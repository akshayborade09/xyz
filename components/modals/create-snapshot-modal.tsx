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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateSnapshotModalProps {
  open: boolean;
  onClose: () => void;
  volumes?: string[];
  volume?: { name: string; size: string; type: string };
  onCreate: (data: {
    volume: string;
    name: string;
    description: string;
  }) => Promise<void>;
  price?: string;
}

export function CreateSnapshotModal({
  open,
  onClose,
  volumes = [],
  volume,
  onCreate,
  price,
}: CreateSnapshotModalProps) {
  const [selectedVolume, setSelectedVolume] = useState(
    volume ? volume.name : ''
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!selectedVolume || !name) {
      return;
    }
    setLoading(true);
    try {
      await onCreate({ volume: selectedVolume, name, description });
      onClose();
      setSelectedVolume('');
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating snapshot:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create Instant Snapshot</DialogTitle>
          <DialogDescription>
            Create a point-in-time snapshot of your volume for backup or cloning
            purposes.
          </DialogDescription>
        </DialogHeader>
        {volume && (
          <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4'>
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
        <div className='space-y-4 py-4'>
          {!volume && (
            <div className='space-y-2'>
              <Label htmlFor='volume'>Volume *</Label>
              <Select value={selectedVolume} onValueChange={setSelectedVolume}>
                <SelectTrigger>
                  <SelectValue placeholder='Select volume' />
                </SelectTrigger>
                <SelectContent>
                  {volumes.map(v => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='name'>Snapshot Name *</Label>
            <Input
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Enter snapshot name'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter snapshot description (optional)'
              rows={3}
            />
          </div>
          {volume && (
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
                <span className='text-black'>Snapshot Price:</span>
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
            disabled={loading || !selectedVolume || !name}
          >
            {loading ? 'Creating...' : 'Create Snapshot'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
