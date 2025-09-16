'use client';

import { useState } from 'react';
import {
  Server,
  Database,
  Brain,
  Code,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Pin,
  X,
  Cpu,
  Network,
} from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample data for recently used services
const recentServices = [
  {
    id: '1',
    name: 'GPU Cluster',
    icon: <Cpu className='h-4 w-4' />,
    href: '/compute/resources/gpu',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    name: 'Model Library',
    icon: <Brain className='h-4 w-4' />,
    href: '/models/library',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    name: 'API Catalog',
    icon: <Code className='h-4 w-4' />,
    href: '/apis/catalog',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '4',
    name: 'Data Storage',
    icon: <Database className='h-4 w-4' />,
    href: '/data/storage',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
];

// Sample data for resources
const resources = [
  {
    id: 'res-1',
    name: 'GPU Cluster',
    type: 'compute',
    status: 'running',
    usage: 78,
    href: '/compute/resources/gpu',
  },
  {
    id: 'res-2',
    name: 'Training Data',
    type: 'storage',
    status: 'running',
    usage: 45,
    href: '/data/storage',
  },
  {
    id: 'res-3',
    name: 'Sentiment Model',
    type: 'model',
    status: 'running',
    usage: 23,
    href: '/models/library',
  },
  {
    id: 'res-4',
    name: 'Dev Server',
    type: 'compute',
    status: 'stopped',
    usage: 0,
    href: '/compute/resources/cpu',
  },
  {
    id: 'res-5',
    name: 'API Endpoint',
    type: 'api',
    status: 'error',
    usage: 92,
    href: '/apis/management',
  },
];

// Sample data for recommended actions
const recommendedActions = [
  {
    id: '1',
    title: 'Optimize GPU usage',
    description: 'Your GPU cluster is running at high capacity',
    icon: <Cpu className='h-5 w-5' />,
    href: '/compute/resources/gpu',
  },
  {
    id: '2',
    title: 'Update API endpoint',
    description: 'Your API endpoint has an error',
    icon: <Code className='h-5 w-5' />,
    href: '/apis/management',
  },
  {
    id: '3',
    title: 'Review network traffic',
    description: 'Unusual network traffic detected',
    icon: <Network className='h-5 w-5' />,
    href: '/networking/security',
  },
];

// Sample data for activity feed
const activityFeed = [
  {
    id: '1',
    title: 'GPU Cluster scaled up',
    description: 'Added 2 more GPU instances',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    icon: <Cpu className='h-4 w-4' />,
  },
  {
    id: '2',
    title: 'Model deployed',
    description: 'Sentiment analysis model deployed to production',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    icon: <Zap className='h-4 w-4' />,
  },
  {
    id: '3',
    title: 'Storage increased',
    description: 'Storage capacity increased by 500GB',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    icon: <Database className='h-4 w-4' />,
  },
  {
    id: '4',
    title: 'API error detected',
    description: 'API endpoint returning 500 errors',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    icon: <AlertCircle className='h-4 w-4' />,
  },
  {
    id: '5',
    title: 'New dataset uploaded',
    description: 'Training dataset uploaded (2.3GB)',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    icon: <Database className='h-4 w-4' />,
  },
];

export function DashboardContent() {
  const [pinnedResources, setPinnedResources] = useState<string[]>([
    'res-1',
    'res-3',
  ]);
  const [activeResourceTab, setActiveResourceTab] = useState('pinned');

  const togglePin = (resourceId: string) => {
    setPinnedResources(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return {
          variant: 'success' as const,
          icon: <CheckCircle2 className='h-3 w-3 mr-1' />,
        };
      case 'stopped':
        return { variant: 'outline' as const, icon: null };
      case 'error':
        return {
          variant: 'destructive' as const,
          icon: <AlertCircle className='h-3 w-3 mr-1' />,
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: <Clock className='h-3 w-3 mr-1' />,
        };
    }
  };

  return (
    <div className='space-y-6 px-6 pb-6 w-full'>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full'>
        <Card className='w-full'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>42%</div>
            <Progress value={42} className='h-2 mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              12 cores across 3 machines
            </p>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>GPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>78%</div>
            <Progress value={78} className='h-2 mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              4 GPUs across 2 machines
            </p>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1.2 TB</div>
            <Progress value={60} className='h-2 mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              2 TB total capacity
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-7 w-full'>
        <Card className='md:col-span-4 w-full'>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Monitor and manage your cloud resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <VercelTabs
                tabs={[
                  { id: 'pinned', label: 'Pinned' },
                  { id: 'all', label: 'All Resources' },
                  { id: 'active', label: 'Active' },
                ]}
                activeTab={activeResourceTab}
                onTabChange={setActiveResourceTab}
                size='md'
                className='mb-4'
              />

              {activeResourceTab === 'pinned' && (
                <TabsContent value='pinned' className='m-0'>
                  <div className='m-0'>
                    {resources.filter(r => pinnedResources.includes(r.id))
                      .length > 0 ? (
                      <div className='space-y-2'>
                        {resources
                          .filter(resource =>
                            pinnedResources.includes(resource.id)
                          )
                          .map(resource => (
                            <div
                              key={resource.id}
                              className='flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors'
                            >
                              <Link
                                href={resource.href}
                                className='flex items-center flex-1'
                              >
                                <div className='h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3'>
                                  {resource.type === 'compute' && (
                                    <Server className='h-4 w-4' />
                                  )}
                                  {resource.type === 'storage' && (
                                    <Database className='h-4 w-4' />
                                  )}
                                  {resource.type === 'model' && (
                                    <Brain className='h-4 w-4' />
                                  )}
                                  {resource.type === 'api' && (
                                    <Code className='h-4 w-4' />
                                  )}
                                </div>
                                <div>
                                  <div className='font-medium text-sm'>
                                    {resource.name}
                                  </div>
                                  <div className='text-xs text-muted-foreground capitalize'>
                                    {resource.type}
                                  </div>
                                </div>
                              </Link>

                              <div className='flex items-center gap-2'>
                                {resource.status !== 'stopped' && (
                                  <div className='w-24'>
                                    <div className='text-xs text-right mb-1'>
                                      {resource.usage}%
                                    </div>
                                    <Progress
                                      value={resource.usage}
                                      className='h-1'
                                    />
                                  </div>
                                )}

                                <Badge
                                  variant={
                                    getStatusBadge(resource.status).variant
                                  }
                                  className='flex items-center ml-2'
                                >
                                  {getStatusBadge(resource.status).icon}
                                  {resource.status}
                                </Badge>

                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-7 w-7'
                                  onClick={() => togglePin(resource.id)}
                                >
                                  <X className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className='text-center py-8 text-muted-foreground'>
                        <Pin className='h-8 w-8 mx-auto mb-2 opacity-50' />
                        <p>No pinned resources yet.</p>
                        <p className='text-sm'>
                          Pin resources from the "All Resources" tab.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

              {activeResourceTab === 'all' && (
                <TabsContent value='all' className='m-0'>
                  <>
                    <div className='m-0'>
                      <div className='space-y-2'>
                        {resources.map(resource => (
                          <div
                            key={resource.id}
                            className='flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors'
                          >
                            <Link
                              href={resource.href}
                              className='flex items-center flex-1'
                            >
                              <div className='h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3'>
                                {resource.type === 'compute' && (
                                  <Server className='h-4 w-4' />
                                )}
                                {resource.type === 'storage' && (
                                  <Database className='h-4 w-4' />
                                )}
                                {resource.type === 'model' && (
                                  <Brain className='h-4 w-4' />
                                )}
                                {resource.type === 'api' && (
                                  <Code className='h-4 w-4' />
                                )}
                              </div>
                              <div>
                                <div className='font-medium text-sm'>
                                  {resource.name}
                                </div>
                                <div className='text-xs text-muted-foreground capitalize'>
                                  {resource.type}
                                </div>
                              </div>
                            </Link>

                            <div className='flex items-center gap-2'>
                              {resource.status !== 'stopped' && (
                                <div className='w-24'>
                                  <div className='text-xs text-right mb-1'>
                                    {resource.usage}%
                                  </div>
                                  <Progress
                                    value={resource.usage}
                                    className='h-1'
                                  />
                                </div>
                              )}

                              <Badge
                                variant={
                                  getStatusBadge(resource.status).variant
                                }
                                className='flex items-center ml-2'
                              >
                                {getStatusBadge(resource.status).icon}
                                {resource.status}
                              </Badge>

                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-7 w-7'
                                onClick={() => togglePin(resource.id)}
                              >
                                <Pin
                                  className={`h-4 w-4 ${pinnedResources.includes(resource.id) ? 'fill-primary text-primary' : ''}`}
                                />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <TabsContent value='active' className='m-0'>
                        <div className='space-y-2'>
                          {resources
                            .filter(
                              resource =>
                                resource.status === 'running' ||
                                resource.status === 'error'
                            )
                            .map(resource => (
                              <div
                                key={resource.id}
                                className='flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors'
                              >
                                <Link
                                  href={resource.href}
                                  className='flex items-center flex-1'
                                >
                                  <div className='h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3'>
                                    {resource.type === 'compute' && (
                                      <Server className='h-4 w-4' />
                                    )}
                                    {resource.type === 'storage' && (
                                      <Database className='h-4 w-4' />
                                    )}
                                    {resource.type === 'model' && (
                                      <Brain className='h-4 w-4' />
                                    )}
                                    {resource.type === 'api' && (
                                      <Code className='h-4 w-4' />
                                    )}
                                  </div>
                                  <div>
                                    <div className='font-medium text-sm'>
                                      {resource.name}
                                    </div>
                                    <div className='text-xs text-muted-foreground capitalize'>
                                      {resource.type}
                                    </div>
                                  </div>
                                </Link>

                                <div className='flex items-center gap-2'>
                                  <div className='w-24'>
                                    <div className='text-xs text-right mb-1'>
                                      {resource.usage}%
                                    </div>
                                    <Progress
                                      value={resource.usage}
                                      className='h-1'
                                    />
                                  </div>

                                  <Badge
                                    variant={
                                      getStatusBadge(resource.status).variant
                                    }
                                    className='flex items-center ml-2'
                                  >
                                    {getStatusBadge(resource.status).icon}
                                    {resource.status}
                                  </Badge>

                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-7 w-7'
                                    onClick={() => togglePin(resource.id)}
                                  >
                                    <Pin
                                      className={`h-4 w-4 ${pinnedResources.includes(resource.id) ? 'fill-primary text-primary' : ''}`}
                                    />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </TabsContent>
                    </div>
                  </>
                </TabsContent>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant='outline' className='w-full'>
              <Plus className='h-4 w-4 mr-2' />
              Add New Resource
            </Button>
          </CardFooter>
        </Card>

        <Card className='md:col-span-3 w-full'>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Recent activity on your account</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[350px] pr-4'>
              <div className='space-y-4'>
                {activityFeed.map(activity => (
                  <div key={activity.id} className='flex gap-3'>
                    <div className='mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                      {activity.icon}
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {activity.title}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {activity.description}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button variant='link' className='w-full'>
              View All Activity
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2 w-full'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Recently Used</CardTitle>
            <CardDescription>Services you've recently accessed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {recentServices.map(service => (
                <Link
                  key={service.id}
                  href={service.href}
                  className='flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors'
                >
                  <div className='flex items-center'>
                    <div className='h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3'>
                      {service.icon}
                    </div>
                    <div className='font-medium text-sm'>{service.name}</div>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {formatRelativeTime(service.timestamp)}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
            <CardDescription>
              Suggestions to optimize your resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recommendedActions.map(action => (
                <div key={action.id} className='flex gap-3'>
                  <div className='mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                    {action.icon}
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {action.title}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {action.description}
                    </p>
                    <Button
                      variant='link'
                      size='sm'
                      className='h-auto p-0'
                      asChild
                    >
                      <Link href={action.href}>
                        Take action
                        <ArrowRight className='h-3 w-3 ml-1' />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
