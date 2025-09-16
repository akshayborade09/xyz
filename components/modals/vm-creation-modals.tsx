'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';

// Create VPC Modal within VM Creation
interface CreateVPCModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (vpcId: string) => void;
  preselectedRegion?: string;
}

export function CreateVPCModal({
  open,
  onClose,
  onSuccess,
  preselectedRegion,
}: CreateVPCModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstVPC] = useState(true); // Mock data

  // Check if user is existing user (existing.user@krutrim.com)
  const isExistingUser = user?.email === 'existing.user@krutrim.com';
  const [formData, setFormData] = useState({
    vpcName: '',
    description: '',
    region: preselectedRegion || '',
    subnetName: '',
    subnetDescription: '',
    cidr: '10.0.0.0/24',
    gatewayIp: '10.0.0.1',
    networkAccessibility: 'public',
  });

  const regions = [
    { id: 'us-east-1', name: 'US East (N. Virginia)' },
    { id: 'us-west-2', name: 'US West (Oregon)' },
    { id: 'eu-west-1', name: 'EU (Ireland)' },
    { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  ];

  // Mock region availability data
  const regionAvailability = {
    'us-east-1': {
      name: 'US East (N. Virginia)',
      resources: [
        { type: 'CPU Instances', availability: 'high' },
        { type: 'GPU A40', availability: 'high' },
        { type: 'GPU RTX A5000', availability: 'medium' },
        { type: 'Storage', availability: 'high' },
      ],
    },
    'us-west-2': {
      name: 'US West (Oregon)',
      resources: [
        { type: 'CPU Instances', availability: 'high' },
        { type: 'GPU A40', availability: 'medium' },
        { type: 'Storage', availability: 'high' },
      ],
    },
  };

  const getAvailabilityBars = (level: string) => {
    const barCount = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
    const barColor =
      level === 'high'
        ? 'bg-green-500'
        : level === 'medium'
          ? 'bg-yellow-500'
          : 'bg-gray-400';

    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`h-2 w-1 ${i < barCount ? barColor : 'bg-gray-200'} rounded-sm`}
      />
    ));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const field = id.replace('vpc-', '').replace('-', '');
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate VPC creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newVpcId = `vpc-${Date.now()}`;
      toast({
        title: 'VPC created successfully',
        description: `${formData.vpcName} has been created and is ready for use.`,
      });

      onSuccess(newVpcId);
      onClose();

      // Reset form
      setFormData({
        vpcName: '',
        description: '',
        region: preselectedRegion || '',
        subnetName: '',
        subnetDescription: '',
        cidr: '10.0.0.0/24',
        gatewayIp: '10.0.0.1',
        networkAccessibility: 'public',
      });
    } catch (error) {
      toast({
        title: 'Failed to create VPC',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='p-0 bg-white max-w-[80vw] max-h-[85vh] w-[80vw] h-[85vh] overflow-hidden flex flex-col'>
        <DialogHeader className='flex-shrink-0 p-6 border-b'>
          <DialogTitle className='text-2xl font-semibold'>
            Create Virtual Private Cloud
          </DialogTitle>
        </DialogHeader>

        <div className='flex-1 flex gap-6 min-h-0 p-6'>
          {/* Main Content */}
          <div
            className='flex-1 overflow-y-auto'
            style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}
          >
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* VPC Configuration */}
              <div className='space-y-5'>
                <div>
                  <Label
                    htmlFor='vpc-vpcName'
                    className='block mb-2 font-medium'
                  >
                    VPC Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='vpc-vpcName'
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

                <div>
                  <Label
                    htmlFor='vpc-region'
                    className='block mb-2 font-medium'
                  >
                    Region <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={formData.region}
                    onValueChange={value => handleSelectChange('region', value)}
                    disabled={!!preselectedRegion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a region' />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
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
                      </div>
                    )}
                </div>

                <div>
                  <Label
                    htmlFor='vpc-description'
                    className='block mb-2 font-medium'
                  >
                    Description
                  </Label>
                  <Textarea
                    id='vpc-description'
                    placeholder='Enter a description for this VPC'
                    value={formData.description}
                    onChange={handleChange}
                    className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]'
                  />
                </div>

                <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                  <p className='text-gray-600' style={{ fontSize: '13px' }}>
                    You can configure specific settings such as the Subnet, CIDR
                    block, and Gateway IP in the advanced settings.
                  </p>
                </div>
              </div>

              {/* Advanced Settings */}
              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem value='advanced-settings'>
                  <AccordionTrigger className='text-base font-semibold'>
                    Advanced Settings
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='pt-4 space-y-5'>
                      <div>
                        <div className='flex items-center gap-2 mb-2'>
                          <Label
                            htmlFor='vpc-subnetName'
                            className='font-medium'
                          >
                            Subnet Name
                          </Label>
                          <TooltipWrapper content='Choose a descriptive name for the default subnet'>
                            <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                          </TooltipWrapper>
                        </div>
                        <Input
                          id='vpc-subnetName'
                          placeholder='Enter subnet name'
                          value={formData.subnetName}
                          onChange={handleChange}
                          className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor='vpc-subnetDescription'
                          className='block mb-2 font-medium'
                        >
                          Subnet Description
                        </Label>
                        <Textarea
                          id='vpc-subnetDescription'
                          placeholder='Enter subnet description'
                          value={formData.subnetDescription}
                          onChange={handleChange}
                          className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]'
                        />
                      </div>

                      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                        <div>
                          <div className='flex items-center gap-2 mb-2'>
                            <Label htmlFor='vpc-cidr' className='font-medium'>
                              CIDR
                            </Label>
                            <TooltipWrapper content='IP address range in CIDR notation (e.g., 10.0.0.0/24)'>
                              <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                            </TooltipWrapper>
                          </div>
                          <Input
                            id='vpc-cidr'
                            placeholder='e.g., 10.0.0.0/24'
                            value={formData.cidr}
                            onChange={handleChange}
                            className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                          />
                        </div>

                        <div>
                          <div className='flex items-center gap-2 mb-2'>
                            <Label
                              htmlFor='vpc-gatewayIp'
                              className='font-medium'
                            >
                              Gateway IP
                            </Label>
                            <TooltipWrapper content='Default gateway for the subnet'>
                              <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                            </TooltipWrapper>
                          </div>
                          <Input
                            id='vpc-gatewayIp'
                            placeholder='e.g., 10.0.0.1'
                            value={formData.gatewayIp}
                            onChange={handleChange}
                            className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                          />
                        </div>

                        <div>
                          <div className='flex items-center gap-2 mb-2'>
                            <Label className='font-medium'>
                              Network Accessibility
                            </Label>
                            <TooltipWrapper content='Internet accessibility for the subnet'>
                              <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                            </TooltipWrapper>
                          </div>
                          <Select
                            value={formData.networkAccessibility}
                            onValueChange={value =>
                              handleSelectChange('networkAccessibility', value)
                            }
                          >
                            <SelectTrigger className='focus:ring-2 focus:ring-ring focus:ring-offset-2'>
                              <SelectValue placeholder='Select accessibility' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='private'>Private</SelectItem>
                              <SelectItem value='public'>Public</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </div>

          {/* Side Panel */}
          <div className='w-80 flex-shrink-0 space-y-6'>
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
          </div>
        </div>

        <DialogFooter className='flex-shrink-0 p-6 border-t bg-gray-50'>
          <div className='flex justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.vpcName || !formData.region}
              className='bg-black text-white hover:bg-black/90'
            >
              {isLoading ? 'Creating...' : 'Create VPC'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Create Subnet Modal within VM Creation
interface CreateSubnetModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (subnetId: string) => void;
  vpcId: string;
  vpcName?: string;
}

