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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttachedVolumeAlertProps {
  isOpen: boolean;
  onClose: () => void;
  volume: {
    name: string;
    attachedInstance: string;
  };
}

interface DeleteVolumeConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  volume: {
    name: string;
    id: string;
  };
  onConfirm: () => Promise<void>;
}

// Alert modal for volumes attached to VMs (prevents deletion)
export function AttachedVolumeAlert({
  isOpen,
  onClose,
  volume,
}: AttachedVolumeAlertProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold text-black'>
            Volume is associated with a VM
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
              <div>
                <p className='text-red-800 text-sm'>
                  The volume <strong>{volume.name}</strong> is attached with a
                  VM <strong>{volume.attachedInstance}</strong>. Please detach
                  the volume from the VM before deleting.
                </p>
              </div>
            </div>
          </div>

          <div className='text-sm text-muted-foreground'>
            To delete this volume:
            <ol className='list-decimal list-inside mt-2 space-y-1'>
              <li>Go to the VM details page</li>
              <li>Detach the volume from the VM</li>
              <li>Return here to delete the volume</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className='text-sm'>
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Confirmation modal for detached volumes (allows deletion)
export function DeleteVolumeConfirmation({
  isOpen,
  onClose,
  volume,
  onConfirm,
}: DeleteVolumeConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toast({
        title: 'Volume deleted successfully',
        description: `${volume.name} has been deleted.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to delete volume',
        description: 'An error occurred while deleting the volume.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Are you sure you want to delete the volume?
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            This action cannot be undone. The volume and all its data will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Volume Name:
                </span>
                <span className='text-sm font-medium'>{volume.name}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Volume ID:
                </span>
                <span className='text-sm font-medium font-mono'>
                  {volume.id}
                </span>
              </div>
            </div>
          </div>

          <Alert className='border-amber-200 bg-amber-50'>
            <AlertTriangle className='h-4 w-4 text-amber-600' />
            <AlertDescription className='text-amber-800 text-sm'>
              <strong>Warning:</strong> This action is irreversible. All data
              stored on this volume will be lost forever.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className='gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='text-sm'
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className='bg-red-600 hover:bg-red-700 text-white text-sm'
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2' />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className='h-3 w-3 mr-2' />
                Confirm Deletion
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
