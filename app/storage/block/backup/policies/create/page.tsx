'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { HelpCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { snapshots } from '@/lib/data';

// Mock data for volumes - using the same structure as block storage page
const mockVolumes = [
  {
    id: 'vol-001',
    name: 'web-server-root',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Bootable',
    size: '50',
    attachedInstance: 'web-server-01',
    vpc: 'vpc-main-prod',
    status: 'attached',
    createdOn: '2024-01-15T10:30:00Z',
  },
  {
    id: 'vol-002',
    name: 'database-storage',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '200',
    attachedInstance: 'db-server-01',
    vpc: 'vpc-main-prod',
    status: 'attached',
    createdOn: '2024-01-20T14:22:00Z',
  },
  {
    id: 'vol-003',
    name: 'backup-volume',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '500',
    attachedInstance: '-',
    vpc: 'vpc-backup',
    status: 'available',
    createdOn: '2024-02-01T09:15:00Z',
  },
  {
    id: 'vol-004',
    name: 'temp-processing',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '100',
    attachedInstance: 'worker-node-03',
    vpc: 'vpc-main-prod',
    status: 'attached',
    createdOn: '2024-02-10T16:45:00Z',
  },
  {
    id: 'vol-005',
    name: 'logs-storage',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '80',
    attachedInstance: '-',
    vpc: 'vpc-logs',
    status: 'creating',
    createdOn: '2024-02-15T12:30:00Z',
  },
  {
    id: 'vol-006',
    name: 'app-server-data',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '150',
    attachedInstance: 'app-server-02',
    vpc: 'vpc-main-prod',
    status: 'attached',
    createdOn: '2024-02-20T08:15:00Z',
  },
  {
    id: 'vol-007',
    name: 'cache-volume',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '75',
    attachedInstance: 'cache-server-01',
    vpc: 'vpc-main-prod',
    status: 'attached',
    createdOn: '2024-02-22T11:20:00Z',
  },
  {
    id: 'vol-008',
    name: 'staging-root',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Bootable',
    size: '40',
    attachedInstance: 'staging-server-01',
    vpc: 'vpc-staging',
    status: 'attached',
    createdOn: '2024-02-25T14:30:00Z',
  },
  {
    id: 'vol-009',
    name: 'analytics-storage',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '300',
    attachedInstance: '-',
    vpc: 'vpc-analytics',
    status: 'available',
    createdOn: '2024-03-01T09:45:00Z',
  },
  {
    id: 'vol-010',
    name: 'test-environment',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '60',
    attachedInstance: 'test-server-01',
    vpc: 'vpc-testing',
    status: 'attached',
    createdOn: '2024-03-05T16:10:00Z',
  },
  {
    id: 'vol-011',
    name: 'media-storage',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '1000',
    attachedInstance: '-',
    vpc: 'vpc-media',
    status: 'available',
    createdOn: '2024-03-08T13:25:00Z',
  },
  {
    id: 'vol-012',
    name: 'backup-secondary',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '750',
    attachedInstance: '-',
    vpc: 'vpc-backup',
    status: 'creating',
    createdOn: '2024-03-10T10:00:00Z',
  },
  {
    id: 'vol-013',
    name: 'ml-training-data',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '2000',
    attachedInstance: 'ml-server-01',
    vpc: 'vpc-ml',
    status: 'attached',
    createdOn: '2024-03-12T07:30:00Z',
  },
  {
    id: 'vol-014',
    name: 'dev-workspace',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '120',
    attachedInstance: 'dev-server-01',
    vpc: 'vpc-development',
    status: 'attached',
    createdOn: '2024-03-15T15:20:00Z',
  },
  {
    id: 'vol-015',
    name: 'monitoring-logs',
    type: 'High-speed NVME SSD Storage (HNSS)',
    role: 'Storage',
    size: '90',
    attachedInstance: '-',
    vpc: 'vpc-monitoring',
    status: 'available',
    createdOn: '2024-03-18T12:45:00Z',
  },
];

