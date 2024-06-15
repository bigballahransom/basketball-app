import connectMongoDB from "../../../lib/mongodb";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";

// Assuming this file is located at /app/api/posts/route.ts
export interface AddPostRequestBody {
  user: IUser;
  text: string;
  imageUrl?: string;
  city?: string;
  neighborhood?: string;
  sport?: string;
}


export async function POST(request: Request) {
  //  auth().protect();
  const { user, text, imageUrl }: AddPostRequestBody = await request.json();

  try {
    await connectMongoDB();

    const postData: IPostBase = {
      user,
      text,
      ...(imageUrl && { imageUrl }),
    };

    const post = await Post.create(postData);
    return NextResponse.json({ message: "Post created successfully", post });
  } catch (error) {
    return NextResponse.json(
      { error: `An error occurred while creating the post ${error}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    const posts = await Post.getAllPosts();

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching posts" },
      { status: 500 }
    );
  }
}

// import connectMongoDB from "../../../lib/mongodb";
// import { IPostBase, Post } from "@/mongodb/models/post";
// import { IUser } from "@/types/user";
// import { NextResponse } from "next/server";
// import { Profile } from "@/mongodb/models/profile"; // Import Profile model
// import twilio from 'twilio';

// // Configure Twilio client
// const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
// const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number
// const client = twilio(accountSid, authToken);

// export interface AddPostRequestBody {
//   user: IUser;
//   text: string;
//   imageUrl?: string;
//   city?: string;
//   neighborhood?: string;
//   sport?: string;
// }

// async function sendTextMessages(postText: string) {
//   try {
//     // Fetch all profiles
//     const profiles = await Profile.find({}, 'phoneNumber');

//     // Send a text message to each profile phone number
//     profiles.forEach(async (profile: { phoneNumber: string }) => {
//       if (profile.phoneNumber) {
//         await client.messages.create({
//           body: `A new post has been created: ${postText}`,
//           from: twilioPhoneNumber,
//           to: profile.phoneNumber
//         });
//       }
//     });
//   } catch (error) {
//     console.error("Error sending text messages:", error);
//   }
// }

// export async function POST(request: Request) {
//   const { user, text, imageUrl }: AddPostRequestBody = await request.json();

//   if (!user || !user.username) {
//     return NextResponse.json(
//       { error: "User and username are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     await connectMongoDB();

//     const postData: IPostBase = {
//       user,
//       text,
//       ...(imageUrl && { imageUrl }),
//     };

//     const post = await Post.create(postData);

//     // Send text messages to all profiles
//     await sendTextMessages(text);

//     return NextResponse.json({ message: "Post created successfully", post });
//   } catch (error) {
//     return NextResponse.json(
//       { error: `An error occurred while creating the post ${error}` },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectMongoDB();

//     const posts = await Post.getAllPosts();

//     return NextResponse.json(posts);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "An error occurred while fetching posts" },
//       { status: 500 }
//     );
//   }
// }

