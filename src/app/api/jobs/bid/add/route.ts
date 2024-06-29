import { MongoJobs } from "@/app/dashboard/page";
import { connectToDatabase } from "@/lib/mongodb";
import { Document, ObjectId } from "mongodb";

// interface MongoJobWithBids extends MongoJobs {
//   bids: {
//     commentBy: string;
//     comment: string;
//     commentAt: Date;
//     commentByUserEmail: string;
//     commentByUserName: string;
//   }[];
// }

export async function POST(req: Request, res: Response) {
  try {
    const body: {
      postId: string;
      comment: string;
      amount: string;
      user: {
        id: string;
        email: string;
        username: string;
        ratings: string;
      };
    } = await req.json();
    const { db } = await connectToDatabase();
    const jobCollection = db.collection("jobs");
    const insertBid = (await jobCollection.updateOne(
      { _id: new ObjectId(body.postId) },
      {
        // @ts-ignore
        $push: {
          bids: {
            id: new ObjectId(),
            comment: body.comment,
            amount: body.amount,
            user: {
              id: body.user.id,
              email: body.user.email,
              username: body.user.username,
              ratings: body.user.ratings,
            },
          },
        },
      },
    )) as Document;
    return Response.json({ success: true, message: "Bid added successfully" });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
