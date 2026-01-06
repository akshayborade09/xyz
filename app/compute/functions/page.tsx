'use client';

import { PageLayout } from '@/components/page-layout';
import { ShadcnDataTable, Column } from '@/components/ui/shadcn-data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { serverlessFunctions } from '@/lib/data';
import { MoreVertical, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';

export default function FunctionsPage() {
  const [data, setData] = useState(serverlessFunctions);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<any>(null);

  // Table columns
  const columns: Column[] = [
    {
      key: 'name',
      label: 'NAME',
      sortable: true,
      searchable: true,
      render: (value, row) => (
        <a
          href={`/compute/functions/${row.id}`}
          className='text-primary font-medium hover:underline leading-5'
        >
          {value}
        </a>
      ),
    },
    {
      key: 'memory',
      label: 'MEMORY',
      sortable: true,
      render: value => <span className='text-sm'>{value}</span>,
    },
    {
      key: 'runtime',
      label: 'RUNTIME',
      sortable: true,
      render: value => <span className='text-sm'>{value}</span>,
    },
    {
      key: 'status',
      label: 'STATUS',
      sortable: true,
      render: value => <StatusBadge status={value} />,
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      align: 'right',
      render: (_: any, row: any) => (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/compute/functions/${row.id}`;
                }}
              >
                Manage
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive focus:text-destructive'
                onClick={() => {
                  setSelectedFunction(row);
                  setShowDelete(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Handlers
  const handleDelete = () => {
    if (!selectedFunction) return;
    setData(data.filter(f => f.id !== selectedFunction.id));
    setShowDelete(false);
    setSelectedFunction(null);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <PageLayout
      title='Functions'
      description='Deploy and manage serverless functions. Scale automatically with zero infrastructure management.'
      headerActions={
        <Button
          onClick={() => {
            window.location.href = '/compute/functions/create';
          }}
        >
          <Plus className='h-4 w-4 mr-2' />
          Create Function
        </Button>
      }
    >
      <ShadcnDataTable
        columns={columns}
        data={data}
        searchableColumns={['name']}
        searchPlaceholder='Search functions...'
        defaultSort={{ column: 'createdOn', direction: 'desc' }}
        pageSize={10}
        enableSearch={true}
        enablePagination={true}
        onRefresh={handleRefresh}
      />

      {/* Delete Function Modal */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Delete Function</DialogTitle>
            <DialogDescription>
              This will permanently delete the function and all its
              configurations. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
              <div className='text-sm'>
                <p className='font-medium text-gray-900'>
                  Are you sure you want to delete{' '}
                  <span className='font-mono'>{selectedFunction?.name}</span>?
                </p>
                <p className='text-gray-600 mt-2'>
                  This will remove all configurations, triggers, and logs
                  associated with this function.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className='flex gap-2 sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleDelete}
              variant='destructive'
              disabled={!selectedFunction}
            >
              Delete Function
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

