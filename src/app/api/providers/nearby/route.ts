import { User } from "@/components/ContextProvider";
import { connectToDatabase } from "@/lib/mongodb";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export async function GET(req: Request, res: Response) {
  //   return Response.json({ success: true, message: "Service Providers fetched" });
  try {
    const token = cookies().get("token")?.value as string;
    const v = verify(token, process.env.JWT_SECRET as string) as
      | JwtPayload
      | User;

    if (!v._id) {
      return Response.json({ success: false, message: "Unauthorized" });
    }
    console.log(v, "v");
    const { db } = await connectToDatabase();
    const collection = db.collection("users");
    const users = await collection
      .find({
        isServiceProvider: true,
        //nearest to the user
      })
      .toArray();
    const usersExceptCurrent = users.filter(
      (user) => user._id.toString() !== v._id.toString(),
    );
    const nearbyUsers = usersExceptCurrent.filter((user) => {
      const distance = getDistanceInKm(
        v.location.coordinates[1],
        v.location.coordinates[0],
        user.location.coordinates[1],
        user.location.coordinates[0],
      );
      return distance <= 50;
    });
    const sortedUsers = nearbyUsers.sort((a, b) => {
      const distanceA = getDistanceInKm(
        v.location.coordinates[1],
        v.location.coordinates[0],
        a.location.coordinates[1],
        a.location.coordinates[0],
      );
      const distanceB = getDistanceInKm(
        v.location.coordinates[1],
        v.location.coordinates[0],
        b.location.coordinates[1],
        b.location.coordinates[0],
      );
      return distanceA - distanceB;
    });
    return Response.json({
      success: true,
      message: "Service Providers fetched",
      data: sortedUsers,
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
