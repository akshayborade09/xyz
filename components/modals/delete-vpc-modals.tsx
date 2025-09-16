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
import {
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/use-toast';

interface VPCResource {
  type: string;
  name: string;
  count: number;
}

interface VPC {
  id: string;
  name: string;
  type: string;
  resources: VPCResource[];
}

interface DeleteVPCResourceWarningModalProps {
  open: boolean;
  onClose: () => void;
  vpc: VPC;
  onConfirm: () => void;
}

interface DeleteVPCConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  vpc: VPC;
  onConfirm: () => Promise<void>;
}

// Step 1: Resource Warning Modal
export function DeleteVPCResourceWarningModal({
  open,
  onClose,
  vpc,
  onConfirm,
}: DeleteVPCResourceWarningModalProps) {
  const hasResources = vpc.resources && vpc.resources.length > 0;
  const isFirstVPC = vpc.type === 'Free VPC';

  // Check for VMs and Volumes specifically for gaming-vpc
  const isGamingVPC = vpc.name === 'gaming-vpc';
  const vmCount =
    vpc.resources
      ?.filter(r => r.type === 'VM')
      .reduce((sum, r) => sum + r.count, 0) || 0;
  const volumeCount =
    vpc.resources
      ?.filter(r => r.type === 'Storage')
      .reduce((sum, r) => sum + r.count, 0) || 0;
  const hasCriticalResources = isGamingVPC && (vmCount > 0 || volumeCount > 0);

  // Determine if deletion should be blocked
  const shouldBlockDeletion = isGamingVPC ? hasCriticalResources : hasResources;

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
            Are you sure that you want to delete the VPC?
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            Please note that deleting a VPC will also delete all the resources
            present in the VPC.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-2'>
          {isFirstVPC && (
            <Alert>
              <ExclamationTriangleIcon className='h-4 w-4' />
              <AlertDescription>
                <strong>Notice:</strong> You are about to delete your first VPC
                which is the free one. This VPC provides free tier benefits.
              </AlertDescription>
            </Alert>
          )}

          {/* Special logic for gaming-vpc */}
          {isGamingVPC && hasCriticalResources ? (
            <div>
              <Alert variant='destructive' className='mb-4'>
                <ExclamationTriangleIcon className='h-4 w-4' />
                <AlertDescription>
                  <strong>Cannot delete VPC "{vpc.name}"</strong>
                  <br />
                  This VPC has associated resources that must be deleted first.
                </AlertDescription>
              </Alert>

              <p className='text-sm font-medium mb-3'>
                You must delete the following associated resources before
                deleting this VPC:
              </p>

              <div className='border rounded-md p-4 bg-red-50 border-red-200'>
                <div className='space-y-2'>
                  {vmCount > 0 && (
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-red-800'>
                        Virtual Machines (VMs)
                      </span>
                      <span className='text-sm font-bold text-red-600'>
                        {vmCount} VM{vmCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  {volumeCount > 0 && (
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-red-800'>
                        Storage Volumes
                      </span>
                      <span className='text-sm font-bold text-red-600'>
                        {volumeCount} Volume{volumeCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className='text-xs text-muted-foreground mt-3'>
                Please navigate to the Compute section to delete VMs and Storage
                section to delete volumes before attempting to delete this VPC.
              </p>
            </div>
          ) : hasResources ? (
            <div>
              <p className='text-sm font-medium mb-3'>
                The following resources are present in the VPC which will also
                get deleted. Please delete the resources before deleting the
                VPC:
              </p>
              <div className='border rounded-md p-3 bg-muted/50 max-h-48 overflow-y-auto'>
                {vpc.resources.map((resource, index) => (
                  <div
                    key={index}
                    className='flex justify-between items-center py-1'
                  >
                    <span className='text-sm'>
                      {resource.count} × {resource.type}: {resource.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Alert>
              <ExclamationTriangleIcon className='h-4 w-4' />
              <AlertDescription>
                <strong>VPC "{vpc.name}" is ready for deletion.</strong>
                <br />
                No resources are present in this VPC.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter
          className='flex gap-3 sm:justify-end'
          style={{ paddingTop: '.5rem' }}
        >
          {/* Gaming VPC with critical resources - show only Close button */}
          {isGamingVPC && hasCriticalResources ? (
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='min-w-20'
            >
              Close
            </Button>
          ) : (
            /* All other cases - show Cancel and Confirm buttons */
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
                disabled={shouldBlockDeletion}
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
export function DeleteVPCConfirmationModal({
  open,
  onClose,
  vpc,
  onConfirm,
}: DeleteVPCConfirmationModalProps) {
  const [vpcName, setVpcName] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (vpcName !== vpc.name) {
      toast({
        title: 'VPC deletion canceled',
        description: 'VPC deletion canceled due to mismatch in VPC name',
        variant: 'destructive',
      });
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
      toast({
        title: 'VPC deleted successfully',
        description: `VPC "${vpc.name}" has been deleted along with all its resources.`,
      });
      onClose();
    } catch (error) {
      console.error('Error deleting VPC:', error);
      toast({
        title: 'Error deleting VPC',
        description:
          'An error occurred while deleting the VPC. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVpcName(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: 'Paste not allowed',
      description: 'You must type the VPC name manually to confirm deletion.',
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
            Please enter the name of the VPC to confirm deletion
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            Type the VPC name exactly as shown below to confirm deletion.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-2'>
          <div className='p-3 bg-muted rounded-md'>
            <Label className='text-xs text-muted-foreground'>
              VPC Name to delete:
            </Label>
            <div className='font-mono font-medium text-sm mt-1'>{vpc.name}</div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='vpc-name'>Type VPC name to confirm *</Label>
            <Input
              id='vpc-name'
              ref={inputRef}
              value={vpcName}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder={`Type "${vpc.name}" to confirm`}
              className='font-mono'
              autoComplete='off'
            />
            <p className='text-xs text-muted-foreground'>
              Pasting is disabled. You must type the name manually.
            </p>
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
            disabled={loading}
            className='min-w-20'
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirm}
            disabled={loading || vpcName !== vpc.name}
            className='min-w-24'
          >
            {loading ? 'Deleting...' : 'Delete VPC'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
