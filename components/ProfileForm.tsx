'use client'

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

const ProfileForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const validatePhoneNumber = (number: any) => {
    const phoneRegex = /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    return phoneRegex.test(number);
  };

  const handleInputChange = (e: any) => {
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isValid && phoneNumber) {
      // Handle form submission (e.g., update phone number)
      console.log('Phone number updated:', phoneNumber);
    } else {
      setErrorMessage('Please enter a valid phone number before updating.');
    }
  };

  return (
    <div className="flex justify-center items-center bg-white rounded-lg border py-4 mb-2">
      <form className="w-full px-2" onSubmit={handleSubmit}>
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
        <p className="text-sm mt-2">Select the sports you are interested in.</p>
        <div className='flex py-2 gap-4 mb-2'>
            <div className="flex flex-wrap items-center space-x-2">
                <Checkbox id="terms2" />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Basketball
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="terms2" />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Golf
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="terms2" />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Ultimate Frisbee
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="terms2" />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Pickleball
                </label>
            </div>
        </div>
        <Button className="w-full" variant="secondary" type="submit">Update</Button>
      </form>
    </div>
  );
};

export default ProfileForm;
