'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Plus,
  Server,
  Database,
  Brain,
  Code,
  MoreHorizontal,
  Edit,
  Trash,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Resource types and their icons
const resourceIcons: Record<string, React.ReactNode> = {
  compute: <Server className='h-4 w-4' />,
  storage: <Database className='h-4 w-4' />,
  model: <Brain className='h-4 w-4' />,
  api: <Code className='h-4 w-4' />,
};

// Status badges and their styles
const statusBadges: Record<
  string,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
    icon: React.ReactNode;
  }
> = {
  running: {
    variant: 'success',
    icon: <CheckCircle2 className='h-3 w-3 mr-1' />,
  },
  stopped: { variant: 'outline', icon: null },
  error: {
    variant: 'destructive',
    icon: <AlertCircle className='h-3 w-3 mr-1' />,
  },
  pending: { variant: 'secondary', icon: <Clock className='h-3 w-3 mr-1' /> },
};

// Define resource type
interface Resource {
  id: string;
  name: string;
  type: string;
  status: string;
  region: string;
  tags: string[];
}

// Define resource group type
interface ResourceGroup {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
  tags: string[];
}

// Sample data
const sampleGroups: ResourceGroup[] = [
  {
    id: 'rg-1',
    name: 'Production ML Pipeline',
    description: 'Resources for the production machine learning pipeline',
    tags: ['production', 'ml'],
    resources: [
      {
        id: 'res-1',
        name: 'GPU Cluster',
        type: 'compute',
        status: 'running',
        region: 'us-east',
        tags: ['gpu', 'training'],
      },
      {
        id: 'res-2',
        name: 'Training Data',
        type: 'storage',
        status: 'running',
        region: 'us-east',
        tags: ['data'],
      },
      {
        id: 'res-3',
        name: 'Sentiment Model',
        type: 'model',
        status: 'running',
        region: 'us-east',
        tags: ['nlp'],
      },
    ],
  },
  {
    id: 'rg-2',
    name: 'Development Environment',
    description: 'Resources for development and testing',
    tags: ['development', 'testing'],
    resources: [
      {
        id: 'res-4',
        name: 'Dev Server',
        type: 'compute',
        status: 'stopped',
        region: 'us-west',
        tags: ['server'],
      },
      {
        id: 'res-5',
        name: 'Test Dataset',
        type: 'storage',
        status: 'running',
        region: 'us-west',
        tags: ['data'],
      },
    ],
  },
  {
    id: 'rg-3',
    name: 'API Gateway',
    description: 'API Gateway and related services',
    tags: ['api', 'gateway'],
    resources: [
      {
        id: 'res-6',
        name: 'API Endpoint',
        type: 'api',
        status: 'running',
        region: 'global',
        tags: ['endpoint'],
      },
      {
        id: 'res-7',
        name: 'API Database',
        type: 'storage',
        status: 'running',
        region: 'us-east',
        tags: ['database'],
      },
    ],
  },
];

export function ResourceGroups() {
  const [groups, setGroups] = useState<ResourceGroup[]>(sampleGroups);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupTags, setNewGroupTags] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter groups based on active tab and search query
  const filteredGroups = groups.filter(group => {
    // Filter by tab
    if (activeTab !== 'all' && !group.tags.includes(activeTab)) {
      return false;
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.tags.some(tag => tag.toLowerCase().includes(query)) ||
        group.resources.some(
          resource =>
            resource.name.toLowerCase().includes(query) ||
            resource.type.toLowerCase().includes(query) ||
            resource.tags.some(tag => tag.toLowerCase().includes(query))
        )
      );
    }

    return true;
  });

  // Create a new resource group
  const handleCreateGroup = () => {
    if (!newGroupName) {
      return;
    }

    const newGroup: ResourceGroup = {
      id: `rg-${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription,
      tags: newGroupTags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
      resources: [],
    };

    setGroups([...groups, newGroup]);
    setNewGroupOpen(false);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupTags('');
  };

  // Delete a resource group
  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  // Get all unique tags for tab filtering
  const allTags = Array.from(new Set(groups.flatMap(group => group.tags)));

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight'>
            Resource Groups
          </h2>
          <p className='text-muted-foreground'>
            Organize and manage your resources in logical groups
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <div className='relative w-full sm:w-64'>
            <Input
              placeholder='Search resources...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full'
            />
          </div>

          <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Resource Group</DialogTitle>
                <DialogDescription>
                  Group related resources together for easier management.
                </DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    placeholder='Production ML Pipeline'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    value={newGroupDescription}
                    onChange={e => setNewGroupDescription(e.target.value)}
                    placeholder='Resources for the production machine learning pipeline'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='tags'>Tags (comma separated)</Label>
                  <Input
                    id='tags'
                    value={newGroupTags}
                    onChange={e => setNewGroupTags(e.target.value)}
                    placeholder='production, ml, critical'
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setNewGroupOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='mb-4'>
          <TabsTrigger value='all'>All Groups</TabsTrigger>
          {allTags.map(tag => (
            <TabsTrigger key={tag} value={tag}>
              {tag}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className='mt-0'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredGroups.map(group => (
              <Card key={group.id}>
                <CardHeader className='pb-2'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>
                          <Edit className='h-4 w-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className='h-4 w-4 mr-2' />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash className='h-4 w-4 mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className='flex flex-wrap gap-1 mt-2'>
                    {group.tags.map(tag => (
                      <Badge key={tag} variant='secondary' className='text-xs'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className='space-y-2'>
                    {group.resources.map(resource => (
                      <div
                        key={resource.id}
                        className='flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors'
                      >
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3'>
                            {resourceIcons[resource.type] || (
                              <Server className='h-4 w-4' />
                            )}
                          </div>
                          <div>
                            <div className='font-medium text-sm'>
                              {resource.name}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {resource.region}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            statusBadges[resource.status]?.variant || 'default'
                          }
                          className='ml-auto flex items-center'
                        >
                          {statusBadges[resource.status]?.icon}
                          {resource.status}
                        </Badge>
                      </div>
                    ))}

                    {group.resources.length === 0 && (
                      <div className='text-center py-4 text-muted-foreground text-sm'>
                        No resources in this group yet.
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button variant='outline' size='sm' className='w-full'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Resource
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredGroups.length === 0 && (
              <div className='col-span-full text-center py-12 text-muted-foreground'>
                No resource groups found. Create a new group to get started.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
