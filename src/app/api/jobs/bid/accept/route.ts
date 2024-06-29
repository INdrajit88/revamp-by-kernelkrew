import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { postId, bidId } = body;
    const { db } = await connectToDatabase();
    const jobs = db.collection("jobs");
    const job = await jobs.findOne({
      _id: new ObjectId(postId),
    });
    if (!job) {
      return Response.json({
        success: false,
        message: "Job not found",
      });
    }
    console.log(job.bids, "job.bids");
    const bid = job.bids.find((b: { id: ObjectId }) => {
      return b.id.toString() === bidId;
    });
    if (!bid) {
      return Response.json({
        success: false,
        message: "Bid not found",
      });
    }
    const updateJobStatus = await jobs.updateOne(
      {
        _id: new ObjectId(postId),
      },
      {
        $set: {
          status: "in-progress",
          acceptedBid: {
            id: new ObjectId(bidId),
            comment: bid.comment,
            amount: bid.amount,
            user: {
              id: bid.user.id,
              email: bid.user.email,
              username: bid.user.username,
              ratings: bid.user.ratings,
            },
          },
        },
      },
      {
        upsert: true,
      },
    );
    console.log(updateJobStatus, "updateJobStatus");
    return Response.json({
      success: true,
      message: "Bid accepted successfully",
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
