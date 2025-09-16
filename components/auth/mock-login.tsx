'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Users } from 'lucide-react';

export function MockLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('user@example.com');

  const handleLogin = async (userType: 'new' | 'existing') => {
    setIsLoading(true);
    try {
      await login(email, 'password', userType);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-4'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Mock Login</h1>
          <p className='text-gray-600'>Choose user type for testing</p>
        </div>

        <div className='space-y-4'>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='Enter email'
            />
          </div>

          <div className='grid grid-cols-1 gap-4'>
            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => !isLoading && handleLogin('new')}
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center space-x-2'>
                  <UserPlus className='h-5 w-5 text-blue-600' />
                  <CardTitle className='text-lg'>New User</CardTitle>
                </div>
                <CardDescription>
                  Fresh signup - needs identity verification directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className='w-full bg-blue-600 hover:bg-blue-700'
                  disabled={isLoading}
                  onClick={e => {
                    e.stopPropagation();
                    handleLogin('new');
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login as New User'}
                </Button>
              </CardContent>
            </Card>

            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => !isLoading && handleLogin('existing')}
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center space-x-2'>
                  <Users className='h-5 w-5 text-green-600' />
                  <CardTitle className='text-lg'>Existing User</CardTitle>
                </div>
                <CardDescription>
                  Has account - needs to complete profile first
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className='w-full bg-green-600 hover:bg-green-700'
                  disabled={isLoading}
                  onClick={e => {
                    e.stopPropagation();
                    handleLogin('existing');
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login as Existing User'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='text-center text-sm text-gray-500'>
          <p>This is a mock login for testing user flows</p>
        </div>
      </div>
    </div>
  );
}
