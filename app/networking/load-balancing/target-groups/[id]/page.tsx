'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { DetailSection } from '@/components/detail-section';
import { DetailGrid } from '@/components/detail-grid';
import { Button } from '@/components/ui/button';
import { getTargetGroup } from '@/lib/data';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { StatusBadge } from '@/components/status-badge';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TargetGroupDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const targetGroup = getTargetGroup(params.id);

  if (!targetGroup) {
    notFound();
  }

  const handleDelete = () => {
    // In a real app, this would delete the target group
    console.log('Deleting Target Group:', targetGroup.name);

    toast({
      title: 'Target group deleted successfully',
      description: `Target Group "${targetGroup.name}" has been deleted.`,
    });

    router.push('/networking/load-balancing/target-groups');
  };

  const handleEdit = () => {
    router.push(
      `/networking/load-balancing/target-groups/${targetGroup.id}/edit`
    );
  };

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Target Members table columns
  const targetMembersColumns = [
    {
      key: 'name',
      label: 'Target Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <div className='font-medium'>{value}</div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: string) => (
        <span className='text-xs px-2 py-1 bg-muted rounded text-muted-foreground'>
          {value}
        </span>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      sortable: true,
    },
    {
      key: 'port',
      label: 'Port',
      align: 'right' as const,
      sortable: true,
      render: (value: number) => <div className='text-right'>{value}</div>,
    },
  ];

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/networking', title: 'Networking' },
    { href: '/networking/load-balancing', title: 'Load Balancers' },
    {
      href: '/networking/load-balancing/target-groups',
      title: 'Target Groups',
    },
    {
      href: `/networking/load-balancing/target-groups/${targetGroup.id}`,
      title: targetGroup.name,
    },
  ];

  return (
    <PageLayout
      title={targetGroup.name}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      {/* Target Group Basic Information */}
      <div
        className='mb-6 group relative'
        style={{
          borderRadius: '16px',
          border: '4px solid #FFF',
          background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
          boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
          padding: '1.5rem',
        }}
      >
        {/* Overlay Edit/Delete Buttons */}
        <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleEdit}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsDeleteModalOpen(true)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>

        <DetailGrid>
          {/* Target Group ID, Protocol, Port, VPC in first row */}
          <div className='col-span-full grid grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Target Group ID
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {targetGroup.id}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Protocol
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {targetGroup.protocol}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Port
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {targetGroup.port}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                VPC
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {targetGroup.vpc}
              </div>
            </div>
          </div>

          {/* Load Balancer, Type, Created On in second row */}
          <div className='col-span-full grid grid-cols-4 gap-4 mt-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Attached Load Balancer
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {targetGroup.loadBalancer || '—'}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Target Type
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {targetGroup.type}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Created On
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {formatDate(targetGroup.createdOn)}
              </div>
            </div>
            <div className='space-y-1'>{/* Empty column for alignment */}</div>
          </div>

          {/* Health Check Configuration */}
          <div className='col-span-full mt-6'>
            <div className='space-y-3'>
              <h3 className='text-base font-semibold text-gray-900'>
                Health Check Configuration
              </h3>
              <div className='grid grid-cols-4 gap-4'>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Protocol
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {targetGroup.healthCheck.protocol}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Port
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {targetGroup.healthCheck.port}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Interval
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {targetGroup.healthCheck.interval}s
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Timeout
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {targetGroup.healthCheck.timeout}s
                  </div>
                </div>
              </div>
              {targetGroup.healthCheck.path && (
                <div className='grid grid-cols-4 gap-4 mt-3'>
                  <div className='space-y-1'>
                    <label
                      className='text-sm font-normal text-gray-700'
                      style={{ fontSize: '13px' }}
                    >
                      Path
                    </label>
                    <div className='font-medium' style={{ fontSize: '14px' }}>
                      {targetGroup.healthCheck.path}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Target Members Section */}
      {targetGroup.targetMembers.length > 0 && (
        <div className='bg-card text-card-foreground border-border border rounded-lg p-6 mb-8'>
          <DetailSection
            title={`Target Members (${targetGroup.targetMembers.length})`}
          >
            <ShadcnDataTable
              columns={targetMembersColumns}
              data={targetGroup.targetMembers}
              searchableColumns={['name']}
              pageSize={10}
              enableSearch={true}
              enableColumnVisibility={false}
              enablePagination={true}
              enableVpcFilter={false}
            />
          </DetailSection>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={targetGroup.name}
        resourceType='Target Group'
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
