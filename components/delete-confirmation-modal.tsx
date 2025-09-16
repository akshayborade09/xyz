'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceName: string;
  resourceType: string;
  onConfirm: () => void;
}

/**
 * @component DeleteConfirmationModal
 * @description A modal dialog that asks for confirmation before deleting a resource
 * @status Active
 * @example
 * <DeleteConfirmationModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   resourceName="production-vpc"
 *   resourceType="VPC"
 *   onConfirm={handleDelete}
 * />
 */
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  resourceName,
  resourceType,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='sm:max-w-md'
        style={{
          boxShadow:
            'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px',
        }}
      >
        <DialogHeader className='space-y-3 pb-4'>
          <DialogTitle className='text-base font-semibold text-black pr-8'>
            Confirm Deletion
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            Are you sure you want to delete this {resourceType.toLowerCase()}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-2'>
          <p className='text-sm text-muted-foreground'>
            Please confirm that you want to delete the following{' '}
            {resourceType.toLowerCase()}:
          </p>
          <div className='rounded-md bg-muted p-3 font-medium'>
            {resourceName}
          </div>
        </div>
        <DialogFooter
          className='flex gap-3 sm:justify-end'
          style={{ paddingTop: '.5rem' }}
        >
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='min-w-20'
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirm}
            className='min-w-20'
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
