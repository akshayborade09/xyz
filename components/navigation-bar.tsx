'use client';

import type React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ServerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  GlobeAmericasIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

/**
 * @component NavigationBar
 * @description Main navigation sidebar for the networking section
 * @status Active
 * @example
 * <NavigationBar />
 */
export function NavigationBar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: 'Virtual Private Cloud',
      href: '/networking/vpc',
      icon: <CpuChipIcon className='w-5 h-5' />,
    },
    {
      name: 'Subnets',
      href: '/networking/subnets',
      icon: <GlobeAltIcon className='w-5 h-5' />,
    },
    {
      name: 'Security Groups',
      href: '/networking/security-groups',
      icon: <ShieldCheckIcon className='w-5 h-5' />,
    },
    {
      name: 'Static IP Addresses',
      href: '/networking/static-ips',
      icon: <ServerIcon className='w-5 h-5' />,
    },
    {
      name: 'DNS',
      href: '/networking/dns',
      icon: <GlobeAltIcon className='w-5 h-5' />,
    },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <div className='w-64 border-r border-border h-screen p-6 bg-card text-card-foreground'>
      <h2 className='text-xl font-semibold mb-6'>Networking</h2>
      <nav>
        <ul className='space-y-2'>
          {navItems.map(item => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-md transition duration-200 ${
                  isActive(item.href)
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50'
                }`}
              >
                {item.icon}
                <span className='ml-3'>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
