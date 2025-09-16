'use client';

import { useState } from 'react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from './auth-provider';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';

interface LogoutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  showIcon?: boolean;
  showConfirmation?: boolean;
}

export function LogoutButton({
  variant = 'ghost',
  showIcon = true,
  showConfirmation = true,
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 300));
    logout();
    setIsLoading(false);
  };

  if (showConfirmation) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={variant} className='w-full justify-start'>
            {showIcon && <ArrowLeftOnRectangleIcon className='mr-2 h-4 w-4' />}
            Sign out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of Krutrim Cloud?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your current session. You'll need to
              sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={isLoading}>
              {isLoading ? 'Signing out...' : 'Sign out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      variant={variant}
      className='w-full justify-start'
      onClick={handleLogout}
      disabled={isLoading}
    >
      {showIcon && <ArrowLeftOnRectangleIcon className='mr-2 h-4 w-4' />}
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
