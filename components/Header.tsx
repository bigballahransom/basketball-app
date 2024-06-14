'use client'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, HomeIcon, Trophy } from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

const Header = () => {
  const pathname = usePathname();

  console.log("Current pathname:", pathname);

  const getIconColor = (path: any) => {
    return pathname === path ? "text-purple-600" : "text-gray-600";
  };

  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto bg-white justify-between">
      <div className="flex items-center gap-2">
        <Image
          className="rounded-lg"
          src="/images/monster.png"
          alt="Linked In"
          width={40}
          height={40}
        />
        {/* <h1 className="font-bold">Pickup Monster</h1> */}
      </div>
      {/* <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600" />
          <input type="text" placeholder="Search" className="bg-transparent flex-1 outline-none" />
        </form>
      </div> */}
      <div className="items-center space-x-4 px-6 flex">
        <Link href="/" className={`icon ${getIconColor("/")} flex`}>
          <HomeIcon className={`h-6 ${getIconColor("/")}`} />
          <p>Home</p>
        </Link>

        <Link href="/tournaments" className="icon flex">
          <Trophy className={`h-6 ${getIconColor("/tournaments")}`} />
          <p>Tournaments</p>
        </Link>
        
        <Link href="/profile" className="icon flex">
          <BarChart2 className={`h-6 ${getIconColor("/my-stats")}`} />
          <p>Profile</p>
        </Link>
        
        {/* User */}
        <SignedOut>
          <Button asChild variant="secondary">
            <SignInButton />
          </Button>
        </SignedOut>
        
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;


