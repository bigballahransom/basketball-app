import Image from "next/image"
import Link from "next/link"
import { Briefcase, HomeIcon, SearchIcon, Trophy } from "lucide-react"
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'
import { Button } from "./ui/button"

const Header = () => {
  return (
    <div className='flex items-center p-2 max-w-6xl mx-auto bg-white'>
      <Image
        className='rounded-lg'
        src='/images/basketball.png'
        alt='Linked In'
        width={40}
        height={40}
      />
      {/*<div className='flex-1'>
         <form className='flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96'>
            <SearchIcon className='h-4 text-gray-600'/>
            <input type='text' placeholder='Search' className='bg-transparent flex-1 outline-none'/>
        </form>
      </div>*/}
      <div className=' items-center space-x-4 px-6 flex'>
        <Link href='/' className='icon'>
            <HomeIcon className='h-6 text-gray-600'/>
            <p>Home</p>
        </Link>

        <Link href='/' className='icon flex'>
            <Trophy className='h-6 text-gray-600 '/>
            <p>Tournaments</p>
        </Link>
        {/* User */}
        <SignedOut>
          <Button asChild variant='secondary'>
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default Header
