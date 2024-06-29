import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  cookies().delete("token");
  return Response.json({ message: "Logged out successfully" });
}
