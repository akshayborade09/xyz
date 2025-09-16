'use client';

import { useState } from 'react';
import { VercelTabs } from '@/components/ui/vercel-tabs';

const navigationTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'activity', label: 'Activity' },
  { id: 'domains', label: 'Domains' },
  { id: 'usage', label: 'Usage' },
  { id: 'monitoring', label: 'Monitoring' },
];

const projectTabs = [
  { id: 'code', label: 'Code' },
  { id: 'issues', label: 'Issues' },
  { id: 'pull-requests', label: 'Pull Requests' },
  { id: 'actions', label: 'Actions' },
  { id: 'projects', label: 'Projects' },
  { id: 'security', label: 'Security' },
  { id: 'insights', label: 'Insights' },
  { id: 'settings', label: 'Settings' },
];

const simpleTabs = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

export default function VercelTabsDemo() {
  const [activeNavTab, setActiveNavTab] = useState('overview');
  const [activeProjectTab, setActiveProjectTab] = useState('code');
  const [activeSimpleTab, setActiveSimpleTab] = useState('tab1');

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto py-12 space-y-12'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-foreground mb-4'>
            Vercel Tabs Component Demo
          </h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            A beautiful, animated tabs component inspired by Vercel's design
            system, integrated with your project's theme and styling.
          </p>
        </div>

        {/* Main Navigation Example */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold text-foreground mb-2'>
              Navigation Tabs
            </h2>
            <p className='text-muted-foreground mb-4'>
              Perfect for main navigation with multiple sections
            </p>
          </div>

          <div className='bg-card border rounded-lg p-8'>
            <VercelTabs
              tabs={navigationTabs}
              activeTab={activeNavTab}
              onTabChange={setActiveNavTab}
              size='md'
            />

            <div className='mt-8 p-6 bg-muted/30 rounded-md'>
              <h3 className='font-medium text-foreground mb-2'>
                Active Tab Content: {activeNavTab}
              </h3>
              <p className='text-muted-foreground'>
                This is the content for the{' '}
                {navigationTabs.find(tab => tab.id === activeNavTab)?.label}{' '}
                tab. The active indicator smoothly animates between tabs with a
                hover effect.
              </p>
            </div>
          </div>
        </div>

        {/* Project Tabs Example */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold text-foreground mb-2'>
              Project Tabs (Large)
            </h2>
            <p className='text-muted-foreground mb-4'>
              Larger tabs suitable for main content areas
            </p>
          </div>

          <div className='bg-card border rounded-lg p-8'>
            <VercelTabs
              tabs={projectTabs}
              activeTab={activeProjectTab}
              onTabChange={setActiveProjectTab}
              size='lg'
            />

            <div className='mt-8 p-6 bg-muted/30 rounded-md'>
              <h3 className='font-medium text-foreground mb-2'>
                Active:{' '}
                {projectTabs.find(tab => tab.id === activeProjectTab)?.label}
              </h3>
              <p className='text-muted-foreground'>
                Larger tabs provide more breathing room and work well for
                primary navigation.
              </p>
            </div>
          </div>
        </div>

        {/* Small Tabs Example */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold text-foreground mb-2'>
              Compact Tabs (Small)
            </h2>
            <p className='text-muted-foreground mb-4'>
              Smaller tabs for secondary navigation or tight spaces
            </p>
          </div>

          <div className='bg-card border rounded-lg p-8'>
            <VercelTabs
              tabs={simpleTabs}
              activeTab={activeSimpleTab}
              onTabChange={setActiveSimpleTab}
              size='sm'
            />

            <div className='mt-8 p-6 bg-muted/30 rounded-md'>
              <h3 className='font-medium text-foreground mb-2'>
                Active:{' '}
                {simpleTabs.find(tab => tab.id === activeSimpleTab)?.label}
              </h3>
              <p className='text-muted-foreground'>
                Compact tabs are perfect for secondary navigation or when space
                is limited.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold text-foreground mb-2'>
              Features
            </h2>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div className='bg-card border rounded-lg p-6'>
              <h3 className='font-semibold text-foreground mb-2'>
                🎯 Smooth Animations
              </h3>
              <p className='text-muted-foreground text-sm'>
                Active indicator smoothly animates between tabs with easing
                transitions.
              </p>
            </div>

            <div className='bg-card border rounded-lg p-6'>
              <h3 className='font-semibold text-foreground mb-2'>
                ✨ Hover Effects
              </h3>
              <p className='text-muted-foreground text-sm'>
                Subtle hover highlights provide visual feedback before
                selection.
              </p>
            </div>

            <div className='bg-card border rounded-lg p-6'>
              <h3 className='font-semibold text-foreground mb-2'>
                🎨 Theme Integration
              </h3>
              <p className='text-muted-foreground text-sm'>
                Seamlessly integrates with your project's design system and dark
                mode.
              </p>
            </div>

            <div className='bg-card border rounded-lg p-6'>
              <h3 className='font-semibold text-foreground mb-2'>
                📱 Responsive Sizes
              </h3>
              <p className='text-muted-foreground text-sm'>
                Multiple sizes (sm, md, lg) for different use cases and screen
                sizes.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold text-foreground mb-2'>
              Usage Example
            </h2>
          </div>

          <div className='bg-card border rounded-lg p-6'>
            <pre className='bg-muted/50 rounded-md p-4 text-sm overflow-x-auto'>
              <code>{`import { VercelTabs } from "@/components/ui/vercel-tabs"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "settings", label: "Settings" },
  { id: "billing", label: "Billing" },
]

export function MyComponent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <VercelTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      size="md"
    />
  )
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
