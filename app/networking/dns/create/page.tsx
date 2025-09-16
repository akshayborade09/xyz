'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { HelpCircle, Globe, Search, ChevronDown, Check } from 'lucide-react';
import { vpcs, subnets } from '@/lib/data';

export default function CreateHostedZonePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    domainName: '',
    description: '',
    type: 'Public',
    vpc: '',
    subnet: '',
  });

  const [formTouched, setFormTouched] = useState(false);
  const [vpcSelectorOpen, setVpcSelectorOpen] = useState(false);
  const [subnetSelectorOpen, setSubnetSelectorOpen] = useState(false);
  const [vpcSearchTerm, setVpcSearchTerm] = useState('');
  const [subnetSearchTerm, setSubnetSearchTerm] = useState('');
  const [errors, setErrors] = useState({
    domainName: '',
    vpc: '',
    subnet: '',
  });

  // Filter VPCs and subnets
  const filteredVPCs = vpcs.filter(
    vpc =>
      vpc.name.toLowerCase().includes(vpcSearchTerm.toLowerCase()) ||
      vpc.id.toLowerCase().includes(vpcSearchTerm.toLowerCase())
  );

  const selectedVPCName = vpcs.find(vpc => vpc.id === formData.vpc)?.name;
  const availableSubnets = selectedVPCName
    ? subnets.filter(subnet => subnet.vpcName === selectedVPCName)
    : [];
  const filteredSubnets = availableSubnets.filter(
    subnet =>
      subnet.name.toLowerCase().includes(subnetSearchTerm.toLowerCase()) ||
      subnet.id.toLowerCase().includes(subnetSearchTerm.toLowerCase())
  );

  const isFormValid = () => {
    // Check if all required fields are filled
    const hasValidDomainName = formData.domainName.trim().length > 0;
    const hasValidType = formData.type.length > 0;
    const hasVpcIfPrivate =
      formData.type === 'Private' ? formData.vpc.length > 0 : true;
    const hasSubnetIfPrivate =
      formData.type === 'Private' ? formData.subnet.length > 0 : true;

    // Check if there are no validation errors
    const noErrors = !errors.domainName && !errors.vpc && !errors.subnet;

    // Validate domain name format
    const validDomainFormat =
      formData.domainName.trim() === '' ||
      /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,})(\.([a-zA-Z]{2,}))*$/.test(
        formData.domainName.trim()
      );

    return (
      hasValidDomainName &&
      hasValidType &&
      hasVpcIfPrivate &&
      hasSubnetIfPrivate &&
      noErrors &&
      validDomainFormat
    );
  };

  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'domainName':
        if (!value.trim()) {
          error = 'Domain name is required';
        } else if (
          !/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,})(\.([a-zA-Z]{2,}))*$/.test(
            value
          )
        ) {
          error = 'Please enter a valid domain name (e.g., example.com)';
        }
        break;
      case 'vpc':
        if (formData.type === 'Private' && !value) {
          error = 'VPC is required for private hosted zones';
        }
        break;
      case 'subnet':
        if (formData.type === 'Private' && !value) {
          error = 'Subnet is required for private hosted zones';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Clear VPC and subnet when type changes to Public
      ...(field === 'type' && value === 'Public'
        ? { vpc: '', subnet: '' }
        : {}),
      // Clear subnet when VPC changes
      ...(field === 'vpc' ? { subnet: '' } : {}),
    }));
    setFormTouched(true);

    // Validate field on change
    if (formTouched) {
      validateField(field, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Creating hosted zone:', formData);

    // Redirect to manage hosted zone page with option to skip or configure
    router.push(`/networking/dns/hz-${Date.now()}/manage?created=true`);
  };

  return (
    <PageLayout
      title='Create Hosted Zone'
      description='Create and configure a new hosted zone to manage DNS records for your domain'
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
                      htmlFor='domainName'
                      className='block mb-2 font-medium'
                    >
                      Domain Name <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='domainName'
                      placeholder='example.com'
                      value={formData.domainName}
                      onChange={e => handleChange('domainName', e.target.value)}
                      onBlur={e => validateField('domainName', e.target.value)}
                      className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        errors.domainName ? 'border-red-300 bg-red-50' : ''
                      }`}
                      required
                    />
                    {errors.domainName ? (
                      <p className='text-xs text-red-600 mt-1'>
                        {errors.domainName}
                      </p>
                    ) : (
                      <p className='text-xs text-muted-foreground mt-1'>
                        User owned domain name, for which DNS records are to be
                        added.
                      </p>
                    )}
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
                      placeholder='Enter a description for this hosted zone'
                      value={formData.description}
                      onChange={e =>
                        handleChange('description', e.target.value)
                      }
                      className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]'
                    />
                  </div>

                  {/* Hosted Zone Type */}
                  <div className='mb-6'>
                    <Label className='block mb-3 font-medium'>
                      Type <span className='text-destructive'>*</span>
                    </Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={value => handleChange('type', value)}
                      className='grid grid-cols-1 md:grid-cols-2 gap-4'
                    >
                      <div className='flex items-start space-x-3 p-4 border rounded-lg'>
                        <RadioGroupItem
                          value='Public'
                          id='public'
                          className='mt-0.5'
                        />
                        <div className='space-y-1'>
                          <Label
                            htmlFor='public'
                            className='text-base font-medium'
                          >
                            Public Hosted Zone
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Creates a public hosted zone. Route traffic on the
                            internet to your resources.
                          </p>
                        </div>
                      </div>

                      <div className='flex items-start space-x-3 p-4 border rounded-lg'>
                        <RadioGroupItem
                          value='Private'
                          id='private'
                          className='mt-0.5'
                        />
                        <div className='space-y-1'>
                          <Label
                            htmlFor='private'
                            className='text-base font-medium'
                          >
                            Private Hosted Zone
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Creates a private hosted zone. Route traffic within
                            your VPCs only.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* VPC and Subnet Selection (only for Private) */}
                {formData.type === 'Private' && (
                  <div className='mb-8'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Network Configuration
                    </h3>

                    {/* VPC Selector */}
                    <div className='mb-6'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Label className='font-medium'>
                          VPC <span className='text-destructive'>*</span>
                        </Label>
                        <TooltipWrapper
                          content='Select the Virtual Private Cloud where this private hosted zone will be accessible'
                          side='top'
                        >
                          <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                        </TooltipWrapper>
                      </div>
                      <div className='relative'>
                        <button
                          type='button'
                          onClick={() => setVpcSelectorOpen(!vpcSelectorOpen)}
                          onBlur={() => validateField('vpc', formData.vpc)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left border rounded-md bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring ${
                            errors.vpc ? 'border-red-300 bg-red-50' : ''
                          }`}
                        >
                          {formData.vpc ? (
                            <div className='flex flex-col'>
                              <span className='font-medium'>
                                {
                                  vpcs.find(vpc => vpc.id === formData.vpc)
                                    ?.name
                                }
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                {formData.vpc} •{' '}
                                {
                                  vpcs.find(vpc => vpc.id === formData.vpc)
                                    ?.region
                                }
                              </span>
                            </div>
                          ) : (
                            <span className='text-muted-foreground'>
                              Select a VPC
                            </span>
                          )}
                          <ChevronDown className='h-4 w-4 opacity-50' />
                        </button>
                        {vpcSelectorOpen && (
                          <div className='absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md'>
                            <div className='p-2 border-b'>
                              <div className='relative'>
                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                <Input
                                  placeholder='Search VPCs...'
                                  value={vpcSearchTerm}
                                  onChange={e =>
                                    setVpcSearchTerm(e.target.value)
                                  }
                                  className='pl-8'
                                />
                              </div>
                            </div>
                            <div className='p-1 max-h-48 overflow-y-auto'>
                              {filteredVPCs.map(vpc => (
                                <button
                                  key={vpc.id}
                                  type='button'
                                  onClick={() => {
                                    handleChange('vpc', vpc.id);
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
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subnet Selector */}
                    <div className='mb-6'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Label className='font-medium'>
                          Subnet <span className='text-destructive'>*</span>
                        </Label>
                        <TooltipWrapper
                          content='Select the subnet within the VPC for this private hosted zone'
                          side='top'
                        >
                          <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                        </TooltipWrapper>
                      </div>
                      <div className='relative'>
                        <button
                          type='button'
                          onClick={() =>
                            setSubnetSelectorOpen(!subnetSelectorOpen)
                          }
                          onBlur={() =>
                            validateField('subnet', formData.subnet)
                          }
                          disabled={!formData.vpc}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left border rounded-md bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.subnet ? 'border-red-300 bg-red-50' : ''
                          }`}
                        >
                          {formData.subnet ? (
                            <div className='flex flex-col'>
                              <span className='font-medium'>
                                {
                                  availableSubnets.find(
                                    subnet => subnet.id === formData.subnet
                                  )?.name
                                }
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                {formData.subnet} •{' '}
                                {
                                  availableSubnets.find(
                                    subnet => subnet.id === formData.subnet
                                  )?.cidr
                                }
                              </span>
                            </div>
                          ) : (
                            <span className='text-muted-foreground'>
                              {!formData.vpc
                                ? 'Select a VPC first'
                                : 'Select a subnet'}
                            </span>
                          )}
                          <ChevronDown className='h-4 w-4 opacity-50' />
                        </button>
                        {subnetSelectorOpen && formData.vpc && (
                          <div className='absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md'>
                            <div className='p-2 border-b'>
                              <div className='relative'>
                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                <Input
                                  placeholder='Search subnets...'
                                  value={subnetSearchTerm}
                                  onChange={e =>
                                    setSubnetSearchTerm(e.target.value)
                                  }
                                  className='pl-8'
                                />
                              </div>
                            </div>
                            <div className='p-1 max-h-48 overflow-y-auto'>
                              {filteredSubnets.map(subnet => (
                                <button
                                  key={subnet.id}
                                  type='button'
                                  onClick={() => {
                                    handleChange('subnet', subnet.id);
                                    setSubnetSelectorOpen(false);
                                    setSubnetSearchTerm('');
                                  }}
                                  className='w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm'
                                >
                                  <div className='flex flex-col items-start'>
                                    <span className='font-medium'>
                                      {subnet.name}
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                      {subnet.id} • {subnet.cidr}
                                    </span>
                                  </div>
                                  {formData.subnet === subnet.id && (
                                    <Check className='h-4 w-4' />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
            <div className='flex justify-end gap-4 px-6 pb-6'>
              <Button
                type='button'
                variant='outline'
                className='hover:bg-secondary transition-colors'
                onClick={() => router.push('/networking/dns')}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!isFormValid()}
                className={`transition-colors ${
                  isFormValid()
                    ? 'bg-black text-white hover:bg-black/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
              >
                {!isFormValid()
                  ? formTouched
                    ? 'Fill Required Fields'
                    : 'Create Hosted Zone'
                  : 'Create Hosted Zone'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className='w-full md:w-80 space-y-6'>
          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base font-normal flex items-center gap-2'>
                <Globe className='w-4 h-4' />
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
                    Use descriptive domain names for easy identification
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Public zones are accessible from anywhere on the internet
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Private zones are only accessible within your selected VPC
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    You can add DNS records after creating the hosted zone
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
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
                <h3 className='text-base font-semibold'>Pricing Summary</h3>
              </div>
            </div>
            <div>
              <div className='space-y-3'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-2xl font-bold'>₹0.50</span>
                  <span className='text-sm text-muted-foreground'>
                    per month
                  </span>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Per hosted zone. Includes 1 million queries per month.
                </p>
                <div className='text-xs text-muted-foreground pt-2 border-t'>
                  <p>• Hosted Zone: ₹0.50/month</p>
                  <p>• DNS queries: ₹0.40 per million</p>
                  <p>• Health checks: ₹0.50 per check/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
