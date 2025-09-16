'use client';

import { useState } from 'react';
import {
  HelpCircle,
  X,
  Search,
  BookOpen,
  FileText,
  MessageSquare,
  ChevronRight,
  PlayCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

interface ContextualHelpProps {
  servicePath?: string;
}

// Sample documentation data
const documentationData = {
  '/compute/resources': {
    quickStart: [
      {
        id: '1',
        title: 'Launch a new machine',
        href: '/docs/compute/launch-machine',
      },
      {
        id: '2',
        title: 'Configure GPU resources',
        href: '/docs/compute/gpu-config',
      },
      {
        id: '3',
        title: 'Set up auto-scaling',
        href: '/docs/compute/auto-scaling',
      },
    ],
    commonTasks: [
      {
        id: '1',
        title: 'Connect to your machine',
        href: '/docs/compute/connect',
      },
      {
        id: '2',
        title: 'Install dependencies',
        href: '/docs/compute/dependencies',
      },
      {
        id: '3',
        title: 'Monitor resource usage',
        href: '/docs/compute/monitoring',
      },
      {
        id: '4',
        title: 'Create a machine image',
        href: '/docs/compute/images',
      },
    ],
    troubleshooting: [
      {
        id: '1',
        title: "Machine won't start",
        href: '/docs/compute/troubleshoot-start',
      },
      {
        id: '2',
        title: 'Connection issues',
        href: '/docs/compute/troubleshoot-connection',
      },
      {
        id: '3',
        title: 'Performance problems',
        href: '/docs/compute/troubleshoot-performance',
      },
    ],
    videos: [
      {
        id: '1',
        title: 'Getting started with Compute',
        href: '/videos/compute-intro',
        duration: '5:32',
      },
      {
        id: '2',
        title: 'Advanced GPU configuration',
        href: '/videos/gpu-advanced',
        duration: '8:15',
      },
    ],
  },
  '/models/library': {
    quickStart: [
      {
        id: '1',
        title: 'Browse available models',
        href: '/docs/models/browse',
      },
      { id: '2', title: 'Import a custom model', href: '/docs/models/import' },
      { id: '3', title: 'Deploy a model', href: '/docs/models/deploy' },
    ],
    commonTasks: [
      { id: '1', title: 'Fine-tune a model', href: '/docs/models/fine-tune' },
      {
        id: '2',
        title: 'Version control for models',
        href: '/docs/models/versioning',
      },
      {
        id: '3',
        title: 'Evaluate model performance',
        href: '/docs/models/evaluation',
      },
      { id: '4', title: 'Export a model', href: '/docs/models/export' },
    ],
    troubleshooting: [
      {
        id: '1',
        title: 'Model loading errors',
        href: '/docs/models/troubleshoot-loading',
      },
      {
        id: '2',
        title: 'Inference timeout issues',
        href: '/docs/models/troubleshoot-inference',
      },
      {
        id: '3',
        title: 'Memory optimization',
        href: '/docs/models/troubleshoot-memory',
      },
    ],
    videos: [
      {
        id: '1',
        title: 'Model Library Overview',
        href: '/videos/model-library',
        duration: '4:45',
      },
      {
        id: '2',
        title: 'Fine-tuning Tutorial',
        href: '/videos/fine-tuning',
        duration: '12:20',
      },
    ],
  },
  '/apis/catalog': {
    quickStart: [
      { id: '1', title: 'Explore available APIs', href: '/docs/apis/explore' },
      { id: '2', title: 'Generate API keys', href: '/docs/apis/keys' },
      {
        id: '3',
        title: 'Make your first API call',
        href: '/docs/apis/first-call',
      },
    ],
    commonTasks: [
      {
        id: '1',
        title: 'Set up rate limiting',
        href: '/docs/apis/rate-limits',
      },
      { id: '2', title: 'Monitor API usage', href: '/docs/apis/monitoring' },
      { id: '3', title: 'Implement authentication', href: '/docs/apis/auth' },
      {
        id: '4',
        title: 'Create API documentation',
        href: '/docs/apis/documentation',
      },
    ],
    troubleshooting: [
      {
        id: '1',
        title: 'API request failures',
        href: '/docs/apis/troubleshoot-failures',
      },
      {
        id: '2',
        title: 'Authentication issues',
        href: '/docs/apis/troubleshoot-auth',
      },
      {
        id: '3',
        title: 'Performance optimization',
        href: '/docs/apis/troubleshoot-performance',
      },
    ],
    videos: [
      {
        id: '1',
        title: 'API Catalog Overview',
        href: '/videos/api-catalog',
        duration: '3:50',
      },
      {
        id: '2',
        title: 'Building Custom APIs',
        href: '/videos/custom-apis',
        duration: '9:45',
      },
    ],
  },
  '/data/datasets': {
    quickStart: [
      {
        id: '1',
        title: 'Create a new dataset',
        href: '/docs/data/create-dataset',
      },
      { id: '2', title: 'Upload data files', href: '/docs/data/upload' },
      {
        id: '3',
        title: 'Connect to external data sources',
        href: '/docs/data/external-sources',
      },
    ],
    commonTasks: [
      {
        id: '1',
        title: 'Transform and clean data',
        href: '/docs/data/transform',
      },
      { id: '2', title: 'Create data pipelines', href: '/docs/data/pipelines' },
      {
        id: '3',
        title: 'Set up data versioning',
        href: '/docs/data/versioning',
      },
      { id: '4', title: 'Share datasets', href: '/docs/data/sharing' },
    ],
    troubleshooting: [
      {
        id: '1',
        title: 'Upload failures',
        href: '/docs/data/troubleshoot-upload',
      },
      {
        id: '2',
        title: 'Data processing errors',
        href: '/docs/data/troubleshoot-processing',
      },
      {
        id: '3',
        title: 'Storage optimization',
        href: '/docs/data/troubleshoot-storage',
      },
    ],
    videos: [
      {
        id: '1',
        title: 'Dataset Management',
        href: '/videos/dataset-management',
        duration: '6:15',
      },
      {
        id: '2',
        title: 'Advanced Data Pipelines',
        href: '/videos/data-pipelines',
        duration: '10:30',
      },
    ],
  },
  // Default help content for any other path
  default: {
    quickStart: [
      {
        id: '1',
        title: 'Getting started with Krutrim Cloud',
        href: '/docs/getting-started',
      },
      {
        id: '2',
        title: 'Understanding the dashboard',
        href: '/docs/dashboard',
      },
      {
        id: '3',
        title: 'Setting up your account',
        href: '/docs/account-setup',
      },
    ],
    commonTasks: [
      { id: '1', title: 'Managing resources', href: '/docs/resources' },
      { id: '2', title: 'Working with AI models', href: '/docs/models' },
      { id: '3', title: 'Using APIs', href: '/docs/apis' },
      { id: '4', title: 'Data management', href: '/docs/data' },
    ],
    troubleshooting: [
      { id: '1', title: 'Common issues', href: '/docs/common-issues' },
      { id: '2', title: 'Billing questions', href: '/docs/billing-faq' },
      { id: '3', title: 'Support tickets', href: '/docs/support' },
    ],
    videos: [
      {
        id: '1',
        title: 'Krutrim Cloud Overview',
        href: '/videos/overview',
        duration: '4:20',
      },
      {
        id: '2',
        title: 'AI Development Workflow',
        href: '/videos/ai-workflow',
        duration: '7:45',
      },
    ],
  },
};

export function ContextualHelp({ servicePath }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('quickStart');
  const pathname = usePathname();

  // Determine which documentation to show based on the current path
  const getDocumentation = () => {
    if (servicePath) {
      return documentationData[servicePath] || documentationData.default;
    }

    // Try to match the current pathname to available documentation
    for (const path in documentationData) {
      if (path !== 'default' && pathname.startsWith(path)) {
        return documentationData[path];
      }
    }

    return documentationData.default;
  };

  const documentation = getDocumentation();

  // Get the current service name from the path
  const getServiceName = () => {
    const path = servicePath || pathname;
    const parts = path.split('/').filter(Boolean);

    if (parts.length > 0) {
      return parts[parts.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    return 'Krutrim Cloud';
  };

  const serviceName = getServiceName();

  return (
    <>
      <TooltipWrapper content='Get help and support for this page'>
        <Button
          variant='outline'
          size='icon'
          className='fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-lg z-50'
          onClick={() => setIsOpen(true)}
        >
          <HelpCircle className='h-5 w-5' />
        </Button>
      </TooltipWrapper>

      {isOpen && (
        <div className='fixed inset-y-0 right-0 w-80 md:w-96 bg-background border-l shadow-lg z-50 flex flex-col'>
          <div className='flex items-center justify-between p-4 border-b'>
            <h2 className='font-semibold'>Help & Resources</h2>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(false)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          <div className='p-4 border-b'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search help articles...'
                className='w-full pl-8'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='flex-1 flex flex-col'>
            <div className='px-4 pt-2'>
              <VercelTabs
                tabs={[
                  { id: 'quickStart', label: 'Quick Start' },
                  { id: 'commonTasks', label: 'Common Tasks' },
                  { id: 'troubleshooting', label: 'Troubleshooting' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                size='sm'
              />
            </div>

            <ScrollArea className='flex-1'>
              <div className='p-4'>
                {activeTab === 'quickStart' && (
                  <div className='m-0'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold mb-1'>
                        {serviceName} Quick Start
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        Get started quickly with {serviceName}
                      </p>
                    </div>

                    <div className='space-y-2'>
                      {documentation.quickStart.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className='flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors'
                        >
                          <FileText className='h-4 w-4 mr-2 text-primary' />
                          <span className='text-sm'>{item.title}</span>
                          <ChevronRight className='h-4 w-4 ml-auto text-muted-foreground' />
                        </Link>
                      ))}
                    </div>

                    {documentation.videos && (
                      <div className='mt-6'>
                        <h4 className='text-base font-semibold mb-2'>
                          Quick Start Videos
                        </h4>
                        <div className='space-y-2'>
                          {documentation.videos.map((video: any) => (
                            <Link
                              key={video.id}
                              href={video.href}
                              className='flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors'
                            >
                              <PlayCircle className='h-4 w-4 mr-2 text-primary' />
                              <span className='text-sm'>{video.title}</span>
                              <Badge
                                variant='outline'
                                className='ml-auto text-xs'
                              >
                                {video.duration}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'commonTasks' && (
                  <div className='m-0'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold mb-1'>
                        Common Tasks
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        Frequently performed operations with {serviceName}
                      </p>
                    </div>

                    <div className='space-y-2'>
                      {documentation.commonTasks.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className='flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors'
                        >
                          <FileText className='h-4 w-4 mr-2 text-primary' />
                          <span className='text-sm'>{item.title}</span>
                          <ChevronRight className='h-4 w-4 ml-auto text-muted-foreground' />
                        </Link>
                      ))}
                    </div>

                    <div className='mt-6 p-4 bg-primary/5 rounded-md border'>
                      <h4 className='text-base font-semibold flex items-center mb-2'>
                        <Lightbulb className='h-4 w-4 mr-2 text-primary' />
                        Pro Tips
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Use keyboard shortcuts to navigate quickly. Press{' '}
                        <kbd className='px-1 py-0.5 bg-muted border rounded text-xs'>
                          ?
                        </kbd>{' '}
                        to see all shortcuts.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'troubleshooting' && (
                  <div className='m-0'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold mb-1'>
                        Troubleshooting
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        Solutions for common problems with {serviceName}
                      </p>
                    </div>

                    <div className='space-y-2'>
                      {documentation.troubleshooting.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className='flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors'
                        >
                          <AlertCircle className='h-4 w-4 mr-2 text-primary' />
                          <span className='text-sm'>{item.title}</span>
                          <ChevronRight className='h-4 w-4 ml-auto text-muted-foreground' />
                        </Link>
                      ))}
                    </div>

                    <div className='mt-6 p-4 bg-primary/5 rounded-md border'>
                      <h4 className='text-base font-semibold flex items-center mb-2'>
                        <CheckCircle className='h-4 w-4 mr-2 text-primary' />
                        Common Solutions
                      </h4>
                      <ul className='text-sm text-muted-foreground space-y-2 ml-6 list-disc'>
                        <li>Check your network connection</li>
                        <li>Verify your API keys are valid</li>
                        <li>Ensure you have sufficient permissions</li>
                        <li>Restart the service if it's unresponsive</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className='p-4 border-t'>
              <div className='grid grid-cols-2 gap-2'>
                <Button variant='outline' className='w-full' asChild>
                  <Link href='/support/documentation'>
                    <BookOpen className='h-4 w-4 mr-2' />
                    Documentation
                  </Link>
                </Button>
                <Button variant='outline' className='w-full' asChild>
                  <Link href='/support/community'>
                    <MessageSquare className='h-4 w-4 mr-2' />
                    Community
                  </Link>
                </Button>
              </div>

              <Button className='w-full mt-2' asChild>
                <Link href='/support/tickets'>
                  <MessageSquare className='h-4 w-4 mr-2' />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
