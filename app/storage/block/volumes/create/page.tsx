'use client';
import { useState, useRef } from 'react';

import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { vpcs } from '@/lib/data';
import { SnapshotPolicyModal } from '@/components/modals/snapshot-policy-modal';
import { AddPolicyModal } from '@/components/modals/add-policy-modal';
import { Edit, Trash2, ChevronDown, Search, Check } from 'lucide-react';
import { CreateVPCModal } from '@/components/modals/vm-creation-modals';

export default function CreateVolumePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVpc, setSelectedVpc] = useState('');
  const [volumeType, setVolumeType] = useState('hnss');
  const [source, setSource] = useState('none');
  const [selectedSnapshot, setSelectedSnapshot] = useState('');
  const [selectedMachineImage, setSelectedMachineImage] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [size, setSize] = useState([100]);
  const [tags, setTags] = useState([{ key: '', value: '' }]);

  // Policy state
  const [snapshotPolicy, setSnapshotPolicy] = useState<any>(null);
  const [backupPolicy, setBackupPolicy] = useState<any>(null);
  const [showAddSnapshotPolicy, setShowAddSnapshotPolicy] = useState(false);
  const [showAddBackupPolicy, setShowAddBackupPolicy] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState(false);
  const [editBackup, setEditBackup] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false);

  // Refs for form fields
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Mock data for source options
  const snapshots = [
    {
      value: 'snap-11111',
      label: 'web-server-snapshot (snap-11111) - 50GB - 2024-01-15',
    },
    {
      value: 'snap-22222',
      label: 'database-snapshot (snap-22222) - 120GB - 2024-01-10',
    },
  ];

  const machineImages = [
    { value: 'ami-11111', label: 'Ubuntu 22.04 LTS (ami-11111)' },
    { value: 'ami-22222', label: 'CentOS 8 (ami-22222)' },
  ];

  const otherVolumes = [
    { value: 'vol-11111', label: 'web-server-volume (vol-11111) - 100GB' },
    { value: 'vol-22222', label: 'database-volume (vol-22222) - 200GB' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const name = nameRef.current?.value.trim() || '';

    // Validate required fields based on source selection
    if (!name || !selectedVpc) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }

    // Validate source-specific requirements
    if (source === 'snapshot' && !selectedSnapshot) {
      setError('Please select a snapshot.');
      setLoading(false);
      return;
    }

    if (source === 'machine-image' && !selectedMachineImage) {
      setError('Please select a machine image.');
      setLoading(false);
      return;
    }

    if (source === 'volume' && !selectedVolume) {
      setError('Please select a volume.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = '/storage/block';
    } catch (err) {
      setError('Failed to create volume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    setTags([...tags, { key: '', value: '' }]);
  };

  const updateTag = (index: number, field: 'key' | 'value', value: string) => {
    const newTags = [...tags];
    newTags[index][field] = value;
    setTags(newTags);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const calculatePrice = () => {
    const pricePerGB = 1.8;
    const totalPrice = size[0] * pricePerGB;
    return totalPrice.toFixed(2);
  };

  const handleSourceChange = (newSource: string) => {
    setSource(newSource);
    // Clear previously selected values when source changes
    setSelectedSnapshot('');
    setSelectedMachineImage('');
    setSelectedVolume('');
  };

  const handleVPCCreated = (vpcId: string) => {
    setSelectedVpc(vpcId);
    setShowCreateVPCModal(false);
  };

  // Function to check if all mandatory fields are filled
  const isFormValid = () => {
    const name = nameRef.current?.value.trim() || '';
    const hasValidName = name.length > 0;
    const hasValidVpc = selectedVpc.length > 0;
    const hasValidVolumeType = volumeType.length > 0;
    const hasValidSource = source.length > 0;
    const hasValidSize = size[0] > 0;

    // Check conditional requirements based on source
    let hasValidConditionalFields = true;
    if (source === 'snapshot') {
      hasValidConditionalFields = selectedSnapshot.length > 0;
    } else if (source === 'machine-image') {
      hasValidConditionalFields = selectedMachineImage.length > 0;
    } else if (source === 'volume') {
      hasValidConditionalFields = selectedVolume.length > 0;
    }

    return (
      hasValidName &&
      hasValidVpc &&
      hasValidVolumeType &&
      hasValidSource &&
      hasValidSize &&
      hasValidConditionalFields
    );
  };

  return (
    <PageLayout
      title='Create Volume'
      description='Provision a new block storage volume for your cloud resources.'
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant='destructive' className='mb-6'>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Basic Configuration */}
                <div className='mb-8'>
                  <div className='mb-5'>
                    <Label
                      htmlFor='volume-name'
                      className='block mb-2 font-medium'
                    >
                      Volume Name <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='volume-name'
                      ref={nameRef}
                      placeholder='Enter volume name'
                      required
                      className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formTouched && !nameRef.current?.value.trim()
                          ? 'border-red-300 bg-red-50'
                          : ''
                      }`}
                      onChange={() => setFormTouched(true)}
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Only alphanumeric characters, hyphens, and underscores
                      allowed.
                    </p>
                  </div>

                  <div className='mb-5'>
                    <Label
                      htmlFor='description'
                      className='block mb-2 font-medium'
                    >
                      Description
                    </Label>
                    <Textarea
                      id='description'
                      ref={descriptionRef}
                      placeholder='Enter description'
                      className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]'
                    />
                  </div>

                  {/* VPC Selection */}
                  <VPCSelectorInline
                    value={selectedVpc}
                    onChange={value => {
                      if (value === '__create_new__') {
                        setShowCreateVPCModal(true);
                      } else {
                        setSelectedVpc(value);
                        setFormTouched(true);
                      }
                    }}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'>
                    <div>
                      <Label
                        htmlFor='volume-type'
                        className='block mb-2 font-medium'
                      >
                        Volume Type <span className='text-destructive'>*</span>
                      </Label>
                      <Select
                        value={volumeType}
                        onValueChange={value => {
                          setVolumeType(value);
                          setFormTouched(true);
                        }}
                        required
                      >
                        <SelectTrigger
                          className={
                            formTouched && !volumeType
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }
                        >
                          <SelectValue placeholder='Select volume type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='hnss'>
                            High-speed NVME SSD storage (HNSS)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className='text-xs text-muted-foreground mt-1'>
                        xxx MBPS Throughput
                      </p>
                    </div>

                    <div>
                      <Label
                        htmlFor='source'
                        className='block mb-2 font-medium'
                      >
                        Source <span className='text-destructive'>*</span>
                      </Label>
                      <Select
                        value={source}
                        onValueChange={value => {
                          handleSourceChange(value);
                          setFormTouched(true);
                        }}
                        required
                      >
                        <SelectTrigger
                          className={
                            formTouched && !source
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }
                        >
                          <SelectValue placeholder='Select source' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='none'>
                            None (create empty volume)
                          </SelectItem>
                          <SelectItem value='snapshot'>Snapshot</SelectItem>
                          <SelectItem value='machine-image'>
                            Machine Image
                          </SelectItem>
                          <SelectItem value='volume'>Other Volume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Conditional Source Dropdowns */}
                  {source === 'snapshot' && (
                    <div className='mb-5'>
                      <Label
                        htmlFor='snapshot-select'
                        className='block mb-2 font-medium'
                      >
                        Snapshots <span className='text-destructive'>*</span>
                      </Label>
                      {snapshots.length > 0 ? (
                        <Select
                          value={selectedSnapshot}
                          onValueChange={value => {
                            setSelectedSnapshot(value);
                            setFormTouched(true);
                          }}
                          required
                        >
                          <SelectTrigger
                            className={
                              formTouched &&
                              source === 'snapshot' &&
                              !selectedSnapshot
                                ? 'border-red-300 bg-red-50'
                                : ''
                            }
                          >
                            <SelectValue placeholder='Select a snapshot' />
                          </SelectTrigger>
                          <SelectContent>
                            {snapshots.map(snapshot => (
                              <SelectItem
                                key={snapshot.value}
                                value={snapshot.value}
                              >
                                {snapshot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className='space-y-2'>
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder='No snapshots available' />
                            </SelectTrigger>
                          </Select>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              (window.location.href =
                                '/storage/block/snapshots')
                            }
                          >
                            Create Snapshot
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {source === 'machine-image' && (
                    <div className='mb-5'>
                      <Label
                        htmlFor='machine-image-select'
                        className='block mb-2 font-medium'
                      >
                        Machine Images{' '}
                        <span className='text-destructive'>*</span>
                      </Label>
                      {machineImages.length > 0 ? (
                        <Select
                          value={selectedMachineImage}
                          onValueChange={value => {
                            setSelectedMachineImage(value);
                            setFormTouched(true);
                          }}
                          required
                        >
                          <SelectTrigger
                            className={
                              formTouched &&
                              source === 'machine-image' &&
                              !selectedMachineImage
                                ? 'border-red-300 bg-red-50'
                                : ''
                            }
                          >
                            <SelectValue placeholder='Select a machine image' />
                          </SelectTrigger>
                          <SelectContent>
                            {machineImages.map(image => (
                              <SelectItem key={image.value} value={image.value}>
                                {image.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className='space-y-2'>
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder='No machine images available' />
                            </SelectTrigger>
                          </Select>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              (window.location.href =
                                '/compute/machines/images')
                            }
                          >
                            Upload Machine Image
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {source === 'volume' && (
                    <div className='mb-5'>
                      <Label
                        htmlFor='volume-select'
                        className='block mb-2 font-medium'
                      >
                        Other Volumes{' '}
                        <span className='text-destructive'>*</span>
                      </Label>
                      {otherVolumes.length > 0 ? (
                        <Select
                          value={selectedVolume}
                          onValueChange={value => {
                            setSelectedVolume(value);
                            setFormTouched(true);
                          }}
                          required
                        >
                          <SelectTrigger
                            className={
                              formTouched &&
                              source === 'volume' &&
                              !selectedVolume
                                ? 'border-red-300 bg-red-50'
                                : ''
                            }
                          >
                            <SelectValue placeholder='Select a volume' />
                          </SelectTrigger>
                          <SelectContent>
                            {otherVolumes.map(volume => (
                              <SelectItem
                                key={volume.value}
                                value={volume.value}
                              >
                                {volume.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className='space-y-2'>
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder='No volumes available' />
                            </SelectTrigger>
                          </Select>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              (window.location.href = '/storage/block/volumes')
                            }
                          >
                            Create Volume
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Size Selection */}
                  <Card className='mb-5'>
                    <CardContent className='pt-4'>
                      <Label htmlFor='size' className='block mb-3 font-medium'>
                        Size (GB) <span className='text-destructive'>*</span>
                      </Label>

                      <div className='space-y-4'>
                        {/* Quick Presets + Custom Input Row */}
                        <div className='flex items-end gap-3'>
                          <div className='flex-1'>
                            <Label className='text-xs text-muted-foreground mb-2 block'>
                              Quick Select
                            </Label>
                            <div className='grid grid-cols-4 gap-2'>
                              {[
                                { size: 20, label: '20GB' },
                                { size: 100, label: '100GB' },
                                { size: 500, label: '500GB' },
                                { size: 1000, label: '1TB' },
                              ].map(preset => (
                                <Button
                                  key={preset.size}
                                  type='button'
                                  variant={
                                    size[0] === preset.size
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  className={`h-9 text-xs font-medium ${
                                    size[0] === preset.size
                                      ? 'bg-primary text-primary-foreground'
                                      : ''
                                  }`}
                                  onClick={() => setSize([preset.size])}
                                >
                                  {preset.label}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className='w-28'>
                            <Label className='text-xs text-muted-foreground mb-2 block'>
                              Custom
                            </Label>
                            <div className='relative'>
                              <Input
                                type='number'
                                value={size[0]}
                                onChange={e => {
                                  const value = Math.max(
                                    4,
                                    Math.min(2048, Number(e.target.value) || 4)
                                  );
                                  setSize([value]);
                                  setFormTouched(true);
                                }}
                                className={`w-full h-9 text-xs text-center pr-8 ${
                                  formTouched && size[0] <= 0
                                    ? 'border-red-300 bg-red-50'
                                    : ''
                                }`}
                                min={4}
                                max={2048}
                              />
                              <span className='absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground pointer-events-none'>
                                GB
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Slider */}
                        <div className='space-y-2'>
                          <Slider
                            value={size}
                            onValueChange={setSize}
                            max={2048}
                            min={4}
                            step={1}
                            className='w-full'
                          />
                          <div className='flex justify-between text-xs text-muted-foreground'>
                            <span>4 GB</span>
                            <span>2048 GB</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className='bg-gray-50 rounded-lg p-3'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <div className='w-2 h-2 bg-primary rounded-full'></div>
                              <span className='text-sm font-medium'>
                                {size[0]} GB Selected
                              </span>
                              <span className='text-xs text-muted-foreground px-2 py-0.5 bg-white rounded'>
                                {size[0] <= 50
                                  ? 'Development'
                                  : size[0] <= 200
                                    ? 'Small App'
                                    : size[0] <= 800
                                      ? 'Production'
                                      : 'Enterprise'}
                              </span>
                            </div>
                            <div className='text-right'>
                              <div className='text-sm font-bold text-primary'>
                                ₹{calculatePrice()}/mo
                              </div>
                              <div className='text-xs text-muted-foreground'>
                                ₹{(Number(calculatePrice()) * 12).toFixed(2)}
                                /year
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <div className='mb-5'>
                    <Label className='block mb-2 font-medium'>Tags</Label>
                    <div className='space-y-3'>
                      {tags.map((tag, index) => (
                        <div key={index} className='grid grid-cols-2 gap-3'>
                          <Input
                            placeholder='Key'
                            value={tag.key}
                            onChange={e =>
                              updateTag(index, 'key', e.target.value)
                            }
                          />
                          <div className='flex gap-2'>
                            <Input
                              placeholder='Value'
                              value={tag.value}
                              onChange={e =>
                                updateTag(index, 'value', e.target.value)
                              }
                            />
                            {index === tags.length - 1 ? (
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={addTag}
                              >
                                Add
                              </Button>
                            ) : (
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={() => removeTag(index)}
                                className='px-2'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem value='advanced'>
                      <AccordionTrigger>Advanced Settings</AccordionTrigger>
                      <AccordionContent className='space-y-6'>
                        {/* Policy Sections - Side by Side */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                          {/* Snapshot Policy Section */}
                          <div className='bg-card text-card-foreground border-border border rounded-lg p-6 relative'>
                            <h2 className='block mb-2 font-medium'>
                              Snapshot Policy
                            </h2>
                            {snapshotPolicy ? (
                              <div className='bg-gray-50 rounded p-4'>
                                <div className='space-y-2'>
                                  <div className='text-sm text-gray-700 font-medium'>
                                    {snapshotPolicy.name || 'Snapshot Policy'}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    {snapshotPolicy.description ||
                                      'Automated snapshot policy for volume protection'}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    Max Snapshots: {snapshotPolicy.maxSnapshots}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    CRON Expression:{' '}
                                    {snapshotPolicy.cronExpression}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    {snapshotPolicy.cronExplanation}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    Next Execution:{' '}
                                    {snapshotPolicy.nextExecution}
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
                                variant='outline'
                                onClick={() => setShowAddSnapshotPolicy(true)}
                              >
                                Add Policy
                              </Button>
                            )}
                          </div>

                          {/* Backup Policy Section */}
                          <div className='bg-card text-card-foreground border-border border rounded-lg p-6 relative'>
                            <h2 className='block mb-2 font-medium'>
                              Backup Policy
                            </h2>
                            {backupPolicy ? (
                              <div className='bg-gray-50 rounded p-4'>
                                <div className='space-y-2'>
                                  <div className='text-sm text-gray-700 font-medium'>
                                    {backupPolicy.name || 'Backup Policy'}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    {backupPolicy.description ||
                                      'Automated backup policy for volume protection'}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    Max Backups: {backupPolicy.retention}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    Incremental:{' '}
                                    {backupPolicy.incremental ? 'Yes' : 'No'}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    Schedule: {backupPolicy.schedule}
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
                                variant='outline'
                                onClick={() => setShowAddBackupPolicy(true)}
                              >
                                Add Policy
                              </Button>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Footer Actions */}
                  <div className='flex justify-end gap-3 pt-6 border-t'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => (window.location.href = '/storage/block')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      disabled={loading || !isFormValid()}
                      onClick={() => setFormTouched(true)}
                    >
                      {loading
                        ? 'Creating...'
                        : !isFormValid()
                          ? formTouched
                            ? 'Fill Required Fields'
                            : 'Create Volume'
                          : 'Create Volume'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className='w-80 flex-shrink-0 space-y-6'>
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
                    Choose size based on your application needs
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    HNSS provides high-performance storage
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Enable backup and Snapshot policies for data protection
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Tags help organize and track resources
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <div
            className='sticky top-6'
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
                <h3 className='text-base font-semibold'>Price Summary</h3>
              </div>
            </div>
            <div>
              <div className='space-y-3'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-2xl font-bold'>
                    ₹{calculatePrice()}
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    per month
                  </span>
                </div>
                <div className='text-xs text-muted-foreground pt-2 border-t'>
                  <p>
                    • Volume ({size[0]} GB): ₹{calculatePrice()}/month
                  </p>
                  <p>• Storage type: HNSS</p>
                  <p>
                    • Additional charges may apply for snapshots and backups
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Policy Modal */}
      <SnapshotPolicyModal
        open={showAddSnapshotPolicy || editSnapshot}
        onClose={() => {
          setShowAddSnapshotPolicy(false);
          setEditSnapshot(false);
        }}
        onSave={policy => {
          setSnapshotPolicy(policy);
        }}
        mode={editSnapshot ? 'edit' : 'add'}
        initialPolicy={editSnapshot ? snapshotPolicy : undefined}
      />

      {/* Backup Policy Modal */}
      <AddPolicyModal
        open={showAddBackupPolicy || editBackup}
        onClose={() => {
          setShowAddBackupPolicy(false);
          setEditBackup(false);
        }}
        onSave={policy => {
          setBackupPolicy(policy);
        }}
        mode={editBackup ? 'edit' : 'add'}
        type='backup'
        initialPolicy={editBackup ? backupPolicy : undefined}
      />

      {/* Create VPC Modal */}
      <CreateVPCModal
        open={showCreateVPCModal}
        onClose={() => setShowCreateVPCModal(false)}
        onSuccess={handleVPCCreated}
        preselectedRegion={undefined}
      />
    </PageLayout>
  );
}

// VPC Selector Component
function VPCSelectorInline({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVPCs = vpcs.filter(
    vpc =>
      vpc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vpc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedVPC = vpcs.find(vpc => vpc.id === value);

  return (
    <div className='mb-6'>
      <Label className='block mb-2 font-medium'>
        VPC <span className='text-destructive'>*</span>
      </Label>
      <div className='relative'>
        <button
          type='button'
          onClick={() => setOpen(!open)}
          className='w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <span className={selectedVPC ? 'text-foreground' : '!text-[#64748b]'}>
            {selectedVPC
              ? `${selectedVPC.name} (${selectedVPC.region})`
              : 'Select VPC to isolate your workload'}
          </span>
          <ChevronDown className='h-4 w-4 opacity-50' />
        </button>
        {open && (
          <div className='absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md'>
            <div className='p-2 border-b'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search VPCs...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-8'
                />
              </div>
            </div>
            <div className='p-1'>
              <button
                type='button'
                onClick={() => {
                  onChange('__create_new__');
                  setOpen(false);
                }}
                className='w-full flex items-center px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-primary font-medium'
              >
                Create new VPC
              </button>
              {filteredVPCs.map(vpc => (
                <button
                  key={vpc.id}
                  type='button'
                  onClick={() => {
                    onChange(vpc.id);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  className='w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm'
                >
                  <div className='flex flex-col items-start'>
                    <span className='font-medium'>{vpc.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {vpc.id} • {vpc.region}
                    </span>
                  </div>
                  {value === vpc.id && <Check className='h-4 w-4' />}
                </button>
              ))}
              {filteredVPCs.length === 0 && searchTerm && (
                <div className='px-2 py-2 text-sm text-muted-foreground'>
                  No VPCs found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
