'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AlertTriangle, Copy, Check } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SaveApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
}

export function SaveApiKeyModal({ open, onClose, apiKey }: SaveApiKeyModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({
      variant: "black",
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAndClose = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      variant: "black",
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        {/* Custom overlay with higher z-index */}
        <DialogPrimitive.Overlay className='fixed inset-0 z-[60] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        
        {/* Custom content with higher z-index */}
        <DialogPrimitive.Content className='fixed left-[50%] top-[50%] z-[60] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'>
          {/* Close button */}
          <DialogPrimitive.Close className='absolute right-4 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
            <XMarkIcon className='h-[1.1rem] w-[1.1rem]' />
            <span className='sr-only'>Close</span>
          </DialogPrimitive.Close>

          <DialogHeader>
            <DialogTitle className='text-base font-semibold text-black'>
              Save API key
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-6'>
            {/* Warning Alert */}
            <Alert className='border-amber-200 bg-amber-50'>
              <AlertTriangle className='h-5 w-5 text-amber-600' />
              <AlertDescription className='ml-2 text-sm text-amber-800'>
                Save this API key safely and accessibly. After you close this window, you will not be able to see the key again. If you lose it, you will need to create a new key.
              </AlertDescription>
            </Alert>

            {/* API Key Display */}
            <div className='flex gap-2'>
              <Input
                value={apiKey}
                readOnly
                className='font-mono text-sm'
              />
              <Button
                variant='outline'
                size='icon'
                onClick={handleCopy}
                className='shrink-0'
              >
                {copied ? (
                  <Check className='h-4 w-4 text-green-600' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            </div>

            {/* Actions */}
            <div className='flex items-center justify-end'>
              <Button
                onClick={handleCopyAndClose}
                size='sm'
              >
                Copy and Close
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

