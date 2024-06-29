import { User } from "@/components/ContextProvider";
import { connectToDatabase } from "@/lib/mongodb";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request, res: Response) {
  try {
    const token = cookies().get("token")?.value as string;
    const u = verify(token, process.env.JWT_SECRET as string) as
      | JwtPayload
      | User;
    if (!u._id) {
      return Response.json({ success: false, message: "Unauthorized" });
    }
    const { db } = await connectToDatabase();
    const collection = db.collection("jobs");
    const myJobs = await collection
      .find({
        "postAdmin.id": u._id,
      })
      .toArray();
    return Response.json({
      success: true,
      message: "My jobs fetched successfully",
      data: myJobs,
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
