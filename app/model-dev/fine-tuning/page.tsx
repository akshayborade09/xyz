'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { CreateButton } from '@/components/create-button';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { StatusBadge } from '@/components/status-badge';
import { ActionMenu } from '@/components/action-menu';
import {
  filterDataForUser,
  shouldShowEmptyState,
  getEmptyStateMessage,
} from '@/lib/demo-data-filter';
import { EmptyState } from '@/components/ui/empty-state';

// Mock data for fine-tuning jobs
const mockFineTuningJobs = [
  {
    id: 'ft-job-001',
    fineTunedModel: 'gpt-3.5-turbo-ft-001',
    status: 'completed',
    baseModel: 'gpt-3.5-turbo',
    checkpoints: 3,
    lastUpdated: '2024-12-19T10:30:00Z',
    createdOn: '2024-12-18T14:20:00Z',
  },
  {
    id: 'ft-job-002',
    fineTunedModel: 'llama-2-7b-ft-002',
    status: 'training',
    baseModel: 'llama-2-7b',
    checkpoints: 1,
    lastUpdated: '2024-12-19T11:45:00Z',
    createdOn: '2024-12-19T08:15:00Z',
  },
  {
    id: 'ft-job-003',
    fineTunedModel: 'mistral-7b-ft-003',
    status: 'failed',
    baseModel: 'mistral-7b-instruct',
    checkpoints: 0,
    lastUpdated: '2024-12-18T16:22:00Z',
    createdOn: '2024-12-18T12:10:00Z',
  },
  {
    id: 'ft-job-004',
    fineTunedModel: 'claude-3-ft-004',
    status: 'queued',
    baseModel: 'claude-3-haiku',
    checkpoints: 0,
    lastUpdated: '2024-12-19T09:15:00Z',
    createdOn: '2024-12-19T09:15:00Z',
  },
  {
    id: 'ft-job-005',
    fineTunedModel: 'gpt-4-ft-005',
    status: 'training',
    baseModel: 'gpt-4-turbo',
    checkpoints: 2,
    lastUpdated: '2024-12-19T12:00:00Z',
    createdOn: '2024-12-19T06:30:00Z',
  },
  {
    id: 'ft-job-006',
    fineTunedModel: 'phi-3-mini-ft-006',
    status: 'completed',
    baseModel: 'phi-3-mini-4k',
    checkpoints: 5,
    lastUpdated: '2024-12-18T20:45:00Z',
    createdOn: '2024-12-17T15:30:00Z',
  },
  {
    id: 'ft-job-007',
    fineTunedModel: 'gemma-2b-ft-007',
    status: 'cancelled',
    baseModel: 'gemma-2b',
    checkpoints: 1,
    lastUpdated: '2024-12-18T13:20:00Z',
    createdOn: '2024-12-18T11:00:00Z',
  },
];

export default function FineTuningPage() {
  const [jobs] = useState(mockFineTuningJobs);

  // Filter data based on user type for demo
  const filteredJobs = filterDataForUser(jobs);
  const showEmptyState = shouldShowEmptyState() && filteredJobs.length === 0;

  const handleRefresh = () => {
    console.log(
      '🔄 Refreshing Fine-Tuning Jobs data at:',
      new Date().toLocaleTimeString()
    );
    // In a real app, this would fetch fresh data from the API
    // window.location.reload()
  };

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Jobs' },
    { value: 'completed', label: 'Completed' },
    { value: 'training', label: 'Training' },
    { value: 'queued', label: 'Queued' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const columns = [
    {
      key: 'fineTunedModel',
      label: 'Fine Tuned Model',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <div className='font-medium leading-5'>{value}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'baseModel',
      label: 'Base Model',
      sortable: true,
      searchable: true,
      render: (value: string) => <div className='leading-5'>{value}</div>,
    },
    {
      key: 'checkpoints',
      label: 'Checkpoints',
      sortable: true,
      render: (value: number) => <div className='leading-5'>{value}</div>,
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
            viewHref={`/model-dev/fine-tuning/${row.id}`}
            editHref={`/model-dev/fine-tuning/${row.id}/edit`}
            resourceName={row.fineTunedModel}
            resourceType='Fine-Tuning Job'
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title='Fine-Tuning'
      description='Create and manage fine-tuning jobs to customize foundation models for your specific use cases and domain requirements.'
      headerActions={
        <CreateButton
          href='/model-dev/fine-tuning/create'
          label='Create Fine Tuning Job'
        />
      }
    >
      {showEmptyState ? (
        <EmptyState {...getEmptyStateMessage('fine-tuning')} />
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={filteredJobs}
          searchableColumns={['fineTunedModel', 'baseModel']}
          defaultSort={{ column: 'lastUpdated', direction: 'desc' }}
          pageSize={5}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={filteredJobs.length > 5}
          onRefresh={handleRefresh}
          enableAutoRefresh={true}
          enableVpcFilter={true}
          vpcOptions={statusOptions}
        />
      )}
    </PageShell>
  );
}
