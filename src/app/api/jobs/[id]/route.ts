import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const postId = params.id;
    console.log(postId, "postId");
    const { db } = await connectToDatabase();
    const jobs = db.collection("jobs");
    const job = await jobs.findOne({
      _id: new ObjectId(postId),
    });
    return Response.json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
