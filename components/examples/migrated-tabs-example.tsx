'use client';

import { useState } from 'react';
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
  Database,
  Brain,
  Code,
  Activity,
  Users,
  Settings,
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped' | 'error';
  usage: number;
}

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Web Server 01',
    type: 'compute',
    status: 'running',
    usage: 78,
  },
  {
    id: '2',
    name: 'Database Primary',
    type: 'storage',
    status: 'running',
    usage: 45,
  },
  {
    id: '3',
    name: 'API Gateway',
    type: 'compute',
    status: 'running',
    usage: 62,
  },
  {
    id: '4',
    name: 'Cache Server',
    type: 'storage',
    status: 'stopped',
    usage: 0,
  },
  { id: '5', name: 'ML Model API', type: 'model', status: 'error', usage: 23 },
];

const pinnedResourceIds = ['1', '3'];

export function MigratedTabsExample() {
  const [activeResourceTab, setActiveResourceTab] = useState('overview');
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compute':
        return <Server className='h-4 w-4' />;
      case 'storage':
        return <Database className='h-4 w-4' />;
      case 'model':
        return <Brain className='h-4 w-4' />;
      default:
        return <Code className='h-4 w-4' />;
    }
  };

  return (
    <div className='space-y-8 max-w-4xl mx-auto p-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Migrated Tabs Example
        </h1>
        <p className='text-muted-foreground'>
          Examples of components successfully migrated to use VercelTabs
        </p>
      </div>

      {/* Resource Management Example */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Management Dashboard</CardTitle>
          <CardDescription>
            Manage and monitor your cloud resources with smooth tab transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VercelTabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'pinned', label: 'Pinned' },
              { id: 'all', label: 'All Resources' },
              { id: 'active', label: 'Active Only' },
            ]}
            activeTab={activeResourceTab}
            onTabChange={setActiveResourceTab}
            size='md'
            className='mb-6'
          />

          {activeResourceTab === 'overview' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-muted/30 rounded-lg p-4'>
                  <div className='flex items-center space-x-2'>
                    <Activity className='h-5 w-5 text-green-600' />
                    <span className='font-medium'>Active Resources</span>
                  </div>
                  <p className='text-2xl font-bold mt-2'>
                    {mockResources.filter(r => r.status === 'running').length}
                  </p>
                </div>
                <div className='bg-muted/30 rounded-lg p-4'>
                  <div className='flex items-center space-x-2'>
                    <Users className='h-5 w-5 text-blue-600' />
                    <span className='font-medium'>Total Resources</span>
                  </div>
                  <p className='text-2xl font-bold mt-2'>
                    {mockResources.length}
                  </p>
                </div>
                <div className='bg-muted/30 rounded-lg p-4'>
                  <div className='flex items-center space-x-2'>
                    <Settings className='h-5 w-5 text-purple-600' />
                    <span className='font-medium'>Pinned</span>
                  </div>
                  <p className='text-2xl font-bold mt-2'>
                    {pinnedResourceIds.length}
                  </p>
                </div>
              </div>
              <p className='text-muted-foreground'>
                Use the tabs above to explore different views of your resources.
              </p>
            </div>
          )}

          {activeResourceTab === 'pinned' && (
            <div className='space-y-3'>
              {mockResources
                .filter(resource => pinnedResourceIds.includes(resource.id))
                .map(resource => (
                  <div
                    key={resource.id}
                    className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-primary/10 rounded-md'>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <p className='font-medium'>{resource.name}</p>
                        <p className='text-sm text-muted-foreground capitalize'>
                          {resource.type}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status}
                      </Badge>
                      {resource.status === 'running' && (
                        <span className='text-sm text-muted-foreground'>
                          {resource.usage}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              {pinnedResourceIds.length === 0 && (
                <p className='text-center text-muted-foreground py-8'>
                  No pinned resources yet.
                </p>
              )}
            </div>
          )}

          {activeResourceTab === 'all' && (
            <div className='space-y-3'>
              {mockResources.map(resource => (
                <div
                  key={resource.id}
                  className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-primary/10 rounded-md'>
                      {getTypeIcon(resource.type)}
                    </div>
                    <div>
                      <p className='font-medium'>{resource.name}</p>
                      <p className='text-sm text-muted-foreground capitalize'>
                        {resource.type}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge className={getStatusColor(resource.status)}>
                      {resource.status}
                    </Badge>
                    {resource.status === 'running' && (
                      <span className='text-sm text-muted-foreground'>
                        {resource.usage}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeResourceTab === 'active' && (
            <div className='space-y-3'>
              {mockResources
                .filter(resource => resource.status === 'running')
                .map(resource => (
                  <div
                    key={resource.id}
                    className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-primary/10 rounded-md'>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <p className='font-medium'>{resource.name}</p>
                        <p className='text-sm text-muted-foreground capitalize'>
                          {resource.type}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status}
                      </Badge>
                      <span className='text-sm text-muted-foreground'>
                        {resource.usage}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Example */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Panel</CardTitle>
          <CardDescription>
            Example of settings with small-sized tabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VercelTabs
            tabs={[
              { id: 'general', label: 'General' },
              { id: 'security', label: 'Security' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'billing', label: 'Billing' },
            ]}
            activeTab={activeSettingsTab}
            onTabChange={setActiveSettingsTab}
            size='sm'
            className='mb-4'
          />

          {activeSettingsTab === 'general' && (
            <div className='space-y-4'>
              <h3 className='font-medium'>General Settings</h3>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Project Name</label>
                <input
                  type='text'
                  className='w-full p-2 border rounded-md'
                  defaultValue='My Project'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Description</label>
                <textarea
                  className='w-full p-2 border rounded-md'
                  rows={3}
                  defaultValue='Project description here...'
                />
              </div>
            </div>
          )}

          {activeSettingsTab === 'security' && (
            <div className='space-y-4'>
              <h3 className='font-medium'>Security Settings</h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium'>Two-Factor Authentication</p>
                    <p className='text-sm text-muted-foreground'>
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Enable
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium'>API Access</p>
                    <p className='text-sm text-muted-foreground'>
                      Manage API keys and access
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'notifications' && (
            <div className='space-y-4'>
              <h3 className='font-medium'>Notification Preferences</h3>
              <div className='space-y-3'>
                <div className='flex items-center space-x-2'>
                  <input type='checkbox' id='email' defaultChecked />
                  <label htmlFor='email' className='text-sm'>
                    Email notifications
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input type='checkbox' id='sms' />
                  <label htmlFor='sms' className='text-sm'>
                    SMS notifications
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input type='checkbox' id='push' defaultChecked />
                  <label htmlFor='push' className='text-sm'>
                    Push notifications
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'billing' && (
            <div className='space-y-4'>
              <h3 className='font-medium'>Billing Information</h3>
              <div className='bg-muted/30 rounded-lg p-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='font-medium'>Current Plan</p>
                    <p className='text-sm text-muted-foreground'>
                      Professional Plan
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className='mt-4 pt-4 border-t'>
                  <p className='text-sm text-muted-foreground'>
                    Next billing date: March 15, 2024
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
