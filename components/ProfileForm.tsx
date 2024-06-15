'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Sports = {
  basketball: boolean;
  pickleball: boolean;
  golf: boolean;
  ultimateFrisbee: boolean;
};

const ProfileForm = () => {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sports, setSports] = useState<Sports>({
    basketball: false,
    pickleball: false,
    golf: false,
    ultimateFrisbee: false,
  });

  useEffect(() => {
    // Fetch the profile data on component mount
    const fetchProfile = async () => {
      const response = await fetch(`/api/profile/${user?.id}`);
      if (response.ok) {
        const profile = await response.json();
        setPhoneNumber(profile.phoneNumber);
        setSports({
          basketball: profile.basketball,
          pickleball: profile.pickleball,
          golf: profile.golf,
          ultimateFrisbee: profile.ultimateFrisbee,
        });
      } else {
        console.error('Error fetching profile:', await response.json());
      }
    };

    fetchProfile();
  }, [user]);

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    return phoneRegex.test(number);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPhoneNumber(value);
    if (!validatePhoneNumber(value)) {
      setIsValid(false);
      setErrorMessage('Invalid phone number. Please enter a valid US phone number.');
    } else {
      setIsValid(true);
      setErrorMessage('');
    }
  };

  const handleCheckboxChange = (e: React.FormEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    setSports(prevSports => ({
      ...prevSports,
      [id]: !prevSports[id as keyof Sports],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && phoneNumber) {
      try {
        const response = await fetch(`/api/profile/${user?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber,
            basketball: sports.basketball,
            pickleball: sports.pickleball,
            golf: sports.golf,
            ultimateFrisbee: sports.ultimateFrisbee,
          }),
        });
        if (response.ok) {
          toast.success('Profile updated successfully');
        } else {
          const error = await response.json();
          throw new Error(error.error);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrorMessage('Failed to update profile. Please try again.');
      }
    } else {
      setErrorMessage('Please enter a valid phone number before updating.');
    }
  };

  return (
    <div className="flex justify-center items-center bg-white rounded-lg border py-4 mb-2">
      <form className="w-full px-2" onSubmit={handleSubmit} ref={ref}>
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <Bell className="w-5 h-5" />
          <h1 className="text-xl font-semibold">Notification Settings</h1>
        </div>
        <label className="text-sm font-semibold">Phone Number</label>
        <p className="text-sm">We will notify you of new games by text message.</p>
        <Input
          className={`mb-2 ${!isValid ? 'border-red-500' : ''}`}
          value={phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
        />
        {!isValid && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {/* <p className="text-sm mt-2">Select the sports you are interested in.</p>
        <div className='flex py-2 gap-4 mb-2'>
          {Object.keys(sports).map((sport) => (
            <div key={sport} className="flex items-center space-x-2">
              <Checkbox id={sport} checked={sports[sport as keyof Sports]} onChange={handleCheckboxChange} />
              <label htmlFor={sport} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </label>
            </div>
          ))}
        </div> */}
        <Button className="w-full" variant="secondary" type="submit">Update</Button>
      </form>
    </div>
  );
};

export default ProfileForm;



