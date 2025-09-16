'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  certificateName: string;
  tags: { [key: string]: string };
}

interface UpdateCertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onConfirm: (data: {
    certificateName: string;
    tags: { [key: string]: string };
  }) => Promise<void>;
}

export function UpdateCertificateModal({
  open,
  onClose,
  certificate,
  onConfirm,
}: UpdateCertificateModalProps) {
  const [certificateName, setCertificateName] = useState('');
  const [tags, setTags] = useState<{ [key: string]: string }>({});
  const [newTagKey, setNewTagKey] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Initialize form data when modal opens
  useEffect(() => {
    if (open && certificate) {
      setCertificateName(certificate.certificateName);
      setTags(certificate.tags || {});
      setNewTagKey('');
      setNewTagValue('');
    }
  }, [open, certificate]);

  const handleAddTag = () => {
    if (newTagKey.trim() && newTagValue.trim()) {
      setTags(prev => ({
        ...prev,
        [newTagKey.trim()]: newTagValue.trim(),
      }));
      setNewTagKey('');
      setNewTagValue('');
    }
  };

  const handleRemoveTag = (key: string) => {
    setTags(prev => {
      const newTags = { ...prev };
      delete newTags[key];
      return newTags;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleConfirm = async () => {
    if (!certificateName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Certificate name is required.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      await onConfirm({
        certificateName: certificateName.trim(),
        tags,
      });
      onClose();
      toast({
        title: 'Success',
        description: 'Certificate updated successfully.',
      });
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to update certificate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!certificate) {
    return null;
  }

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
            Update Certificate: {certificate.certificateName}
          </DialogTitle>
          <hr className='border-border' />
        </DialogHeader>

        {/* Tip Text */}
        <div className='p-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-md'>
          <div className='flex items-start gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 18 18'
              className='flex-shrink-0 mt-0.5'
            >
              <title>lightbulb-3</title>
              <g
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.5'
                stroke='#212121'
              >
                <path d='M9 0.75V1.75'></path>
                <path d='M14.834 3.16599L14.127 3.87299'></path>
                <path d='M17.25 9H16.25'></path>
                <path d='M3.16599 3.16599L3.87299 3.87299'></path>
                <path d='M0.75 9H1.75'></path>
                <path d='M13.75 8.99999C13.75 6.04069 11.0445 3.71348 7.972 4.35818C6.0998 4.75108 4.62103 6.31669 4.31453 8.20489C3.93513 10.5427 5.26681 12.6193 7.25001 13.407V15.25C7.25001 16.0784 7.92161 16.75 8.75001 16.75H9.25001C10.0784 16.75 10.75 16.0784 10.75 15.25V13.407C12.505 12.71 13.75 11.004 13.75 8.99999Z'></path>
                <path d='M6.897 13.25H11.103'></path>
              </g>
            </svg>
            <p className='text-sm text-gray-700'>
              Updating the name, tags, or file will not detach the certificate
              from its currently associated resources as the KRN will remain the
              same.
            </p>
          </div>
        </div>

        <div className='space-y-6 py-2'>
          {/* Certificate Name */}
          <div className='space-y-2'>
            <Label htmlFor='certificateName' className='text-sm font-medium'>
              Certificate Name *
            </Label>
            <Input
              id='certificateName'
              value={certificateName}
              onChange={e => setCertificateName(e.target.value)}
              placeholder='Enter certificate name'
              className='w-full'
            />
          </div>

          {/* Upload New Certificate File */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>
              Upload New Certificate File
            </Label>
            <Button
              variant='outline'
              className='w-full justify-start text-left text-muted-foreground'
              onClick={() => {
                // File upload functionality would be implemented here
                toast({
                  title: 'File Upload',
                  description: 'File upload functionality will be implemented.',
                });
              }}
            >
              Choose File no file selected
            </Button>
            <p className='text-xs text-muted-foreground'>
              Upload a new .p12 file to replace the existing certificate
            </p>
          </div>

          {/* Tags Section */}
          <div className='space-y-3'>
            <Label className='text-sm font-medium'>Tags</Label>

            {/* Add Tag Input */}
            <div className='flex gap-2'>
              <Input
                placeholder='Key'
                value={newTagKey}
                onChange={e => setNewTagKey(e.target.value)}
                onKeyPress={handleKeyPress}
                className='flex-1'
              />
              <Input
                placeholder='Value'
                value={newTagValue}
                onChange={e => setNewTagValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className='flex-1'
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleAddTag}
                disabled={!newTagKey.trim() || !newTagValue.trim()}
                className='px-3'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {/* Display Tags */}
            {Object.keys(tags).length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {Object.entries(tags).map(([key, value]) => (
                  <Badge
                    key={key}
                    variant='secondary'
                    className='bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-700 cursor-default px-3 py-1'
                  >
                    {key}: {value}
                    <button
                      type='button'
                      onClick={() => handleRemoveTag(key)}
                      className='ml-2 hover:text-red-600'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='flex gap-2 pt-4'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isUpdating}
            className='flex-1'
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isUpdating || !certificateName.trim()}
            className='flex-1 bg-black hover:bg-gray-800 text-white'
          >
            {isUpdating ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
