import bcryptjs from "bcryptjs";
import { clsx, type ClassValue } from "clsx";
import { decode, sign } from "jsonwebtoken";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(passsword: string) {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(passsword, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcryptjs.compare(password, hash);
}

export const generateToken = (payload: Record<string, any>) => {
  return sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const decodeToken = (token: string) => {
  return decode(token);
};
