'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { PageLayout } from '@/components/page-layout';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { vpcs, targetGroups } from '@/lib/data';
import { Search, Check, HelpCircle, ChevronDown } from 'lucide-react';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { StatusBadge } from '@/components/status-badge';

// Mock VMs data for selection
const mockVMs = [
  {
    id: 'krn:vm:colo-2-accept-001',
    name: 'masakari-testing',
    status: 'active',
  },
  {
    id: 'krn:vm:colo-2-accept-002',
    name: 'simple-instance3',
    status: 'active',
  },
  { id: 'krn:vm:colo-2-accept-003', name: 'vmsep3-1', status: 'stopped' },
  {
    id: 'krn:vm:colo-2-accept-004',
    name: 'instance-config-2',
    status: 'in-progress',
  },
  {
    id: 'krn:vm:colo-2-accept-005',
    name: 'instance-config-2',
    status: 'active',
  },
];

const protocols = ['HTTP', 'TCP'];

export default function EditTargetGroupPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  // Find the target group to edit
  const targetGroup = targetGroups.find(tg => tg.id === params.id);

  if (!targetGroup) {
    router.push('/networking/load-balancing/target-groups');
    return null;
  }

  const [formData, setFormData] = useState({
    targetGroupName: targetGroup.name,
    vpc: targetGroup.vpc,
    healthCheckName: targetGroup.healthCheck.name || '',
    protocol: targetGroup.healthCheck.protocol,
    healthCheckPath: targetGroup.healthCheck.path || '',
    healthCheckInterval: targetGroup.healthCheck.interval.toString(),
    timeout: targetGroup.healthCheck.timeout.toString(),
    maxRetries: '3', // Default value
    selectedVMs: targetGroup.members?.map(member => member.id) || [],
    vmWeights:
      targetGroup.members?.reduce(
        (acc, member) => {
          acc[member.id] = 100; // Default weight
          return acc;
        },
        {} as Record<string, number>
      ) || {},
    portNumber: targetGroup.port.toString(),
  });

  // State to track if form has been interacted with
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get VMs filtered by selected VPC (for now, show all VMs when VPC is selected)
  const filteredVMs = formData.vpc ? mockVMs : [];

  // Function to check if all mandatory fields are filled
  const isFormValid = () => {
    return (
      formData.healthCheckName?.trim().length > 0 &&
      formData.healthCheckInterval?.length > 0 &&
      formData.timeout?.length > 0 &&
      formData.maxRetries?.length > 0 &&
      formData.selectedVMs.length > 0 &&
      formData.portNumber?.length > 0
    );
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormTouched(true);
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormTouched(true);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Target Group Updated',
        description: `Target Group "${formData.targetGroupName}" has been updated successfully`,
      });

      router.push(`/networking/load-balancing/target-groups/${params.id}`);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update target group. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/networking', title: 'Networking' },
    { href: '/networking/load-balancing', title: 'Load Balancers' },
    {
      href: '/networking/load-balancing/target-groups',
      title: 'Target Groups',
    },
    {
      href: `/networking/load-balancing/target-groups/${params.id}`,
      title: targetGroup.name,
    },
    {
      href: `/networking/load-balancing/target-groups/${params.id}/edit`,
      title: 'Edit',
    },
  ];

  return (
    <PageLayout
      title={`Edit Target Group - ${targetGroup.name}`}
      customBreadcrumbs={customBreadcrumbs}
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div className='mb-8'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Basic Information
                  </h3>

                  <div className='space-y-5'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {/* Target Group Name - Non-editable */}
                      <div>
                        <Label
                          htmlFor='targetGroupName'
                          className='block mb-2 font-medium'
                        >
                          Target Group Name{' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='targetGroupName'
                          value={formData.targetGroupName}
                          disabled
                          className='bg-gray-50 text-gray-600 cursor-not-allowed'
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                          Target Group name cannot be changed
                        </p>
                      </div>

                      {/* VPC - Non-editable */}
                      <div>
                        <Label htmlFor='vpc' className='block mb-2 font-medium'>
                          VPC <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='vpc'
                          value={
                            vpcs.find(vpc => vpc.id === formData.vpc)?.name ||
                            formData.vpc
                          }
                          disabled
                          className='bg-gray-50 text-gray-600 cursor-not-allowed'
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                          VPC cannot be changed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configure Health Checks Section */}
                <div className='mb-8'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Configure Health Checks
                  </h3>

                  <div className='space-y-5'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {/* Health Check Name - Editable */}
                      <div>
                        <Label
                          htmlFor='healthCheckName'
                          className='block mb-2 font-medium'
                        >
                          Health Check Name{' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='healthCheckName'
                          placeholder='Enter health check name'
                          value={formData.healthCheckName}
                          onChange={handleInputChange('healthCheckName')}
                          className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            formTouched && !formData.healthCheckName.trim()
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }`}
                          required
                        />
                      </div>

                      {/* Protocol - Non-editable */}
                      <div>
                        <Label
                          htmlFor='protocol'
                          className='block mb-2 font-medium'
                        >
                          Protocol <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='protocol'
                          value={formData.protocol}
                          disabled
                          className='bg-gray-50 text-gray-600 cursor-not-allowed'
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                          Protocol cannot be changed
                        </p>
                      </div>
                    </div>

                    {/* Health Check Path - Only show for HTTP */}
                    {formData.protocol === 'HTTP' && (
                      <div>
                        <Label
                          htmlFor='healthCheckPath'
                          className='block mb-2 font-medium'
                        >
                          Health Check Path
                        </Label>
                        <Input
                          id='healthCheckPath'
                          placeholder='/health'
                          value={formData.healthCheckPath}
                          onChange={handleInputChange('healthCheckPath')}
                          className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                          Path for health check endpoint (e.g., /health,
                          /api/health)
                        </p>
                      </div>
                    )}

                    {/* Health Check Settings - All editable */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <Label
                          htmlFor='healthCheckInterval'
                          className='block mb-2 font-medium'
                        >
                          Health Check Interval{' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='healthCheckInterval'
                          type='number'
                          min='5'
                          max='300'
                          placeholder='30'
                          value={formData.healthCheckInterval}
                          onChange={handleInputChange('healthCheckInterval')}
                          className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            formTouched && !formData.healthCheckInterval
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }`}
                          required
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                          Seconds (5-300)
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor='timeout'
                          className='block mb-2 font-medium'
                        >
                          Timeout <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='timeout'
                          type='number'
                          min='1'
                          max='120'
                          placeholder='10'
                          value={formData.timeout}
                          onChange={handleInputChange('timeout')}
                          className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            formTouched && !formData.timeout
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }`}
                          required
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                          Seconds (1-120)
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor='maxRetries'
                          className='block mb-2 font-medium'
                        >
                          Max Retries{' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='maxRetries'
                          type='number'
                          min='1'
                          max='10'
                          placeholder='3'
                          value={formData.maxRetries}
                          onChange={handleInputChange('maxRetries')}
                          className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            formTouched && !formData.maxRetries
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }`}
                          required
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                          Attempts (1-10)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Select Targets Section */}
                <div className='mb-8'>
                  <h3 className='text-lg font-semibold mb-4'>Select Targets</h3>

                  <div className='space-y-5'>
                    {/* Port Number - Editable */}
                    <div>
                      <Label
                        htmlFor='portNumber'
                        className='block mb-2 font-medium'
                      >
                        Port Number <span className='text-destructive'>*</span>
                      </Label>
                      <Input
                        id='portNumber'
                        type='number'
                        min='1'
                        max='65535'
                        placeholder='80'
                        value={formData.portNumber}
                        onChange={handleInputChange('portNumber')}
                        className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          formTouched && !formData.portNumber
                            ? 'border-red-300 bg-red-50'
                            : ''
                        }`}
                        required
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        Port number for target group (1-65535)
                      </p>
                    </div>

                    {/* VM Selection - Fully editable */}
                    <div>
                      <Label className='block mb-2 font-medium'>
                        Select VMs <span className='text-destructive'>*</span>
                      </Label>
                      <div className='space-y-4'>
                        {/* Select All Button */}
                        {filteredVMs.length > 0 && (
                          <div className='flex items-center justify-between'>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setFormTouched(true);
                                const activeVMs = filteredVMs.filter(
                                  vm => vm.status === 'active'
                                );
                                const allActiveSelected = activeVMs.every(vm =>
                                  formData.selectedVMs.includes(vm.id)
                                );

                                if (allActiveSelected) {
                                  // Deselect all active VMs
                                  setFormData(prev => ({
                                    ...prev,
                                    selectedVMs: prev.selectedVMs.filter(
                                      id => !activeVMs.some(vm => vm.id === id)
                                    ),
                                    vmWeights: Object.fromEntries(
                                      Object.entries(prev.vmWeights).filter(
                                        ([id]) =>
                                          !activeVMs.some(vm => vm.id === id)
                                      )
                                    ),
                                  }));
                                } else {
                                  // Select all active VMs
                                  const defaultWeights = activeVMs.reduce(
                                    (acc, vm) => {
                                      acc[vm.id] = 100;
                                      return acc;
                                    },
                                    {} as Record<string, number>
                                  );
                                  setFormData(prev => ({
                                    ...prev,
                                    selectedVMs: [
                                      ...new Set([
                                        ...prev.selectedVMs,
                                        ...activeVMs.map(vm => vm.id),
                                      ]),
                                    ],
                                    vmWeights: {
                                      ...prev.vmWeights,
                                      ...defaultWeights,
                                    },
                                  }));
                                }
                              }}
                              className='text-sm'
                            >
                              {(() => {
                                const activeVMs = filteredVMs.filter(
                                  vm => vm.status === 'active'
                                );
                                const allActiveSelected = activeVMs.every(vm =>
                                  formData.selectedVMs.includes(vm.id)
                                );
                                return allActiveSelected
                                  ? 'Deselect All'
                                  : 'Select All';
                              })()}{' '}
                              (
                              {
                                filteredVMs.filter(vm => vm.status === 'active')
                                  .length
                              }{' '}
                              active)
                            </Button>
                            <span className='text-sm text-muted-foreground'>
                              {formData.selectedVMs.length} VM
                              {formData.selectedVMs.length !== 1
                                ? 's'
                                : ''}{' '}
                              selected
                            </span>
                          </div>
                        )}

                        {/* VM Selection Table */}
                        {filteredVMs.length > 0 ? (
                          <div>
                            <div className='[&_table]:table-fixed [&_th:first-child]:w-[40px] [&_td:first-child]:w-[40px] [&_th:first-child]:px-3 [&_td:first-child]:px-3 [&_td:first-child]:align-middle [&_th:first-child]:align-middle [&_td]:align-middle [&_th]:align-middle'>
                              <ShadcnDataTable
                                data={filteredVMs.map(vm => ({
                                  ...vm,
                                  isSelected: formData.selectedVMs.includes(
                                    vm.id
                                  ),
                                  weight: formData.vmWeights[vm.id] || 100,
                                  isActive: vm.status === 'active',
                                }))}
                                columns={[
                                  {
                                    key: 'select',
                                    label: '',
                                    render: (_: any, row: any) => {
                                      const isActive = row.status === 'active';
                                      const isDisabled = !isActive;

                                      return (
                                        <div className='flex items-center justify-center h-full'>
                                          <input
                                            type='checkbox'
                                            checked={row.isSelected}
                                            disabled={isDisabled}
                                            onChange={() => {
                                              if (isDisabled) {
                                                return;
                                              }

                                              setFormTouched(true);
                                              if (row.isSelected) {
                                                setFormData(prev => {
                                                  const newWeights = {
                                                    ...prev.vmWeights,
                                                  };
                                                  delete newWeights[row.id];
                                                  return {
                                                    ...prev,
                                                    selectedVMs:
                                                      prev.selectedVMs.filter(
                                                        id => id !== row.id
                                                      ),
                                                    vmWeights: newWeights,
                                                  };
                                                });
                                              } else {
                                                setFormData(prev => ({
                                                  ...prev,
                                                  selectedVMs: [
                                                    ...prev.selectedVMs,
                                                    row.id,
                                                  ],
                                                  vmWeights: {
                                                    ...prev.vmWeights,
                                                    [row.id]: 100,
                                                  },
                                                }));
                                              }
                                            }}
                                            className={`rounded border-gray-300 text-black focus:ring-black focus:ring-2 h-4 w-4 ${
                                              isDisabled
                                                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                                : 'cursor-pointer bg-white hover:bg-gray-50'
                                            }`}
                                          />
                                        </div>
                                      );
                                    },
                                  },
                                  {
                                    key: 'name',
                                    label: 'Name',
                                    sortable: true,
                                    render: (value: string, row: any) => (
                                      <div
                                        className={`font-medium text-sm ${
                                          row.isActive
                                            ? 'hover:underline cursor-pointer text-gray-900'
                                            : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                      >
                                        {value}
                                      </div>
                                    ),
                                  },

                                  {
                                    key: 'id',
                                    label: 'Id',
                                    sortable: true,
                                    render: (value: string, row: any) => (
                                      <div
                                        className={`text-sm font-mono ${
                                          row.isActive
                                            ? 'text-muted-foreground'
                                            : 'text-gray-300'
                                        }`}
                                      >
                                        {value}
                                      </div>
                                    ),
                                  },
                                  {
                                    key: 'status',
                                    label: 'Status',
                                    render: (value: string) => (
                                      <StatusBadge status={value} />
                                    ),
                                  },
                                ]}
                                searchable={false}
                                enableSearch={false}
                                pagination={false}
                                className='max-h-[400px]'
                              />
                            </div>
                          </div>
                        ) : (
                          <div className='text-center text-muted-foreground py-8 border-2 border-dashed border-gray-200 rounded-lg'>
                            <p>No VMs available in selected VPC</p>
                          </div>
                        )}
                      </div>
                      {formTouched && formData.selectedVMs.length === 0 && (
                        <p className='text-xs text-red-600 mt-1'>
                          Please select at least one VM
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className='flex justify-end space-x-3 pt-6 border-t'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      router.push(
                        `/networking/load-balancing/target-groups/${params.id}`
                      )
                    }
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={!isFormValid() || isSubmitting}
                    className='min-w-[120px]'
                  >
                    {isSubmitting ? 'Updating...' : 'Update Target Group'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Summary */}
        <div
          className='self-start'
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
              <h3 className='text-base font-semibold'>Configuration Summary</h3>
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between items-center gap-4'>
              <span className='text-sm text-gray-600'>Target Group Name</span>
              <span className='text-sm font-medium text-gray-900'>
                {formData.targetGroupName}
              </span>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <span className='text-sm text-gray-600'>VPC</span>
              <span className='text-sm font-medium text-gray-900'>
                {vpcs.find(vpc => vpc.id === formData.vpc)?.name ||
                  formData.vpc}
              </span>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <span className='text-sm text-gray-600'>Protocol</span>
              <span className='text-sm font-medium text-gray-900'>
                {formData.protocol}
              </span>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <span className='text-sm text-gray-600'>Port</span>
              <span className='text-sm font-medium text-gray-900'>
                {formData.portNumber}
              </span>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <span className='text-sm text-gray-600'>Health Check</span>
              <span className='text-sm font-medium text-gray-900'>
                {formData.healthCheckName}
              </span>
            </div>

            <div className='flex justify-between items-center gap-4'>
              <span className='text-sm text-gray-600'>Selected VMs</span>
              <span className='text-sm font-medium text-gray-900'>
                {formData.selectedVMs.length} VM
                {formData.selectedVMs.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className='pt-2 border-t border-gray-200'>
              <div className='space-y-2'>
                <div className='flex justify-between items-center gap-4'>
                  <span className='text-sm text-gray-600'>Interval</span>
                  <span className='text-sm font-medium text-gray-900'>
                    {formData.healthCheckInterval}s
                  </span>
                </div>
                <div className='flex justify-between items-center gap-4'>
                  <span className='text-sm text-gray-600'>Timeout</span>
                  <span className='text-sm font-medium text-gray-900'>
                    {formData.timeout}s
                  </span>
                </div>
                <div className='flex justify-between items-center gap-4'>
                  <span className='text-sm text-gray-600'>Max Retries</span>
                  <span className='text-sm font-medium text-gray-900'>
                    {formData.maxRetries}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
