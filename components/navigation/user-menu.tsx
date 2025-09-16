'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='relative'>
      <button
        onClick={toggleMenu}
        className='flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors'
        aria-expanded={isOpen}
        aria-haspopup='true'
      >
        <User className='h-5 w-5' />
        <span className='sr-only'>User menu</span>
      </button>

      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
            aria-hidden='true'
          />
          <div className='absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20'>
            <div className='py-1' role='menu' aria-orientation='vertical'>
              <div className='px-4 py-3 border-b border-gray-100 dark:border-gray-700'>
                <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                  John Doe
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  john.doe@example.com
                </p>
              </div>
              <Link
                href='/settings/profile'
                className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                role='menuitem'
                onClick={() => setIsOpen(false)}
              >
                <span className='inline-flex items-center justify-center w-5 h-5 mr-3'>
                  <User className='h-4 w-4' />
                </span>
                <span>Profile</span>
              </Link>
              <Link
                href='/settings'
                className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                role='menuitem'
                onClick={() => setIsOpen(false)}
              >
                <span className='inline-flex items-center justify-center w-5 h-5 mr-3'>
                  <Settings className='h-4 w-4' />
                </span>
                <span>Settings</span>
              </Link>
              <div className='px-4 py-2'>
                <LogoutButton
                  variant='ghost'
                  showIcon={true}
                  showConfirmation={false}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
