'use server';

import { Profile } from "@/mongodb/models/profile";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectMongoDB from '../lib/mongodb';

export default async function createProfileAction(formData: FormData) {
  // Connect to MongoDB
  await connectMongoDB();

  const user = await currentUser();
  const phoneNumber = formData.get("phoneNumber") as string;
  const basketball = formData.get("basketball") === "true";
  const pickleball = formData.get("pickleball") === "true";
  const golf = formData.get("golf") === "true";
  const ultimateFrisbee = formData.get("ultimateFrisbee") === "true";

  if (!phoneNumber) {
    throw new Error("Phone number is required");
  }

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  const body = {
    user: userDB,
    phoneNumber,
    basketball,
    pickleball,
    golf,
    ultimateFrisbee,
  };

  try {
    await Profile.create(body);
  } catch (error: any) {
    console.error("Error details:", error);
    throw new Error("Failed to create profile", error);
  }

  revalidatePath("/");
}
