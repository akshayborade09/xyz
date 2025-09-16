'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  key: string;
  value: string;
}

interface VMEditModalProps {
  open: boolean;
  onClose: () => void;
  vmId: string;
  vmName: string;
  initialDescription?: string;
  initialTags?: Tag[];
  isLoading?: boolean;
}

export function VMEditModal({
  open,
  onClose,
  vmId,
  vmName,
  initialDescription = '',
  initialTags = [],
  isLoading = false,
}: VMEditModalProps) {
  const { toast } = useToast();
  const [description, setDescription] = useState(initialDescription);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens/closes or props change
  useEffect(() => {
    if (open) {
      setDescription(initialDescription);
      setTags(initialTags.length > 0 ? [...initialTags] : []);
    }
  }, [open, initialDescription, initialTags]);

  const addTag = () => {
    setTags(prev => [...prev, { key: '', value: '' }]);
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, field: 'key' | 'value', value: string) => {
    setTags(prev =>
      prev.map((tag, i) => (i === index ? { ...tag, [field]: value } : tag))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Filter out empty tags
      const validTags = tags.filter(
        tag => tag.key.trim() !== '' || tag.value.trim() !== ''
      );

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'VM updated successfully',
        description: `${vmName} has been updated with new tags and description.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Failed to update VM',
        description: 'Please try again later.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDescription(initialDescription);
    setTags(initialTags.length > 0 ? [...initialTags] : []);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[85vh] overflow-hidden flex flex-col'>
        <DialogHeader className='flex-shrink-0 pb-4'>
          <DialogTitle className='text-xl font-semibold'>
            Edit VM Details
          </DialogTitle>
          <p className='text-sm text-muted-foreground mt-1'>
            Update description and tags for{' '}
            <span className='font-medium'>{vmName}</span>
          </p>
        </DialogHeader>

        <div
          className='flex-1 overflow-y-auto space-y-6 px-1 pb-4'
          style={{ maxHeight: 'calc(85vh - 180px)' }}
        >
          {/* Description Section */}
          <div className='space-y-3'>
            <Label htmlFor='description' className='text-sm font-medium'>
              Description
            </Label>
            <Textarea
              id='description'
              placeholder='Enter a description for this VM...'
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className='resize-none min-h-[100px]'
            />
            <p className='text-xs text-muted-foreground'>
              Provide a brief description of this VM's purpose or configuration.
            </p>
          </div>

          {/* Tags Section */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-medium'>Tags</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addTag}
                className='h-8'
              >
                <Plus className='h-4 w-4 mr-1' />
                Add Tag
              </Button>
            </div>

            {tags.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <p className='text-sm'>No tags added yet.</p>
                <p className='text-xs mt-1'>
                  Tags help organize and categorize your VMs.
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {tags.map((tag, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <div className='flex-1 grid grid-cols-2 gap-2'>
                      <Input
                        placeholder='Key (e.g., Environment)'
                        value={tag.key}
                        onChange={e => updateTag(index, 'key', e.target.value)}
                        className='text-sm'
                      />
                      <Input
                        placeholder='Value (e.g., Production)'
                        value={tag.value}
                        onChange={e =>
                          updateTag(index, 'value', e.target.value)
                        }
                        className='text-sm'
                      />
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeTag(index)}
                      className='h-8 w-8 text-muted-foreground hover:text-destructive'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Tag Preview */}
            {tags.some(
              tag => tag.key.trim() !== '' && tag.value.trim() !== ''
            ) && (
              <div className='space-y-2'>
                <Label className='text-xs font-medium text-muted-foreground'>
                  Preview:
                </Label>
                <div className='flex flex-wrap gap-2'>
                  {tags
                    .filter(
                      tag => tag.key.trim() !== '' && tag.value.trim() !== ''
                    )
                    .map((tag, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='text-xs'
                      >
                        {tag.key}: {tag.value}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            <p className='text-xs text-muted-foreground'>
              Tags are key-value pairs that help you organize and filter your
              VMs. Common examples: Environment: Production, Team: DevOps,
              Cost-Center: Engineering.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className='flex-shrink-0 flex justify-end gap-3 pt-6 mt-4 border-t bg-white'>
          <Button variant='outline' onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className='bg-black text-white hover:bg-black/90'
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
