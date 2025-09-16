'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddPolicyModal } from '@/components/modals/add-policy-modal';
import { ActionMenu } from '@/components/action-menu';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';

// Dummy data for demo
const getVolume = (id: string) => ({
  id: id,
  name: 'web-server-root',
  description: 'Root volume for production web server hosting main application',
  tags: [
    { key: 'environment', value: 'prod' },
    { key: 'service', value: 'web' },
  ],
  type: 'High-speed NVME SSD Storage (HNSS)',
  size: '50',
  status: 'attached',
  createdOn: '2024-01-15T10:30:00Z',
});

export default function EditVolumePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const volume = getVolume(params.id);

  if (!volume) {
    notFound();
  }

  // Editable fields
  const [description, setDescription] = useState(volume.description);
  const [tags, setTags] = useState<{ key: string; value: string }[]>(
    volume.tags
  );
  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');

  // Policy state (dummy, design mode)
  const [snapshotPolicy, setSnapshotPolicy] = useState<any>({
    name: 'Web Server Snapshot Policy',
    description: 'Automated daily backup for web server root volume',
    maxSnapshots: 7,
    cronExpression: '30 8 * * *',
    cronExplanation: 'This policy will run at every 30 minutes.',
    nextExecution: '20/12/2024, 14:00:00',
    enabled: true,
  });
  const [backupPolicy, setBackupPolicy] = useState<any>({
    name: 'Web Server Backup Policy',
    description: 'Automated daily backup for web server root volume',
    maxSnapshots: 7,
    cronExpression: '0 3 * * *',
    cronExplanation: 'This policy will run at hour 3.',
    nextExecution: '20/12/2024, 03:00:00',
    enabled: true,
  });
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState(false);
  const [editBackup, setEditBackup] = useState(false);

  // Tag helpers
  const handleAddTag = () => {
    if (tagKey && tagValue && !tags.some(tag => tag.key === tagKey)) {
      setTags([...tags, { key: tagKey, value: tagValue }]);
      setTagKey('');
      setTagValue('');
    }
  };
  const handleRemoveTag = (tagKey: string) =>
    setTags(tags.filter(t => t.key !== tagKey));

  // Save handler (design mode)
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Volume Updated',
        description: `Volume '${volume.name}' has been updated successfully.`,
      });

      router.push(`/storage/block/volumes/${volume.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update volume. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Breadcrumbs
  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/storage', title: 'Storage' },
    { href: '/storage/block', title: 'Block Storage' },
    { href: `/storage/block/volumes/${volume.id}`, title: volume.name },
    { href: `/storage/block/volumes/${volume.id}/edit`, title: 'Edit' },
  ];

  return (
    <PageLayout
      title={`Edit Volume: ${volume.name}`}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      <div className='flex gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          {/* Volume Configuration */}
          <Card>
            <CardContent>
              <form onSubmit={handleSave} className='space-y-6'>
                {/* Volume Configuration */}
                <div className='pt-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label className='font-medium'>Volume Name</Label>
                      <Input
                        value={volume.name}
                        disabled
                        className='bg-gray-50 text-gray-500 cursor-not-allowed'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='font-medium'>Type</Label>
                      <Input
                        value={volume.type}
                        disabled
                        className='bg-gray-50 text-gray-500 cursor-not-allowed'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='font-medium'>Size (GB)</Label>
                      <Input
                        value={volume.size}
                        disabled
                        className='bg-gray-50 text-gray-500 cursor-not-allowed'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='font-medium'>Status</Label>
                      <Input
                        value={volume.status}
                        disabled
                        className='bg-gray-50 text-gray-500 cursor-not-allowed'
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description' className='font-medium'>
                    Description
                  </Label>
                  <Textarea
                    id='description'
                    placeholder='Enter a description for this volume'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className='min-h-[100px]'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='font-medium'>Tags</Label>
                  <div className='space-y-3'>
                    <div className='flex flex-wrap gap-2'>
                      {tags.map(tag => (
                        <span
                          key={tag.key}
                          className='bg-gray-200 rounded px-3 py-1 text-sm flex items-center gap-2'
                        >
                          <span className='font-medium'>{tag.key}:</span>
                          <span>{tag.value}</span>
                          <button
                            type='button'
                            onClick={() => handleRemoveTag(tag.key)}
                            className='text-gray-500 hover:text-red-500 text-lg font-bold ml-2'
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
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
              </form>
            </CardContent>
          </Card>

          {/* Policy Sections - Side by Side */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Snapshot Policy Section */}
            <div className='bg-card text-card-foreground border-border border rounded-lg p-6 relative'>
              <h2 className='text-lg font-semibold mb-4'>Snapshot Policy</h2>
              {snapshotPolicy ? (
                <div className='bg-gray-50 rounded p-4'>
                  <div className='space-y-2'>
                    <div className='text-sm text-gray-700 font-medium'>
                      {snapshotPolicy.name}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {snapshotPolicy.description}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Max Snapshots: {snapshotPolicy.maxSnapshots}
                    </div>
                    <div className='text-xs text-gray-500'>
                      CRON Expression: {snapshotPolicy.cronExpression}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {snapshotPolicy.cronExplanation}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Next Execution: {snapshotPolicy.nextExecution}
                    </div>
                  </div>
                  {/* Action Icons */}
                  <div className='absolute top-4 right-4 flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setEditSnapshot(true)}
                      className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setSnapshotPolicy(null)}
                      className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant='default'
                  onClick={() => setShowSnapshotModal(true)}
                >
                  Add Policy
                </Button>
              )}
            </div>

            {/* Backup Policy Section */}
            <div className='bg-card text-card-foreground border-border border rounded-lg p-6 relative'>
              <h2 className='text-lg font-semibold mb-4'>Backup Policy</h2>
              {backupPolicy ? (
                <div className='bg-gray-50 rounded p-4'>
                  <div className='space-y-2'>
                    <div className='text-sm text-gray-700 font-medium'>
                      {backupPolicy.name}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {backupPolicy.description}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Max Backups: {backupPolicy.maxSnapshots}
                    </div>
                    <div className='text-xs text-gray-500'>
                      CRON Expression: {backupPolicy.cronExpression}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {backupPolicy.cronExplanation}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Next Execution: {backupPolicy.nextExecution}
                    </div>
                  </div>
                  {/* Action Icons */}
                  <div className='absolute top-4 right-4 flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setEditBackup(true)}
                      className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setBackupPolicy(null)}
                      className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant='default'
                  onClick={() => setShowBackupModal(true)}
                >
                  Add Policy
                </Button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-4 pt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push(`/storage/block/volumes/${volume.id}`)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-black text-white hover:bg-black/90'
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className='w-80 flex-shrink-0 space-y-6'>
          {/* Volume Information */}
          <div
            style={{
              borderRadius: '16px',
              border: '4px solid #FFF',
              background:
                'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
              boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
              padding: '1.5rem',
            }}
          >
            <div className='pb-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-base font-semibold'>Volume Information</h3>
              </div>
            </div>
            <div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Volume ID:
                  </span>
                  <span className='text-sm font-mono'>{volume.id}</span>
                </div>
                <div className='flex justify-between items-start'>
                  <span className='text-sm text-muted-foreground'>Type:</span>
                  <span className='text-sm text-right'>{volume.type}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Status:</span>
                  <span className='text-sm capitalize'>{volume.status}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Created:
                  </span>
                  <span className='text-sm'>
                    {new Date(volume.createdOn).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Size:</span>
                  <span className='text-sm'>{volume.size} GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Tips */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base font-normal'>
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Update description to reflect current usage
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Add tags for better organization
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Configure backup policies for data protection
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Snapshot policies help with point-in-time recovery
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AddPolicyModal
        open={showSnapshotModal || editSnapshot}
        onClose={() => {
          setShowSnapshotModal(false);
          setEditSnapshot(false);
        }}
        onSave={policy => {
          setSnapshotPolicy(policy);
        }}
        mode={editSnapshot ? 'edit' : 'add'}
        type='snapshot'
        initialPolicy={editSnapshot ? snapshotPolicy : undefined}
      />

      <AddPolicyModal
        open={showBackupModal || editBackup}
        onClose={() => {
          setShowBackupModal(false);
          setEditBackup(false);
        }}
        onSave={policy => {
          setBackupPolicy(policy);
        }}
        mode={editBackup ? 'edit' : 'add'}
        type='backup'
        initialPolicy={editBackup ? backupPolicy : undefined}
      />
    </PageLayout>
  );
}