export function CreateSubnetModal({
  open,
  onClose,
  onSuccess,
  vpcId,
  vpcName,
}: CreateSubnetModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subnetName: '',
    description: '',
    cidr: '10.0.1.0/24',
    accessibility: 'public',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate subnet creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newSubnetId = `subnet-${Date.now()}`;
      toast({
        title: 'Subnet created successfully',
        description: `${formData.subnetName} has been created in ${vpcName || 'the selected VPC'}.`,
      });

      onSuccess(newSubnetId);
      onClose();

      // Reset form
      setFormData({
        subnetName: '',
        description: '',
        cidr: '10.0.1.0/24',
        accessibility: 'public',
      });
    } catch (error) {
      toast({
        title: 'Failed to create subnet',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create New Subnet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='text-sm text-muted-foreground'>
            Creating subnet in:{' '}
            <span className='font-medium'>{vpcName || vpcId}</span>
          </div>

          <div>
            <Label htmlFor='subnet-name' className='block mb-2 font-medium'>
              Subnet Name <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='subnet-name'
              placeholder='Enter subnet name'
              value={formData.subnetName}
              onChange={e =>
                setFormData(prev => ({ ...prev, subnetName: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor='subnet-description'>Description</Label>
            <Textarea
              id='subnet-description'
              placeholder='Enter subnet description (optional)'
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor='subnet-cidr' className='block mb-2 font-medium'>
              CIDR Block <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='subnet-cidr'
              placeholder='10.0.1.0/24'
              value={formData.cidr}
              onChange={e =>
                setFormData(prev => ({ ...prev, cidr: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label
              htmlFor='subnet-accessibility'
              className='block mb-2 font-medium'
            >
              Network Accessibility
            </Label>
            <Select
              value={formData.accessibility}
              onValueChange={value =>
                setFormData(prev => ({ ...prev, accessibility: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select accessibility' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='public'>Public</SelectItem>
                <SelectItem value='private'>Private</SelectItem>
              </SelectContent>
            </Select>
            <p className='text-xs text-muted-foreground mt-1'>
              Public subnets allow internet access
            </p>
          </div>

          <DialogFooter className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading || !formData.subnetName || !formData.cidr}
              className='bg-black text-white hover:bg-black/90'
            >
              {isLoading ? 'Creating...' : 'Create Subnet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Create Security Group Modal within VM Creation
interface CreateSecurityGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (sgId: string) => void;
  vpcId: string;
  vpcName?: string;
}

export function CreateSecurityGroupModal({
  open,
  onClose,
  onSuccess,
  vpcId,
  vpcName,
}: CreateSecurityGroupModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    sgName: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate security group creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newSgId = `sg-${Date.now()}`;
      toast({
        title: 'Security group created successfully',
        description: `${formData.sgName} has been created with default SSH access rules.`,
      });

      onSuccess(newSgId);
      onClose();

      // Reset form
      setFormData({
        sgName: '',
        description: '',
      });
    } catch (error) {
      toast({
        title: 'Failed to create security group',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create New Security Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='text-sm text-muted-foreground'>
            Creating security group in:{' '}
            <span className='font-medium'>{vpcName || vpcId}</span>
          </div>

          <div>
            <Label htmlFor='sg-name' className='block mb-2 font-medium'>
              Security Group Name <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='sg-name'
              placeholder='Enter security group name'
              value={formData.sgName}
              onChange={e =>
                setFormData(prev => ({ ...prev, sgName: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor='sg-description' className='block mb-2 font-medium'>
              Description <span className='text-destructive'>*</span>
            </Label>
            <Textarea
              id='sg-description'
              placeholder='Describe the purpose of this security group'
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              required
            />
          </div>

          <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
            <div className='text-sm'>
              <div className='font-medium text-blue-900 mb-1'>
                Default Rules
              </div>
              <div className='text-blue-800 space-y-1'>
                <div>• SSH (Port 22) - Inbound from anywhere</div>
                <div>• HTTP (Port 80) - Inbound from anywhere</div>
                <div>• HTTPS (Port 443) - Inbound from anywhere</div>
                <div>• All traffic - Outbound to anywhere</div>
              </div>
              <div className='text-xs text-blue-700 mt-2'>
                You can modify these rules after creation
              </div>
            </div>
          </div>

          <DialogFooter className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading || !formData.sgName || !formData.description}
              className='bg-black text-white hover:bg-black/90'
            >
              {isLoading ? 'Creating...' : 'Create Security Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Create SSH Key Modal within VM Creation
interface CreateSSHKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (sshKeyId: string) => void;
}

export function CreateSSHKeyModal({
  open,
  onClose,
  onSuccess,
}: CreateSSHKeyModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    region: '',
    keyName: '',
    publicKey: '',
  });

  const regions = [
    { id: 'us-east-1', name: 'US East (N. Virginia)' },
    { id: 'us-west-2', name: 'US West (Oregon)' },
    { id: 'eu-west-1', name: 'EU (Ireland)' },
    { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const field = id.replace('ssh-', '');
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate SSH key creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newKeyId = `ssh-${Date.now()}`;
      toast({
        title: 'SSH key created successfully',
        description: `${formData.keyName} has been created and is ready for use.`,
      });

      onSuccess(newKeyId);
      onClose();

      // Reset form
      setFormData({
        region: '',
        keyName: '',
        publicKey: '',
      });
    } catch (error) {
      toast({
        title: 'Failed to create SSH key',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create SSH Key</DialogTitle>
          <DialogDescription>
            Create a new SSH key for secure access to your virtual machines.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='ssh-region'>Region *</Label>
            <Select
              value={formData.region}
              onValueChange={value => handleSelectChange('region', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder='Select region' />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='ssh-keyName'>Key Name *</Label>
            <Input
              id='ssh-keyName'
              placeholder='Enter SSH key name'
              value={formData.keyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='ssh-publicKey'>Public Key *</Label>
            <Textarea
              id='ssh-publicKey'
              placeholder='Paste your SSH public key here (starts with ssh-rsa, ssh-ed25519, etc.)'
              value={formData.publicKey}
              onChange={handleChange}
              rows={6}
              className='font-mono text-sm'
              required
            />
            <p className='text-xs text-muted-foreground'>
              Paste your complete SSH public key including the key type and
              comment
            </p>
          </div>
        </div>
        <DialogFooter className='flex gap-2 sm:justify-end sticky bottom-0 bg-white border-t pt-4 mt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !formData.keyName ||
              !formData.region ||
              !formData.publicKey
            }
          >
            {isLoading ? 'Creating...' : 'Create Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
