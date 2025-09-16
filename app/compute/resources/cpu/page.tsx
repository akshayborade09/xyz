'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Server,
  Play,
  Square,
  RotateCcw,
  Settings,
  Monitor,
  Activity,
} from 'lucide-react';

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'pending' | 'error';
  vcpus: number;
  memory: string;
  storage: string;
  os: string;
  region: string;
  uptime: string;
  ip: string;
}

const mockVMs: VirtualMachine[] = [
  {
    id: 'vm-001',
    name: 'Web Server 01',
    status: 'running',
    vcpus: 4,
    memory: '16 GB',
    storage: '100 GB SSD',
    os: 'Ubuntu 22.04',
    region: 'us-west-1',
    uptime: '15 days',
    ip: '192.168.1.10',
  },
  {
    id: 'vm-002',
    name: 'Database Server',
    status: 'running',
    vcpus: 8,
    memory: '32 GB',
    storage: '500 GB SSD',
    os: 'CentOS 8',
    region: 'us-west-1',
    uptime: '23 days',
    ip: '192.168.1.20',
  },
  {
    id: 'vm-003',
    name: 'Development Server',
    status: 'stopped',
    vcpus: 2,
    memory: '8 GB',
    storage: '50 GB SSD',
    os: 'Ubuntu 22.04',
    region: 'us-east-1',
    uptime: '0 days',
    ip: '192.168.1.30',
  },
  {
    id: 'vm-004',
    name: 'Load Balancer',
    status: 'pending',
    vcpus: 2,
    memory: '4 GB',
    storage: '20 GB SSD',
    os: 'Alpine Linux',
    region: 'us-west-1',
    uptime: '0 days',
    ip: 'pending',
  },
];

export default function CpuResourcesPage() {
  const [activeTab, setActiveTab] = useState('instances');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'stopped':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className='h-3 w-3' />;
      case 'stopped':
        return <Square className='h-3 w-3' />;
      case 'pending':
        return <RotateCcw className='h-3 w-3 animate-spin' />;
      case 'error':
        return <Activity className='h-3 w-3' />;
      default:
        return <Square className='h-3 w-3' />;
    }
  };

  const runningVMs = mockVMs.filter(vm => vm.status === 'running').length;
  const totalVMs = mockVMs.length;
  const totalVCPUs = mockVMs.reduce((sum, vm) => sum + vm.vcpus, 0);
  const totalMemory = mockVMs.reduce((sum, vm) => sum + parseInt(vm.memory), 0);

  return (
    <PageLayout
      title='CPU Virtual Machines'
      description='Manage your CPU-based virtual machines and compute instances'
    >
      <div className='space-y-6'>
        <VercelTabs
          tabs={[
            { id: 'instances', label: 'Instances' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'configurations', label: 'Configurations' },
            { id: 'networking', label: 'Networking' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          size='md'
        />

        {activeTab === 'instances' && (
          <div className='space-y-6'>
            {/* Overview Stats */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center space-x-2'>
                    <Server className='h-5 w-5 text-blue-600' />
                    <span className='font-medium'>Total Instances</span>
                  </div>
                  <p className='text-2xl font-bold mt-2'>{totalVMs}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center space-x-2'>
                    <Activity className='h-5 w-5 text-green-600' />
                    <span className='font-medium'>Running</span>
                  </div>
                  <p className='text-2xl font-bold mt-2'>{runningVMs}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center space-x-2'>
                    <Monitor className='h-5 w-5 text-purple-600' />
                    <span className='font-medium'>Total vCPUs</span>
                  </div>
                  <p className='text-2xl font-bold mt-2'>{totalVCPUs}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center space-x-2'>
                    <Settings className='h-5 w-5 text-orange-600' />
                    <span className='font-medium'>Total Memory</span>
                  </div>
                  <p className='text-2xl font-bold mt-2'>{totalMemory} GB</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Bar */}
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Virtual Machines</h2>
              <Button>
                <Server className='h-4 w-4 mr-2' />
                Create Instance
              </Button>
            </div>

            {/* VM List */}
            <div className='space-y-4'>
              {mockVMs.map(vm => (
                <Card key={vm.id}>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                          <Server className='h-6 w-6 text-blue-600' />
                        </div>
                        <div>
                          <h3 className='font-semibold text-lg'>{vm.name}</h3>
                          <p className='text-sm text-muted-foreground'>
                            {vm.id}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-4'>
                        <Badge
                          className={`${getStatusColor(vm.status)} flex items-center space-x-1`}
                        >
                          {getStatusIcon(vm.status)}
                          <span className='capitalize'>{vm.status}</span>
                        </Badge>
                        <Button variant='outline' size='sm'>
                          <Settings className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                      <div>
                        <p className='text-muted-foreground'>vCPUs</p>
                        <p className='font-medium'>{vm.vcpus}</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Memory</p>
                        <p className='font-medium'>{vm.memory}</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Storage</p>
                        <p className='font-medium'>{vm.storage}</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>OS</p>
                        <p className='font-medium'>{vm.os}</p>
                      </div>
                    </div>

                    <div className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
                      <div>
                        <p className='text-muted-foreground'>Region</p>
                        <p className='font-medium'>{vm.region}</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>IP Address</p>
                        <p className='font-medium'>{vm.ip}</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Uptime</p>
                        <p className='font-medium'>{vm.uptime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Resource Monitoring</CardTitle>
                <CardDescription>
                  Monitor CPU, memory, and network usage across your instances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[400px] flex items-center justify-center border rounded-lg bg-muted/30'>
                  <div className='text-center'>
                    <Monitor className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
                    <p className='text-lg font-medium mb-2'>
                      Monitoring Dashboard
                    </p>
                    <p className='text-muted-foreground'>
                      Real-time performance metrics would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'configurations' && (
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Instance Configurations</CardTitle>
                <CardDescription>
                  Manage templates and configuration presets for your instances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[400px] flex items-center justify-center border rounded-lg bg-muted/30'>
                  <div className='text-center'>
                    <Settings className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
                    <p className='text-lg font-medium mb-2'>
                      Configuration Management
                    </p>
                    <p className='text-muted-foreground'>
                      Instance templates and configurations would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'networking' && (
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Network Configuration</CardTitle>
                <CardDescription>
                  Manage networking, security groups, and load balancers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[400px] flex items-center justify-center border rounded-lg bg-muted/30'>
                  <div className='text-center'>
                    <Activity className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
                    <p className='text-lg font-medium mb-2'>
                      Network Management
                    </p>
                    <p className='text-muted-foreground'>
                      Network topology and configuration would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
