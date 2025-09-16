import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FolderIcon } from '@heroicons/react/24/outline';

interface CreateBackupModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    tags: { key: string; value: string }[];
  }) => Promise<void>;
  price?: string;
  volume?: { name: string; size: string; type: string };
}

export function CreateBackupModal({
  open,
  onClose,
  onCreate,
  price,
  volume,
}: CreateBackupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<{ key: string; value: string }[]>([]);
  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTag = () => {
    if (tagKey && tagValue && !tags.some(tag => tag.key === tagKey)) {
      setTags([...tags, { key: tagKey, value: tagValue }]);
      setTagKey('');
      setTagValue('');
    }
  };
  const handleRemoveTag = (tagKey: string) =>
    setTags(tags.filter(t => t.key !== tagKey));

  const handleCreate = async () => {
    if (!name) {
      return;
    }
    setLoading(true);
    try {
      await onCreate({ name, description, tags });
      onClose();
      setName('');
      setDescription('');
      setTags([]);
      setTagKey('');
      setTagValue('');
    } catch (error) {
      console.error('Error creating backup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create Instant Backup</DialogTitle>
          <DialogDescription>
            Create a backup of your volume data for data protection and recovery
            purposes.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          {volume && (
            <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
              <div className='space-y-3 mb-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Volume Name:
                  </span>
                  <span className='text-sm font-medium'>{volume.name}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Size:</span>
                  <span className='text-sm font-medium'>{volume.size} GB</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Volume Type:
                  </span>
                  <span className='text-sm font-medium'>{volume.type}</span>
                </div>
              </div>
            </div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='name'>Backup Name *</Label>
            <Input
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Enter backup name'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter backup description (optional)'
              rows={3}
            />
          </div>
          <div className='space-y-2'>
            <Label>Tags</Label>
            <div className='space-y-2'>
              {tags.map(tag => (
                <span
                  key={tag.key}
                  className='bg-gray-200 rounded px-2 py-1 text-sm flex items-center gap-1'
                >
                  <span className='font-medium'>{tag.key}:</span>
                  <span>{tag.value}</span>
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag.key)}
                    className='text-gray-500 hover:text-red-500 ml-1'
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className='flex gap-2'>
                <Input
                  value={tagKey}
                  onChange={e => setTagKey(e.target.value)}
                  placeholder='Key'
                  className='flex-1'
                />
                <Input
                  value={tagValue}
                  onChange={e => setTagValue(e.target.value)}
                  placeholder='Value'
                  className='flex-1'
                />
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          {price && (
            <div
              className='p-4 rounded-lg mt-2'
              style={{
                boxShadow: 'rgba(14, 114, 180, 0.1) 0px 0px 0px 1px inset',
                background:
                  'linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)',
              }}
            >
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-sm font-medium text-black'>
                  Pricing Summary
                </span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='text-black'>Backup Price:</span>
                <span className='font-semibold text-black'>{price}</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className='flex gap-2 sm:justify-end sticky bottom-0 bg-white border-t pt-4 mt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleCreate}
            disabled={loading || !name}
          >
            {loading ? 'Creating...' : 'Create Backup'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
