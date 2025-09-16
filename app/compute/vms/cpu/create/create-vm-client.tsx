'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  HelpCircle,
  RefreshCw,
  Plus,
  X,
  ChevronDown,
  Search,
  Check,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  CreateVPCModal,
  CreateSSHKeyModal,
} from '@/components/modals/vm-creation-modals';

// Mock data
const vpcs = [
  { id: 'vpc-1', name: 'production-vpc', region: 'us-east-1' },
  { id: 'vpc-2', name: 'development-vpc', region: 'us-west-2' },
  { id: 'vpc-3', name: 'staging-vpc', region: 'us-east-1' },
];

const bootableVolumes = [
  {
    id: 'vol-1',
    name: 'ubuntu-22.04-boot',
    size: '20 GB',
    image: 'Ubuntu 22.04 LTS',
  },
  { id: 'vol-2', name: 'centos-8-boot', size: '25 GB', image: 'CentOS 8' },
];

const storageVolumes = [
  { id: 'vol-s1', name: 'data-storage-1', size: '100 GB' },
  { id: 'vol-s2', name: 'backup-storage', size: '500 GB' },
];

const machineImages = [
  { id: 'img-1', name: 'Ubuntu 22.04 LTS', type: 'Linux' },
  { id: 'img-2', name: 'CentOS 8', type: 'Linux' },
  { id: 'img-3', name: 'Windows Server 2022', type: 'Windows' },
];

const sshKeys = [
  { id: 'ssh-1', name: 'prod-admin-key' },
  { id: 'ssh-2', name: 'dev-key' },
  { id: 'ssh-3', name: 'backup-key' },
  { id: 'ssh-4', name: 'test-environment-key' },
  { id: 'ssh-5', name: 'deployment-key' },
];

const subnets = [
  {
    id: 'subnet-1',
    name: 'public-subnet-1',
    type: 'Public',
    cidr: '10.0.1.0/24',
  },
  {
    id: 'subnet-2',
    name: 'private-subnet-1',
    type: 'Private',
    cidr: '10.0.2.0/24',
  },
];

const reservedIPs = [
  { id: 'ip-1', address: '203.0.113.1', subnet: 'subnet-1', attached: false },
  { id: 'ip-2', address: '203.0.113.2', subnet: 'subnet-1', attached: false },
  { id: 'ip-3', address: '203.0.113.3', subnet: 'subnet-1', attached: true },
  { id: 'ip-4', address: '203.0.113.4', subnet: 'subnet-1', attached: false },
  { id: 'ip-5', address: '203.0.113.5', subnet: 'subnet-1', attached: false },
];

const securityGroups = [
  { id: 'sg-1', name: 'web-servers', description: 'Web server security group' },
  { id: 'sg-2', name: 'database', description: 'Database security group' },
];

interface FormData {
  name: string;
  vpcId: string;
  bootableVolumeType: 'existing' | 'new';
  existingBootableVolume: string;
  newBootableVolumeSize: string;
  newBootableVolumeImage: string;
  newBootableVolumeName: string;
  storageVolumeType: 'existing' | 'new' | 'none';
  existingStorageVolumes: string[];
  newStorageVolumeName: string;
  newStorageVolumeSize: string;
  newStorageVolumeType: 'ssd' | 'hdd';
  newStorageVolumeDescription: string;
  sshKeyId: string;
  startupScript: string;
  tags: { key: string; value: string }[];
  subnetId: string;
  ipAddressType: 'floating' | 'reserved';
  reservedIpId: string;
  securityGroupId: string;
  networkSpeed: string;
}

