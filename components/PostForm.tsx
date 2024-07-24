"use client";
import React, { useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createPostAction from '../actions/createPostAction';
import sendSms from "../lib/utils/twilioClient";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


function PostForm() {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [city, setCity] = useState<string>(""); // State for city
  const [neighborhood, setNeighborhood] = useState<string>(""); // State for neighborhood
  const [sport, setSport] = useState<string>(""); // State for sport
  const [userProfiles, setUserProfiles] = useState<any[]>([]); // State to store all user profiles
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set()); // State to store selected users

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const profiles = await response.json();
          setUserProfiles(profiles);
        } else {
          console.error("Failed to fetch user profiles");
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUsers();
  }, []);

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

      // Send an SMS notification with dynamic content
      const smsBody = `${user?.firstName} is playing ${sport} in ${city}. You in? Let your team know at pickupmonster.com`;

      // Send SMS to selected users
      for (const profile of userProfiles) {
        if (selectedUsers.has(profile.user.userId) && profile.phoneNumber) {
          await sendSms(profile.phoneNumber, smsBody);
        }
      }

      toast.success("Post created and SMS sent successfully!");
    } catch (error) {
      console.error(`Error creating post: ${error}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(userId)) {
        newSelection.delete(userId);
      } else {
        newSelection.add(userId);
      }
      return newSelection;
    });
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
            placeholder="Tell others When and Where your playing..."
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
          <div className="mt-2">
          <AlertDialog>
  <AlertDialogTrigger className='text-[#662d91] flex gap-2 py-2 hover:text-purple-300'>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
            Notify Players
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Notify select users by invite.</AlertDialogTitle>
      <AlertDialogDescription>
      <div className="">
        <h2 className="text-lg font-bold">Select Users</h2>
        <ul>
          {userProfiles.map((profile, index) => (
            <li key={index} className="mb-2 p-2 border rounded-md flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedUsers.has(profile.user.userId)}
                onChange={() => toggleUserSelection(profile.user.userId)}
                className="mr-2"
              />
              <Avatar>
                <AvatarImage src={profile.user.userImage || "/default-avatar.png"} />
                <AvatarFallback>
                  {profile.user.firstName.charAt(0)}
                  {profile.user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{profile.user.firstName} {profile.user.lastName}</p>
                <p>{profile.phoneNumber}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

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
          <Button type="submit" className='w-full bg-[#662d91] hover:bg-purple-300 hover:text-[#662d91]'>
            Post
          </Button>
        </div>
      </form>
      <hr className="mt-2 border-gray-300" />
      
      {/* Display user profiles with checkboxes
      <div className="mt-4">
        <h2 className="text-lg font-bold">User Profiles</h2>
        <ul>
          {userProfiles.map((profile, index) => (
            <li key={index} className="mb-2 p-2 border rounded-md flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedUsers.has(profile.user.userId)}
                onChange={() => toggleUserSelection(profile.user.userId)}
                className="mr-2"
              />
              <Avatar>
                <AvatarImage src={profile.user.userImage || "/default-avatar.png"} />
                <AvatarFallback>
                  {profile.user.firstName.charAt(0)}
                  {profile.user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{profile.user.firstName} {profile.user.lastName}</p>
                <p>{profile.phoneNumber}</p>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default PostForm;


