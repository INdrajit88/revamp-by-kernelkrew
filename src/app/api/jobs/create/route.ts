import { User } from "@/components/ContextProvider";
import { connectToDatabase } from "@/lib/mongodb";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { JobsFormI } from "../../../jobs/create/page";

export async function POST(req: Request, res: Response) {
  try {
    const token = cookies().get("token")?.value as string;
    const u = verify(token, process.env.JWT_SECRET as string) as
      | JwtPayload
      | User;
    const body: JobsFormI = await req.json();
    const { budget, description, location, title, images } = body;
    if (!u._id) {
      return Response.json({ success: false, message: "Unauthorized" });
    }
    const { db } = await connectToDatabase();
    const collection = db.collection("jobs");
    const userRating =
      u?.ratings?.length > 0
        ? u.ratings.reduce((a: number, b: number) => a + b, 0) /
          u.ratings.length
        : 0;

    const job = await collection.insertOne({
      budget,
      description,
      location,
      title,
      images,
      postAdmin: {
        id: u._id,
        username: u.username,
        email: u.email,
        phone_number: u.phone_number,
        ratings: userRating,
      },
      status: "open",
      createdAt: new Date(),
    });
    return Response.json({ success: true, message: "Job posted successfully" });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
