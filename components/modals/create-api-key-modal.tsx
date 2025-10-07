'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateApiKeyModal({ open, onClose }: CreateApiKeyModalProps) {
  const [secretName, setSecretName] = useState('');

  const handleCreate = () => {
    // Mock API key creation
    console.log('Creating API key with name:', secretName);
    // In real implementation, this would call an API
    onClose();
    setSecretName('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-base font-semibold text-black'>
            Create New API Key
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='secret-name' className='text-sm font-medium'>
              Secret Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='secret-name'
              placeholder='Enter Name'
              value={secretName}
              onChange={(e) => setSecretName(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3'>
            <Button
              variant='outline'
              onClick={onClose}
              size='sm'
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!secretName.trim()}
              size='sm'
            >
              Create API Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
