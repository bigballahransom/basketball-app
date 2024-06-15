import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import { Profile } from '@/mongodb/models/profile';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  await connectMongoDB();

  const user = await currentUser();

  if (!user?.id || user.id !== params.user_id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const profile = await Profile.findOne({ 'user.userId': params.user_id });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  await connectMongoDB();

  const user = await currentUser();
  if (!user?.id || user.id !== params.user_id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { phoneNumber, basketball, pickleball, golf, ultimateFrisbee } = await request.json();

  if (!phoneNumber) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const userDB = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  const profileData = {
    user: userDB,
    phoneNumber,
    basketball,
    pickleball,
    golf,
    ultimateFrisbee,
  };

  try {
    let profile = await Profile.findOne({ 'user.userId': user.id });

    if (profile) {
      // Update the existing profile
      await profile.updateProfile(profileData);
      return NextResponse.json(profile);
    } else {
      // Create a new profile
      profile = new Profile(profileData);
      await profile.save();
      return NextResponse.json(profile, { status: 201 });
    }
  } catch (error) {
    console.error('Error updating/creating profile:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

