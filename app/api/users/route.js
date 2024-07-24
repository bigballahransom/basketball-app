// app/api/users/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import { Profile } from '@/mongodb/models/profile';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request) {
  await connectMongoDB();

  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const profiles = await Profile.find({}).select('-_id -__v'); // Fetch all profiles excluding MongoDB internal fields

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
