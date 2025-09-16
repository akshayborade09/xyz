'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout } from '../../../../../components/page-layout';
import { DetailSection } from '../../../../../components/detail-section';
import { DetailGrid } from '../../../../../components/detail-grid';
import { DetailItem } from '../../../../../components/detail-item';
import { Button } from '../../../../../components/ui/button';
import { DeleteConfirmationModal } from '../../../../../components/delete-confirmation-modal';
import { ShadcnDataTable } from '../../../../../components/ui/shadcn-data-table';
import { StatusBadge } from '../../../../../components/status-badge';
import { VolumeDeletionStatus } from '../../../../../components/volume-deletion-status';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '../../../../../hooks/use-toast';
import { ExtendVolumeModal } from '../../../../../components/modals/extend-volume-modal';
import {
  AttachedVolumeAlert,
  DeleteVolumeConfirmation,
} from '../../../../../components/modals/delete-volume-modals';
import { snapshots } from '@/lib/data';
import { ActionMenu } from '../../../../../components/action-menu';
import { AddPolicyModal } from '../../../../../components/modals/add-policy-modal';
import { CreateBackupModal } from '../../../../../components/modals/create-backup-modal';
import { CreateSnapshotModal } from '../../../../../components/modals/create-snapshot-modal';
import { SnapshotPolicyModal } from '../../../../../components/modals/snapshot-policy-modal';

// Mock function to get volume by ID
const getVolume = (id: string) => {
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
    {
      id: 'vol-010',
      name: 'failed-volume',
      description: 'Volume that failed during creation process',
      type: 'High-speed NVME SSD Storage (HNSS)',
      role: 'Storage',
      size: '120',
      attachedInstances: [],
      vpc: 'vpc-main-prod',
      status: 'failed',
      createdOn: '2024-03-05T10:15:00Z',
      updatedOn: '2024-03-05T10:15:00Z',
    },
    {
      id: 'vol-011',
      name: 'deleting-volume',
      description: 'Volume currently being deleted',
      type: 'High-speed NVME SSD Storage (HNSS)',
      role: 'Storage',
      size: '60',
      attachedInstances: [],
      vpc: 'vpc-main-prod',
      status: 'deleting',
      deletionStartedOn: '2024-03-14T09:15:00Z',
      estimatedDeletionTime: 8,
      createdOn: '2024-03-08T14:20:00Z',
      updatedOn: '2024-03-08T14:20:00Z',
    },
    {
      id: 'vol-012',
      name: 'detached-volume',
      description: 'Volume that has been detached from instance',
      type: 'High-speed NVME SSD Storage (HNSS)',
      role: 'Storage',
      size: '90',
      attachedInstances: [],
      vpc: 'vpc-main-prod',
      status: 'detached',
      createdOn: '2024-03-10T09:30:00Z',
      updatedOn: '2024-03-10T09:30:00Z',
    },
    {
      id: 'vol-014',
      name: 'failed-volume-2',
      description: 'Volume that failed during creation process',
      type: 'High-speed NVME SSD Storage (HNSS)',
      role: 'Storage',
      size: '150',
      attachedInstances: [],
      vpc: 'vpc-main-prod',
      status: 'failed',
      createdOn: '2024-03-13T14:20:00Z',
      updatedOn: '2024-03-13T14:20:00Z',
    },
    {
      id: 'vol-015',
      name: 'deleting-volume-2',
      description: 'Volume currently being deleted',
      type: 'High-speed NVME SSD Storage (HNSS)',
      role: 'Storage',
      size: '100',
      attachedInstances: [],
      vpc: 'vpc-main-prod',
      status: 'deleting',
      deletionStartedOn: '2024-03-14T09:15:00Z',
      estimatedDeletionTime: 10,
      createdOn: '2024-03-14T09:15:00Z',
      updatedOn: '2024-03-14T09:15:00Z',
    },
    {
      id: 'vol-016',
      name: 'detached-volume-2',
      description: 'Volume that has been detached from instance',
      type: 'High-speed NVME SSD Storage (HNSS)',
      role: 'Storage',
      size: '200',
      attachedInstances: [],
      vpc: 'vpc-main-prod',
      status: 'detached',
      createdOn: '2024-03-15T11:45:00Z',
      updatedOn: '2024-03-15T11:45:00Z',
    },
  ];

  return mockVolumes.find(volume => volume.id === id);
};

