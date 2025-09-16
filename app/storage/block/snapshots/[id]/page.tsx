'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout } from '../../../../../components/page-layout';
import { DetailGrid } from '../../../../../components/detail-grid';
import { Button } from '../../../../../components/ui/button';
import {
  getSnapshot,
  canDeletePrimarySnapshot,
  getPrimarySnapshotsForResource,
} from '../../../../../lib/data';
import { DeleteConfirmationModal } from '../../../../../components/delete-confirmation-modal';
import { StatusBadge } from '../../../../../components/status-badge';
import { Edit, Trash2, Download, Copy } from 'lucide-react';
import { useToast } from '../../../../../hooks/use-toast';
import { TooltipWrapper } from '../../../../../components/ui/tooltip-wrapper';

export default function SnapshotDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const snapshot = getSnapshot(params.id);

  if (!snapshot) {
    notFound();
  }

  const handleDelete = () => {
    // Check if this is a Primary snapshot and if it can be safely deleted
    if (snapshot.type === 'Primary' && !canDeletePrimarySnapshot(snapshot.id)) {
      toast({
        title: 'Cannot delete Primary snapshot',
        description: `You must create another Primary snapshot for "${snapshot.volumeVM}" before deleting this one. This is the only Primary snapshot for this resource.`,
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would delete the snapshot
    console.log('Deleting snapshot:', snapshot.name);
    toast({
      title: 'Snapshot deleted',
      description: `Snapshot "${snapshot.name}" has been deleted successfully.`,
    });
    router.push('/storage/block?tab=snapshots');
  };

  const handleDeleteButtonClick = () => {
    // Check if this is a Primary snapshot and if it can be safely deleted
    if (snapshot.type === 'Primary' && !canDeletePrimarySnapshot(snapshot.id)) {
      toast({
        title: 'Cannot delete Primary snapshot',
        description: `You must create another Primary snapshot for "${snapshot.volumeVM}" before deleting this one. This is the only Primary snapshot for this resource.`,
        variant: 'destructive',
      });
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const handleEdit = () => {
    // In a real app, this might allow editing snapshot metadata
    toast({
      title: 'Edit snapshot',
      description: 'Edit functionality would be implemented here.',
    });
  };

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Get resource type (Volume or VM) based on volumeVM name pattern
  const getResourceType = (resourceName: string) => {
    // If it has a VM naming pattern (like staging-server-01), it's a VM
    if (
      resourceName.includes('-server-') ||
      resourceName.includes('-vm-') ||
      resourceName.includes('server')
    ) {
      return 'Virtual Machine';
    }
    return 'Volume';
  };

  // Check if deletion is allowed for this snapshot
  const isDeletionAllowed = () => {
    if (snapshot.type !== 'Primary') {
      return true;
    }
    return canDeletePrimarySnapshot(snapshot.id);
  };

  // Get deletion constraint message
  const getDeletionConstraintMessage = () => {
    if (snapshot.type !== 'Primary') {
      return 'Delete this snapshot';
    }

    const primarySnapshots = getPrimarySnapshotsForResource(snapshot.volumeVM);
    const activePrimaryCount = primarySnapshots.length;

    if (activePrimaryCount <= 1) {
      return `Cannot delete: This is the only Primary snapshot for ${snapshot.volumeVM}. Create another Primary snapshot first.`;
    }

    return `Delete this Primary snapshot (${activePrimaryCount - 1} other Primary snapshots will remain)`;
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/storage', title: 'Storage' },
    { href: '/storage/block', title: 'Block Storage' },
    { href: '/storage/block?tab=snapshots', title: 'Snapshots' },
    { href: `/storage/block/snapshots/${snapshot.id}`, title: snapshot.name },
  ];

  return (
    <PageLayout
      title={snapshot.name}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      {/* Snapshot Basic Information */}
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
        {/* Overlay Action Buttons */}
        {snapshot.status !== 'deleting' && snapshot.status !== 'creating' && (
          <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                toast({
                  title: 'Download started',
                  description: `Downloading snapshot "${snapshot.name}" metadata.`,
                });
              }}
              className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
            >
              <Download className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleEdit}
              className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
            >
              <Edit className='h-4 w-4' />
            </Button>
            {snapshot.name !== 'web-server-backup-primary' && (
              <TooltipWrapper
                content={getDeletionConstraintMessage()}
                side='top'
              >
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleDeleteButtonClick}
                  disabled={!isDeletionAllowed()}
                  className={`h-8 w-8 p-0 bg-white/80 hover:bg-white border border-gray-200 shadow-sm ${
                    isDeletionAllowed()
                      ? 'text-muted-foreground hover:text-red-600'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TooltipWrapper>
            )}
          </div>
        )}

        <DetailGrid>
          {/* Snapshot ID, Type, Status, Created On in one row */}
          <div className='col-span-full grid grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Snapshot ID
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {snapshot.id}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Type
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    snapshot.type === 'Primary'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {snapshot.type}
                </span>
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Status
              </label>
              <div>
                <StatusBadge status={snapshot.status} />
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
                {formatDate(snapshot.createdOn)}
              </div>
            </div>
          </div>

          {/* Size and Source Resource in one row */}
          <div className='col-span-full grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Size
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {snapshot.size} GB
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Source Resource
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {snapshot.volumeVM} ({getResourceType(snapshot.volumeVM)})
              </div>
            </div>
          </div>

          {/* Policy field (conditional) */}
          {snapshot.policy && snapshot.policy.policyType !== 'manual' && (
            <div className='col-span-full'>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Policy
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {snapshot.name.split('-snapshot-')[0]}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className='col-span-full'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Description
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {snapshot.description}
              </div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Conditional Form Data Display */}
      {snapshot.policy && snapshot.policy.policyType !== 'manual' ? (
        // Snapshot created via Policy - show Policy form data
        <div className='bg-card text-card-foreground border-border border rounded-lg p-6'>
          <h3 className='text-lg font-medium mb-4'>Policy Information</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='border rounded-lg p-4'>
                <h4 className='font-medium mb-3'>Policy Details</h4>
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Policy Name:</span>
                    <span className='font-medium'>
                      {snapshot.name.split('-snapshot-')[0]}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Resource Type:
                    </span>
                    <span className='font-medium capitalize'>
                      {snapshot.policy.policyType}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Schedule:</span>
                    <span className='font-medium'>
                      {snapshot.policy.scheduleDescription}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Max Snapshots:
                    </span>
                    <span className='font-medium'>
                      {snapshot.policy.maxSnapshots}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='border rounded-lg p-4'>
                <h4 className='font-medium mb-3'>Naming Convention</h4>
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Pattern:</span>
                    <span className='font-medium'>
                      {snapshot.name.split('-snapshot-')[0]}-snapshot-
                      {'{{date}}'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Generated Name:
                    </span>
                    <span className='font-medium'>{snapshot.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Snapshot created via Instant Snapshot - show Instant form data
        <div className='bg-card text-card-foreground border-border border rounded-lg p-6'>
          <h3 className='text-lg font-medium mb-4'>
            Instant Snapshot Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='border rounded-lg p-4'>
                <h4 className='font-medium mb-3'>Snapshot Details</h4>
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Snapshot Type:
                    </span>
                    <span className='font-medium'>{snapshot.type}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Source Resource:
                    </span>
                    <span className='font-medium'>{snapshot.volumeVM}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Resource Type:
                    </span>
                    <span className='font-medium'>
                      {getResourceType(snapshot.volumeVM)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='border rounded-lg p-4'>
                <h4 className='font-medium mb-3'>Description</h4>
                <div className='space-y-3 text-sm'>
                  <div className='text-sm'>
                    {snapshot.description || 'No description provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={snapshot.name}
        resourceType='Snapshot'
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
