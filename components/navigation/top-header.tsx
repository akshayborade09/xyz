'use client';

import Link from 'next/link';
import {
  BellIcon,
  UserIcon,
  CogIcon,
  GlobeAltIcon,
  CreditCardIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';
import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/auth-provider';
import { GlobalSearch } from '@/components/search/global-search';
import { Progress } from '@/components/ui/progress';

interface TopHeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

interface User {
  name: string;
  email: string;
}

export function TopHeader({ onMenuClick, isMobile }: TopHeaderProps) {
  const { user, logout } = useAuth() as {
    user: User | null;
    logout: () => void;
  };

  // Sample regions for the region selector
  const regions = [
    { id: 'in-blr', name: 'Bengaluru' },
    { id: 'in-hyd', name: 'Hyderabad' },
  ];

  // Sample usage data
  const usageData = {
    total: 5000,
    used: 3200,
    remaining: 1800,
    breakdown: [
      { name: 'Compute', used: 1500, total: 2000 },
      { name: 'Storage', used: 1000, total: 2000 },
      { name: 'Network', used: 700, total: 1000 },
    ],
  };

  return (
    <header className='sticky top-0 z-40 w-full'>
      <div className='flex h-[56px] items-center justify-between px-4'>
        {/* Left side - Logo, mobile menu button and search */}
        <div className='flex items-center gap-4'>
          {/* Logo */}
          <Link href='/dashboard' className='flex items-center gap-2'>
            <KrutrimLogo width={120} height={40} href={null} />
          </Link>

          {isMobile && (
            <Button
              variant='ghost'
              size='icon'
              onClick={onMenuClick}
              className='lg:hidden'
            >
              <Bars3Icon className='h-5 w-5' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          )}

          <div className='w-[300px] hidden'>
            <GlobalSearch />
          </div>
        </div>

        {/* Right side - Region selector, notifications, help, and user profile */}
        <div className='flex items-center gap-3'>
          {/* Region selector */}
          <DropdownMenu>
            <TooltipWrapper content='Select your preferred region for resources'>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='hidden md:flex items-center gap-2 h-9 px-3 hover:bg-[#1f22250f]'
                >
                  <GlobeAltIcon className='h-4 w-4 text-muted-foreground' />
                  <span className='max-w-[120px] truncate text-sm'>
                    {regions[0].name}
                  </span>
                  <ChevronDownIcon className='h-4 w-4 text-muted-foreground' />
                </Button>
              </DropdownMenuTrigger>
            </TooltipWrapper>
            <DropdownMenuContent align='end' className='w-[240px]'>
              <DropdownMenuLabel className='text-xs font-medium text-muted-foreground'>
                Select Region
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {regions.map(region => (
                <DropdownMenuItem
                  key={region.id}
                  className='cursor-pointer py-2'
                >
                  <div className='flex flex-col'>
                    <span className='text-sm'>{region.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {region.id}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Credits display */}
          <DropdownMenu>
            <TooltipWrapper content='View credit balance and usage details'>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='hidden md:flex items-center gap-2 h-9 px-3 hover:bg-[#1f22250f]'
                >
                  <CreditCardIcon className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>
                    Balance ₹{usageData.remaining}
                  </span>
                  <ChevronDownIcon className='h-4 w-4 text-muted-foreground' />
                </Button>
              </DropdownMenuTrigger>
            </TooltipWrapper>
            <DropdownMenuContent align='end' className='w-[240px]'>
              <div className='px-3 py-3'>
                <div className='space-y-2'>
                  <Button
                    variant='default'
                    size='sm'
                    className='w-full'
                    asChild
                  >
                    <Link href='/billing/add-credits'>Add Credits</Link>
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full'
                    asChild
                  >
                    <Link href='/billing/usage'>View Usage</Link>
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='relative hidden'>
                <div className='relative flex items-center justify-center w-9 h-9 border border-border rounded-full hover:bg-accent hover:text-accent-foreground transition-colors'>
                  <BellIcon className='h-5 w-5' />
                  <Badge className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white'>
                    3
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[300px]'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className='max-h-[300px] overflow-auto'>
                <DropdownMenuItem className='cursor-pointer flex flex-col items-start'>
                  <div className='font-medium'>VM Deployment Complete</div>
                  <div className='text-xs text-muted-foreground'>
                    Your VM instance is now running
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer flex flex-col items-start'>
                  <div className='font-medium'>Billing Alert</div>
                  <div className='text-xs text-muted-foreground'>
                    You've used 80% of your credits
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer flex flex-col items-start'>
                  <div className='font-medium'>Maintenance Scheduled</div>
                  <div className='text-xs text-muted-foreground'>
                    Scheduled maintenance on June 15
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href='/notifications'
                  className='w-full cursor-pointer text-center text-sm'
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex items-center gap-2 h-9 px-2'
              >
                <Avatar className='h-7 w-7'>
                  <AvatarImage src='/placeholder-user.jpg' alt='User avatar' />
                  <AvatarFallback className='bg-primary/10 text-primary'>
                    <UserIcon className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
                <ChevronDownIcon className='h-4 w-4 text-muted-foreground' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[240px]'>
              <div className='flex items-center gap-3 px-3 py-2 border-b'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage src='/placeholder-user.jpg' alt='User avatar' />
                  <AvatarFallback className='bg-primary/10 text-primary'>
                    <UserIcon className='h-5 w-5' />
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold'>Sammy Shark</span>
                  <span className='text-xs text-muted-foreground'>Owner</span>
                </div>
              </div>
              <div className='p-1'>
                <div className='flex items-center px-3 py-2'>
                  <Badge
                    variant='outline'
                    className='px-3 py-1.5 rounded-full bg-gray-50 border-gray-200 text-gray-700 font-medium text-xs'
                  >
                    Account Id - 7381739941
                  </Badge>
                </div>
                <DropdownMenuSeparator className='my-1' />
                <DropdownMenuItem
                  className='flex items-center gap-2 py-2 px-3 cursor-pointer'
                  asChild
                >
                  <Link href='/dashboard/profile-completion'>
                    <UserIcon className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='my-1' />
                <DropdownMenuItem
                  className='flex items-center gap-2 py-2 px-3 cursor-pointer text-red-600 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/50'
                  onClick={logout}
                >
                  <ArrowLeftOnRectangleIcon className='h-4 w-4 text-red-600' />
                  <span className='text-sm'>Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
