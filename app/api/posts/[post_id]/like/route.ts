import connectMongoDB from "../../../../../lib/mongodb";
import { Post } from "@/mongodb/models/post";
import { NextResponse } from "next/server";

export interface LikePostRequestBody {
  userId: string;
}

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectMongoDB();
  const { userId }: LikePostRequestBody = await request.json();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Using the instance method to like the post
    await post.likePost(userId);

    return NextResponse.json({ message: "Post liked successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while liking the post" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectMongoDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post.likes);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching likes" },
      { status: 500 }
    );
  }
}


