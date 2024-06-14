import React from 'react'
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import connectMongoDB from "@/lib/mongodb";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import {Post} from "@/mongodb/models/post";
import PostFeed from "@/components/PostFeed";

export const revalidate = 0;

export default async function page() {
    await connectMongoDB();
    const posts = await Post.getAllPosts();
    console.log(posts);
  return (
    <main className=" mt-5 sm:px-5 flex justify-center">
      {/* <section className='hidden md:inline md:col-span-2'>
        <UserInformation posts={posts}/>
      </section> */}
      <section className="col-span-full md:col-span-6 xl:col-span-4 max-w-xl mx-auto w-full px-1">
      <UserInformation posts={posts}/>
      {/* <div className="flex flex-col justify-center items-center bg-white rounded-lg border py-4 mb-2">
      <div className="text-center text-xl font-bold">
        Coming Soon...
      </div>
    </div> */}
      </section>
    </main>
  )
}