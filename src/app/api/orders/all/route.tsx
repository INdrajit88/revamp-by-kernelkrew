import { User } from "@/components/ContextProvider";
import { connectToDatabase } from "@/lib/mongodb";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const token = cookies().get("token")?.value as string;
    const u = verify(token, process.env.JWT_SECRET as string) as
      | JwtPayload
      | User;
    if (!u._id) {
      return Response.json({ success: false, message: "Unauthorized" });
    }
    const { db } = await connectToDatabase();
    const jobCollection = db.collection("jobs");
    //status should "in-progress" or "closed"
    const allCompletedJobs = await jobCollection
      .find({
        $or: [{ status: "in-progress" }, { status: "closed" }],
        "acceptedBid.user.id": u._id,
      })
      .toArray();
    return Response.json({
      success: true,
      message: "All completed jobs fetched",
      data: allCompletedJobs,
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
