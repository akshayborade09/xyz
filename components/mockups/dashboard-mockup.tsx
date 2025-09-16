'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Bell,
  Clock,
  Server,
  Cpu,
  Database,
  HardDrive,
  Layers,
  ChevronDown,
  Plus,
  ArrowUpRight,
  Zap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground mt-1'>
            Welcome back! Here's an overview of your Krutrim Cloud resources.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm'>
            <Clock className='mr-2 h-4 w-4' />
            Last 7 days
            <ChevronDown className='ml-2 h-4 w-4' />
          </Button>
          <Button size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            New Resource
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue='overview'
        className='space-y-4'
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value='overview' className='flex items-center'>
            <LayoutDashboard className='mr-2 h-4 w-4' />
            Overview
          </TabsTrigger>
          <TabsTrigger value='resources' className='flex items-center'>
            <Server className='mr-2 h-4 w-4' />
            Resources
          </TabsTrigger>
          <TabsTrigger value='activity' className='flex items-center'>
            <Activity className='mr-2 h-4 w-4' />
            Activity
          </TabsTrigger>
          <TabsTrigger value='alerts' className='flex items-center'>
            <Bell className='mr-2 h-4 w-4' />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Active Models
                </CardTitle>
                <Cpu className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>12</div>
                <p className='text-xs text-muted-foreground'>
                  +2 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>API Calls</CardTitle>
                <BarChart3 className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>1.2M</div>
                <p className='text-xs text-muted-foreground'>
                  +15% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Compute Usage
                </CardTitle>
                <Server className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>68%</div>
                <Progress value={68} className='h-2' />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Storage</CardTitle>
                <Database className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>2.4 TB</div>
                <Progress value={45} className='h-2' />
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='lg:col-span-4'>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className='h-[240px] flex items-center justify-center'>
                <div className='text-muted-foreground text-sm'>
                  Usage chart would appear here
                </div>
              </CardContent>
            </Card>
            <Card className='lg:col-span-3'>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-start gap-4'>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Cpu className='h-4 w-4 text-primary' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>Model Deployed</p>
                    <p className='text-xs text-muted-foreground'>
                      Text Classification model deployed to production
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      30 minutes ago
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Database className='h-4 w-4 text-primary' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>Dataset Updated</p>
                    <p className='text-xs text-muted-foreground'>
                      Customer Feedback dataset updated with new entries
                    </p>
                    <p className='text-xs text-muted-foreground'>2 hours ago</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <HardDrive className='h-4 w-4 text-primary' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>Storage Expanded</p>
                    <p className='text-xs text-muted-foreground'>
                      Storage capacity increased by 500GB
                    </p>
                    <p className='text-xs text-muted-foreground'>Yesterday</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' size='sm' className='w-full'>
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current status of your services
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    <span className='text-sm'>AI Models</span>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700'
                  >
                    Operational
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    <span className='text-sm'>API Services</span>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700'
                  >
                    Operational
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4 text-yellow-500' />
                    <span className='text-sm'>Data Processing</span>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-yellow-50 text-yellow-700'
                  >
                    Degraded
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    <span className='text-sm'>Compute Resources</span>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700'
                  >
                    Operational
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' size='sm' className='w-full'>
                  View Status Page
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used operations</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Button variant='outline' className='w-full justify-between'>
                  <div className='flex items-center'>
                    <Layers className='mr-2 h-4 w-4' />
                    Deploy New Model
                  </div>
                  <ArrowUpRight className='h-4 w-4' />
                </Button>
                <Button variant='outline' className='w-full justify-between'>
                  <div className='flex items-center'>
                    <Database className='mr-2 h-4 w-4' />
                    Upload Dataset
                  </div>
                  <ArrowUpRight className='h-4 w-4' />
                </Button>
                <Button variant='outline' className='w-full justify-between'>
                  <div className='flex items-center'>
                    <Zap className='mr-2 h-4 w-4' />
                    Create API Key
                  </div>
                  <ArrowUpRight className='h-4 w-4' />
                </Button>
                <Button variant='outline' className='w-full justify-between'>
                  <div className='flex items-center'>
                    <Server className='mr-2 h-4 w-4' />
                    Scale Resources
                  </div>
                  <ArrowUpRight className='h-4 w-4' />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Activity</CardTitle>
                <CardDescription>
                  Recent actions by team members
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <Avatar>
                    <AvatarImage src='/placeholder.svg?height=40&width=40' />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>John Doe</p>
                    <p className='text-xs text-muted-foreground'>
                      Deployed a new NLP model
                    </p>
                    <p className='text-xs text-muted-foreground'>1 hour ago</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <Avatar>
                    <AvatarImage src='/placeholder.svg?height=40&width=40' />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>Alice Smith</p>
                    <p className='text-xs text-muted-foreground'>
                      Updated API documentation
                    </p>
                    <p className='text-xs text-muted-foreground'>3 hours ago</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <Avatar>
                    <AvatarImage src='/placeholder.svg?height=40&width=40' />
                    <AvatarFallback>RJ</AvatarFallback>
                  </Avatar>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>Robert Johnson</p>
                    <p className='text-xs text-muted-foreground'>
                      Added new team members
                    </p>
                    <p className='text-xs text-muted-foreground'>Yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
