"use client";
import React, { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createPostAction from '../actions/createPostAction';

function PostForm() {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [city, setCity] = useState<string>(""); // State for city
  const [neighborhood, setNeighborhood] = useState<string>(""); // State for neighborhood
  const [sport, setSport] = useState<string>(""); // State for sport

  const handlePostAction = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    ref.current?.reset();

    const text = formDataCopy.get("postInput") as string;

    if (!text) {
      throw new Error("You must provide a post input");
    }

    formDataCopy.set("city", city); // Set city value in FormData
    formDataCopy.set("neighborhood", neighborhood); // Set neighborhood value in FormData
    formDataCopy.set("sport", sport); // Set sport value in FormData

    setPreview(null);

    try {
      await createPostAction(formDataCopy);
    } catch (error) {
      console.error(`Error creating post: ${error}`);

      // Display toast
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mb-2">
      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(ref.current as HTMLFormElement);
          const promise = handlePostAction(formData);
          toast.promise(promise, {
            loading: "Creating post...",
            success: "Post created!",
            error: (e: any) => "Error creating post: " + e.message,
          });
        }}
        className="p-3 bg-white rounded-lg border"
      >
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <input
            type="text"
            name="postInput"
            placeholder="Start writing a post..."
            className="flex-1 outline-none rounded-full py-3 px-4 border"
          />
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>
        {/* Preview conditional check */}
        {/* {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Preview"
              className="w-full object-cover"
            />
          </div>
        )} */}
        <div className="mt-2">
          <Select onValueChange={(value) => setCity(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Seattle">Seattle</SelectItem>
              <SelectItem value="Bellevue">Bellevue</SelectItem>
              <SelectItem value="Mercer Island">Mercer Island</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          <Select onValueChange={(value) => setNeighborhood(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Neighborhood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cascade Playground">Cascade Playground</SelectItem>
              <SelectItem value="Cal Anderson Park">Cal-Anderson Park</SelectItem>
              <SelectItem value="Greenlake">Greenlake</SelectItem>
              <SelectItem value="Tt Minor Court">T.T. Minor Playground</SelectItem>
              <SelectItem value="Miller Playground">Miller Playground</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          <Select onValueChange={(value) => setSport(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Basketball">Basketball</SelectItem>
              <SelectItem value="Pickle Ball">Pickle Ball</SelectItem>
              <SelectItem value="Golf">Golf</SelectItem>
              <SelectItem value="Ultimate Frisbee">Ultimate Frisbee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end mt-2">
          {preview && (
            <Button
              type="button"
              onClick={() => setPreview(null)}
              variant="outline"
              className="ml-2"
            >
              <XIcon className="mr-2" size={16} color="currentColor" />
              Remove image
            </Button>
          )}
          <Button type="submit" className='w-full' variant='secondary'>
            Post
          </Button>
        </div>
      </form>
      <hr className="mt-2 border-gray-300" />
    </div>
  );
}

export default PostForm;



