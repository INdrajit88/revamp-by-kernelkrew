import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request, res: Response) {
  try {
    const { db } = await connectToDatabase();
    const jobs = db.collection("jobs");
    const allJobs = await jobs
      .find({
        status: "open",
      })
      .toArray();
    return Response.json({
      success: true,
      message: "All jobs fetched",
      data: allJobs,
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
