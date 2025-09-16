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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../../components/ui/accordion';
import { TooltipWrapper } from '../../../../components/ui/tooltip-wrapper';
import { HelpCircle } from 'lucide-react';

export default function CreateVPCPage() {
  const router = useRouter();
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

  // State to track if form has been interacted with
  const [formTouched, setFormTouched] = useState(false);

  // Mock data to check if this is the first VPC
  const [isFirstVPC] = useState(true); // This would come from your data/API

  // Check if user is existing user (existing.user@krutrim.com)
  const isExistingUser = user?.email === 'existing.user@krutrim.com';

  // Function to check if all mandatory fields are filled
  const isFormValid = () => {
    const hasValidVpcName = formData.vpcName.trim().length > 0;
    const hasValidRegion = formData.region.length > 0;
    return hasValidVpcName && hasValidRegion;
  };

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
    setFormTouched(true);
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    setFormTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create the VPC
    console.log('Creating VPC:', formData);
    router.push('/networking/vpc');
  };

  return (
    <PageLayout
      title='Create Virtual Private Cloud'
      description='Configure and create a new Virtual Private Cloud for your infrastructure'
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                {/* VPC Configuration */}
                <div className='mb-8'>
                  <div className='mb-5'>
                    <Label htmlFor='vpcName' className='block mb-2 font-medium'>
                      VPC Name <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='vpcName'
                      placeholder='Enter VPC name'
                      value={formData.vpcName}
                      onChange={handleChange}
                      className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formTouched && !formData.vpcName.trim()
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
                    <Label htmlFor='region' className='block mb-2 font-medium'>
                      Region <span className='text-destructive'>*</span>
                    </Label>
                    <Select
                      value={formData.region}
                      onValueChange={value =>
                        handleSelectChange('region', value)
                      }
                      required
                    >
                      <SelectTrigger
                        className={
                          formTouched && !formData.region
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
                        <SelectItem value='eu-west-1'>EU (Ireland)</SelectItem>
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
                          <div className='mb-5 px-1'>
                            <div className='flex items-center gap-2 mb-2'>
                              <Label
                                htmlFor='subnetName'
                                className='font-medium'
                              >
                                Subnet Name
                              </Label>
                              <TooltipWrapper
                                content={
                                  <div className='space-y-2'>
                                    <p className='font-medium'>
                                      Subnet Name Guidelines
                                    </p>
                                    <p>
                                      Choose a descriptive name that identifies
                                      the subnet's purpose or environment.
                                    </p>
                                    <p>
                                      <strong>Allowed characters:</strong>
                                    </p>
                                    <ul className='list-disc pl-4 space-y-1'>
                                      <li>Letters (a-z, A-Z)</li>
                                      <li>Numbers (0-9)</li>
                                      <li>Hyphens (-)</li>
                                      <li>Underscores (_)</li>
                                    </ul>
                                    <p>
                                      <strong>Examples:</strong> web-subnet,
                                      db-private, app-tier-1
                                    </p>
                                  </div>
                                }
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
                              className='focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full'
                            />
                          </div>

                          <div className='mb-5 px-1'>
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
                              className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px] w-full'
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
                                  content={
                                    <div className='space-y-2'>
                                      <p className='font-medium'>
                                        CIDR Block Configuration
                                      </p>
                                      <p>
                                        Define the IP address range for your
                                        subnet using CIDR notation.
                                      </p>
                                      <p>
                                        <strong>Common CIDR blocks:</strong>
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
                                        <strong>Example:</strong> 10.0.1.0/24
                                        provides IPs from 10.0.1.1 to 10.0.1.254
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
                                  content={
                                    <div className='space-y-2'>
                                      <p className='font-medium'>
                                        Gateway IP Configuration
                                      </p>
                                      <p>
                                        The gateway IP serves as the default
                                        route for resources in this subnet to
                                        communicate with other subnets and
                                        external networks.
                                      </p>
                                      <p>
                                        <strong>Best Practices:</strong>
                                      </p>
                                      <ul className='list-disc pl-4 space-y-1'>
                                        <li>
                                          Usually the first IP in your CIDR
                                          range
                                        </li>
                                        <li>
                                          Must be within your subnet's CIDR
                                          range
                                        </li>
                                        <li>
                                          Cannot be the network or broadcast
                                          address
                                        </li>
                                      </ul>
                                      <p>
                                        <strong>Example:</strong> For subnet
                                        10.0.1.0/24, use 10.0.1.1 as gateway
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
                                  content={
                                    <div className='space-y-2'>
                                      <p className='font-medium'>
                                        Network Accessibility Types
                                      </p>
                                      <p>
                                        <strong>Private Subnet:</strong>
                                      </p>
                                      <ul className='list-disc pl-4 space-y-1'>
                                        <li>
                                          Isolated from direct internet access
                                        </li>
                                        <li>
                                          Resources can only communicate within
                                          the VPC
                                        </li>
                                        <li>
                                          Ideal for databases, application
                                          servers, and backend services
                                        </li>
                                        <li>
                                          Higher security for sensitive
                                          workloads
                                        </li>
                                      </ul>
                                      <p>
                                        <strong>Public Subnet:</strong>
                                      </p>
                                      <ul className='list-disc pl-4 space-y-1'>
                                        <li>
                                          Direct internet access available
                                        </li>
                                        <li>
                                          Resources can receive public IP
                                          addresses
                                        </li>
                                        <li>
                                          Suitable for web servers, load
                                          balancers, and NAT gateways
                                        </li>
                                        <li>
                                          Required for internet-facing
                                          applications
                                        </li>
                                      </ul>
                                    </div>
                                  }
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
                                  <SelectItem value='public'>Public</SelectItem>
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
            <div className='flex justify-end gap-4 px-6 pb-6'>
              <Button
                type='button'
                variant='outline'
                className='hover:bg-secondary transition-colors'
                onClick={() => router.push('/networking/vpc')}
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
                    : 'Create VPC'
                  : 'Create VPC'}
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
                  </div>
                </div>
              ) : isFirstVPC ? (
                <div className='space-y-3'>
                  <div className='text-2xl font-bold text-green-600'>Free</div>
                  <p className='text-sm text-muted-foreground'>
                    Your first Virtual Private Cloud is free! This includes the
                    basic VPC setup and one subnet.
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
        </div>
      </div>
    </PageLayout>
  );
}
