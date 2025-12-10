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
  title?: string;
  description?: string;
  confirmText?: string;
  variant?: 'destructive' | 'default';
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
  title,
  description,
  confirmText,
  variant = 'destructive',
}: DeleteConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error processing action:', error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  const displayTitle = title || 'Confirm Deletion';
  const displayDescription = description || `Are you sure you want to delete this ${resourceType.toLowerCase()}? This action cannot be undone.`;
  const displayConfirmText = confirmText || 'Delete';
  const processingText = confirmText ? `${confirmText}ing...` : 'Deleting...';

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
            {displayTitle}
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            {displayDescription}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-2'>
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
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant={variant}
            onClick={handleConfirm}
            className='min-w-20'
            disabled={isProcessing}
          >
            {isProcessing ? processingText : displayConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
