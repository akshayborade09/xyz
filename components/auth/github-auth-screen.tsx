/**
 * @component GitHubAuthScreen
 * @description A GitHub-styled authentication screen for the OAuth flow
 *
 * This component provides a GitHub-styled login interface for users
 * authenticating via GitHub OAuth. It includes username/email and password
 * fields, along with appropriate GitHub branding.
 *
 * @status Planned - Not currently in use
 * @plannedFor Authentication system upgrade (Q2 2023)
 *
 * @example
 * // Future implementation in the auth flow
 * import { GitHubAuthScreen } from "@/components/auth/github-auth-screen";
 *
 * // In a route handler or page component
 * export default function GitHubAuthPage() {
 *   return <GitHubAuthScreen />;
 * }
 *
 * @see Related components:
 * - SignInForm
 * - TwoFactorScreen
 * - AuthProvider
 *
 * @todo Integrate with actual GitHub OAuth API when authentication system is upgraded
 * @todo Add proper error handling for OAuth failures
 * @todo Implement "Remember this device" functionality
 */
'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { trackComponentRender } from '@/utils/component-tracker';

export function GitHubAuthScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});

  // Authentication helper functions
  const setUserAuthData = (username: string) => {
    try {
      const userInfo = {
        name: username,
        email: `${username}@github.local`, // Fake email for GitHub auth
        mobile: '',
        accountType: 'individual',
        socialSignin: 'github',
        signinCompletedAt: new Date().toISOString(),
      };
      document.cookie = `user_data=${JSON.stringify(userInfo)}; path=/; max-age=86400`;
      console.log('User auth data set successfully for GitHub sign-in');
    } catch (error) {
      console.error('Error setting user auth data:', error);
    }
  };

  const setAccessLevel = (level: 'full' = 'full') => {
    try {
      console.log('Setting access level for GitHub sign-in:', level);
      localStorage.setItem('accessLevel', level);

      // Set authentication cookie for middleware
      const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      document.cookie = `auth-token=${authToken}; path=/; max-age=86400`; // 24 hours

      // Set user profile status cookie for middleware - assume full access for social signin
      const profileStatus = {
        basicInfoComplete: true,
        identityVerified: true,
        paymentSetupComplete: true,
      };
      document.cookie = `user_profile_status=${JSON.stringify(profileStatus)}; path=/; max-age=86400`;

      console.log('Access level set successfully for GitHub sign-in');
    } catch (error) {
      console.error('Error setting access level:', error);
    }
  };

  useEffect(() => {
    trackComponentRender('GitHubAuthScreen');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate form
    const newErrors: {
      username?: string;
      password?: string;
      general?: string;
    } = {};

    if (!username) {
      newErrors.username = 'Username or email is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with sign in
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Set authentication data before navigation
      console.log('GitHub sign-in successful, setting auth data');
      setUserAuthData(username);
      setAccessLevel('full');

      // Navigate to dashboard
      console.log('Navigating to dashboard...');
      router.push('/dashboard');
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      setErrors({
        general: 'Incorrect username or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/auth/signin');
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex flex-col items-center'>
          {/* GitHub Logo */}
          <div className='mb-6 flex justify-center'>
            <svg className='h-10 w-10' viewBox='0 0 16 16' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'
              ></path>
            </svg>
          </div>

          <h2 className='mt-2 text-center text-2xl font-bold tracking-tight text-gray-900'>
            Sign in to GitHub
          </h2>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {errors.general && (
            <div className='rounded-md bg-red-50 p-4'>
              <p className='text-sm text-red-700'>{errors.general}</p>
            </div>
          )}

          <div className='space-y-4 rounded-md'>
            <div>
              <Label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700'
              >
                Username or email address
              </Label>
              <Input
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={cn(
                  'mt-1',
                  errors.username && 'border-red-300 focus-visible:ring-red-500'
                )}
              />
              {errors.username && (
                <p className='mt-1 text-sm text-red-600'>{errors.username}</p>
              )}
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </Label>
                <Link
                  href='https://github.com/password_reset'
                  target='_blank'
                  className='text-sm font-medium text-blue-600 hover:text-blue-500'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='relative mt-1'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={cn(
                    'pr-10',
                    errors.password &&
                      'border-red-300 focus-visible:ring-red-500'
                  )}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
              )}
            </div>
          </div>

          <div className='flex justify-between space-x-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='flex-1 bg-primary hover:bg-primary/90'
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