// VMs data for VM backup option
const mockVMs = [
  {
    id: 'vm-001',
    name: 'web-server-01',
    vpc: 'vpc-main-prod',
    status: 'running',
  },
  {
    id: 'vm-002',
    name: 'db-server-01',
    vpc: 'vpc-main-prod',
    status: 'running',
  },
  {
    id: 'vm-003',
    name: 'staging-server-01',
    vpc: 'vpc-staging',
    status: 'running',
  },
  {
    id: 'vm-004',
    name: 'test-server-01',
    vpc: 'vpc-testing',
    status: 'running',
  },
  { id: 'vm-005', name: 'ml-server-01', vpc: 'vpc-ml', status: 'running' },
  {
    id: 'vm-006',
    name: 'dev-server-01',
    vpc: 'vpc-development',
    status: 'running',
  },
];

export default function CreateBackupPolicyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState(
    searchParams.get('volumeId') || ''
  );
  const [selectedVM, setSelectedVM] = useState('');
  const [backupType, setBackupType] = useState<'volume' | 'vm'>('volume');
  const [autoGeneratedName, setAutoGeneratedName] = useState('');
  const [maxBackups, setMaxBackups] = useState('5');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Policy scheduler state (simplified - "*" or empty means "any", filled means "specific")
  const [minute, setMinute] = useState('30');
  const [hour, setHour] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  const formRef = useRef<HTMLFormElement>(null);

  // Refs for form fields
  const customNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Generate CRON expression
  const generateCronExpression = () => {
    const monthMap: { [key: string]: string } = {
      Jan: '1',
      Feb: '2',
      Mar: '3',
      Apr: '4',
      May: '5',
      Jun: '6',
      Jul: '7',
      Aug: '8',
      Sep: '9',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };

    const cronMinute = minute.trim() === '' || minute === '*' ? '*' : minute;
    const cronHour = hour.trim() === '' || hour === '*' ? '*' : hour;
    const cronDayOfMonth =
      dayOfMonth.trim() === '' || dayOfMonth === '*' ? '*' : dayOfMonth;
    const cronMonth =
      month.trim() === '' || month === '*' ? '*' : monthMap[month] || month;
    const cronDayOfWeek =
      dayOfWeek.trim() === '' || dayOfWeek === '*' ? '*' : dayOfWeek;

    return `${cronMinute} ${cronHour} ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`;
  };

  // Generate CRON explanation with better logic
  const generateCronExplanation = () => {
    const conditions = [];

    // Build conditions based on what's specified (ignore "*" and empty values)
    if (minute.trim() !== '' && minute !== '*') {
      conditions.push(`at every ${minute} minutes`);
    }

    if (hour.trim() !== '' && hour !== '*') {
      conditions.push(`at hour ${hour}`);
    }

    if (dayOfMonth.trim() !== '' && dayOfMonth !== '*') {
      conditions.push(`on day ${dayOfMonth} of the month`);
    }

    if (month.trim() !== '' && month !== '*') {
      conditions.push(`in ${month}`);
    }

    if (dayOfWeek.trim() !== '' && dayOfWeek !== '*') {
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const dayName = dayNames[parseInt(dayOfWeek)] || `day ${dayOfWeek}`;
      conditions.push(`on ${dayName}`);
    }

    if (conditions.length === 0) {
      return 'This policy will run every minute (no constraints specified).';
    }

    if (conditions.length === 1) {
      return `This policy will run ${conditions[0]}.`;
    }

    return `This policy will run when all these conditions are met: ${conditions.join(', ')}.`;
  };

  // Calculate next backup number and name based on existing backups
  const generateBackupName = (
    resourceName: string,
    resourceType: 'volume' | 'vm'
  ) => {
    // Get existing backups for this resource (mock data - in real app this would come from API)
    const existingBackups = []; // Mock: no existing backups for now

    // Sort by creation date to understand backup sequence
    existingBackups.sort(
      (a, b) =>
        new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
    );

    let backupNumber: number;
    let backupTypeLabel: string;

    if (existingBackups.length === 0) {
      // First backup - always Primary with number 1
      backupNumber = 1;
      backupTypeLabel = 'Primary';
    } else {
      // Check how many backups exist
      const maxBackupsNum = parseInt(maxBackups);

      if (existingBackups.length < maxBackupsNum) {
        // We haven't reached the limit, continue numbering
        backupNumber = existingBackups.length + 1;
        backupTypeLabel = 'Delta';
      } else {
        // We've reached the limit, new backup gets max number
        backupNumber = maxBackupsNum;
        backupTypeLabel = 'Delta';
      }
    }

    // Generate name: resourcename-type-number
    const baseType = resourceType === 'vm' ? 'vm' : 'vol';
    return `${resourceName}-${baseType}-${backupTypeLabel.toLowerCase()}-${backupNumber}`;
  };

  // Update auto-generated name when volume/VM selection changes
  const handleResourceChange = (resourceId: string, type: 'volume' | 'vm') => {
    let resourceName = '';

    if (type === 'volume') {
      const volume = mockVolumes.find(v => v.id === resourceId);
      resourceName = volume?.name || '';
      setSelectedVolume(resourceId);
      setSelectedVM('');
    } else {
      const vm = mockVMs.find(v => v.id === resourceId);
      resourceName = vm?.name || '';
      setSelectedVM(resourceId);
      setSelectedVolume('');
    }

    if (resourceName) {
      const generatedName = generateBackupName(resourceName, type);
      setAutoGeneratedName(generatedName);
    }
  };

  // Update auto-generated name when max backups changes
  const handleMaxBackupsChange = (value: string) => {
    setMaxBackups(value);

    // Regenerate name with new max backups value
    let resourceName = '';
    if (selectedVolume) {
      const volume = mockVolumes.find(v => v.id === selectedVolume);
      resourceName = volume?.name || '';
    } else if (selectedVM) {
      const vm = mockVMs.find(v => v.id === selectedVM);
      resourceName = vm?.name || '';
    }

    if (resourceName) {
      const generatedName = generateBackupName(resourceName, 'volume'); // Assuming volume for now
      setAutoGeneratedName(generatedName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const customName = customNameRef.current?.value.trim() || '';
    const description = descriptionRef.current?.value.trim() || '';

    // Validate required fields
    if (selectedVolume === '') {
      setError('Please select a volume.');
      setLoading(false);
      return;
    }

    if (selectedVM === '') {
      setError('Please select a VM.');
      setLoading(false);
      return;
    }

    const finalName = customName || autoGeneratedName;
    if (!finalName) {
      setError('Policy name is required.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success toast
      toast({
        title: 'Backup Policy Created',
        description: `Policy "${finalName}" has been created successfully.`,
      });

      // Navigate back to backup list
      router.push('/storage/block?tab=backup');
    } catch (err) {
      setError('Failed to create backup policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title='Create Backup Policy'
      description='Create an automated backup policy for regular backups of your volumes or VMs.'
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

                {/* Backup Type Selection */}
                <div className='mb-8'>
                  <Label className='block mb-3 font-medium'>
                    Backup Type <span className='text-destructive'>*</span>
                  </Label>
                  <div className='grid grid-cols-2 gap-4'>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        backupType === 'volume'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setBackupType('volume')}
                    >
                      <div className='flex items-center space-x-2'>
                        <input
                          type='radio'
                          name='backupType'
                          value='volume'
                          checked={backupType === 'volume'}
                          onChange={() => {}}
                          className='text-primary'
                        />
                        <div>
                          <div className='font-medium'>Volume Backup</div>
                          <div className='text-sm text-muted-foreground'>
                            Create a backup of a specific volume
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        backupType === 'vm'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setBackupType('vm')}
                    >
                      <div className='flex items-center space-x-2'>
                        <input
                          type='radio'
                          name='backupType'
                          value='vm'
                          checked={backupType === 'vm'}
                          onChange={() => {}}
                          className='text-primary'
                        />
                        <div>
                          <div className='font-medium'>VM Backup</div>
                          <div className='text-sm text-muted-foreground'>
                            Create a backup of an entire virtual machine
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Selection and Configuration in one row */}
                <div className='grid grid-cols-2 gap-4 mb-5'>
                  {/* Resource Selection */}
                  {backupType === 'volume' ? (
                    <div>
                      <div className='flex items-center gap-2 mb-2'>
                        <Label htmlFor='volume' className='font-medium'>
                          Select Volume{' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <TooltipWrapper
                          content='Only volumes that are available or attached can be backed up.'
                          side='top'
                        >
                          <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                        </TooltipWrapper>
                      </div>
                      <Select
                        value={selectedVolume}
                        onValueChange={value =>
                          handleResourceChange(value, 'volume')
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select a volume' />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVolumes
                            .filter(volume => volume.status !== 'creating') // Only show available volumes
                            .map(volume => (
                              <SelectItem key={volume.id} value={volume.id}>
                                {volume.name} ({volume.id}) - {volume.size}GB -{' '}
                                {volume.status}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <div className='flex items-center gap-2 mb-2'>
                        <Label htmlFor='vm' className='font-medium'>
                          Select Virtual Machine{' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <TooltipWrapper
                          content='VM backups capture the entire machine state including all attached volumes.'
                          side='top'
                        >
                          <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                        </TooltipWrapper>
                      </div>
                      <Select
                        value={selectedVM}
                        onValueChange={value =>
                          handleResourceChange(value, 'vm')
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select a virtual machine' />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVMs.map(vm => (
                            <SelectItem key={vm.id} value={vm.id}>
                              {vm.name} ({vm.id}) - {vm.vpc} - {vm.status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Maximum Backups */}
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <Label htmlFor='maxBackups' className='font-medium'>
                        Maximum Backups{' '}
                        <span className='text-destructive'>*</span>
                      </Label>
                      <TooltipWrapper
                        content='When this limit is reached, the oldest backup (except Primary) will be replaced.'
                        side='top'
                      >
                        <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                      </TooltipWrapper>
                    </div>
                    <Select
                      value={maxBackups}
                      onValueChange={handleMaxBackupsChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1} backup{i + 1 > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Auto-generated Name Display */}
                {autoGeneratedName && (
                  <div className='mb-5'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Label className='font-medium'>Auto-generated Name</Label>
                      <TooltipWrapper
                        content='This name follows the automatic naming convention. You can override it below.'
                        side='top'
                      >
                        <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                      </TooltipWrapper>
                    </div>
                    <div className='bg-muted p-3 rounded-md'>
                      <code className='text-sm font-mono'>
                        {autoGeneratedName}
                      </code>
                    </div>
                  </div>
                )}

                {/* Custom Name Override */}
                <div className='mb-5'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Label htmlFor='customName' className='font-medium'>
                      Policy Name <span className='text-destructive'>*</span>
                    </Label>
                    <TooltipWrapper
                      content='Only alphanumeric characters, hyphens, and underscores allowed.'
                      side='top'
                    >
                      <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                    </TooltipWrapper>
                  </div>
                  <Input
                    id='customName'
                    ref={customNameRef}
                    placeholder='Enter custom policy name'
                    className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    required
                  />
                </div>

                {/* Description */}
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
                    placeholder='Enter policy description'
                    className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]'
                  />
                </div>

                {/* Policy Scheduler */}
                <div className='mb-5'>
                  <Label className='block mb-3 font-medium'>
                    Policy Scheduler <span className='text-destructive'>*</span>
                  </Label>

                  <div className='space-y-4'>
                    <div className='text-sm text-muted-foreground mb-4'>
                      Leave fields empty for "any" value, or fill in specific
                      values to create constraints. All specified constraints
                      must be met.
                    </div>

                    <div className='grid grid-cols-3 gap-4'>
                      {/* Minute */}
                      <div>
                        <Label className='text-sm font-medium mb-2 block'>
                          Minute{' '}
                          <span className='text-xs text-muted-foreground'>
                            (0-59)
                          </span>
                        </Label>
                        <Input
                          type='number'
                          value={minute}
                          onChange={e => setMinute(e.target.value)}
                          placeholder='Any minute'
                          min='0'
                          max='59'
                          className='text-sm h-8'
                        />
                      </div>

                      {/* Hour */}
                      <div>
                        <Label className='text-sm font-medium mb-2 block'>
                          Hour{' '}
                          <span className='text-xs text-muted-foreground'>
                            (0-23)
                          </span>
                        </Label>
                        <Input
                          type='number'
                          value={hour}
                          onChange={e => setHour(e.target.value)}
                          placeholder='Any hour'
                          min='0'
                          max='23'
                          className='text-sm h-8'
                        />
                      </div>

                      {/* Day */}
                      <div>
                        <Label className='text-sm font-medium mb-2 block'>
                          Day{' '}
                          <span className='text-xs text-muted-foreground'>
                            (1-31)
                          </span>
                        </Label>
                        <Select
                          value={dayOfMonth}
                          onValueChange={setDayOfMonth}
                        >
                          <SelectTrigger className='h-8 text-sm'>
                            <SelectValue placeholder='Any day' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='*'>Any day</SelectItem>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Month */}
                      <div>
                        <Label className='text-sm font-medium mb-2 block'>
                          Month
                        </Label>
                        <Select value={month} onValueChange={setMonth}>
                          <SelectTrigger className='h-8 text-sm'>
                            <SelectValue placeholder='Any month' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='*'>Any month</SelectItem>
                            {[
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ].map(m => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Day of Week */}
                      <div>
                        <Label className='text-sm font-medium mb-2 block'>
                          Weekday
                        </Label>
                        <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                          <SelectTrigger className='h-8 text-sm'>
                            <SelectValue placeholder='Any weekday' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='*'>Any weekday</SelectItem>
                            {[
                              { value: '0', label: 'Sunday' },
                              { value: '1', label: 'Monday' },
                              { value: '2', label: 'Tuesday' },
                              { value: '3', label: 'Wednesday' },
                              { value: '4', label: 'Thursday' },
                              { value: '5', label: 'Friday' },
                              { value: '6', label: 'Saturday' },
                            ].map(day => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Common Examples */}
                    <div className='bg-blue-50 p-3 rounded-lg mt-4'>
                      <h4 className='text-sm font-medium mb-2'>
                        Common Examples:
                      </h4>
                      <div className='text-xs space-y-1 text-muted-foreground'>
                        <div>
                          • <strong>Every 30 minutes:</strong> Minute: 30, leave
                          others empty
                        </div>
                        <div>
                          • <strong>Daily at 2:30 AM:</strong> Minute: 30, Hour:
                          2, leave others empty
                        </div>
                        <div>
                          • <strong>Weekly backup on Sunday at 3:00 AM:</strong>{' '}
                          Minute: 0, Hour: 3, Weekday: Sunday
                        </div>
                        <div>
                          • <strong>Monthly on 1st at midnight:</strong> Minute:
                          0, Hour: 0, Day: 1
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generated CRON Expression */}
                  <div className='bg-muted/50 p-3 rounded-lg mt-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium'>
                        CRON Expression:
                      </span>
                      <TooltipWrapper
                        content='Copy CRON expression to clipboard'
                        side='left'
                        align='center'
                        inModal={true}
                      >
                        <button
                          type='button'
                          className='p-1 hover:bg-muted/50 rounded transition-colors'
                          onClick={() => {
                            navigator.clipboard.writeText(
                              generateCronExpression()
                            );
                            toast({
                              title: 'CRON expression copied',
                              description:
                                'The CRON expression has been copied to your clipboard.',
                            });
                          }}
                        >
                          <Copy className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer' />
                        </button>
                      </TooltipWrapper>
                    </div>
                    <code className='text-primary font-mono text-sm bg-white px-2 py-1 rounded border'>
                      {generateCronExpression()}
                    </code>
                    <p className='text-xs text-muted-foreground mt-2'>
                      {generateCronExplanation()}
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className='flex justify-end gap-3 pt-6 border-t'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.push('/storage/block?tab=backup')}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={loading}>
                    {loading ? 'Creating Policy...' : 'Create Policy'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className='w-80 flex-shrink-0 space-y-6'>
          {/* Configuration Tips */}
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Best Practices</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Schedule backups during low-traffic periods for better
                    performance
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Set appropriate retention limits to balance protection and
                    storage costs
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Use descriptive names to easily identify policy purpose
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Backup Pricing Summary */}
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
                <h3 className='text-base font-semibold'>
                  Backup Pricing Summary
                </h3>
              </div>
            </div>
            <div>
              <div className='space-y-3'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-2xl font-bold'>₹10.00</span>
                  <span className='text-sm text-muted-foreground'>
                    per GB per month
                  </span>
                </div>
                <div className='text-xs text-muted-foreground pt-2 border-t'>
                  <p>• Policy Management: ₹1.00/month</p>
                  <p>• Backup Storage: ₹0.10/GB/month</p>
                  <p>• Automated Execution: ₹0.10/run</p>
                  <p>• Estimated based on policy configuration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
