'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../../../components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../../components/ui/accordion';
import { TooltipWrapper } from '../../../../components/ui/tooltip-wrapper';
import { HelpCircle, ChevronDown, Check, Search } from 'lucide-react';
import { vpcs } from '../../../../lib/data';
import Link from 'next/link';

export default function CreateSubnetPage() {
  const router = useRouter();
  const [creatingNewVpc, setCreatingNewVpc] = useState(false);
  const [formData, setFormData] = useState({
    vpcId: '',
    name: '',
    description: '',
    accessType: '',
    cidr: '',
    gatewayIp: '',
    // VPC fields
    vpcName: '',
    vpcRegion: '',
    vpcDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [isFirstVPC] = useState(true);

  // State to track if form has been interacted with
  const [formTouched, setFormTouched] = useState(false);

  // Function to check if all mandatory fields are filled
  const isFormValid = () => {
    // Basic subnet fields
    const hasValidName = formData.name.trim().length > 0;
    const hasValidAccessType = formData.accessType.length > 0;
    const hasValidCidr = formData.cidr.trim().length > 0;
    const hasValidGatewayIp = formData.gatewayIp.trim().length > 0;

    // VPC validation
    let hasValidVpc = false;
    if (creatingNewVpc) {
      // If creating new VPC, VPC Name and Region are mandatory
      const hasValidVpcName = formData.vpcName.trim().length > 0;
      const hasValidVpcRegion = formData.vpcRegion.length > 0;
      hasValidVpc = hasValidVpcName && hasValidVpcRegion;
    } else {
      // If selecting existing VPC, VPC ID is mandatory
      hasValidVpc = formData.vpcId.length > 0;
    }

    return (
      hasValidName &&
      hasValidAccessType &&
      hasValidCidr &&
      hasValidGatewayIp &&
      hasValidVpc
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setFormTouched(true);
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    setFormTouched(true);
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, accessType: value }));
    setFormTouched(true);
  };

  const handleVpcSelect = (value: string) => {
    if (value === '__create_new__') {
      setCreatingNewVpc(true);
      setFormData(prev => ({ ...prev, vpcId: '' }));
    } else {
      setCreatingNewVpc(false);
      setFormData(prev => ({ ...prev, vpcId: value }));
    }
    setFormTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (creatingNewVpc) {
      // Simulate VPC creation
      const newVpcId = 'vpc-' + Math.random().toString(36).substr(2, 8);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Now create subnet under new VPC
      console.log('Creating VPC:', {
        name: formData.vpcName,
        region: formData.vpcRegion,
        description: formData.vpcDescription,
        id: newVpcId,
      });
      console.log('Creating subnet:', {
        ...formData,
        vpcId: newVpcId,
      });
    } else {
      // Just create subnet under selected VPC
      console.log('Creating subnet:', formData);
    }
    setLoading(false);
    router.push('/networking/subnets');
  };

  return (
    <PageLayout
      title='Create Subnet'
      description='Configure and create a new subnet for your Virtual Private Cloud'
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                <div className='mb-8'>
                  <VPCSelectorInline
                    value={formData.vpcId}
                    onChange={handleVpcSelect}
                    creatingNewVpc={creatingNewVpc}
                  />

                  {creatingNewVpc && (
                    <div className='mb-8 border rounded-lg p-4 bg-gray-50'>
                      <div className='mb-5'>
                        <Label
                          htmlFor='vpcName'
                          className='block mb-2 font-medium'
                        >
                          VPC Name <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                          id='vpcName'
                          placeholder='Enter VPC name'
                          value={formData.vpcName}
                          onChange={handleChange}
                          className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            formTouched &&
                            creatingNewVpc &&
                            !formData.vpcName.trim()
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
                      <div className='mb-5'>
                        <Label
                          htmlFor='vpcRegion'
                          className='block mb-2 font-medium'
                        >
                          Region <span className='text-destructive'>*</span>
                        </Label>
                        <Select
                          value={formData.vpcRegion}
                          onValueChange={value =>
                            handleSelectChange('vpcRegion', value)
                          }
                          required
                        >
                          <SelectTrigger
                            className={
                              formTouched &&
                              creatingNewVpc &&
                              !formData.vpcRegion
                                ? 'border-red-300 bg-red-50'
                                : ''
                            }
                          >
                            <SelectValue placeholder='Select a region' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='us-east-1'>
                              US East (N. Virginia)
                            </SelectItem>
                            <SelectItem value='us-west-2'>
                              US West (Oregon)
                            </SelectItem>
                            <SelectItem value='eu-west-1'>
                              EU (Ireland)
                            </SelectItem>
                            <SelectItem value='ap-south-1'>
                              Asia Pacific (Mumbai)
                            </SelectItem>
                            <SelectItem value='ap-southeast-1'>
                              Asia Pacific (Singapore)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='mb-5'>
                        <Label
                          htmlFor='vpcDescription'
                          className='block mb-2 font-medium'
                        >
                          Description
                        </Label>
                        <Textarea
                          id='vpcDescription'
                          placeholder='Enter a description for this VPC'
                          value={formData.vpcDescription}
                          onChange={handleChange}
                          className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]'
                        />
                      </div>
                      {/* You can add region availability and price summary here if needed */}
                    </div>
                  )}

                  <div className='mb-5'>
                    <Label htmlFor='name' className='block mb-2 font-medium'>
                      {creatingNewVpc ? 'Subnet Name ' : 'Name '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='name'
                      placeholder={
                        creatingNewVpc
                          ? 'Enter subnet name'
                          : 'Enter subnet name'
                      }
                      value={formData.name}
                      onChange={handleChange}
                      className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formTouched && !formData.name.trim()
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

                  <div className='mb-5'>
                    <Label
                      htmlFor='description'
                      className='block mb-2 font-medium'
                    >
                      Description
                    </Label>
                    <Textarea
                      id='description'
                      placeholder='Enter subnet description'
                      value={formData.description}
                      onChange={handleChange}
                      className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]'
                    />
                  </div>

                  <div className='mb-5'>
                    <Label className='block mb-2 font-medium'>
                      Access Type <span className='text-destructive'>*</span>
                    </Label>
                    <RadioGroup
                      value={formData.accessType}
                      onValueChange={handleRadioChange}
                      className='flex gap-5 mt-2'
                    >
                      <div className='flex items-center'>
                        <RadioGroupItem value='public' id='public' />
                        <Label htmlFor='public' className='ml-2'>
                          Public
                        </Label>
                      </div>
                      <div className='flex items-center'>
                        <RadioGroupItem value='private' id='private' />
                        <Label htmlFor='private' className='ml-2'>
                          Private
                        </Label>
                      </div>
                    </RadioGroup>

                    {formData.accessType === 'public' && (
                      <div className='mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                        <p
                          className='text-gray-600'
                          style={{ fontSize: '13px' }}
                        >
                          Public subnets can be accessed through the internet.
                          Public IP addresses which you want to assign to your
                          publicly accessible VMs can only be assigned to this
                          type of subnet.
                        </p>
                      </div>
                    )}

                    {formData.accessType === 'private' && (
                      <div className='mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                        <p
                          className='text-gray-600'
                          style={{ fontSize: '13px' }}
                        >
                          Private subnets cannot be accessed through the
                          internet. Only private IP addresses will be created
                          inside this subnet and you can only add privately
                          accessible VMs inside this subnet.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'>
                    <div>
                      <div className='flex items-center gap-2 mb-2'>
                        <Label htmlFor='cidr' className='font-medium'>
                          CIDR <span className='text-destructive'>*</span>
                        </Label>
                        <TooltipWrapper
                          content={
                            <div className='space-y-2'>
                              <p className='font-medium'>
                                CIDR Block Configuration
                              </p>
                              <p>
                                Define the IP address range for your subnet
                                using CIDR notation (e.g., 192.168.1.0/24).
                              </p>
                              <p>
                                <strong>Examples:</strong>
                              </p>
                              <ul className='list-disc pl-4 space-y-1'>
                                <li>
                                  /24 = 254 usable IPs (good for small
                                  environments)
                                </li>
                                <li>
                                  /23 = 510 usable IPs (good for medium
                                  environments)
                                </li>
                                <li>
                                  /22 = 1022 usable IPs (good for large
                                  environments)
                                </li>
                              </ul>
                              <p>
                                <strong>Important:</strong> Choose a CIDR block
                                that doesn't overlap with existing subnets and
                                provides adequate IP addresses for your
                                resources.
                              </p>
                            </div>
                          }
                          side='top'
                        >
                          <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                        </TooltipWrapper>
                      </div>
                      <Input
                        id='cidr'
                        placeholder='e.g., 192.168.1.0/24'
                        value={formData.cidr}
                        onChange={handleChange}
                        className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          formTouched && !formData.cidr.trim()
                            ? 'border-red-300 bg-red-50'
                            : ''
                        }`}
                        required
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        IP address range in CIDR notation
                      </p>
                    </div>

                    <div>
                      <div className='flex items-center gap-2 mb-2'>
                        <Label htmlFor='gatewayIp' className='font-medium'>
                          Gateway IP <span className='text-destructive'>*</span>
                        </Label>
                        <TooltipWrapper
                          content={
                            <div className='space-y-2'>
                              <p className='font-medium'>
                                Gateway IP Configuration
                              </p>
                              <p>
                                The gateway IP serves as the default route for
                                resources in this subnet to communicate with
                                other subnets and external networks.
                              </p>
                              <p>
                                <strong>Best Practices:</strong>
                              </p>
                              <ul className='list-disc pl-4 space-y-1'>
                                <li>
                                  Usually the first IP in your CIDR range (e.g.,
                                  192.168.1.1 for 192.168.1.0/24)
                                </li>
                                <li>Must be within your subnet's CIDR range</li>
                                <li>
                                  Cannot be the network or broadcast address
                                </li>
                              </ul>
                              <p>
                                <strong>Example:</strong> For subnet
                                192.168.1.0/24, use 192.168.1.1 as gateway
                              </p>
                            </div>
                          }
                          side='top'
                        >
                          <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                        </TooltipWrapper>
                      </div>
                      <Input
                        id='gatewayIp'
                        placeholder='e.g., 192.168.1.1'
                        value={formData.gatewayIp}
                        onChange={handleChange}
                        className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          formTouched && !formData.gatewayIp.trim()
                            ? 'border-red-300 bg-red-50'
                            : ''
                        }`}
                        required
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        Gateway IP address for the subnet
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <div className='flex justify-end gap-4 px-6 pb-6'>
              <Button
                type='button'
                variant='outline'
                className='hover:bg-secondary transition-colors'
                onClick={() => router.push('/networking/subnets')}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!isFormValid()}
                className={`transition-colors ${
                  isFormValid()
                    ? 'bg-black text-white hover:bg-black/90 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
              >
                {!isFormValid()
                  ? formTouched
                    ? 'Fill Required Fields'
                    : 'Create Subnet'
                  : 'Create Subnet'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='w-full lg:w-80 space-y-6'>
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
                    Choose descriptive names for easy identification
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Use private subnets for better security
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Plan IP address allocation to avoid future conflicts
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Price Summary */}
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
                <h3 className='text-base font-semibold'>Price Summary</h3>
              </div>
            </div>
            <div>
              <div className='space-y-3'>
                <div className='text-2xl font-bold text-green-600'>Free</div>
                <p className='text-sm text-muted-foreground'>
                  Subnet creation is free! You only pay for the resources you
                  deploy within the subnet.
                </p>
                <div className='text-xs text-muted-foreground pt-2 border-t'>
                  <p>• Subnet Creation: ₹0.00</p>
                  <p>• No monthly charges</p>
                  <p>• Pay only for resources</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function VPCSelectorInline({
  value,
  onChange,
  creatingNewVpc,
}: {
  value: string;
  onChange: (value: string) => void;
  creatingNewVpc: boolean;
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
    <div className='mb-5'>
      <Label className='block mb-2 font-medium'>
        VPC <span className='text-destructive'>*</span>
      </Label>
      <div className='relative'>
        <button
          type='button'
          onClick={() => setOpen(!open)}
          className='w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={creatingNewVpc}
        >
          <span
            className={
              selectedVPC ? 'text-foreground' : 'text-muted-foreground'
            }
          >
            {selectedVPC
              ? `${selectedVPC.name} (${selectedVPC.id})`
              : creatingNewVpc
                ? 'Creating new VPC...'
                : 'Select VPC'}
          </span>
          <ChevronDown className='h-4 w-4 opacity-50' />
        </button>
        {open && !creatingNewVpc && (
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
      <p className='text-xs text-muted-foreground mt-1'>
        Select the VPC where you want to create this subnet, or create a new
        one.
      </p>
    </div>
  );
}
