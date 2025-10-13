'use client';

import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  mobile: string;
  accountType: string;
  signinCompletedAt: string;
  userType: 'existing' | 'new' | 'regular';
  credits: number;
}

export function useUserCredits() {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const userData: UserData = JSON.parse(userDataStr);
        setCredits(userData.credits || 0);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setCredits(0);
      }
    }
    setIsLoading(false);
  }, []);

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
    // Update localStorage
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const userData: UserData = JSON.parse(userDataStr);
        userData.credits = newCredits;
        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch (error) {
        console.error('Error updating credits:', error);
      }
    }
  };

  return {
    credits,
    hasCredits: credits > 0,
    isLoading,
    updateCredits,
  };
}