export default function CreateVMClient() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    vpcId: '',
    bootableVolumeType: 'existing',
    existingBootableVolume: '',
    newBootableVolumeSize: '20',
    newBootableVolumeImage: '',
    newBootableVolumeName: '',
    storageVolumeType: 'none',
    existingStorageVolumes: [],
    newStorageVolumeName: '',
    newStorageVolumeSize: '100',
    newStorageVolumeType: 'ssd',
    newStorageVolumeDescription: '',
    sshKeyId: '',
    startupScript: '',
    tags: [{ key: '', value: '' }],
    subnetId: '',
    ipAddressType: 'floating',
    reservedIpId: '',
    securityGroupId: '',
    networkSpeed: '100 Mbps',
  });

  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false);
  const [showCreateSSHKeyModal, setShowCreateSSHKeyModal] = useState(false);
  const [step, setStep] = useState<'form' | 'confirmation'>('form');

  const selectedVPC = vpcs.find(vpc => vpc.id === formData.vpcId);
  const selectedSubnet = subnets.find(
    subnet => subnet.id === formData.subnetId
  );
  const isPrivateSubnet = selectedSubnet?.type === 'Private';
  const showIPAddressType = selectedSubnet?.type === 'Public';
  const availableReservedIPs = reservedIPs.filter(
    ip => ip.subnet === formData.subnetId && !ip.attached
  );

  // Debug logging
  console.log('Debug IP Address Type:', {
    selectedSubnet,
    subnetId: formData.subnetId,
    showIPAddressType,
    selectedSubnetType: selectedSubnet?.type,
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { key: '', value: '' }],
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const updateTag = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) =>
        i === index ? { ...tag, [field]: value } : tag
      ),
    }));
  };

  const handleVPCCreated = (vpcId: string) => {
    handleInputChange('vpcId', vpcId);
    setShowCreateVPCModal(false);
  };

  const handleSSHKeyCreated = (sshKeyId: string) => {
    handleInputChange('sshKeyId', sshKeyId);
    setShowCreateSSHKeyModal(false);
  };

  const calculatePricing = () => {
    const basePricing = 12;
    let storagePricing = 0;
    if (formData.bootableVolumeType === 'new') {
      const bootableSize = parseInt(formData.newBootableVolumeSize) || 20;
      storagePricing += bootableSize * 0.05;
    }
    if (formData.storageVolumeType === 'new') {
      const storageSize = parseInt(formData.newStorageVolumeSize) || 100;
      storagePricing += storageSize * 0.03;
    }

    let ipPricing = 0;
    if (showIPAddressType) {
      if (formData.ipAddressType === 'floating') {
        ipPricing = 1;
      } else if (formData.ipAddressType === 'reserved') {
        ipPricing = 2;
      }
    } else if (selectedSubnet?.type === 'Public') {
      ipPricing = 1;
    }

    const total = basePricing + storagePricing + ipPricing;

    return {
      vm: basePricing,
      storage: storagePricing,
      ip: ipPricing,
      total: parseFloat(total.toFixed(2)),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'VM name is required.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.vpcId) {
      toast({
        title: 'Validation Error',
        description: 'VPC selection is required.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.subnetId) {
      toast({
        title: 'Validation Error',
        description: 'Subnet selection is required.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.sshKeyId) {
      toast({
        title: 'Validation Error',
        description: 'SSH key selection is required.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.securityGroupId) {
      toast({
        title: 'Validation Error',
        description: 'Security group selection is required.',
        variant: 'destructive',
      });
      return;
    }

    // Validate reserved IP if IP address type is reserved
    if (
      showIPAddressType &&
      formData.ipAddressType === 'reserved' &&
      !formData.reservedIpId
    ) {
      toast({
        title: 'Validation Error',
        description:
          'Reserved IP selection is required when using reserved IP type.',
        variant: 'destructive',
      });
      return;
    }

    if (step === 'form') {
      setStep('confirmation');
    } else {
      toast({
        title: 'VM creation initiated',
        description: `${formData.name} is being created. This may take a few minutes.`,
      });
      router.push('/compute/vms');
    }
  };

  const pricing = calculatePricing();

  if (step === 'confirmation') {
    return (
      <PageLayout
        title='Confirm VM Creation'
        description='Review your configuration and confirm VM creation'
      >
        <div className='max-w-4xl mx-auto'>
          <div
            className='mb-6'
            style={{
              borderRadius: '16px',
              border: '4px solid #FFF',
              background:
                'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
              boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
              padding: '1.5rem',
            }}
          >
            <div className='grid grid-cols-1 gap-6'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    VM Name
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {formData.name}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    VPC
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {selectedVPC?.name}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    SSH Key
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {sshKeys.find(k => k.id === formData.sshKeyId)?.name}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Security Group
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {
                      securityGroups.find(
                        sg => sg.id === formData.securityGroupId
                      )?.name
                    }
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Subnet
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {selectedSubnet?.name} ({selectedSubnet?.type})
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    IP Address Type
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {showIPAddressType
                      ? formData.ipAddressType === 'floating'
                        ? 'Floating IP'
                        : 'Reserved IP'
                      : selectedSubnet?.type === 'Public'
                        ? 'Floating IP (Default)'
                        : 'Private'}
                  </div>
                </div>
                {formData.ipAddressType === 'reserved' &&
                  formData.reservedIpId && (
                    <div className='space-y-1'>
                      <label
                        className='text-sm font-normal text-gray-700'
                        style={{ fontSize: '13px' }}
                      >
                        Reserved IP
                      </label>
                      <div className='font-medium' style={{ fontSize: '14px' }}>
                        {
                          reservedIPs.find(
                            ip => ip.id === formData.reservedIpId
                          )?.address
                        }
                      </div>
                    </div>
                  )}
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Machine Type
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    CPU VM (4 vCPU, 16 GB RAM, {formData.networkSpeed})
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Bootable Volume
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {formData.bootableVolumeType === 'existing'
                      ? `Existing (${bootableVolumes.find(v => v.id === formData.existingBootableVolume)?.name || 'Selected'})`
                      : `New (${formData.newBootableVolumeSize || '20'} GB)`}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Storage Volume
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {formData.storageVolumeType === 'none'
                      ? 'None'
                      : formData.storageVolumeType === 'existing'
                        ? `${formData.existingStorageVolumes.length} Selected`
                        : `New (${formData.newStorageVolumeSize || '100'} GB)`}
                  </div>
                </div>
                {formData.bootableVolumeType === 'new' &&
                  formData.newBootableVolumeImage && (
                    <div className='space-y-1'>
                      <label
                        className='text-sm font-normal text-gray-700'
                        style={{ fontSize: '13px' }}
                      >
                        Machine Image
                      </label>
                      <div className='font-medium' style={{ fontSize: '14px' }}>
                        {
                          machineImages.find(
                            img => img.id === formData.newBootableVolumeImage
                          )?.name
                        }
                      </div>
                    </div>
                  )}
                {formData.tags && formData.tags.length > 0 && (
                  <div className='space-y-1'>
                    <label
                      className='text-sm font-normal text-gray-700'
                      style={{ fontSize: '13px' }}
                    >
                      Tags
                    </label>
                    <div className='font-medium' style={{ fontSize: '14px' }}>
                      {formData.tags.filter(tag => tag.key).length > 0
                        ? `${formData.tags.filter(tag => tag.key).length} tag(s)`
                        : 'None'}
                    </div>
                  </div>
                )}
              </div>

              {formData.startupScript && (
                <div className='grid grid-cols-1 gap-4'>
                  <div className='space-y-1'>
                    <label
                      className='text-sm font-normal text-gray-700'
                      style={{ fontSize: '13px' }}
                    >
                      Startup Script
                    </label>
                    <div className='font-medium p-3 bg-gray-50 rounded border font-mono text-xs max-h-32 overflow-y-auto'>
                      {formData.startupScript}
                    </div>
                  </div>
                </div>
              )}

              <div className='pt-6'>
                <div
                  className='p-4 rounded-lg'
                  style={{
                    boxShadow: 'rgba(14, 114, 180, 0.1) 0px 0px 0px 1px inset',
                    background:
                      'linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)',
                  }}
                >
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-sm font-medium text-black'>
                      Cost Breakdown
                    </span>
                  </div>

                  <div className='space-y-3 mb-4'>
                    <div className='flex justify-between items-center'>
                      <label
                        className='text-sm font-normal text-black'
                        style={{ fontSize: '13px' }}
                      >
                        VM Cost
                      </label>
                      <div
                        className='font-semibold text-black'
                        style={{ fontSize: '16px' }}
                      >
                        ₹{pricing.vm}/hr
                      </div>
                    </div>
                    {pricing.storage > 0 && (
                      <div className='flex justify-between items-center'>
                        <label
                          className='text-sm font-normal text-black'
                          style={{ fontSize: '13px' }}
                        >
                          Storage Cost
                        </label>
                        <div
                          className='font-semibold text-black'
                          style={{ fontSize: '16px' }}
                        >
                          ₹{pricing.storage}/hr
                        </div>
                      </div>
                    )}
                    {pricing.ip > 0 && (
                      <div className='flex justify-between items-center'>
                        <label
                          className='text-sm font-normal text-black'
                          style={{ fontSize: '13px' }}
                        >
                          IP Address Cost
                        </label>
                        <div
                          className='font-semibold text-black'
                          style={{ fontSize: '16px' }}
                        >
                          ₹{pricing.ip}/hr
                        </div>
                      </div>
                    )}
                    <div className='flex justify-between items-center'>
                      <label
                        className='text-sm font-normal text-black'
                        style={{ fontSize: '13px' }}
                      >
                        Total Cost
                      </label>
                      <div className='font-bold text-black text-xl'>
                        ₹{pricing.total}/hr
                      </div>
                    </div>
                  </div>

                  <div
                    className='pt-4 border-t'
                    style={{ borderColor: 'rgba(14, 114, 180, 0.2)' }}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='text-black text-sm'>
                        Monthly estimate
                      </span>
                      <span className='text-black font-bold text-lg'>
                        ₹{(pricing.total * 24 * 30).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setStep('form')}
            >
              Back to Edit
            </Button>
            <Button
              onClick={handleSubmit}
              className='bg-black text-white hover:bg-black/90'
            >
              Create VM
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title='Create Virtual Machine'
      description='Configure and deploy a new virtual machine instance'
    >
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                {/* Basic Configuration */}
                <div className='space-y-6'>
                  <div>
                    <Label htmlFor='name' className='block mb-2 font-medium'>
                      VM Name <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='name'
                      placeholder='Enter VM name'
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      required
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Only alphanumeric characters, hyphens, and underscores
                      allowed.
                    </p>
                  </div>

                  <VPCSelectorInline
                    value={formData.vpcId}
                    onChange={value => {
                      if (value === '__create_new__') {
                        setShowCreateVPCModal(true);
                      } else {
                        handleInputChange('vpcId', value);
                      }
                    }}
                  />
                </div>

                {/* Volume Configuration */}
                <div className='space-y-6 mb-6'>
                  <Separator className='my-6' />
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold'>
                      Volume Configuration
                    </h3>
                  </div>

                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Bootable Volume */}
                    <Card className='p-6'>
                      <div className='space-y-6'>
                        <h4 className='text-base font-semibold text-gray-900'>
                          Bootable Volume
                        </h4>
                        <div className='space-y-4'>
                          <div className='space-y-4'>
                            <div className='flex items-start space-x-3'>
                              <input
                                type='radio'
                                id='existing-bootable'
                                name='bootableVolumeType'
                                checked={
                                  formData.bootableVolumeType === 'existing'
                                }
                                onChange={() =>
                                  handleInputChange(
                                    'bootableVolumeType',
                                    'existing'
                                  )
                                }
                                className='mt-1 h-4 w-4 accent-black border-gray-300 focus:ring-gray-900'
                              />
                              <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                  <Label
                                    htmlFor='existing-bootable'
                                    className='text-sm font-medium leading-relaxed cursor-pointer'
                                  >
                                    Select an existing bootable volume
                                  </Label>
                                  <TooltipWrapper content='Choose appropriate bootable volume for right OS'>
                                    <HelpCircle className='h-4 w-4 text-muted-foreground cursor-pointer' />
                                  </TooltipWrapper>
                                </div>
                              </div>
                            </div>
                            {formData.bootableVolumeType === 'existing' && (
                              <div className='ml-8 pt-2'>
                                <Select
                                  value={formData.existingBootableVolume}
                                  onValueChange={value =>
                                    handleInputChange(
                                      'existingBootableVolume',
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select bootable volume' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {bootableVolumes.map(volume => (
                                      <SelectItem
                                        key={volume.id}
                                        value={volume.id}
                                      >
                                        {volume.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          <div className='space-y-4'>
                            <div className='flex items-start space-x-3'>
                              <input
                                type='radio'
                                id='new-bootable'
                                name='bootableVolumeType'
                                checked={formData.bootableVolumeType === 'new'}
                                onChange={() =>
                                  handleInputChange('bootableVolumeType', 'new')
                                }
                                className='mt-1 h-4 w-4 accent-black border-gray-300 focus:ring-gray-900'
                              />
                              <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                  <Label
                                    htmlFor='new-bootable'
                                    className='text-sm font-medium leading-relaxed cursor-pointer'
                                  >
                                    Create a new bootable volume
                                  </Label>
                                  <TooltipWrapper content='Create a fresh bootable volume with your preferred machine image'>
                                    <HelpCircle className='h-4 w-4 text-muted-foreground cursor-pointer' />
                                  </TooltipWrapper>
                                </div>
                              </div>
                            </div>
                            {formData.bootableVolumeType === 'new' && (
                              <div className='ml-8 pt-2 space-y-4'>
                                <div>
                                  <Label
                                    htmlFor='bootable-name'
                                    className='block mb-2 text-sm font-medium'
                                  >
                                    Volume Name{' '}
                                    <span className='text-destructive'>*</span>
                                  </Label>
                                  <Input
                                    id='bootable-name'
                                    placeholder='Enter bootable volume name'
                                    value={formData.newBootableVolumeName}
                                    onChange={e =>
                                      handleInputChange(
                                        'newBootableVolumeName',
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                  <div>
                                    <Label
                                      htmlFor='bootable-size'
                                      className='block mb-2 text-sm font-medium'
                                    >
                                      Size (GB)
                                    </Label>
                                    <Input
                                      id='bootable-size'
                                      type='number'
                                      value={formData.newBootableVolumeSize}
                                      onChange={e =>
                                        handleInputChange(
                                          'newBootableVolumeSize',
                                          e.target.value
                                        )
                                      }
                                      min='10'
                                      max='1000'
                                      placeholder='20'
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor='machine-image'
                                      className='block mb-2 text-sm font-medium'
                                    >
                                      Machine Image
                                    </Label>
                                    <Select
                                      value={formData.newBootableVolumeImage}
                                      onValueChange={value =>
                                        handleInputChange(
                                          'newBootableVolumeImage',
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder='Select machine image' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {machineImages.map(image => (
                                          <SelectItem
                                            key={image.id}
                                            value={image.id}
                                          >
                                            {image.name} ({image.type})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Storage Volume */}
                    <Card className='p-6'>
                      <div className='space-y-6'>
                        <h4 className='text-base font-semibold text-gray-900'>
                          Storage Volume
                        </h4>
                        <div className='space-y-4'>
                          <div className='space-y-4'>
                            <div className='flex items-start space-x-3'>
                              <input
                                type='radio'
                                id='no-storage'
                                name='storageVolumeType'
                                checked={formData.storageVolumeType === 'none'}
                                onChange={() =>
                                  handleInputChange('storageVolumeType', 'none')
                                }
                                className='mt-1 h-4 w-4 accent-black border-gray-300 focus:ring-gray-900'
                              />
                              <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                  <Label
                                    htmlFor='no-storage'
                                    className='text-sm font-medium leading-relaxed cursor-pointer'
                                  >
                                    No additional storage
                                  </Label>
                                  <TooltipWrapper content='Choose appropriate storage size for your workload'>
                                    <HelpCircle className='h-4 w-4 text-muted-foreground cursor-pointer' />
                                  </TooltipWrapper>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='space-y-4'>
                            <div className='flex items-start space-x-3'>
                              <input
                                type='radio'
                                id='existing-storage'
                                name='storageVolumeType'
                                checked={
                                  formData.storageVolumeType === 'existing'
                                }
                                onChange={() =>
                                  handleInputChange(
                                    'storageVolumeType',
                                    'existing'
                                  )
                                }
                                className='mt-1 h-4 w-4 accent-black border-gray-300 focus:ring-gray-900'
                              />
                              <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                  <Label
                                    htmlFor='existing-storage'
                                    className='text-sm font-medium leading-relaxed cursor-pointer'
                                  >
                                    Select existing storage volumes
                                  </Label>
                                  <TooltipWrapper content='Attach one or more existing storage volumes to this VM'>
                                    <HelpCircle className='h-4 w-4 text-muted-foreground cursor-pointer' />
                                  </TooltipWrapper>
                                </div>
                              </div>
                            </div>
                            {formData.storageVolumeType === 'existing' && (
                              <div className='ml-8 pt-2'>
                                <Label className='block mb-2 text-sm font-medium'>
                                  Select Storage Volumes
                                </Label>
                                <Select
                                  value={
                                    formData.existingStorageVolumes.length > 0
                                      ? formData.existingStorageVolumes[0]
                                      : ''
                                  }
                                  onValueChange={value => {
                                    if (
                                      value &&
                                      !formData.existingStorageVolumes.includes(
                                        value
                                      )
                                    ) {
                                      handleInputChange(
                                        'existingStorageVolumes',
                                        [
                                          ...formData.existingStorageVolumes,
                                          value,
                                        ]
                                      );
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select storage volumes' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {storageVolumes.map(volume => (
                                      <SelectItem
                                        key={volume.id}
                                        value={volume.id}
                                      >
                                        {volume.name} - {volume.size}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {formData.existingStorageVolumes.length > 0 && (
                                  <div className='mt-2 space-y-1'>
                                    <p className='text-sm text-muted-foreground'>
                                      Selected volumes:
                                    </p>
                                    <div className='flex flex-wrap gap-2'>
                                      {formData.existingStorageVolumes.map(
                                        volumeId => {
                                          const volume = storageVolumes.find(
                                            v => v.id === volumeId
                                          );
                                          return volume ? (
                                            <Badge
                                              key={volumeId}
                                              variant='secondary'
                                              className='flex items-center gap-1'
                                            >
                                              {volume.name}
                                              <X
                                                className='h-3 w-3 cursor-pointer'
                                                onClick={() =>
                                                  handleInputChange(
                                                    'existingStorageVolumes',
                                                    formData.existingStorageVolumes.filter(
                                                      id => id !== volumeId
                                                    )
                                                  )
                                                }
                                              />
                                            </Badge>
                                          ) : null;
                                        }
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className='space-y-4'>
                            <div className='flex items-start space-x-3'>
                              <input
                                type='radio'
                                id='new-storage'
                                name='storageVolumeType'
                                checked={formData.storageVolumeType === 'new'}
                                onChange={() =>
                                  handleInputChange('storageVolumeType', 'new')
                                }
                                className='mt-1 h-4 w-4 accent-black border-gray-300 focus:ring-gray-900'
                              />
                              <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                  <Label
                                    htmlFor='new-storage'
                                    className='text-sm font-medium leading-relaxed cursor-pointer'
                                  >
                                    Create a new storage volume
                                  </Label>
                                  <TooltipWrapper content='Create a new storage volume for additional data storage'>
                                    <HelpCircle className='h-4 w-4 text-muted-foreground cursor-pointer' />
                                  </TooltipWrapper>
                                </div>
                              </div>
                            </div>
                            {formData.storageVolumeType === 'new' && (
                              <div className='ml-8 pt-2 space-y-4'>
                                <div>
                                  <Label
                                    htmlFor='storage-name'
                                    className='block mb-2 text-sm font-medium'
                                  >
                                    Volume Name{' '}
                                    <span className='text-destructive'>*</span>
                                  </Label>
                                  <Input
                                    id='storage-name'
                                    placeholder='Enter storage volume name'
                                    value={formData.newStorageVolumeName}
                                    onChange={e =>
                                      handleInputChange(
                                        'newStorageVolumeName',
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                  <div>
                                    <Label
                                      htmlFor='storage-size'
                                      className='block mb-2 text-sm font-medium'
                                    >
                                      Size (GB)
                                    </Label>
                                    <Input
                                      id='storage-size'
                                      type='number'
                                      value={formData.newStorageVolumeSize}
                                      onChange={e =>
                                        handleInputChange(
                                          'newStorageVolumeSize',
                                          e.target.value
                                        )
                                      }
                                      min='10'
                                      max='10000'
                                      placeholder='100'
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor='storage-type'
                                      className='block mb-2 text-sm font-medium'
                                    >
                                      Volume Type
                                    </Label>
                                    <Select
                                      value={formData.newStorageVolumeType}
                                      onValueChange={value =>
                                        handleInputChange(
                                          'newStorageVolumeType',
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder='Select volume type' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value='ssd'>
                                          SSD (High Performance)
                                        </SelectItem>
                                        <SelectItem value='hdd'>
                                          HDD (Standard)
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label
                                    htmlFor='storage-description'
                                    className='block mb-2 text-sm font-medium'
                                  >
                                    Description
                                  </Label>
                                  <Textarea
                                    id='storage-description'
                                    placeholder='Enter volume description (optional)'
                                    value={formData.newStorageVolumeDescription}
                                    onChange={e =>
                                      handleInputChange(
                                        'newStorageVolumeDescription',
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* SSH Key */}
                <div className='mb-6'>
                  <Label className='block mb-2 font-medium'>
                    SSH Key <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={formData.sshKeyId}
                    onValueChange={value => {
                      if (value === '__create_new__') {
                        setShowCreateSSHKeyModal(true);
                      } else {
                        handleInputChange('sshKeyId', value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder='Select SSH Key to securely access your VMs'
                        className='!text-[#64748b]'
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sshKeys.map(key => (
                        <SelectItem key={key.id} value={key.id}>
                          {key.name}
                        </SelectItem>
                      ))}
                      <SelectItem
                        value='__create_new__'
                        className='text-blue-600 font-medium'
                      >
                        <Plus className='h-4 w-4 mr-2 inline' />
                        Create new SSH key
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Network Configuration */}
                <div className='space-y-6 mb-6'>
                  <Separator className='my-6' />
                  <h3 className='text-lg font-semibold'>
                    Network Configuration
                  </h3>

                  {/* Subnet */}
                  <div className='mb-6'>
                    <Label className='block mb-2 font-medium'>
                      Subnet <span className='text-destructive'>*</span>
                    </Label>
                    <Select
                      value={formData.subnetId}
                      onValueChange={value => {
                        if (value === '__create_new__') {
                          router.push(
                            '/networking/subnets/create?return=/compute/vms/cpu/create'
                          );
                        } else {
                          handleInputChange('subnetId', value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder='Select the subnet to access your VM'
                          className='!text-[#64748b]'
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {subnets.map(subnet => (
                          <SelectItem key={subnet.id} value={subnet.id}>
                            {subnet.name} - {subnet.type} ({subnet.cidr})
                          </SelectItem>
                        ))}
                        <SelectItem
                          value='__create_new__'
                          className='text-blue-600 font-medium'
                        >
                          <Plus className='h-4 w-4 mr-2 inline' />
                          Create new subnet
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {isPrivateSubnet && (
                      <div className='mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
                        <p className='text-sm text-yellow-800'>
                          <strong>Note:</strong> You have selected a private
                          subnet. Only your VMs present in this private subnet
                          will be able to access this VM. You won't be able to
                          SSH into this VM directly.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Security Group */}
                  <div className='mb-6'>
                    <Label className='block mb-2 font-medium'>
                      Security Group <span className='text-destructive'>*</span>
                    </Label>
                    <Select
                      value={formData.securityGroupId}
                      onValueChange={value => {
                        if (value === '__create_new__') {
                          router.push(
                            '/networking/security-groups/create?return=/compute/vms/cpu/create'
                          );
                        } else {
                          handleInputChange('securityGroupId', value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder='Select Security group to control traffic to and from your VM'
                          className='!text-[#64748b]'
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {securityGroups.map(sg => (
                          <SelectItem key={sg.id} value={sg.id}>
                            {sg.name} - {sg.description}
                          </SelectItem>
                        ))}
                        <SelectItem
                          value='__create_new__'
                          className='text-blue-600 font-medium'
                        >
                          <Plus className='h-4 w-4 mr-2 inline' />
                          Create new security group
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* IP Address Type */}
                  <div className='mb-6'>
                    {showIPAddressType && (
                      <div>
                        <Label className='block mb-2 font-medium'>
                          IP Address Type
                        </Label>
                        <div className='space-y-3'>
                          <div className='flex items-center space-x-2'>
                            <Checkbox
                              id='floating-ip'
                              checked={formData.ipAddressType === 'floating'}
                              onCheckedChange={() =>
                                handleInputChange('ipAddressType', 'floating')
                              }
                            />
                            <Label
                              htmlFor='floating-ip'
                              className='flex items-center gap-2'
                            >
                              Floating IP
                              <TooltipWrapper content="Dynamic Public IP address that is automatically assigned to the VM from the IP address pool. You will be only billed for the IP address as long as the VM is not stopped. Please note that this IP address is not reserved and it can't be guaranteed that you will get the same IP address again once you restart your VM">
                                <HelpCircle className='h-4 w-4 text-muted-foreground' />
                              </TooltipWrapper>
                            </Label>
                          </div>

                          <div className='flex items-center space-x-2'>
                            <Checkbox
                              id='reserved-ip'
                              checked={formData.ipAddressType === 'reserved'}
                              onCheckedChange={() =>
                                handleInputChange('ipAddressType', 'reserved')
                              }
                            />
                            <Label
                              htmlFor='reserved-ip'
                              className='flex items-center gap-2'
                            >
                              Reserved IP
                              <TooltipWrapper content='Fixed IP that is assigned to your VM. You will be billed as long as you have not deleted the IP address. The same IP address will be assigned to the VM even if you restart your VM'>
                                <HelpCircle className='h-4 w-4 text-muted-foreground' />
                              </TooltipWrapper>
                            </Label>
                          </div>

                          {formData.ipAddressType === 'reserved' && (
                            <div className='ml-6'>
                              <Label htmlFor='reserved-ip-select'>
                                Reserved IP
                              </Label>
                              <Select
                                value={formData.reservedIpId}
                                onValueChange={value =>
                                  handleInputChange('reservedIpId', value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Select reserved IP' />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableReservedIPs.map(ip => (
                                    <SelectItem key={ip.id} value={ip.id}>
                                      {ip.address}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Startup Script */}
                <div className='mb-6'>
                  <Separator className='my-6' />
                  <Label
                    htmlFor='startup-script'
                    className='block mb-2 font-medium'
                  >
                    Startup Script
                  </Label>
                  <Textarea
                    id='startup-script'
                    placeholder='#!/bin/bash&#10;# Enter your bash script here'
                    value={formData.startupScript}
                    onChange={e =>
                      handleInputChange('startupScript', e.target.value)
                    }
                    rows={4}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Only bash format is supported. Script will run on first
                    boot.
                  </p>
                </div>

                {/* Tags */}
                <div className='mb-6'>
                  <Label className='block mb-2 font-medium'>Tags</Label>
                  <div className='space-y-3'>
                    {formData.tags.map((tag, index) => (
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
                          {index === formData.tags.length - 1 ? (
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

                <div className='flex justify-end gap-4 pt-6'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.push('/compute/vms')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='bg-black text-white hover:bg-black/90'
                    disabled={
                      !formData.name ||
                      !formData.vpcId ||
                      !formData.sshKeyId ||
                      !formData.securityGroupId
                    }
                  >
                    Review Configuration
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className='w-full lg:w-80 lg:flex-shrink-0 space-y-6'>
          {/* Best Practices */}
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
                    Choose appropriate storage size for your workload
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Private subnets provide better security isolation
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Reserved IPs are recommended for production workloads
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Configure security groups to control network access
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Price Summary */}
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
            <div className='space-y-3'>
              <div className='flex items-baseline gap-2'>
                <div className='text-2xl font-bold'>₹{pricing.total}</div>
                <p className='text-sm text-muted-foreground'>per hour</p>
              </div>

              <div className='text-xs text-muted-foreground pt-2 border-t space-y-1'>
                <div className='flex justify-between'>
                  <span>
                    VM Instance (4 vCPU, 16 GB RAM, {formData.networkSpeed})
                  </span>
                  <span>₹{pricing.vm}/hr</span>
                </div>

                {pricing.storage > 0 && (
                  <div className='flex justify-between'>
                    <span>Storage</span>
                    <span>₹{pricing.storage}/hr</span>
                  </div>
                )}

                {pricing.ip > 0 && (
                  <div className='flex justify-between'>
                    <span>
                      {formData.ipAddressType === 'floating'
                        ? 'Floating IP'
                        : formData.ipAddressType === 'reserved'
                          ? 'Reserved IP'
                          : 'Public IP'}
                    </span>
                    <span>₹{pricing.ip}/hr</span>
                  </div>
                )}

                <div className='pt-1 mt-2 border-t'>
                  <span>
                    Monthly estimate: ~₹
                    {(pricing.total * 24 * 30).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creation Modals */}
      <CreateVPCModal
        open={showCreateVPCModal}
        onClose={() => setShowCreateVPCModal(false)}
        onSuccess={handleVPCCreated}
        preselectedRegion={selectedVPC?.region}
      />

      <CreateSSHKeyModal
        open={showCreateSSHKeyModal}
        onClose={() => setShowCreateSSHKeyModal(false)}
        onSuccess={handleSSHKeyCreated}
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
