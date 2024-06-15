import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Bell } from 'lucide-react'

const ProfileForm = () => {
  return (
    <div className="flex justify-center items-center bg-white rounded-lg border py-4 mb-2">
        <form className='w-full px-2'>
            <div className='flex items-center gap-2 mb-2'>
            <Bell className='w-5 h-5'/>
            <h1 className='text-xl font-bold'>Notification Settings</h1>
            </div>
            <label className='text-sm font-semibold'>Phone Number</label>
            <p className='text-sm'>We will notify you of new games by text message.</p>
            <Input className='mb-2'/>
            <Button className='w-full' variant='secondary'>Update</Button>
        </form>
  </div>
  )
}

export default ProfileForm
