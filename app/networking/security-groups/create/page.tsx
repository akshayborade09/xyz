'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { PageLayout } from '@/components/page-layout';
import {
  Card,
  CardContent,
  CardFooter,
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
import { Dialog, DialogContent } from '../../../../components/ui/dialog';
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

interface Rule {
  id: string;
  protocol: string;
  portRange: string;
  remoteIpPrefix: string;
  description: string;
}

export default function CreateSecurityGroupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    securityGroupFor: 'vpc',
  });

  const [inboundRules, setInboundRules] = useState<Rule[]>([
    {
      id: 'in-rule-1',
      protocol: 'tcp',
      portRange: '22',
      remoteIpPrefix: '0.0.0.0/0',
      description: 'SSH',
    },
  ]);

  const [outboundRules, setOutboundRules] = useState<Rule[]>([
    {
      id: 'out-rule-1',
      protocol: 'all',
      portRange: '0-65535',
      remoteIpPrefix: '0.0.0.0/0',
      description: 'Allow all outbound traffic',
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRuleChange = (
    index: number,
    field: keyof Rule,
    value: string,
    isInbound: boolean
  ) => {
    if (isInbound) {
      const newRules = [...inboundRules];
      newRules[index] = { ...newRules[index], [field]: value };
      // Auto-set port range when protocol is "all"
      if (field === 'protocol' && value === 'all') {
        newRules[index] = { ...newRules[index], portRange: '0-65535' };
      }
      setInboundRules(newRules);
    } else {
      const newRules = [...outboundRules];
      newRules[index] = { ...newRules[index], [field]: value };
      // Auto-set port range when protocol is "all"
      if (field === 'protocol' && value === 'all') {
        newRules[index] = { ...newRules[index], portRange: '0-65535' };
      }
      setOutboundRules(newRules);
    }
  };

  const addRule = (isInbound: boolean) => {
    if (isInbound) {
      setInboundRules([
        ...inboundRules,
        {
          id: `rule-${inboundRules.length + 1}`,
          protocol: '',
          portRange: '',
          remoteIpPrefix: '',
          description: '',
        },
      ]);
    } else {
      setOutboundRules([
        ...outboundRules,
        {
          id: `out-rule-${outboundRules.length + 1}`,
          protocol: '',
          portRange: '',
          remoteIpPrefix: '',
          description: '',
        },
      ]);
    }
  };

  const deleteRule = (index: number, isInbound: boolean) => {
    if (isInbound) {
      const newRules = [...inboundRules];
      newRules.splice(index, 1);
      setInboundRules(newRules);
    } else {
      const newRules = [...outboundRules];
      newRules.splice(index, 1);
      setOutboundRules(newRules);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create the security group
    console.log('Creating Security Group:', {
      ...formData,
      inboundRules,
      outboundRules,
    });
    router.push('/networking/security-groups');
  };

  return (
    <PageLayout
      title='Create Security Group'
      description='Configure and create a new security group for your Virtual Private Cloud'
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className='mb-8'>
                  <div className='mb-5'>
                    <Label htmlFor='name' className='block mb-2 font-medium'>
                      Security Group Name{' '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='name'
                      placeholder='Enter security group name'
                      value={formData.name}
                      onChange={handleChange}
                      className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
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
                      placeholder='Enter a description for this security group'
                      value={formData.description}
                      onChange={handleChange}
                      className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]'
                    />
                  </div>

                  <div className='mb-5'>
                    <Label
                      htmlFor='securityGroupFor'
                      className='block mb-2 font-medium'
                    >
                      Security Group For{' '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Select
                      value={formData.securityGroupFor}
                      onValueChange={value =>
                        handleSelectChange('securityGroupFor', value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='vpc'>VPC</SelectItem>
                        <SelectItem value='load-balancer'>
                          Load Balancer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                    <p className='text-gray-600' style={{ fontSize: '13px' }}>
                      Security groups act as virtual firewalls controlling
                      inbound and outbound traffic for your resources.
                    </p>
                  </div>
                </div>

                {/* Inbound Rules */}
                <div className='mb-8'>
                  <h2 className='text-base font-normal mb-5 pb-2.5 border-b border-border'>
                    Inbound Rules
                  </h2>

                  {inboundRules.length > 0 ? (
                    <>
                      {inboundRules.map((rule, index) => (
                        <div
                          key={rule.id}
                          className='rounded-lg bg-gray-50 border border-gray-200 p-5 mb-4'
                        >
                          <div className='flex justify-between items-center mb-4'>
                            <div className='font-semibold'>
                              Rule {index + 1}
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              onClick={() => deleteRule(index, true)}
                              className='text-sm underline hover:no-underline'
                            >
                              Delete
                            </Button>
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                              <Label className='block mb-2 font-medium'>
                                Protocol{' '}
                                <span className='text-destructive'>*</span>
                              </Label>
                              <Select
                                value={rule.protocol}
                                onValueChange={value =>
                                  handleRuleChange(
                                    index,
                                    'protocol',
                                    value,
                                    true
                                  )
                                }
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Select protocol' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='tcp'>TCP</SelectItem>
                                  <SelectItem value='udp'>UDP</SelectItem>
                                  <SelectItem value='icmp'>ICMP</SelectItem>
                                  <SelectItem value='all'>All</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className='block mb-2 font-medium'>
                                Port Range{' '}
                                <span className='text-destructive'>*</span>
                              </Label>
                              <Input
                                placeholder='e.g., 80 or 8000-9000'
                                value={rule.portRange}
                                onChange={e =>
                                  handleRuleChange(
                                    index,
                                    'portRange',
                                    e.target.value,
                                    true
                                  )
                                }
                                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                disabled={rule.protocol === 'all'}
                                required
                              />
                              {rule.protocol === 'all' && (
                                <p className='text-xs text-muted-foreground mt-1'>
                                  All ports (0-65535) are automatically selected
                                  for "All" protocol
                                </p>
                              )}
                            </div>

                            <div>
                              <Label className='block mb-2 font-medium'>
                                Remote IP Prefix{' '}
                                <span className='text-destructive'>*</span>
                              </Label>
                              <Input
                                placeholder='e.g., 0.0.0.0/0 or 192.168.1.0/24'
                                value={rule.remoteIpPrefix}
                                onChange={e =>
                                  handleRuleChange(
                                    index,
                                    'remoteIpPrefix',
                                    e.target.value,
                                    true
                                  )
                                }
                                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                required
                              />
                            </div>

                            <div>
                              <Label className='block mb-2 font-medium'>
                                Description
                              </Label>
                              <Input
                                placeholder='e.g., Allow HTTP traffic'
                                value={rule.description}
                                onChange={e =>
                                  handleRuleChange(
                                    index,
                                    'description',
                                    e.target.value,
                                    true
                                  )
                                }
                                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='hover:bg-secondary transition-colors'
                        onClick={() => addRule(true)}
                      >
                        Add Inbound Rule
                      </Button>
                    </>
                  ) : (
                    <div className='text-center py-6'>
                      <div className='mb-3'>
                        <svg
                          width='80'
                          height='50'
                          viewBox='0 0 80 50'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          className='mx-auto'
                        >
                          <rect width='80' height='50' fill='#FFFFFF' />
                          <rect
                            x='15'
                            y='15'
                            width='50'
                            height='20'
                            fill='none'
                            stroke='#E5E7EB'
                            strokeWidth='2'
                            rx='3'
                          />
                          <path
                            d='M22 22H58'
                            stroke='#E5E7EB'
                            strokeWidth='1.5'
                          />
                          <path
                            d='M22 28H48'
                            stroke='#E5E7EB'
                            strokeWidth='1.5'
                          />
                          <circle cx='19' cy='25' r='1.5' fill='#E5E7EB' />
                        </svg>
                      </div>
                      <h4 className='font-medium text-sm mb-2'>
                        No Inbound Rules
                      </h4>
                      <p className='text-xs text-muted-foreground mb-3'>
                        No inbound rules defined. Add rules to control incoming
                        traffic to your security group.
                      </p>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => addRule(true)}
                      >
                        Add Inbound Rule
                      </Button>
                    </div>
                  )}
                </div>

                {/* Outbound Rules */}
                <div className='mb-8'>
                  <h2 className='text-base font-normal mb-5 pb-2.5 border-b border-border'>
                    Outbound Rules
                  </h2>

                  {outboundRules.length > 0 ? (
                    <>
                      {outboundRules.map((rule, index) => (
                        <div
                          key={rule.id}
                          className='rounded-lg bg-gray-50 border border-gray-200 p-5 mb-4'
                        >
                          <div className='flex justify-between items-center mb-4'>
                            <div className='font-semibold'>
                              Rule {index + 1}
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              onClick={() => deleteRule(index, false)}
                              className='text-sm underline hover:no-underline'
                            >
                              Delete
                            </Button>
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                              <Label className='block mb-2 font-medium'>
                                Protocol{' '}
                                <span className='text-destructive'>*</span>
                              </Label>
                              <Select
                                value={rule.protocol}
                                onValueChange={value =>
                                  handleRuleChange(
                                    index,
                                    'protocol',
                                    value,
                                    false
                                  )
                                }
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Select protocol' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='tcp'>TCP</SelectItem>
                                  <SelectItem value='udp'>UDP</SelectItem>
                                  <SelectItem value='icmp'>ICMP</SelectItem>
                                  <SelectItem value='all'>All</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className='block mb-2 font-medium'>
                                Port Range{' '}
                                <span className='text-destructive'>*</span>
                              </Label>
                              <Input
                                placeholder='e.g., 80 or 8000-9000'
                                value={rule.portRange}
                                onChange={e =>
                                  handleRuleChange(
                                    index,
                                    'portRange',
                                    e.target.value,
                                    false
                                  )
                                }
                                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                disabled={rule.protocol === 'all'}
                                required
                              />
                              {rule.protocol === 'all' && (
                                <p className='text-xs text-muted-foreground mt-1'>
                                  All ports (0-65535) are automatically selected
                                  for "All" protocol
                                </p>
                              )}
                            </div>

                            <div>
                              <Label className='block mb-2 font-medium'>
                                Remote IP Prefix{' '}
                                <span className='text-destructive'>*</span>
                              </Label>
                              <Input
                                placeholder='e.g., 0.0.0.0/0 or 192.168.1.0/24'
                                value={rule.remoteIpPrefix}
                                onChange={e =>
                                  handleRuleChange(
                                    index,
                                    'remoteIpPrefix',
                                    e.target.value,
                                    false
                                  )
                                }
                                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                required
                              />
                            </div>

                            <div>
                              <Label className='block mb-2 font-medium'>
                                Description
                              </Label>
                              <Input
                                placeholder='e.g., Allow all outbound traffic'
                                value={rule.description}
                                onChange={e =>
                                  handleRuleChange(
                                    index,
                                    'description',
                                    e.target.value,
                                    false
                                  )
                                }
                                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='hover:bg-secondary transition-colors'
                        onClick={() => addRule(false)}
                      >
                        Add Outbound Rule
                      </Button>
                    </>
                  ) : (
                    <div className='text-center py-6'>
                      <div className='mb-3'>
                        <svg
                          width='80'
                          height='50'
                          viewBox='0 0 80 50'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          className='mx-auto'
                        >
                          <rect width='80' height='50' fill='#FFFFFF' />
                          <rect
                            x='15'
                            y='15'
                            width='50'
                            height='20'
                            fill='none'
                            stroke='#E5E7EB'
                            strokeWidth='2'
                            rx='3'
                          />
                          <path
                            d='M22 22H58'
                            stroke='#E5E7EB'
                            strokeWidth='1.5'
                          />
                          <path
                            d='M22 28H48'
                            stroke='#E5E7EB'
                            strokeWidth='1.5'
                          />
                          <circle cx='61' cy='25' r='1.5' fill='#E5E7EB' />
                        </svg>
                      </div>
                      <h4 className='font-medium text-sm mb-2'>
                        No Outbound Rules
                      </h4>
                      <p className='text-xs text-muted-foreground mb-3'>
                        No outbound rules defined. Add rules to control outgoing
                        traffic from your security group.
                      </p>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => addRule(false)}
                      >
                        Add Outbound Rule
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
            <div className='flex justify-end gap-4 px-6 pb-6'>
              <Button
                type='button'
                variant='outline'
                className='hover:bg-secondary transition-colors'
                onClick={() => router.push('/networking/security-groups')}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-black text-white hover:bg-black/90 transition-colors hover:scale-105'
                onClick={handleSubmit}
              >
                Create Security Group
              </Button>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className='w-full md:w-80 space-y-6'>
          {/* Configuration Tips */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base font-normal'>
                Security Best Practices
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
                    Only allow necessary ports and protocols
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Use specific IP ranges instead of 0.0.0.0/0 when possible
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Create separate security groups for different tiers
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Regularly review and update security rules
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Add descriptive names to identify rules easily
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
                  Security groups are free to create and manage in your VPC.
                </p>
                <div className='text-xs text-muted-foreground pt-2 border-t'>
                  <p>• Security Group Creation: ₹0.00</p>
                  <p>• Rule Management: ₹0.00</p>
                  <p>• No additional charges for security groups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function VPCSelector({
  value,
  onChange,
  onCreateNew,
}: {
  value: string;
  onChange: (value: string) => void;
  onCreateNew: () => void;
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
        >
          <span
            className={
              selectedVPC ? 'text-foreground' : 'text-muted-foreground'
            }
          >
            {selectedVPC
              ? `${selectedVPC.name} (${selectedVPC.id})`
              : 'Select VPC'}
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
                  onCreateNew();
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
        Select the VPC where you want to create this security group.
      </p>
    </div>
  );
}

function CreateVPCModalContent({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    vpcName: '',
    region: '',
    description: '',
    subnetName: '',
    subnetDescription: '',
    cidr: '',
    gatewayIp: '',
    networkAccessibility: '',
  });
  const [loading, setLoading] = useState(false);
  const [isFirstVPC] = useState(true);

  // Check if user is existing user (existing.user@krutrim.com)
  const isExistingUser = user?.email === 'existing.user@krutrim.com';

  // Mock region availability data
  const regionAvailability = {
    'us-east-1': {
      name: 'US East (N. Virginia)',
      resources: [
        { type: 'CPU Instances', availability: 'high' },
        { type: 'GPU A40', availability: 'high' },
        { type: 'GPU RTX A5000', availability: 'medium' },
        { type: 'GPU RTX A6000', availability: 'medium' },
        { type: 'Storage', availability: 'high' },
      ],
    },
    'us-west-2': {
      name: 'US West (Oregon)',
      resources: [
        { type: 'CPU Instances', availability: 'high' },
        { type: 'GPU A40', availability: 'medium' },
        { type: 'GPU RTX A5000', availability: 'low' },
        { type: 'GPU RTX A6000', availability: 'low' },
        { type: 'Storage', availability: 'high' },
      ],
    },
    'eu-west-1': {
      name: 'EU (Ireland)',
      resources: [
        { type: 'CPU Instances', availability: 'high' },
        { type: 'GPU A40', availability: 'high' },
        { type: 'GPU RTX A5000', availability: 'medium' },
        { type: 'GPU RTX A6000', availability: 'medium' },
        { type: 'Storage', availability: 'high' },
      ],
    },
    'ap-south-1': {
      name: 'Asia Pacific (Mumbai)',
      resources: [
        { type: 'CPU Instances', availability: 'medium' },
        { type: 'GPU A40', availability: 'medium' },
        { type: 'GPU RTX A5000', availability: 'high' },
        { type: 'GPU RTX A6000', availability: 'high' },
        { type: 'Storage', availability: 'medium' },
      ],
    },
    'ap-southeast-1': {
      name: 'Asia Pacific (Singapore)',
      resources: [
        { type: 'CPU Instances', availability: 'high' },
        { type: 'GPU A40', availability: 'low' },
        { type: 'GPU RTX A5000', availability: 'medium' },
        { type: 'GPU RTX A6000', availability: 'medium' },
        { type: 'Storage', availability: 'high' },
      ],
    },
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const getAvailabilityBars = (availability: string) => {
    const totalBars = 3;
    const activeBars =
      availability === 'high' ? 3 : availability === 'medium' ? 2 : 1;

    return Array.from({ length: totalBars }, (_, index) => (
      <div
        key={index}
        className={`h-1.5 w-6 rounded-sm ${
          index < activeBars
            ? getAvailabilityColor(availability)
            : 'bg-gray-300'
        }`}
      />
    ));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Creating VPC:', formData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onClose();
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='flex-shrink-0 p-6 border-b'>
        <h2 className='text-lg font-semibold'>Create New VPC</h2>
        <p className='text-sm text-muted-foreground mt-1'>
          Configure and create a new Virtual Private Cloud
        </p>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-auto'>
        <div className='flex flex-col md:flex-row gap-6 p-6'>
          {/* Main Content */}
          <div className='flex-1 space-y-6'>
            <Card>
              <CardContent className='space-y-6 pt-6'>
                <form id='vpc-form' onSubmit={handleSubmit}>
                  {/* VPC Configuration */}
                  <div className='mb-8'>
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
                        className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                        required
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        Only alphanumeric characters, hyphens, and underscores
                        allowed.
                      </p>
                    </div>

                    <div className='mb-5'>
                      <Label
                        htmlFor='region'
                        className='block mb-2 font-medium'
                      >
                        Region <span className='text-destructive'>*</span>
                      </Label>
                      <Select
                        value={formData.region}
                        onValueChange={value =>
                          handleSelectChange('region', value)
                        }
                        required
                      >
                        <SelectTrigger>
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

                      {/* Region Availability Display */}
                      {formData.region &&
                        regionAvailability[
                          formData.region as keyof typeof regionAvailability
                        ] && (
                          <div className='mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='text-xs text-gray-900'>
                                Resource Availability
                              </h4>
                              <span className='text-xs text-gray-500'>
                                {
                                  regionAvailability[
                                    formData.region as keyof typeof regionAvailability
                                  ].name
                                }
                              </span>
                            </div>
                            <div className='space-y-2'>
                              {regionAvailability[
                                formData.region as keyof typeof regionAvailability
                              ].resources.map((resource, index) => (
                                <div
                                  key={index}
                                  className='flex items-center justify-between'
                                >
                                  <span className='text-xs text-gray-700'>
                                    {resource.type}
                                  </span>
                                  <div className='flex items-center gap-0.5'>
                                    {getAvailabilityBars(resource.availability)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className='mt-2 pt-2 border-t border-gray-100'>
                              <div className='flex items-center justify-between text-xs text-gray-500'>
                                <div className='flex items-center gap-3'>
                                  <div className='flex items-center gap-1'>
                                    <div className='h-1.5 w-1.5 bg-green-500 rounded-sm'></div>
                                    <span>High</span>
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    <div className='h-1.5 w-1.5 bg-yellow-500 rounded-sm'></div>
                                    <span>Medium</span>
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    <div className='h-1.5 w-1.5 bg-gray-400 rounded-sm'></div>
                                    <span>Low</span>
                                  </div>
                                </div>
                                <span>Updated 5 min ago</span>
                              </div>
                            </div>
                          </div>
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
                        placeholder='Enter a description for this VPC'
                        value={formData.description}
                        onChange={handleChange}
                        className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]'
                      />
                    </div>

                    <div className='mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                      <p className='text-gray-600' style={{ fontSize: '13px' }}>
                        You can configure specific settings such as the Subnet,
                        CIDR block, and Gateway IP in the advanced settings.
                      </p>
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div className='mb-8'>
                    <Accordion type='single' collapsible className='w-full'>
                      <AccordionItem value='advanced-settings'>
                        <AccordionTrigger className='text-base font-semibold'>
                          Advanced Settings
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='pt-4'>
                            <div className='mb-5'>
                              <div className='flex items-center gap-2 mb-2'>
                                <Label
                                  htmlFor='subnetName'
                                  className='font-medium'
                                >
                                  Subnet Name
                                </Label>
                                <TooltipWrapper
                                  content='Name for your subnet. Use letters, numbers, hyphens, underscores.'
                                  side='top'
                                >
                                  <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                                </TooltipWrapper>
                              </div>
                              <Input
                                id='subnetName'
                                placeholder='Enter subnet name'
                                value={formData.subnetName}
                                onChange={handleChange}
                                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                              />
                            </div>

                            <div className='mb-5'>
                              <Label
                                htmlFor='subnetDescription'
                                className='block mb-2 font-medium'
                              >
                                Subnet Description
                              </Label>
                              <Textarea
                                id='subnetDescription'
                                placeholder='Enter subnet description'
                                value={formData.subnetDescription}
                                onChange={handleChange}
                                className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]'
                              />
                            </div>

                            {/* CIDR, Gateway IP, and Network Accessibility in one row */}
                            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 mb-5'>
                              <div className='min-w-0 px-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <Label htmlFor='cidr' className='font-medium'>
                                    CIDR
                                  </Label>
                                  <TooltipWrapper
                                    content='IP range for subnet. Example: 10.0.0.0/24 = 254 IPs'
                                    side='top'
                                  >
                                    <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                                  </TooltipWrapper>
                                </div>
                                <Input
                                  id='cidr'
                                  placeholder='e.g., 10.0.0.0/24'
                                  value={formData.cidr}
                                  onChange={handleChange}
                                  className='focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full'
                                />
                                <p className='text-xs text-muted-foreground mt-1'>
                                  IP address range in CIDR notation
                                </p>
                              </div>

                              <div className='min-w-0 px-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <Label
                                    htmlFor='gatewayIp'
                                    className='font-medium'
                                  >
                                    Gateway IP
                                  </Label>
                                  <TooltipWrapper
                                    content='Default gateway IP. Usually first IP in range (e.g., 10.0.0.1)'
                                    side='top'
                                  >
                                    <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                                  </TooltipWrapper>
                                </div>
                                <Input
                                  id='gatewayIp'
                                  placeholder='e.g., 10.0.0.1'
                                  value={formData.gatewayIp}
                                  onChange={handleChange}
                                  className='focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full'
                                />
                                <p className='text-xs text-muted-foreground mt-1'>
                                  Gateway IP address
                                </p>
                              </div>

                              <div className='min-w-0 px-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <Label
                                    htmlFor='networkAccessibility'
                                    className='font-medium'
                                  >
                                    Network Accessibility
                                  </Label>
                                  <TooltipWrapper
                                    content='Private: isolated from internet. Public: internet accessible'
                                    side='top'
                                  >
                                    <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                                  </TooltipWrapper>
                                </div>
                                <Select
                                  value={formData.networkAccessibility}
                                  onValueChange={value =>
                                    handleSelectChange(
                                      'networkAccessibility',
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className='w-full focus:ring-2 focus:ring-ring focus:ring-offset-2'>
                                    <SelectValue placeholder='Select accessibility' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='private'>
                                      Private
                                    </SelectItem>
                                    <SelectItem value='public'>
                                      Public
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className='text-xs text-muted-foreground mt-1'>
                                  Internet accessibility
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className='w-80 flex-shrink-0 space-y-6'>
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
                {isExistingUser ? (
                  <div className='space-y-3'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-2xl font-bold'>₹0.28</span>
                      <span className='text-sm text-muted-foreground'>
                        per hour
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      This includes the basic VPC setup and one subnet.
                    </p>
                    <div className='text-xs text-muted-foreground pt-2 border-t'>
                      <p>• VPC Setup: ₹0.28/hour</p>
                      <p>• Estimated monthly: ₹204.40</p>
                      <p>• Additional subnets: ₹0.10/hour each</p>
                    </div>
                  </div>
                ) : isFirstVPC ? (
                  <div className='space-y-3'>
                    <div className='text-2xl font-bold text-green-600'>
                      Free
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Your first Virtual Private Cloud is free! This includes
                      the basic VPC setup and one subnet.
                    </p>
                    <div className='text-xs text-muted-foreground pt-2 border-t'>
                      <p>• First VPC: ₹0.00/month</p>
                      <p>• Subsequent VPCs: ₹500.00/month</p>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <div className='text-2xl font-bold'>₹500.00</div>
                    <p className='text-sm text-muted-foreground'>per month</p>
                    <div className='text-xs text-muted-foreground pt-2 border-t'>
                      <p>• VPC Setup: ₹500.00/month</p>
                      <p>• Additional subnets: ₹100.00/month each</p>
                      <p>• Data transfer charges apply</p>
                    </div>
                  </div>
                )}
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
                      Choose a descriptive VPC name for easy identification
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                    <span
                      className='text-muted-foreground'
                      style={{ fontSize: '13px' }}
                    >
                      Select the region closest to your users for better
                      performance
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                    <span
                      className='text-muted-foreground'
                      style={{ fontSize: '13px' }}
                    >
                      Use private networks for better security
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                    <span
                      className='text-muted-foreground'
                      style={{ fontSize: '13px' }}
                    >
                      Plan your CIDR blocks to avoid IP conflicts
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='flex-shrink-0 p-6 border-t bg-gray-50'>
        <div className='flex justify-end gap-4'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            type='submit'
            form='vpc-form'
            className='bg-black text-white hover:bg-black/90 transition-colors'
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create VPC'}
          </Button>
        </div>
      </div>
    </div>
  );
}
