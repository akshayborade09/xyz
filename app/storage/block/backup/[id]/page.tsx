'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageLayout } from '../../../../../components/page-layout';
import { DetailGrid } from '../../../../../components/detail-grid';
import { StatusBadge } from '../../../../../components/status-badge';
import { Button } from '../../../../../components/ui/button';
import { DeleteConfirmationModal } from '../../../../../components/delete-confirmation-modal';
import { notFound } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { VolumeDetailsModal } from '../../../../../components/modals/volume-details-modal';

// Dummy backup data (should match mockBackups in app/storage/block/page.tsx)
const mockBackups = [
  {
    id: 'backup-001',
    name: 'web-server-backup-primary',
    status: 'completed',
    volumeName: 'web-server-root',
    vpc: 'vpc-main-prod',
    createdOn: '2024-02-01T09:15:00Z',
    description: 'Primary backup of web server root volume',
  },
  {
    id: 'backup-002',
    name: 'db-storage-backup-delta',
    status: 'completed',
    volumeName: 'database-storage',
    vpc: 'vpc-main-prod',
    createdOn: '2024-02-02T10:00:00Z',
    description: 'Daily delta backup of database storage',
  },
  {
    id: 'backup-003',
    name: 'app-server-backup-primary',
    status: 'in-progress',
    volumeName: 'app-server-data',
    vpc: 'vpc-main-prod',
    createdOn: '2024-02-03T11:30:00Z',
    description: 'Primary backup of application server data volume',
  },
  // ... more backups ...
];

// Dummy volumes data (should match mockVolumes in app/storage/block/page.tsx)
const mockVolumes = [
  {
    id: 'vol-001',
    name: 'web-server-root',
    description:
      'Root volume for production web server hosting main application',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Bootable',
    size: '50',
    attachedInstances: ['web-server-01'],
    vpc: 'vpc-main-prod',
    status: 'attached',
    createdOn: '2024-01-15T10:30:00Z',
    updatedOn: '2024-01-15T10:30:00Z',
  },
  {
    id: 'vol-002',
    name: 'database-storage',
    description:
      'High-performance storage for PostgreSQL database with automated backups',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '200',
    attachedInstances: ['db-server-01'],
    vpc: 'vpc-main-prod',
    status: 'attached',
    createdOn: '2024-01-20T14:22:00Z',
    updatedOn: '2024-02-05T09:15:00Z',
  },
  {
    id: 'vol-003',
    name: 'backup-volume',
    description:
      'Secondary backup storage for critical data archival and disaster recovery',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '500',
    attachedInstances: [],
    vpc: 'vpc-backup',
    status: 'available',
    createdOn: '2024-02-01T09:15:00Z',
    updatedOn: '2024-02-01T09:15:00Z',
  },
  // ... add more as needed ...
];

export default function BackupDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const backup = mockBackups.find(b => b.id === params.id);

  if (!backup) {
    notFound();
  }

  // Find the related volume object for modal
  const relatedVolume = mockVolumes.find(v => v.name === backup.volumeName);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/storage', title: 'Storage' },
    { href: '/storage/block', title: 'Block Storage' },
    { href: '/storage/block/backup', title: 'Backup' },
    { href: `/storage/block/backup/${backup.id}`, title: backup.name },
  ];

  const handleDelete = () => {
    // Simulate delete
    router.push('/storage/block/backup');
  };

  return (
    <PageLayout
      title={backup.name}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      {/* Backup Basic Information */}
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
        {/* Overlay Delete Icon Button */}
        <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsDeleteModalOpen(true)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
            aria-label='Delete Backup'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
        <DetailGrid>
          {/* Backup ID, Status, Volume, VPC, Created On */}
          <div className='col-span-full grid grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Backup ID
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {backup.id}
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
                <StatusBadge status={backup.status} />
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Volume
              </label>
              <div className='font-medium text-base'>
                {relatedVolume ? (
                  <button
                    type='button'
                    className='text-primary hover:underline focus:outline-none bg-transparent p-0 m-0 border-0'
                    onClick={() => setIsVolumeModalOpen(true)}
                    style={{ background: 'none' }}
                  >
                    {backup.volumeName}
                  </button>
                ) : (
                  backup.volumeName
                )}
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
                {formatDate(backup.createdOn)}
              </div>
            </div>
          </div>
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
                {backup.description}
              </div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Related Volume Section */}
      <div className='bg-card text-card-foreground border-border border rounded-lg p-6'>
        <h2 className='text-lg font-semibold mb-4'>Related Volume</h2>
        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <div className='text-sm text-muted-foreground'>Volume Name</div>
            <div className='font-medium text-base'>
              {relatedVolume ? (
                <button
                  type='button'
                  className='text-primary hover:underline focus:outline-none bg-transparent p-0 m-0 border-0'
                  onClick={() => setIsVolumeModalOpen(true)}
                  style={{ background: 'none' }}
                >
                  {backup.volumeName}
                </button>
              ) : (
                backup.volumeName
              )}
            </div>
          </div>
        </div>
        {/* Volume Details Modal */}
        <VolumeDetailsModal
          isOpen={isVolumeModalOpen}
          onClose={() => setIsVolumeModalOpen(false)}
          volume={relatedVolume}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={backup.name}
        resourceType='Backup'
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
