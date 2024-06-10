// "use server";

// import { AddPostRequestBody } from "../app/api/posts/route";

// import { Post } from "@/mongodb/models/post";
// import { IUser } from "@/types/user";
// import { BlobServiceClient } from "@azure/storage-blob";
// import { currentUser } from "@clerk/nextjs/server";
// import { randomUUID } from "crypto";
// import { revalidatePath } from "next/cache";

// export default async function createPostAction(formData: FormData) {
//   const user = await currentUser();
//   const postInput = formData.get("postInput") as string;
//   const image = formData.get("image") as File;
//   let image_url = undefined;

//   if (!postInput) {
//     throw new Error("Post input is required");
//   }

//   if (!user?.id) {
//     throw new Error("User not authenticated");
//   }

//   const userDB: IUser = {
//     userId: user.id,
//     userImage: user.imageUrl,
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//   };

//   try {
//     if (image.size > 0) {
//       console.log("Uploading image to Azure Blob Storage...", image);

//       const accountName = process.env.AZURE_STORAGE_NAME;

//       const sasToken = await generateSASToken();

//       const blobServiceClient = new BlobServiceClient(
//         `https://${accountName}.blob.core.windows.net?${sasToken}`
//       );

//       const containerClient =
//         blobServiceClient.getContainerClient(containerName);

//       // generate current timestamp
//       const timestamp = new Date().getTime();
//       const file_name = `${randomUUID()}_${timestamp}.png`;

//       const blockBlobClient = containerClient.getBlockBlobClient(file_name);

//       const imageBuffer = await image.arrayBuffer();
//       const res = await blockBlobClient.uploadData(imageBuffer);
//       image_url = res._response.request.url;

//       console.log("File uploaded successfully!", image_url);

//       const body: AddPostRequestBody = {
//         user: userDB,
//         text: postInput,
//         imageUrl: image_url,
//       };

//       await Post.create(body);
//     } else {
//       const body: AddPostRequestBody = {
//         user: userDB,
//         text: postInput,
//       };

//       await Post.create(body);
//     }
//   } catch (error: any) {
//     console.error("Error details:", error);
//     throw new Error("Failed to create post", error);
//   }

//   revalidatePath("/");
// }
"use server";

import { AddPostRequestBody } from "../app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import connectMongoDB from '../lib/mongodb'; // Import the MongoDB connection function
import mongoose from 'mongoose';

export default async function createPostAction(formData: FormData) {
  // Connect to MongoDB
  await connectMongoDB();

  const user = await currentUser();
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url = undefined;

  if (!postInput) {
    throw new Error("Post input is required");
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

  try {
    if (image && image.size > 0) {
      console.log("Uploading image to MongoDB...", image);

      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      // Convert the image to a buffer and store it in MongoDB
      const imageBuffer = Buffer.from(await image.arrayBuffer());

      const imageDocument = new mongoose.Schema({
        fileName: String,
        data: Buffer,
        contentType: String,
        userId: String,
      });

      const Image = mongoose.model('Image', imageDocument);
      const newImage = new Image({
        fileName: file_name,
        data: imageBuffer,
        contentType: image.type,
        userId: user.id,
      });

      const savedImage = await newImage.save();

      // Construct the image URL using the inserted document's ObjectId
      image_url = `/api/images/${savedImage._id}`;

      console.log("Image uploaded successfully!", image_url);

      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url,
      };

      await Post.create(body);
    } else {
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };

      await Post.create(body);
    }
  } catch (error: any) {
    console.error("Error details:", error);
    throw new Error("Failed to create post", error);
  }

  revalidatePath("/");
}
