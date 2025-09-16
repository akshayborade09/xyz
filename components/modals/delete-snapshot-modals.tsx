'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/use-toast';

interface Snapshot {
  id: string;
  name: string;
  type: string;
  volumeVM: string;
  status: string;
  size: string;
  createdOn: string;
}

interface DeleteSnapshotConstraintModalProps {
  open: boolean;
  onClose: () => void;
  snapshot: Snapshot;
  constraintReason: string;
  onConfirm?: () => void;
}

interface DeleteSnapshotConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  snapshot: Snapshot;
  onConfirm: () => Promise<void>;
}

// Step 1: Constraint Warning Modal
export function DeleteSnapshotConstraintModal({
  open,
  onClose,
  snapshot,
  constraintReason,
  onConfirm,
}: DeleteSnapshotConstraintModalProps) {
  const canProceed = onConfirm !== undefined;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='sm:max-w-lg'
        style={{
          boxShadow:
            'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px',
        }}
      >
        <DialogHeader className='space-y-3 pb-4'>
          <DialogTitle className='text-base font-semibold text-black pr-8'>
            Are you sure that you want to delete the snapshot?
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            Please review the constraints below before proceeding with deletion.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-2'>
          {!canProceed ? (
            <div>
              <Alert variant='destructive' className='mb-4'>
                <ExclamationTriangleIcon className='h-4 w-4' />
                <AlertDescription>
                  <strong>Cannot delete snapshot "{snapshot.name}"</strong>
                  <br />
                  {constraintReason}
                </AlertDescription>
              </Alert>

              <div className='border rounded-md p-4 bg-red-50 border-red-200'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-red-800'>
                      Snapshot Type
                    </span>
                    <span className='text-sm font-bold text-red-600'>
                      {snapshot.type}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-red-800'>
                      Associated Resource
                    </span>
                    <span className='text-sm font-bold text-red-600'>
                      {snapshot.volumeVM}
                    </span>
                  </div>
                </div>
              </div>

              <p className='text-xs text-muted-foreground mt-3'>
                Please create another Primary snapshot for this resource before
                deleting this one, or delete Delta snapshots first if available.
              </p>
            </div>
          ) : (
            <Alert>
              <ExclamationTriangleIcon className='h-4 w-4' />
              <AlertDescription>
                <strong>
                  Snapshot "{snapshot.name}" is ready for deletion.
                </strong>
                <br />
                This snapshot can be safely deleted without affecting other
                resources.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter
          className='flex gap-3 sm:justify-end'
          style={{ paddingTop: '.5rem' }}
        >
          {!canProceed ? (
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='min-w-20'
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='min-w-20'
              >
                Cancel
              </Button>
              <Button
                type='button'
                variant='destructive'
                onClick={onConfirm}
                className='min-w-20'
              >
                Confirm
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Step 2: Name Confirmation Modal
export function DeleteSnapshotConfirmationModal({
  open,
  onClose,
  snapshot,
  onConfirm,
}: DeleteSnapshotConfirmationModalProps) {
  const [snapshotName, setSnapshotName] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (snapshotName !== snapshot.name) {
      toast({
        title: 'Snapshot deletion canceled',
        description:
          'Snapshot deletion canceled due to mismatch in snapshot name',
        variant: 'destructive',
      });
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
      toast({
        title: 'Snapshot deleted successfully',
        description: `Snapshot "${snapshot.name}" has been deleted.`,
      });
      onClose();
    } catch (error) {
      console.error('Error deleting snapshot:', error);
      toast({
        title: 'Error deleting snapshot',
        description:
          'An error occurred while deleting the snapshot. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSnapshotName(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: 'Paste not allowed',
      description:
        'You must type the snapshot name manually to confirm deletion.',
      variant: 'destructive',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='sm:max-w-md'
        style={{
          boxShadow:
            'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px',
        }}
      >
        <DialogHeader className='space-y-3 pb-4'>
          <DialogTitle className='text-base font-semibold text-black pr-8'>
            Please enter the name of the snapshot to confirm deletion
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            Type the snapshot name exactly as shown below to confirm deletion.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-2'>
          <div className='p-3 bg-muted rounded-md'>
            <Label className='text-xs text-muted-foreground'>
              Snapshot Name to delete:
            </Label>
            <div className='font-mono font-medium text-sm mt-1'>
              {snapshot.name}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='snapshot-name'>
              Type snapshot name to confirm *
            </Label>
            <Input
              id='snapshot-name'
              ref={inputRef}
              value={snapshotName}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder={`Type "${snapshot.name}" to confirm`}
              className='font-mono'
              autoComplete='off'
            />
            <p className='text-xs text-muted-foreground'>
              Pasting is disabled. You must type the name manually.
            </p>
          </div>

          <Alert variant='destructive'>
            <ExclamationTriangleIcon className='h-4 w-4' />
            <AlertDescription>
              <strong>Warning:</strong> This will permanently delete snapshot "
              {snapshot.name}". This action cannot be undone.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter
          className='flex gap-3 sm:justify-end'
          style={{ paddingTop: '.5rem' }}
        >
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={loading}
            className='min-w-20'
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirm}
            disabled={loading || snapshotName !== snapshot.name}
            className='min-w-24'
          >
            {loading ? 'Deleting...' : 'Delete Snapshot'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
