import { SignUpFormValues } from "@/app/(auth)/signup/page";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request, res: Response) {
  try {
    const {
      first_name,
      last_name,
      confirm_password,
      email,
      password,
      phone_number,
      username,
      address,
      isServiceProvider,
      services,
      city,
      country_code,
      feesPerHour,
      landmark,
      latitude,
      longitude,
      state,
      timezone,
      yearsOfExperience,
      zip_code,
    }: SignUpFormValues = await req.json();
    if (password !== confirm_password) {
      return Response.json({
        success: false,
        message: "Passwords do not match",
      });
    }
    const { db } = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (user) {
      throw new Error("User already exists");
    }
    const hash = await hashPassword(password);

    if (isServiceProvider) {
      const serviceProvider = await collection.insertOne({
        first_name,
        last_name,
        email,
        phone_number,
        username,
        password: hash,
        isServiceProvider,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        locationDetails: {
          address,
          city,
          country_code,
          landmark,
          state,
          timezone,
          zip_code,
        },
        feesPerHour,
        yearsOfExperience,
        services,
      });
      if (!serviceProvider) {
        throw new Error("Failed to create service provider");
      }
    } else {
      const result = await collection.insertOne({
        first_name,
        last_name,
        email,
        phone_number,
        username,
        password: hash,
        isServiceProvider,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        locationDetails: {
          address,
          city,
          country_code,
          landmark,
          state,
          timezone,
          zip_code,
        },
        ratings: [
          {
            rating: 0,
            ratedBy: "",
          },
        ],
      });
      if (!result) {
        throw new Error("Failed to create user");
      }
    }

    return Response.json({ success: true, message: "User created" });
  } catch (err) {
    const error = err as Error & { message: string };
    return Response.json({ success: false, message: error.message });
  }
}
