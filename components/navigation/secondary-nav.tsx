'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SecondaryNavProps {
  section: string;
}

interface NavSection {
  title: string;
  items: {
    title: string;
    href: string;
    items?: {
      title: string;
      href: string;
    }[];
  }[];
}

const navSections: Record<string, NavSection> = {
  apis: {
    title: 'AI APIs',
    items: [
      {
        title: 'API Catalog',
        href: '/apis/catalog',
        items: [
          { title: 'Natural Language Processing', href: '/apis/catalog/nlp' },
          { title: 'Computer Vision', href: '/apis/catalog/vision' },
          { title: 'Speech & Audio', href: '/apis/catalog/speech' },
          { title: 'Multimodal APIs', href: '/apis/catalog/multimodal' },
        ],
      },
      {
        title: 'API Management',
        href: '/apis/management',
        items: [
          { title: 'API Keys & Authentication', href: '/apis/management/keys' },
          { title: 'API Versioning', href: '/apis/management/versions' },
          { title: 'API Documentation', href: '/apis/management/docs' },
          { title: 'API Testing', href: '/apis/management/testing' },
        ],
      },
      {
        title: 'API Analytics',
        href: '/apis/analytics',
        items: [
          { title: 'Usage Metrics', href: '/apis/analytics/usage' },
          { title: 'User Analytics', href: '/apis/analytics/users' },
          {
            title: 'Performance Monitoring',
            href: '/apis/analytics/performance',
          },
          { title: 'Cost Analysis', href: '/apis/analytics/cost' },
        ],
      },
      {
        title: 'Custom API Development',
        href: '/apis/development',
        items: [
          { title: 'API Builder', href: '/apis/development/builder' },
          { title: 'Model Integration', href: '/apis/development/integration' },
          { title: 'Deployment Options', href: '/apis/development/deployment' },
          {
            title: 'API Lifecycle Management',
            href: '/apis/development/lifecycle',
          },
        ],
      },
    ],
  },
  solutions: {
    title: 'Industry Solutions',
    items: [
      {
        title: 'Healthcare',
        href: '/solutions/healthcare',
        items: [
          {
            title: 'Medical Imaging Analysis',
            href: '/solutions/healthcare/imaging',
          },
          {
            title: 'Clinical Documentation',
            href: '/solutions/healthcare/documentation',
          },
          {
            title: 'Patient Care Optimization',
            href: '/solutions/healthcare/patient-care',
          },
          {
            title: 'Healthcare Compliance',
            href: '/solutions/healthcare/compliance',
          },
        ],
      },
      {
        title: 'Financial Services',
        href: '/solutions/finance',
        items: [
          { title: 'Fraud Detection', href: '/solutions/finance/fraud' },
          { title: 'Customer Insights', href: '/solutions/finance/insights' },
          { title: 'Trading & Investment', href: '/solutions/finance/trading' },
          {
            title: 'Regulatory Compliance',
            href: '/solutions/finance/compliance',
          },
        ],
      },
      {
        title: 'Retail & E-commerce',
        href: '/solutions/retail',
        items: [
          { title: 'Customer Experience', href: '/solutions/retail/customer' },
          {
            title: 'Inventory Management',
            href: '/solutions/retail/inventory',
          },
          {
            title: 'Visual Search & Recognition',
            href: '/solutions/retail/visual',
          },
          { title: 'Pricing Optimization', href: '/solutions/retail/pricing' },
        ],
      },
      {
        title: 'Manufacturing',
        href: '/solutions/manufacturing',
        items: [
          {
            title: 'Predictive Maintenance',
            href: '/solutions/manufacturing/maintenance',
          },
          {
            title: 'Quality Control',
            href: '/solutions/manufacturing/quality',
          },
          {
            title: 'Supply Chain Optimization',
            href: '/solutions/manufacturing/supply-chain',
          },
          {
            title: 'Process Optimization',
            href: '/solutions/manufacturing/process',
          },
        ],
      },
      {
        title: 'Media & Entertainment',
        href: '/solutions/media',
        items: [
          { title: 'Content Analysis', href: '/solutions/media/analysis' },
          { title: 'Content Creation', href: '/solutions/media/creation' },
          { title: 'Content Moderation', href: '/solutions/media/moderation' },
          { title: 'Audience Engagement', href: '/solutions/media/engagement' },
        ],
      },
    ],
  },
  models: {
    title: 'AI Models',
    items: [
      {
        title: 'Model Library',
        href: '/models/library',
      },
      {
        title: 'Model Training',
        href: '/models/training',
      },
      {
        title: 'Model Deployment',
        href: '/models/deployment',
      },
      {
        title: 'Model Monitoring',
        href: '/models/monitoring',
      },
    ],
  },
  dashboard: {
    title: 'Dashboard',
    items: [
      {
        title: 'Overview & Analytics',
        href: '/dashboard/overview',
      },
      {
        title: 'System Status',
        href: '/dashboard/status',
      },
      {
        title: 'Recent Activities',
        href: '/dashboard/activities',
      },
      {
        title: 'Quick Actions',
        href: '/dashboard/actions',
      },
    ],
  },
  data: {
    title: 'Data Management',
    items: [
      {
        title: 'Datasets',
        href: '/data/datasets',
      },
      {
        title: 'Data Processing',
        href: '/data/processing',
      },
      {
        title: 'Data Pipelines',
        href: '/data/pipelines',
      },
      {
        title: 'Data Governance',
        href: '/data/governance',
      },
    ],
  },
  compute: {
    title: 'Compute & Infrastructure',
    items: [
      {
        title: 'Compute Resources',
        href: '/compute/resources',
      },
      {
        title: 'Storage',
        href: '/compute/storage',
      },
      {
        title: 'Networking',
        href: '/compute/networking',
      },
      {
        title: 'Kubernetes Clusters',
        href: '/compute/kubernetes',
      },
    ],
  },
  developer: {
    title: 'Developer Tools',
    items: [
      {
        title: 'SDKs & Libraries',
        href: '/developer/sdks',
      },
      {
        title: 'CI/CD Integration',
        href: '/developer/cicd',
      },
      {
        title: 'Version Control',
        href: '/developer/version-control',
      },
      {
        title: 'Debugging Tools',
        href: '/developer/debugging',
      },
    ],
  },
  security: {
    title: 'Security & Compliance',
    items: [
      {
        title: 'Identity & Access Management',
        href: '/security/iam',
      },
      {
        title: 'Encryption',
        href: '/security/encryption',
      },
      {
        title: 'Audit Logs',
        href: '/security/audit',
      },
      {
        title: 'Compliance Center',
        href: '/security/compliance',
      },
    ],
  },
  billing: {
    title: 'Billing & Administration',
    items: [
      {
        title: 'Usage & Billing',
        href: '/billing/usage',
      },
      {
        title: 'Account Management',
        href: '/billing/account',
      },
      {
        title: 'Team Management',
        href: '/billing/team',
      },
      {
        title: 'Quotas & Limits',
        href: '/billing/quotas',
      },
    ],
  },
  support: {
    title: 'Support & Resources',
    items: [
      {
        title: 'Documentation',
        href: '/support/documentation',
      },
      {
        title: 'Community',
        href: '/support/community',
      },
      {
        title: 'Support Tickets',
        href: '/support/tickets',
      },
      {
        title: 'Learning Resources',
        href: '/support/learning',
      },
    ],
  },
};

