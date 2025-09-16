'use client';

import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { ActionMenu } from '@/components/action-menu';
import { PlusCircle } from 'lucide-react';

// Mock data
const mockRoles = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access and control',
    users: '2 users',
    permissions: 'All permissions',
  },
  {
    id: '2',
    name: 'Developer',
    description: 'Development and testing access',
    users: '8 users',
    permissions: 'Limited permissions',
  },
];

export default function RolesPage() {
  const columns = [
    {
      key: 'name',
      label: 'Role Name',
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
      key: 'users',
      label: 'Users',
      sortable: true,
      render: (value: string) => <div className='text-sm'>{value}</div>,
    },
    {
      key: 'permissions',
      label: 'Permissions',
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
            resourceType='Role'
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title='Roles'
      description='Manage user roles and their permissions'
      headerActions={
        <Button>
          <PlusCircle className='mr-2 h-4 w-4' />
          Create Role
        </Button>
      }
    >
      <ShadcnDataTable
        columns={columns}
        data={mockRoles}
        searchableColumns={['name', 'description']}
        defaultSort={{ column: 'name', direction: 'asc' }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={false}
        enablePagination={true}
      />
    </PageShell>
  );
}
