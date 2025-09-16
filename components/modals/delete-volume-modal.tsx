import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteVolumeModalProps {
  open: boolean;
  onClose: () => void;
  volumeName: string;
  onConfirm: () => Promise<void>;
}

export function DeleteVolumeModal({
  open,
  onClose,
  volumeName,
  onConfirm,
}: DeleteVolumeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting volume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <ExclamationTriangleIcon className='h-5 w-5' />
            Delete Volume
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            volume and all its data.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Alert variant='destructive'>
            <ExclamationTriangleIcon className='h-4 w-4' />
            <AlertDescription>
              Are you sure you want to delete <strong>{volumeName}</strong>? All
              data on this volume will be permanently lost.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className='flex gap-2 sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Volume'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