export default function VolumeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAttachedAlertOpen, setIsAttachedAlertOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [snapshotPolicyDeleted, setSnapshotPolicyDeleted] = useState(false);
  const [backupPolicyDeleted, setBackupPolicyDeleted] = useState(false);
  const [showAddSnapshotPolicy, setShowAddSnapshotPolicy] = useState(false);
  const [showAddBackupPolicy, setShowAddBackupPolicy] = useState(false);
  const [snapshotPolicyState, setSnapshotPolicyState] = useState<any>(null);
  const [backupPolicyState, setBackupPolicyState] = useState<any>(null);
  const [editSnapshot, setEditSnapshot] = useState(false);
  const [editBackup, setEditBackup] = useState(false);
  const volume = getVolume(params.id);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);

  // Initialize policy data based on the image
  const [snapshotPolicyData, setSnapshotPolicyData] = useState<{
    name: string;
    description: string;
    maxSnapshots: number;
    cronExpression: string;
    cronExplanation: string;
    nextExecution: string;
  } | null>({
    name: 'Web Server Snapshot Policy',
    description: 'Automated daily backup for web server root volume',
    maxSnapshots: 7,
    cronExpression: '30 8 * * *',
    cronExplanation: 'This policy will run at every 30 minutes.',
    nextExecution: '20/12/2024, 14:00:00',
  });

  const [backupPolicyData, setBackupPolicyData] = useState<{
    name: string;
    description: string;
    maxBackups: number;
    cronExpression: string;
    cronExplanation: string;
    nextExecution: string;
  } | null>({
    name: 'Web Server Backup Policy',
    description: 'Automated daily backup for web server root volume',
    maxBackups: 7,
    cronExpression: '0 3 * * *',
    cronExplanation: 'This policy will run at hour 3.',
    nextExecution: '20/12/2024, 03:00:00',
  });

  if (!volume) {
    notFound();
  }

  const handleDeleteClick = () => {
    // Check if volume is attached to a VM
    if (volume.attachedInstances && volume.attachedInstances.length > 0) {
      // Volume is attached - show alert preventing deletion
      setIsAttachedAlertOpen(true);
    } else {
      // Volume is not attached - show deletion confirmation
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleActualDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would delete the volume
      console.log('Deleting volume:', volume.name);

      // Navigate back to volumes list
      router.push('/storage/block');
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const handleEdit = () => {
    router.push(`/storage/block/volumes/${volume.id}/edit`);
  };

  const handleExtend = () => {
    setIsExtendModalOpen(true);
  };

  const handleExtendConfirm = async (newSize: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would update the volume data here
      console.log(`Extending volume ${volume.name} to ${newSize} GB`);

      // Close modal
      setIsExtendModalOpen(false);

      // Refresh would happen in a real app
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const handleCreateSnapshot = () => {
    router.push(`/storage/block/snapshots/create?volumeId=${volume.id}`);
  };

  const handleCreateSnapshotPolicy = () => {
    router.push(
      `/storage/block/snapshots/policies/create?volumeId=${volume.id}`
    );
  };

  const handleCreateBackupPolicy = () => {
    router.push(`/storage/block/backup/policies/create?volumeId=${volume.id}`);
  };

  const handleRetryVolume = async (volume: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would call the retry API here
      console.log(`Retrying volume creation: ${volume.name}`);

      toast({
        title: 'Volume Retry Initiated',
        description: `Retry process started for volume '${volume.name}'. This may take a few minutes.`,
      });
    } catch (error) {
      toast({
        title: 'Retry Failed',
        description: 'Failed to initiate retry process. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Find snapshot policy for this volume (mock: match volume.name or id to snapshot.volumeVM)
  const snapshotPolicy =
    !snapshotPolicyDeleted &&
    (snapshotPolicyState ||
      snapshots.find(snap => snap.volumeVM === volume.name && snap.policy)
        ?.policy);

  // Dummy backup policy (for demo, you can expand this as needed)
  const backupPolicies = [
    {
      volumeId: 'vol-001',
      name: 'Web Server Backup Policy',
      description: 'Automated daily backup for web server root volume',
      enabled: true,
      schedule: 'Daily at 3:00 AM',
      retention: 7,
      cronExpression: '0 3 * * *',
      cronExplanation: 'This policy will run at hour 3.',
      nextExecution: '2024-12-20T03:00:00Z',
    },
    {
      volumeId: 'vol-002',
      name: 'Weekly Backup Policy',
      description: 'Weekly backup for secondary volumes',
      enabled: false,
      schedule: 'Weekly on Sunday at 2:00 AM',
      retention: 4,
      cronExpression: '0 2 * * 0',
      cronExplanation: 'This policy will run on Sunday at hour 2.',
      nextExecution: null,
    },
  ];
  const backupPolicy =
    !backupPolicyDeleted &&
    (backupPolicyState || backupPolicies.find(p => p.volumeId === volume.id));

  // Snapshot policies table columns
  const snapshotPolicyColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/storage/block/snapshots/policies/${row.id}`}
          className='text-primary font-medium hover:underline text-sm'
        >
          {value}
        </a>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      searchable: true,
      render: (value: string) => (
        <div className='max-w-xs text-sm' title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'scheduler',
      label: 'Scheduler',
      sortable: true,
      render: (value: string) => (
        <code className='text-sm bg-muted px-2 py-1 rounded font-mono'>
          {value}
        </code>
      ),
    },
  ];

  // Backup policies table columns
  const backupPolicyColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/storage/block/backup/policies/${row.id}`}
          className='text-primary font-medium hover:underline text-sm'
        >
          {value}
        </a>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      searchable: true,
      render: (value: string) => (
        <div className='max-w-xs text-sm' title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'scheduler',
      label: 'Scheduler',
      sortable: true,
      render: (value: string) => (
        <code className='text-sm bg-muted px-2 py-1 rounded font-mono'>
          {value}
        </code>
      ),
    },
  ];

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/storage', title: 'Storage' },
    { href: '/storage/block', title: 'Block Storage' },
    { href: `/storage/block/volumes/${volume.id}`, title: volume.name },
  ];

  return (
    <PageLayout
      title={volume.name}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={() => setShowSnapshotModal(true)}>
            Create Instant Snapshot
          </Button>
          <Button variant='outline' onClick={() => setShowBackupModal(true)}>
            Create Instant Backup
          </Button>
          <Button variant='outline' onClick={handleExtend}>
            Extend Volume
          </Button>
        </div>
      }
    >
      <CreateSnapshotModal
        open={showSnapshotModal}
        onClose={() => setShowSnapshotModal(false)}
        volume={volume}
        onCreate={async ({ volume: volumeName, name, description }) => {
          const price = `$${(Number(volume.size) * 0.05).toFixed(2)}`;
          toast({
            title: 'Snapshot Created',
            description: `Snapshot '${name}' for volume '${volumeName}' created. Price: ${price}`,
          });
          setShowSnapshotModal(false);
        }}
        price={`$${(Number(volume.size) * 0.05).toFixed(2)}`}
      />
      <CreateBackupModal
        open={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onCreate={async ({ name, description, tags }) => {
          const price = `₹${(Number(volume.size) * 1.8).toFixed(2)} per month`;
          toast({
            title: 'Backup Created',
            description: `Backup '${name}' for volume '${volume.name}' created. Price: ${price}`,
          });
          setShowBackupModal(false);
        }}
        price={`₹${(Number(volume.size) * 1.8).toFixed(2)} per month`}
        volume={volume}
      />
      {/* Volume Basic Information */}
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
            onClick={handleDeleteClick}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>

        <DetailGrid>
          {/* Volume ID, Status, Volume Type, Size in one row */}
          <div className='col-span-full grid grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Volume ID
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {volume.id}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Status
              </label>
              <div className='flex items-center gap-2'>
                {volume.status === 'deleting' ? (
                  <VolumeDeletionStatus volume={volume} compact={true} />
                ) : (
                  <>
                    <StatusBadge status={volume.status} />
                    {volume.status === 'failed' && (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleRetryVolume(volume)}
                        className='h-6 px-2 text-xs'
                      >
                        Retry
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Volume Type
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {volume.type}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Size
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {volume.size} GB
              </div>
            </div>
          </div>

          {/* Created At, Updated At, Volume Role, Attached VMs in second row */}
          <div className='col-span-full grid grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Created At
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {formatDate(volume.createdOn)}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Updated At
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {formatDate(volume.updatedOn)}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Volume Role
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {volume.role}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Attached VM
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {volume.attachedInstances.length > 0
                  ? volume.attachedInstances.join(', ')
                  : 'Not attached'}
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
                {volume.description}
              </div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Policy Sections - Side by Side */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        {/* Snapshot Policy Section */}
        <div className='bg-card text-card-foreground border-border border rounded-lg p-6 relative'>
          <h2 className='text-lg font-semibold mb-4'>Snapshot Policy</h2>
          {snapshotPolicyData ? (
            <div className='bg-gray-50 rounded p-4'>
              <div className='space-y-2'>
                <div className='text-sm text-gray-700 font-medium'>
                  {snapshotPolicyData.name}
                </div>
                <div className='text-xs text-gray-500'>
                  {snapshotPolicyData.description}
                </div>
                <div className='text-xs text-gray-500'>
                  Max Snapshots: {snapshotPolicyData.maxSnapshots}
                </div>
                <div className='text-xs text-gray-500'>
                  CRON Expression: {snapshotPolicyData.cronExpression}
                </div>
                <div className='text-xs text-gray-500'>
                  {snapshotPolicyData.cronExplanation}
                </div>
                <div className='text-xs text-gray-500'>
                  Next Execution: {snapshotPolicyData.nextExecution}
                </div>
              </div>
              {/* Action Icons */}
              <div className='absolute top-4 right-4 flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditSnapshot(true)}
                  className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setSnapshotPolicyDeleted(true);
                    setSnapshotPolicyData(null);
                  }}
                  className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant='default'
              onClick={() => setShowAddSnapshotPolicy(true)}
            >
              Add Policy
            </Button>
          )}
        </div>

        {/* Backup Policy Section */}
        <div className='bg-card text-card-foreground border-border border rounded-lg p-6 relative'>
          <h2 className='text-lg font-semibold mb-4'>Backup Policy</h2>
          {backupPolicyData ? (
            <div className='bg-gray-50 rounded p-4'>
              <div className='space-y-2'>
                <div className='text-sm text-gray-700 font-medium'>
                  {backupPolicyData.name}
                </div>
                <div className='text-xs text-gray-500'>
                  {backupPolicyData.description}
                </div>
                <div className='text-xs text-gray-500'>
                  Max Backups: {backupPolicyData.maxBackups}
                </div>
                <div className='text-xs text-gray-500'>
                  CRON Expression: {backupPolicyData.cronExpression}
                </div>
                <div className='text-xs text-gray-500'>
                  {backupPolicyData.cronExplanation}
                </div>
                <div className='text-xs text-gray-500'>
                  Next Execution: {backupPolicyData.nextExecution}
                </div>
              </div>
              {/* Action Icons */}
              <div className='absolute top-4 right-4 flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditBackup(true)}
                  className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setBackupPolicyDeleted(true);
                    setBackupPolicyData(null);
                  }}
                  className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant='default'
              onClick={() => setShowAddBackupPolicy(true)}
            >
              Add Policy
            </Button>
          )}
        </div>
      </div>

      {/* Snapshot Policy Modal */}
      <SnapshotPolicyModal
        open={showAddSnapshotPolicy || editSnapshot}
        onClose={() => {
          setShowAddSnapshotPolicy(false);
          setEditSnapshot(false);
        }}
        onSave={policy => {
          setSnapshotPolicyData(policy);
          setSnapshotPolicyDeleted(false);
        }}
        mode={editSnapshot ? 'edit' : 'add'}
        initialPolicy={editSnapshot ? snapshotPolicyData : undefined}
      />

      <AddPolicyModal
        open={showAddBackupPolicy || editBackup}
        onClose={() => {
          setShowAddBackupPolicy(false);
          setEditBackup(false);
        }}
        onSave={policy => {
          setBackupPolicyData(policy);
          setBackupPolicyDeleted(false);
        }}
        mode={editBackup ? 'edit' : 'add'}
        type='backup'
        initialPolicy={editBackup ? backupPolicyData : undefined}
      />

      {/* Alert for volumes attached to VMs */}
      <AttachedVolumeAlert
        isOpen={isAttachedAlertOpen}
        onClose={() => setIsAttachedAlertOpen(false)}
        volume={{
          name: volume.name,
          attachedInstance:
            volume.attachedInstances.length > 0
              ? volume.attachedInstances[0]
              : '',
        }}
      />

      {/* Confirmation for detached volumes */}
      <DeleteVolumeConfirmation
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        volume={{
          name: volume.name,
          id: volume.id,
        }}
        onConfirm={handleActualDelete}
      />

      {/* Extend Volume Modal */}
      <ExtendVolumeModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        volume={volume}
        onConfirm={handleExtendConfirm}
      />
    </PageLayout>
  );
}
