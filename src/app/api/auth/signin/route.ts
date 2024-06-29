import { SignInInterface } from "@/app/(auth)/signin/page";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword, generateToken } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  try {
    const body: SignInInterface = await req.json();
    const { username, password } = body;
    const { db } = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    // compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      throw new Error("Invalid password");
    }
    const token = generateToken(user);
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    return Response.json({
      success: true,
      message: "User signed in",
      data: user,
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({ success: false, message: err.message });
  }
}
