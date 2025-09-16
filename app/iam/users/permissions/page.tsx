'use client';

import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { ActionMenu } from '@/components/action-menu';
import { PlusCircle } from 'lucide-react';

// Mock data
const mockPermissions = [
  {
    id: '1',
    name: 'manage_users',
    description: 'Create, edit, and delete users',
    category: 'User Management',
    assignedTo: 'Admin Role',
  },
  {
    id: '2',
    name: 'view_analytics',
    description: 'Access to system analytics and reports',
    category: 'Analytics',
    assignedTo: 'All Roles',
  },
];

export default function PermissionsPage() {
  const columns = [
    {
      key: 'name',
      label: 'Permission Name',
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className='font-medium text-sm'>{value}</div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value: string) => <div className='text-sm'>{value}</div>,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: string) => <div className='text-sm'>{value}</div>,
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true,
      render: (value: string) => <div className='text-sm'>{value}</div>,
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'right' as const,
      render: (_: unknown, row: any) => (
        <div className='flex justify-end'>
          <ActionMenu
            viewHref='#'
            editHref='#'
            deleteHref='#'
            resourceName={row.name}
            resourceType='Permission'
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title='Permissions'
      description='Manage system permissions and access controls'
      headerActions={
        <Button>
          <PlusCircle className='mr-2 h-4 w-4' />
          Add Permission
        </Button>
      }
    >
      <ShadcnDataTable
        columns={columns}
        data={mockPermissions}
        searchableColumns={['name', 'description', 'category']}
        defaultSort={{ column: 'name', direction: 'asc' }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={false}
        enablePagination={true}
      />
    </PageShell>
  );
}
