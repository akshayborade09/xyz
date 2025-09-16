'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { BookOpen, ArrowRight, Map, Cpu, Database, Server } from 'lucide-react';
import { CpuChipIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';

export function AllowedServicesSection() {
  const { accessLevel } = useAuth();

  // Only show for limited access users
  if (accessLevel !== 'limited') {
    return null;
  }

  const allowedServices = [
    {
      id: 'compute',
      title: 'Compute Resources',
      description:
        'Launch and scale virtual machines, manage workloads, and monitor compute usage.',
      icon: Server,
      href: '/compute',
      color: 'bg-green-100 text-green-700',
      available: true,
      features: [
        'VMs & Servers',
        'Auto-scaling',
        'Monitoring',
        'Resource Management',
      ],
    },
    {
      id: 'storage',
      title: 'Storage',
      description:
        'Save, back up, and access your data securely with scalable storage solutions.',
      icon: Database,
      href: '/storage',
      color: 'bg-yellow-100 text-yellow-700',
      available: true,
      features: ['Block Storage', 'Object Storage', 'Snapshots', 'Backups'],
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      description:
        'Manage networks, firewalls, and monitoring tools for your cloud environment.',
      icon: Cpu,
      href: '/infrastructure',
      color: 'bg-blue-100 text-blue-700',
      available: true,
      features: ['Networking', 'Firewalls', 'Monitoring', 'Security Groups'],
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Explore guides, tutorials, and API references',
      icon: BookOpen,
      href: '/documentation',
      color: 'bg-blue-100 text-blue-600',
      available: true,
      features: ['API Guides', 'Tutorials', 'Best Practices', 'Examples'],
    },
    {
      id: 'maps',
      title: 'Maps',
      description: 'Access mapping services and location-based features',
      icon: Map,
      href: '/maps',
      color: 'bg-orange-100 text-orange-600',
      available: true,
      features: [
        'Map Studio',
        'Location Services',
        'Geocoding',
        'Route Planning',
      ],
    },
    {
      id: 'ai-studio',
      title: 'AI Studio',
      description: 'Explore AI models and capabilities',
      icon: CpuChipIcon,
      href: '/ai-studio',
      color: 'bg-purple-100 text-purple-600',
      available: true,
      features: [
        'Model Catalog',
        'API Testing',
        'Documentation',
        'Sample Code',
      ],
    },
  ];

  return (
    <div className='space-y-6 pb-16'>
      <div>
        <h2 className='text-xl font-semibold text-gray-900 text-left'>
          Available Services
        </h2>
        <p className='text-sm text-muted-foreground mt-1 text-left'>
          Services you can access with your current profile status
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-3'>
        {allowedServices.map(service => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className='relative w-full'
              style={{
                borderRadius: '16px',
                border: '4px solid #FFF',
                background:
                  'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                padding: '1.5rem',
              }}
            >
              <div className='pb-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`p-2 rounded-lg ${service.color} flex items-center justify-center`}
                    >
                      <Icon className='h-5 w-5' />
                    </div>
                    <div className='flex items-center'>
                      <h3 className='text-lg font-semibold leading-none'>
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <StatusBadge status='available' />
                </div>
                <p className='text-sm text-gray-600 mt-3'>
                  {service.description}
                </p>
              </div>

              <div className='space-y-4'>
                {/* Features List */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-gray-900'>
                    What's included:
                  </h4>
                  <ul className='space-y-1'>
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className='flex items-center text-xs text-gray-600'
                      >
                        <div className='w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0' />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button asChild className='w-full' variant='secondary'>
                  <Link
                    href={service.href}
                    className='flex items-center justify-center'
                  >
                    Explore {service.title}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
