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
import { canDeleteSubnet } from '@/lib/data';

interface Subnet {
  id: string;
  name: string;
  vpcName: string;
  type: string;
  status: string;
  cidr: string;
  gatewayIp: string;
  createdOn: string;
}

interface DeleteSubnetVMWarningModalProps {
  open: boolean;
  onClose: () => void;
  subnet: Subnet;
  vmName: string;
}

interface DeleteSubnetConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  subnet: Subnet;
  onConfirm: () => void;
}

interface DeleteSubnetNameConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  subnet: Subnet;
  onConfirm: () => Promise<void>;
}

interface DeleteSubnetDependencyCheckModalProps {
  open: boolean;
  onClose: () => void;
  subnet: Subnet;
  onProceed: () => void;
}

// Step 1: VM Attachment Warning Modal
export function DeleteSubnetVMWarningModal({
  open,
  onClose,
  subnet,
  vmName,
}: DeleteSubnetVMWarningModalProps) {
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
            Subnet is associated with a VM
          </DialogTitle>
          <hr className='border-border' />
        </DialogHeader>

        <div className='space-y-6 py-2'>
          <Alert variant='destructive'>
            <ExclamationTriangleIcon className='h-4 w-4' />
            <AlertDescription>
              The subnet <strong>{subnet.name}</strong> is attached with a VM{' '}
              <strong>{vmName}</strong>. Please detach the subnet from the VM
              before deletion.
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
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Step 2: Initial Confirmation Modal
export function DeleteSubnetConfirmationModal({
  open,
  onClose,
  subnet,
  onConfirm,
}: DeleteSubnetConfirmationModalProps) {
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
            Are you sure you want to delete the subnet?
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            Please note that deleting the subnet will also delete the IP
            addresses associated with the subnet.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-2'>
          <Alert>
            <ExclamationTriangleIcon className='h-4 w-4' />
            <AlertDescription>
              <strong>
                Subnet "{subnet.name}" will be permanently deleted.
              </strong>
              <br />
              This action will also remove all IP addresses associated with this
              subnet.
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
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={onConfirm}
            className='min-w-32'
          >
            Confirm deletion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Step 3: Name Confirmation Modal
export function DeleteSubnetNameConfirmationModal({
  open,
  onClose,
  subnet,
  onConfirm,
}: DeleteSubnetNameConfirmationModalProps) {
  const [subnetName, setSubnetName] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (subnetName !== subnet.name) {
      toast({
        title: 'Subnet deletion canceled',
        description: 'Subnet deletion canceled due to mismatch in subnet name',
        variant: 'destructive',
      });
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
      toast({
        title: 'Subnet deleted successfully',
        description: `Subnet "${subnet.name}" has been deleted along with all its IP addresses.`,
      });
      onClose();
    } catch (error) {
      console.error('Error deleting subnet:', error);
      toast({
        title: 'Error deleting subnet',
        description:
          'An error occurred while deleting the subnet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubnetName(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: 'Paste not allowed',
      description:
        'You must type the subnet name manually to confirm deletion.',
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
            Please enter the name of the subnet to confirm deletion
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
            Type the subnet name exactly as shown below to confirm deletion.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-2'>
          <div className='p-3 bg-muted rounded-md'>
            <Label className='text-xs text-muted-foreground'>
              Subnet Name to delete:
            </Label>
            <div className='font-mono font-medium text-sm mt-1'>
              {subnet.name}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='subnet-name'>Type subnet name to confirm *</Label>
            <Input
              id='subnet-name'
              ref={inputRef}
              value={subnetName}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder={`Type "${subnet.name}" to confirm`}
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
              <strong>Warning:</strong> This will permanently delete subnet "
              {subnet.name}" and all its IP addresses. This action cannot be
              undone.
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
            disabled={loading || subnetName !== subnet.name}
            className='min-w-24'
          >
            {loading ? 'Deleting...' : 'Delete Subnet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Step 0: Dependency Check Modal (NEW)
export function DeleteSubnetDependencyCheckModal({
  open,
  onClose,
  subnet,
  onProceed,
}: DeleteSubnetDependencyCheckModalProps) {
  const { toast } = useToast();

  // Check for dependencies
  const dependencyCheck = canDeleteSubnet(subnet.name);

  const handleProceed = () => {
    if (dependencyCheck.canDelete) {
      onProceed();
    } else {
      toast({
        title: 'Cannot delete subnet',
        description:
          'This subnet has dependencies that prevent deletion. Please remove all VMs and IP addresses first.',
        variant: 'destructive',
      });
    }
  };

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
            {dependencyCheck.canDelete
              ? 'Ready to delete subnet'
              : 'Cannot delete subnet'}
          </DialogTitle>
          <hr className='border-border' />
        </DialogHeader>

        <div className='space-y-6 py-2'>
          {dependencyCheck.canDelete ? (
            <Alert>
              <AlertDescription>
                The subnet <strong>{subnet.name}</strong> has no dependencies
                and can be safely deleted.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant='destructive'>
              <ExclamationTriangleIcon className='h-4 w-4' />
              <AlertDescription>
                The subnet <strong>{subnet.name}</strong> cannot be deleted
                because it has the following dependencies:
              </AlertDescription>
            </Alert>
          )}

          {dependencyCheck.dependencies.vmCount > 0 && (
            <div className='space-y-3'>
              <h4 className='font-medium text-sm'>
                Virtual Machines ({dependencyCheck.dependencies.vmCount})
              </h4>
              <div className='space-y-2'>
                {dependencyCheck.vms.map(vm => (
                  <div
                    key={vm.id}
                    className='p-3 border rounded-lg bg-muted/50'
                  >
                    <div className='font-medium text-sm'>{vm.name}</div>
                    <div className='text-xs text-muted-foreground'>
                      ID: {vm.id} • Status: {vm.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dependencyCheck.dependencies.ipCount > 0 && (
            <div className='space-y-3'>
              <h4 className='font-medium text-sm'>
                IP Addresses ({dependencyCheck.dependencies.ipCount})
              </h4>
              <div className='space-y-2'>
                {dependencyCheck.ips.map(ip => (
                  <div
                    key={ip.id}
                    className='p-3 border rounded-lg bg-muted/50'
                  >
                    <div className='font-medium text-sm'>{ip.name}</div>
                    <div className='text-xs text-muted-foreground'>
                      {ip.ipAddress} • Type: {ip.type} • Status: {ip.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dependencyCheck.canDelete && (
            <Alert>
              <AlertDescription>
                <strong>Next steps:</strong> You will be asked to type the
                subnet name to confirm deletion.
              </AlertDescription>
            </Alert>
          )}
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
          >
            Cancel
          </Button>
          {dependencyCheck.canDelete && (
            <Button type='button' onClick={handleProceed} className='min-w-20'>
              Continue
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
