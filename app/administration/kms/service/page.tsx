'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { CreateButton } from '@/components/create-button';
import { StatusBadge } from '@/components/status-badge';
import { ActionMenu } from '@/components/action-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Key } from 'lucide-react';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { keyManagementServices } from '@/lib/data';
import {
  filterDataForUser,
  shouldShowEmptyState,
  getEmptyStateMessage,
} from '@/lib/demo-data-filter';

export default function KeyManagementServicePage() {
  const [refreshing, setRefreshing] = useState(false);

  // Filter data for demo purposes
  const filteredServices = filterDataForUser(
    keyManagementServices,
    'key-management-service'
  );
  const showEmptyState = shouldShowEmptyState(
    'key-management-service',
    filteredServices
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  const handleEdit = (service: any) => {
    console.log('Edit service:', service);
  };

  const handleDisableKey = (service: any) => {
    console.log('Disable key:', service);
  };

  const handleInitiateDeletion = (service: any) => {
    console.log('Initiate deletion:', service);
  };

  const handleRotateKey = (service: any) => {
    console.log('Rotate key:', service);
  };

  const columns = [
    {
      key: 'keyAlias',
      label: 'Key Alias',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/administration/kms/service/${row.keyId}`}
          className='text-primary font-medium hover:underline leading-5'
        >
          {value}
        </a>
      ),
    },
    {
      key: 'keyId',
      label: 'Key ID',
      searchable: true,
      render: (value: string) => (
        <div className='text-sm font-mono max-w-xs truncate' title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'keyType',
      label: 'Key Type',
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'Symmetric'
              ? 'bg-blue-100 text-blue-700'
              : value === 'Asymmetric'
                ? 'bg-green-100 text-green-700'
                : 'bg-purple-100 text-purple-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'region',
      label: 'Region',
      searchable: true,
      render: (value: string) => <div className='text-sm'>{value}</div>,
    },
    {
      key: 'creationDate',
      label: 'Creation Date',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className='text-sm text-muted-foreground'>
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
            resourceName={row.keyAlias}
            resourceType='Key'
            customActions={[
              {
                label: 'Disable Key',
                onClick: () => handleDisableKey(row),
              },
              {
                label: 'Initiate Deletions',
                onClick: () => handleInitiateDeletion(row),
                variant: 'destructive' as const,
              },
              {
                label: 'Rotate Key',
                onClick: () => handleRotateKey(row),
              },
              {
                label: 'Edit',
                onClick: () => handleEdit(row),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const keyIcon = (
    <svg
      className='mx-auto h-12 w-12 text-muted-foreground'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={1.5}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z'
      />
    </svg>
  );

  return (
    <PageShell
      title='Key Management Service'
      description='Create and manage encryption keys, certificates, and security credentials for your cloud infrastructure and applications.'
      headerActions={
        <CreateButton
          href='/administration/kms/service/create'
          label='Create Key'
        />
      }
    >
      {showEmptyState ? (
        <Card className='mt-8'>
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('key-management-service')}
              onAction={() =>
                (window.location.href = '/administration/kms/service/create')
              }
              icon={keyIcon}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={filteredServices}
          searchableColumns={['keyAlias', 'keyId', 'keyType', 'region']}
          pageSize={10}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableAutoRefresh={true}
          enableVpcFilter={false}
        />
      )}
    </PageShell>
  );
}
