'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { CreateButton } from '@/components/create-button';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { StatusBadge } from '@/components/status-badge';
import { ActionMenu } from '@/components/action-menu';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import {
  filterDataForUser,
  shouldShowEmptyState,
  getEmptyStateMessage,
} from '@/lib/demo-data-filter';
import { EmptyState } from '@/components/ui/empty-state';

// Mock data for deployments
const mockDeployments = [
  {
    id: 'deploy-001',
    deploymentName: 'chatbot-gpt-prod',
    instanceType: 'GPU-A100-40GB',
    jobStatus: 'active',
    lastUpdated: '2024-12-19T10:30:00Z',
    createdOn: '2024-12-18T14:20:00Z',
  },
  {
    id: 'deploy-002',
    deploymentName: 'document-classifier-v2',
    instanceType: 'CPU-8vCPU-32GB',
    jobStatus: 'deploying',
    lastUpdated: '2024-12-19T11:45:00Z',
    createdOn: '2024-12-19T08:15:00Z',
  },
  {
    id: 'deploy-003',
    deploymentName: 'sentiment-analyzer',
    instanceType: 'GPU-V100-16GB',
    jobStatus: 'failed',
    lastUpdated: '2024-12-18T16:22:00Z',
    createdOn: '2024-12-18T12:10:00Z',
  },
  {
    id: 'deploy-004',
    deploymentName: 'code-completion-api',
    instanceType: 'GPU-A100-80GB',
    jobStatus: 'scaling',
    lastUpdated: '2024-12-19T09:15:00Z',
    createdOn: '2024-12-19T09:15:00Z',
  },
  {
    id: 'deploy-005',
    deploymentName: 'translation-service',
    instanceType: 'CPU-4vCPU-16GB',
    jobStatus: 'active',
    lastUpdated: '2024-12-19T12:00:00Z',
    createdOn: '2024-12-19T06:30:00Z',
  },
  {
    id: 'deploy-006',
    deploymentName: 'image-recognition-api',
    instanceType: 'GPU-T4-16GB',
    jobStatus: 'stopped',
    lastUpdated: '2024-12-18T20:45:00Z',
    createdOn: '2024-12-17T15:30:00Z',
  },
];

export default function DeploymentsPage() {
  const [deployments] = useState(mockDeployments);

  // Filter data based on user type for demo
  const filteredDeployments = filterDataForUser(deployments);
  const showEmptyState =
    shouldShowEmptyState() && filteredDeployments.length === 0;

  const handleRefresh = () => {
    console.log(
      '🔄 Refreshing Deployments data at:',
      new Date().toLocaleTimeString()
    );
    // In a real app, this would fetch fresh data from the API
    // window.location.reload()
  };

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'deploying', label: 'Deploying' },
    { value: 'scaling', label: 'Scaling' },
    { value: 'stopped', label: 'Stopped' },
    { value: 'failed', label: 'Failed' },
  ];

  const columns = [
    {
      key: 'deploymentName',
      label: 'Deployment Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <div className='font-medium leading-5'>{value}</div>
      ),
    },
    {
      key: 'instanceType',
      label: 'Instance Type',
      sortable: true,
      searchable: true,
      render: (value: string) => <div className='leading-5'>{value}</div>,
    },
    {
      key: 'jobStatus',
      label: 'Job Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className='text-muted-foreground leading-5'>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (value: any, row: any) => (
        <div className='flex justify-end'>
          <ActionMenu
            viewHref={`/models/deployment/${row.id}`}
            editHref={`/models/deployment/${row.id}/edit`}
            resourceName={row.deploymentName}
            resourceType='Deployment'
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title='Deployments'
      description='Deploy and manage your AI models as scalable APIs. Monitor performance, manage resources, and scale your deployments based on demand.'
      headerActions={
        <CreateButton href='/models/deployment/create' label='New Deploy' />
      }
    >
      {showEmptyState ? (
        <EmptyState {...getEmptyStateMessage('deployments')} />
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={filteredDeployments}
          searchableColumns={['deploymentName', 'instanceType']}
          defaultSort={{ column: 'lastUpdated', direction: 'desc' }}
          pageSize={5}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={filteredDeployments.length > 5}
          onRefresh={handleRefresh}
          enableAutoRefresh={true}
          enableVpcFilter={true}
          vpcOptions={statusOptions}
        />
      )}
    </PageShell>
  );
}
