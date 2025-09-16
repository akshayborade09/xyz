'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Trash2, HardDrive } from 'lucide-react';
import { type MKSCluster } from '@/lib/mks-data';

interface ClusterDeleteModalProps {
  cluster: MKSCluster | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (clusterId: string) => void;
  onEditCluster?: () => void;
}

export function ClusterDeleteModal({
  cluster,
  isOpen,
  onClose,
  onConfirm,
  onEditCluster,
}: ClusterDeleteModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!cluster) {
    return null;
  }

  const hasNodePools = cluster.nodePools.length > 0;
  const canDelete = !hasNodePools;
  const isConfirmationValid = confirmationText === cluster.name;

  const handleConfirm = async () => {
    if (!canDelete || !isConfirmationValid) {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm(cluster.id);
      onClose();
    } catch (error) {
      console.error('Error deleting cluster:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    setIsDeleting(false);
    onClose();
  };

  if (hasNodePools) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-red-600'>
              Cannot Delete Cluster
            </DialogTitle>
            <DialogDescription>
              This cluster cannot be deleted because it still has node pools.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                You must delete all node pools before deleting this cluster.
                Click 'Edit Cluster' to remove node pools first.
              </AlertDescription>
            </Alert>

            <div className='bg-muted/50 p-4 rounded-lg'>
              <h4 className='font-medium mb-2'>Current Node Pools:</h4>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                {cluster.nodePools.map(pool => (
                  <li key={pool.id} className='flex items-center gap-2'>
                    <span>•</span>
                    <span className='font-medium'>{pool.name}</span>
                    <span>({pool.desiredCount} nodes)</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={handleClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (onEditCluster) {
                  onEditCluster();
                }
                onClose();
              }}
              className='bg-black text-white hover:bg-black/90'
            >
              Edit Cluster
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-red-600'>
            <Trash2 className='h-5 w-5' />
            Delete Cluster
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            cluster and all associated resources.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <Alert>
            <HardDrive className='h-4 w-4' />
            <AlertDescription>
              <strong>Warning:</strong> Deleting this cluster will also delete
              all associated persistent volumes. Please ensure you have taken a
              backup of any important data.
            </AlertDescription>
          </Alert>

          <div className='bg-muted/50 p-4 rounded-lg'>
            <h4 className='font-medium mb-2'>Cluster Details:</h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Name:</span>
                <span className='font-medium'>{cluster.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Region:</span>
                <span className='font-medium'>{cluster.region}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Node Pools:</span>
                <span className='font-medium'>{cluster.nodePools.length}</span>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <label htmlFor='confirmation' className='text-sm font-medium'>
              Type the cluster name to confirm deletion:
            </label>
            <Input
              id='confirmation'
              value={confirmationText}
              onChange={e => setConfirmationText(e.target.value)}
              placeholder={cluster.name}
              className={
                confirmationText && !isConfirmationValid ? 'border-red-500' : ''
              }
            />
            {confirmationText && !isConfirmationValid && (
              <p className='text-sm text-red-600'>
                Please type the exact cluster name:{' '}
                <span className='font-mono'>{cluster.name}</span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Cluster'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
