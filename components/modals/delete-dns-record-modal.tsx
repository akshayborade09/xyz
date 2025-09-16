'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/use-toast';

interface DeleteDnsRecordModalProps {
  open: boolean;
  onClose: () => void;
  dnsRecord: {
    id: string;
    recordName: string;
    type: string;
    value: string;
  };
  onConfirm: () => void;
}

export function DeleteDnsRecordModal({
  open,
  onClose,
  dnsRecord,
  onConfirm,
}: DeleteDnsRecordModalProps) {
  const [recordName, setRecordName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isConfirmationValid = recordName === dnsRecord.recordName;

  useEffect(() => {
    if (open) {
      setRecordName('');
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecordName(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: 'Pasting is not allowed',
      description:
        'For security reasons, you must type the record name manually.',
      variant: 'destructive',
    });
  };

  const handleConfirm = async () => {
    if (!isConfirmationValid) {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting DNS record:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isConfirmationValid && !isDeleting) {
      handleConfirm();
    }
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
            Please enter the record name to confirm deletion
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            Are you sure you want to delete this {dnsRecord.type} DNS record?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-2'>
          <div className='p-3 bg-muted rounded-md'>
            <Label className='text-xs text-muted-foreground'>
              Record Name to delete:
            </Label>
            <div className='font-mono font-medium text-sm mt-1'>
              {dnsRecord.recordName}
            </div>
            <Label className='text-xs text-muted-foreground mt-2 block'>
              Type:
            </Label>
            <div className='font-mono font-medium text-sm'>
              {dnsRecord.type}
            </div>
            <Label className='text-xs text-muted-foreground mt-2 block'>
              Value:
            </Label>
            <div
              className='font-mono font-medium text-sm truncate'
              title={dnsRecord.value}
            >
              {dnsRecord.value}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='record-name'>Type record name to confirm *</Label>
            <Input
              id='record-name'
              ref={inputRef}
              value={recordName}
              onChange={handleInputChange}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              placeholder={`Type "${dnsRecord.recordName}" to confirm`}
              className='font-mono'
              autoComplete='off'
            />
            <p className='text-xs text-muted-foreground'>
              Pasting is disabled. You must type the record name manually.
            </p>
          </div>

          <Alert variant='destructive'>
            <ExclamationTriangleIcon className='h-4 w-4' />
            <AlertDescription>
              <strong>Warning:</strong> This will permanently delete DNS record
              "{dnsRecord.recordName}". This action cannot be undone.
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
            className='min-w-20'
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirm}
            className='min-w-32'
            disabled={!isConfirmationValid || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm deletion'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
