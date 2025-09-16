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

interface VMAttachmentWarningModalProps {
  open: boolean;
  onClose: () => void;
  volumeName: string;
  instanceName: string;
}

export function VMAttachmentWarningModal({
  open,
  onClose,
  volumeName,
  instanceName,
}: VMAttachmentWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-amber-600'>
            <ExclamationTriangleIcon className='h-5 w-5' />
            Volume Attached to VM
          </DialogTitle>
          <DialogDescription>
            This volume is currently attached to a running virtual machine.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Alert>
            <ExclamationTriangleIcon className='h-4 w-4' />
            <AlertDescription>
              Volume <strong>{volumeName}</strong> is currently attached to VM
              instance <strong>{instanceName}</strong>. Please detach the volume
              from the VM before performing this operation.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button type='button' onClick={onClose}>
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