export function SecondaryNav({ section }: SecondaryNavProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const navSection = navSections[section];

  if (!navSection) {
    return null;
  }

  const toggleExpanded = (title: string) => {
    setExpanded(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className='w-64 border-r h-[calc(100vh-4rem)] hidden md:block'>
      <div className='p-4 border-b'>
        <h2 className='font-semibold text-lg'>{navSection.title}</h2>
      </div>
      <ScrollArea className='h-[calc(100vh-8rem)]'>
        <div className='p-2'>
          {navSection.items.map(item => (
            <div key={item.title} className='mb-2'>
              <div className='flex items-center'>
                {item.items ? (
                  <Button
                    variant='ghost'
                    className='w-full justify-start font-medium'
                    onClick={() => toggleExpanded(item.title)}
                  >
                    {expanded[item.title] ? (
                      <ChevronDown className='h-4 w-4 mr-2' />
                    ) : (
                      <ChevronRight className='h-4 w-4 mr-2' />
                    )}
                    {item.title}
                  </Button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              </div>

              {item.items && expanded[item.title] && (
                <div className='ml-4 mt-1 space-y-1'>
                  {item.items.map(subItem => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={cn(
                        'flex items-center w-full px-3 py-2 text-sm rounded-md',
                        pathname === subItem.href
                          ? 'bg-accent/80 text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
