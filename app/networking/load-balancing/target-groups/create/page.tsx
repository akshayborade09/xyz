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
import { vpcs } from '@/lib/data';
import { Search, Check, HelpCircle, ChevronDown } from 'lucide-react';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { CreateVPCModal } from '@/components/modals/vm-creation-modals';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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

export default function CreateTargetGroupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    targetGroupName: '',
    vpc: '',
    healthCheckName: '',
    protocol: '',
    healthCheckPath: '',
    healthCheckInterval: '',
    timeout: '',
    maxRetries: '',
    selectedVMs: [] as string[],
    vmWeights: {} as Record<string, number>,
    portNumber: '',
  });

  // Modal states
  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false);

  // VPC selector state
  const [vpcSelectorOpen, setVpcSelectorOpen] = useState(false);
  const [vpcSearchTerm, setVpcSearchTerm] = useState('');

  // State to track if form has been interacted with
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get VMs filtered by selected VPC (for now, show all VMs when VPC is selected)
  const filteredVMs = formData.vpc ? mockVMs : [];

  // Filter VPCs based on search term
  const filteredVPCs = vpcs.filter(
    vpc =>
      vpc.name.toLowerCase().includes(vpcSearchTerm.toLowerCase()) ||
      vpc.id.toLowerCase().includes(vpcSearchTerm.toLowerCase())
  );

  // Function to check if all mandatory fields are filled
  const isFormValid = () => {
    const hasValidTargetGroupName = formData.targetGroupName.trim().length > 0;
    const hasValidVpc = formData.vpc.length > 0;
    const hasValidHealthCheckName = formData.healthCheckName.trim().length > 0;
    const hasValidProtocol = formData.protocol.length > 0;
    const hasValidInterval =
      formData.healthCheckInterval.trim().length > 0 &&
      !isNaN(Number(formData.healthCheckInterval));
    const hasValidTimeout =
      formData.timeout.trim().length > 0 && !isNaN(Number(formData.timeout));
    const hasValidMaxRetries =
      formData.maxRetries.trim().length > 0 &&
      !isNaN(Number(formData.maxRetries));
    const hasValidPortNumber =
      formData.portNumber.trim().length > 0 &&
      !isNaN(Number(formData.portNumber));
    const hasSelectedVMs = formData.selectedVMs.length > 0;

    return (
      hasValidTargetGroupName &&
      hasValidVpc &&
      hasValidHealthCheckName &&
      hasValidProtocol &&
      hasValidInterval &&
      hasValidTimeout &&
      hasValidMaxRetries &&
      hasValidPortNumber &&
      hasSelectedVMs
    );
  };

  // Handle VPC creation
  const handleVPCCreated = (vpcId: string) => {
    setFormData(prev => ({
      ...prev,
      vpc: vpcId,
      selectedVMs: [], // Clear selected VMs when VPC changes
      vmWeights: {}, // Clear weights when VPC changes
    }));
    setShowCreateVPCModal(false);
  };

  // Close VPC selector on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vpcSelectorOpen) {
        setVpcSelectorOpen(false);
        setVpcSearchTerm('');
      }
    };

    if (vpcSelectorOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [vpcSelectorOpen]);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormTouched(true);
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormTouched(true);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear selected VMs when VPC changes
    if (field === 'vpc') {
      setFormData(prev => ({
        ...prev,
        selectedVMs: [],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    if (!isFormValid()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success toast
      toast({
        title: 'Target group created successfully',
        description: `Target Group "${formData.targetGroupName}" has been created with ${formData.selectedVMs.length} targets.`,
      });

      // Redirect to target groups list
      router.push('/networking/load-balancing/target-groups');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create target group. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/networking/load-balancing/target-groups');
  };

  return (
    <PageLayout
      title='Create Target Group'
      description='Configure and create a new target group for your load balancer'
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                {/* Basic Configuration */}
                <div className='mb-8'>
                  <div className='mb-5'>
                    <Label
                      htmlFor='targetGroupName'
                      className='block mb-2 font-medium'
                    >
                      Target Group Name{' '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='targetGroupName'
                      placeholder='Enter target group name'
                      value={formData.targetGroupName}
                      onChange={handleInputChange('targetGroupName')}
                      className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formTouched && !formData.targetGroupName.trim()
                          ? 'border-red-300 bg-red-50'
                          : ''
                      }`}
                      required
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Only alphanumeric characters, hyphens, and underscores
                      allowed.
                    </p>
                  </div>

                  {/* VPC Selector */}
                  <div className='mb-5'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Label className='font-medium'>
                        VPC <span className='text-destructive'>*</span>
                      </Label>
                      <TooltipWrapper
                        content='Select the Virtual Private Cloud where your target group will be deployed. This determines the network scope and security boundaries.'
                        side='top'
                      >
                        <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                      </TooltipWrapper>
                    </div>
                    <div className='relative'>
                      <button
                        type='button'
                        onClick={() => setVpcSelectorOpen(!vpcSelectorOpen)}
                        className={`w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          formTouched && !formData.vpc
                            ? 'border-red-300 bg-red-50'
                            : ''
                        }`}
                      >
                        <span
                          className={
                            vpcs.find(vpc => vpc.id === formData.vpc)
                              ? 'text-foreground'
                              : '!text-[#64748b]'
                          }
                        >
                          {vpcs.find(vpc => vpc.id === formData.vpc)
                            ? `${vpcs.find(vpc => vpc.id === formData.vpc)?.name} (${vpcs.find(vpc => vpc.id === formData.vpc)?.region})`
                            : 'Select VPC to isolate your target group'}
                        </span>
                        <ChevronDown className='h-4 w-4 opacity-50' />
                      </button>
                      {vpcSelectorOpen && (
                        <div
                          className='absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md'
                          onClick={e => e.stopPropagation()}
                        >
                          <div className='p-2 border-b'>
                            <div className='relative'>
                              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                              <Input
                                placeholder='Search VPCs...'
                                value={vpcSearchTerm}
                                onChange={e => setVpcSearchTerm(e.target.value)}
                                className='pl-8'
                              />
                            </div>
                          </div>
                          <div className='p-1'>
                            <button
                              type='button'
                              onClick={e => {
                                e.stopPropagation();
                                setShowCreateVPCModal(true);
                                setVpcSelectorOpen(false);
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
                                  setFormTouched(true);
                                  setFormData(prev => ({
                                    ...prev,
                                    vpc: vpc.id,
                                    selectedVMs: [], // Clear selected VMs when VPC changes
                                    vmWeights: {}, // Clear weights when VPC changes
                                  }));
                                  setVpcSelectorOpen(false);
                                  setVpcSearchTerm('');
                                }}
                                className='w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm'
                              >
                                <div className='flex flex-col items-start'>
                                  <span className='font-medium'>
                                    {vpc.name}
                                  </span>
                                  <span className='text-xs text-muted-foreground'>
                                    {vpc.id} • {vpc.region}
                                  </span>
                                </div>
                                {formData.vpc === vpc.id && (
                                  <Check className='h-4 w-4' />
                                )}
                              </button>
                            ))}
                            {filteredVPCs.length === 0 && vpcSearchTerm && (
                              <div className='px-2 py-2 text-sm text-muted-foreground'>
                                No VPCs found matching "{vpcSearchTerm}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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

                      <div>
                        <Label
                          htmlFor='protocol'
                          className='block mb-2 font-medium'
                        >
                          Protocol <span className='text-destructive'>*</span>
                        </Label>
                        <Select
                          value={formData.protocol}
                          onValueChange={handleSelectChange('protocol')}
                        >
                          <SelectTrigger
                            className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                              formTouched && !formData.protocol
                                ? 'border-red-300 bg-red-50'
                                : ''
                            }`}
                          >
                            <SelectValue placeholder='Select protocol' />
                          </SelectTrigger>
                          <SelectContent>
                            {protocols.map(protocol => (
                              <SelectItem key={protocol} value={protocol}>
                                {protocol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

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

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <Label
                          htmlFor='healthCheckInterval'
                          className='block mb-2 font-medium'
                        >
                          Health Check Interval (seconds){' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='healthCheckInterval'
                          type='number'
                          placeholder='30'
                          min='5'
                          max='300'
                          value={formData.healthCheckInterval}
                          onChange={handleInputChange('healthCheckInterval')}
                          className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            formTouched &&
                            (!formData.healthCheckInterval.trim() ||
                              isNaN(Number(formData.healthCheckInterval)))
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor='timeout'
                          className='block mb-2 font-medium'
                        >
                          Timeout (seconds){' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='timeout'
                          type='number'
                          placeholder='5'
                          min='1'
                          max='60'
                          value={formData.timeout}
                          onChange={handleInputChange('timeout')}
                          className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            formTouched &&
                            (!formData.timeout.trim() ||
                              isNaN(Number(formData.timeout)))
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }`}
                          required
                        />
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
                          placeholder='3'
                          min='1'
                          max='10'
                          value={formData.maxRetries}
                          onChange={handleInputChange('maxRetries')}
                          className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            formTouched &&
                            (!formData.maxRetries.trim() ||
                              isNaN(Number(formData.maxRetries)))
                              ? 'border-red-300 bg-red-50'
                              : ''
                          }`}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Select Targets Section */}
                <div className='mb-8'>
                  <h3 className='text-lg font-semibold mb-4'>Select Targets</h3>

                  <div className='space-y-5'>
                    <div>
                      <Label className='block mb-2 font-medium'>
                        Select VMs <span className='text-destructive'>*</span>
                      </Label>
                      {formData.vpc ? (
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
                                  const allActiveSelected = activeVMs.every(
                                    vm => formData.selectedVMs.includes(vm.id)
                                  );

                                  if (allActiveSelected) {
                                    // Deselect all active VMs
                                    setFormData(prev => ({
                                      ...prev,
                                      selectedVMs: prev.selectedVMs.filter(
                                        id =>
                                          !activeVMs.some(vm => vm.id === id)
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
                                  const allActiveSelected = activeVMs.every(
                                    vm => formData.selectedVMs.includes(vm.id)
                                  );
                                  return allActiveSelected
                                    ? 'Deselect All'
                                    : 'Select All';
                                })()}{' '}
                                (
                                {
                                  filteredVMs.filter(
                                    vm => vm.status === 'active'
                                  ).length
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
                          ) : (
                            <div className='text-center text-muted-foreground py-8 border-2 border-dashed border-gray-200 rounded-lg'>
                              <p>No VMs available in selected VPC</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='text-center text-muted-foreground py-12 border-2 border-dashed border-gray-200 rounded-lg'>
                          <div className='flex flex-col items-center space-y-3'>
                            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
                              <svg
                                className='w-6 h-6 text-gray-400'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                />
                              </svg>
                            </div>
                            <div>
                              <p className='text-sm font-medium text-gray-900'>
                                No VPC Selected
                              </p>
                              <p className='text-xs text-gray-500 mt-1'>
                                Please select a VPC above to view available VMs
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {formTouched && formData.selectedVMs.length === 0 && (
                        <p className='text-xs text-red-600 mt-1'>
                          Please select at least one VM
                        </p>
                      )}
                    </div>

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
                        placeholder='80'
                        min='1'
                        max='65535'
                        value={formData.portNumber}
                        onChange={handleInputChange('portNumber')}
                        className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          formTouched &&
                          (!formData.portNumber.trim() ||
                            isNaN(Number(formData.portNumber)))
                            ? 'border-red-300 bg-red-50'
                            : ''
                        }`}
                        required
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        Port number for target traffic (1-65535)
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className='flex justify-end space-x-4 pt-6 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className='min-w-[140px]'
              >
                {isSubmitting ? 'Creating...' : 'Create Target Group'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='w-full md:w-80 space-y-6'>
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
                    Target Group cannot be empty, and must consist of 1 or more
                    active VMs, to be attached to a load balancer.
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Creation of target group is free, and has no extra charges.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create VPC Modal */}
      <CreateVPCModal
        open={showCreateVPCModal}
        onClose={() => setShowCreateVPCModal(false)}
        onSuccess={handleVPCCreated}
      />
    </PageLayout>
  );
}
