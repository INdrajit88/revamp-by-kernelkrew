import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request, res: Response) {
  try {
    const body: {
      rating: number;
      ratedBy: string;
      userId: string;
      ratedByUserName: string;
      postId: string;
    } = await req.json();
    const { db } = await connectToDatabase();
    //already rated
    const alreadyRated = await db.collection("users").findOne({
      _id: new ObjectId(body.userId),
      //ratings is an array of objects
      "ratings.postId": body.postId,
    });
    if (alreadyRated) {
      return Response.json({ success: false, message: "User already rated" });
    }
    console.log(alreadyRated, "alreadyRated");
    const collection = await db.collection("users").updateOne(
      { _id: new ObjectId(body.userId) },
      {
        //@ts-ignore
        $push: {
          ratings: {
            ratings: body.rating,
            ratedBy: body.ratedBy,
            ratedByUserName: body.ratedByUserName,
            postId: body.postId,
            createdAt: new Date(),
          },
        },
      },
    );
    return Response.json({ success: true, message: "User rated successfully" });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
