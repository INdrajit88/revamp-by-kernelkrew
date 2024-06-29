import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const { db } = await connectToDatabase();
    const jobs = db.collection("jobs");
    const updateJob = await jobs.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "closed" } },
    );
    return Response.json({
      success: true,
      message: "Job closed successfully",
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
