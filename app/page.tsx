import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import connectMongoDB from "@/lib/mongodb";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import {Post} from "@/mongodb/models/post";
import PostFeed from "@/components/PostFeed";

export const revalidate = 0;

export default async function Home() {
  await connectMongoDB();
  const posts = await Post.getAllPosts();
  console.log(posts);
  return (
    <main className="grid grid-cols-8 mt-5 sm:px-5">
      {/* <section className='hidden md:inline md:col-span-2'>
        <UserInformation/>
      </section> */}
      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full px-1">
        <SignedIn>
          <PostForm/>
        </SignedIn>
          <PostFeed posts={posts}/>
      </section>
      {/* <section className="hidden xl:inline justify-center col-span-2">
        
      </section> */}
    </main>
  );
}
