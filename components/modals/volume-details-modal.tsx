'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../status-badge';
import { DetailGrid } from '../detail-grid';
import { snapshots } from '@/lib/data';
import { ActionMenu } from '../action-menu';
import { useState } from 'react';
import { AddPolicyModal } from './add-policy-modal';

interface VolumeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  volume:
    | {
        id: string;
        name: string;
        description: string;
        type: string;
        role: string;
        size: string;
        attachedInstances: string[];
        vpc: string;
        status: string;
        createdOn: string;
        updatedOn: string;
      }
    | null
    | undefined;
}

export function VolumeDetailsModal({
  isOpen,
  onClose,
  volume,
}: VolumeDetailsModalProps) {
  if (!volume) {
    return null;
  }

  const [snapshotPolicyDeleted, setSnapshotPolicyDeleted] = useState(false);
  const [backupPolicyDeleted, setBackupPolicyDeleted] = useState(false);
  const [showAddSnapshotPolicy, setShowAddSnapshotPolicy] = useState(false);
  const [showAddBackupPolicy, setShowAddBackupPolicy] = useState(false);
  const [snapshotPolicyState, setSnapshotPolicyState] = useState<any>(null);
  const [backupPolicyState, setBackupPolicyState] = useState<any>(null);
  const [editSnapshot, setEditSnapshot] = useState(false);
  const [editBackup, setEditBackup] = useState(false);

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
      enabled: true,
      schedule: 'Daily at 3:00 AM',
      retention: 7,
      nextExecution: '2024-12-20T03:00:00Z',
    },
    {
      volumeId: 'vol-002',
      enabled: false,
      schedule: 'Weekly on Sunday at 2:00 AM',
      retention: 4,
      nextExecution: null,
    },
  ];
  const backupPolicy =
    !backupPolicyDeleted &&
    (backupPolicyState || backupPolicies.find(p => p.volumeId === volume.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {volume.name}
          </DialogTitle>
          <DialogDescription>Block Storage Volume Details</DialogDescription>
        </DialogHeader>

        {/* Volume Information */}
        <div className='py-4'>
          <div
            className='mb-4 p-4 rounded-lg'
            style={{
              borderRadius: '12px',
              border: '3px solid #FFF',
              background:
                'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
              boxShadow: '0px 6px 25px -6px rgba(0, 27, 135, 0.06)',
            }}
          >
            <DetailGrid>
              {/* Volume ID, Status, Type, Size in first row */}
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
                  <div>
                    <StatusBadge status={volume.status} />
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

              {/* Created At, Updated At, Role, Attached VMs in second row */}
              <div className='col-span-full grid grid-cols-4 gap-4 mt-4'>
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
                    Role
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
                    Attached VMs
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {volume.attachedInstances.length > 0
                      ? volume.attachedInstances.join(', ')
                      : 'Not attached'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className='col-span-full mt-4'>
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
        </div>

        {/* Snapshot Policy Section */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Snapshot Policy</h3>
          {snapshotPolicy ? (
            <div className='bg-gray-50 rounded p-4 flex items-center justify-between'>
              <div>
                <div className='text-sm text-gray-700 font-medium'>
                  {snapshotPolicy.scheduleDescription}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Max Snapshots: {snapshotPolicy.maxSnapshots}
                </div>
                <div className='text-xs text-gray-500'>
                  Next Execution:{' '}
                  {snapshotPolicy.nextExecution
                    ? new Date(snapshotPolicy.nextExecution).toLocaleString()
                    : '-'}
                </div>
                <div className='text-xs text-gray-500'>
                  Status: {snapshotPolicy.enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <ActionMenu
                resourceName='Snapshot Policy'
                resourceType='Policy'
                onEdit={() => {
                  setEditSnapshot(true);
                }}
                onCustomDelete={() => {
                  setSnapshotPolicyDeleted(true);
                  setSnapshotPolicyState(null);
                }}
                deleteLabel='Delete'
              />
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
        <AddPolicyModal
          open={showAddSnapshotPolicy || editSnapshot}
          onClose={() => {
            setShowAddSnapshotPolicy(false);
            setEditSnapshot(false);
          }}
          onSave={policy => {
            setSnapshotPolicyState(policy);
            setSnapshotPolicyDeleted(false);
          }}
          mode={editSnapshot ? 'edit' : 'add'}
          type='snapshot'
          initialPolicy={editSnapshot ? snapshotPolicy : undefined}
        />

        {/* Backup Policy Section */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Backup Policy</h3>
          {backupPolicy ? (
            <div className='bg-gray-50 rounded p-4 flex items-center justify-between'>
              <div>
                <div className='text-sm text-gray-700 font-medium'>
                  {backupPolicy.schedule}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Retention: {backupPolicy.retention} backups
                </div>
                <div className='text-xs text-gray-500'>
                  Next Execution:{' '}
                  {backupPolicy.nextExecution
                    ? new Date(backupPolicy.nextExecution).toLocaleString()
                    : '-'}
                </div>
                <div className='text-xs text-gray-500'>
                  Status: {backupPolicy.enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <ActionMenu
                resourceName='Backup Policy'
                resourceType='Policy'
                onEdit={() => {
                  setEditBackup(true);
                }}
                onCustomDelete={() => {
                  setBackupPolicyDeleted(true);
                  setBackupPolicyState(null);
                }}
                deleteLabel='Delete'
              />
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
        <AddPolicyModal
          open={showAddBackupPolicy || editBackup}
          onClose={() => {
            setShowAddBackupPolicy(false);
            setEditBackup(false);
          }}
          onSave={policy => {
            setBackupPolicyState(policy);
            setBackupPolicyDeleted(false);
          }}
          mode={editBackup ? 'edit' : 'add'}
          type='backup'
          initialPolicy={editBackup ? backupPolicy : undefined}
        />

        <div className='flex justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='border-input hover:bg-secondary transition-colors'
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
