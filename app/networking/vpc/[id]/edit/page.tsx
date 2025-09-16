'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout } from '../../../../../components/page-layout';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Textarea } from '../../../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';
import { Card, CardContent } from '../../../../../components/ui/card';
import { getVPC } from '../../../../../lib/data';
import { useToast } from '../../../../../hooks/use-toast';
import { TooltipWrapper } from '../../../../../components/ui/tooltip-wrapper';
import { HelpCircle } from 'lucide-react';

export default function EditVPCPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const vpc = getVPC(params.id);

  if (!vpc) {
    notFound();
  }

  const [formData, setFormData] = useState({
    vpcName: '',
    region: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  // Pre-populate form with existing VPC data
  useEffect(() => {
    if (vpc) {
      setFormData({
        vpcName: vpc.name,
        region: vpc.region,
        description: vpc.description || '',
      });
    }
  }, [vpc]);

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
        { type: 'CPU Instances', availability: 'medium' },
        { type: 'GPU A40', availability: 'low' },
        { type: 'GPU RTX A5000', availability: 'medium' },
        { type: 'GPU RTX A6000', availability: 'medium' },
        { type: 'Storage', availability: 'medium' },
      ],
    },
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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'VPC Updated Successfully',
        description: `Description for ${formData.vpcName} has been updated successfully.`,
      });

      // Navigate back to VPC detail page
      router.push(`/networking/vpc/${vpc.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update VPC. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'high':
        return '●';
      case 'medium':
        return '●';
      case 'low':
        return '●';
      default:
        return '●';
    }
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/networking', title: 'Networking' },
    { href: '/networking/vpc', title: 'VPC' },
    { href: `/networking/vpc/${vpc.id}`, title: vpc.name },
    { href: `/networking/vpc/${vpc.id}/edit`, title: 'Edit' },
  ];

  return (
    <PageLayout
      title={`Edit VPC: ${vpc.name}`}
      customBreadcrumbs={customBreadcrumbs}
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
                    <div className='flex items-center gap-2 mb-2'>
                      <Label htmlFor='vpcName' className='font-medium'>
                        VPC Name <span className='text-destructive'>*</span>
                      </Label>
                      <TooltipWrapper content='VPC name cannot be changed after creation. This field is read-only.'>
                        <HelpCircle className='h-4 w-4 text-muted-foreground cursor-help' />
                      </TooltipWrapper>
                    </div>
                    <Input
                      id='vpcName'
                      placeholder='Enter VPC name'
                      value={formData.vpcName}
                      onChange={handleChange}
                      className='bg-gray-50 text-gray-500 cursor-not-allowed'
                      disabled
                      required
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      The VPC name cannot be changed after creation.
                    </p>
                  </div>

                  <div className='mb-5'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Label htmlFor='region' className='font-medium'>
                        Region <span className='text-destructive'>*</span>
                      </Label>
                      <TooltipWrapper content='Region cannot be changed after VPC creation. This field is read-only.'>
                        <HelpCircle className='h-4 w-4 text-muted-foreground cursor-help' />
                      </TooltipWrapper>
                    </div>
                    <Select
                      value={formData.region}
                      onValueChange={value =>
                        handleSelectChange('region', value)
                      }
                      disabled
                    >
                      <SelectTrigger className='bg-gray-50 text-gray-500 cursor-not-allowed'>
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
                    <p className='text-xs text-muted-foreground mt-1'>
                      The region cannot be changed after VPC creation.
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
                      placeholder='Enter a description for this VPC'
                      value={formData.description}
                      onChange={handleChange}
                      className='focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]'
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Provide a meaningful description to help identify this
                      VPC.
                    </p>
                  </div>

                  <div className='mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                    <p className='text-gray-600' style={{ fontSize: '13px' }}>
                      Only the description can be edited. VPC name and region
                      cannot be changed after creation for security and
                      consistency reasons. For subnet management, navigate to
                      the VPC details page.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-end gap-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.push(`/networking/vpc/${vpc.id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='bg-black text-white hover:bg-black/90 transition-colors'
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Description'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className='w-80 flex-shrink-0'>
          <div className='space-y-6'>
            {/* Current Configuration */}
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
              <h3 className='text-base font-semibold mb-4'>
                Current Configuration
              </h3>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>VPC ID:</span>
                  <span className='font-mono'>{vpc.id}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Type:</span>
                  <span>{vpc.type}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Status:</span>
                  <span className='capitalize'>{vpc.status}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Created:</span>
                  <span>{new Date(vpc.createdOn).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Region Information */}
            {formData.region &&
              regionAvailability[
                formData.region as keyof typeof regionAvailability
              ] && (
                <Card>
                  <CardContent className='pt-6'>
                    <h3 className='text-base font-normal'>
                      Region Information
                    </h3>
                    <div className='space-y-3 mt-4'>
                      <div>
                        <p className='text-sm font-medium'>
                          {
                            regionAvailability[
                              formData.region as keyof typeof regionAvailability
                            ].name
                          }
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>
                          Current region for this VPC
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium mb-2'>
                          Resource Availability:
                        </p>
                        <div className='space-y-1'>
                          {regionAvailability[
                            formData.region as keyof typeof regionAvailability
                          ].resources.map((resource, index) => (
                            <div
                              key={index}
                              className='flex justify-between items-center text-xs'
                            >
                              <span>{resource.type}</span>
                              <span
                                className={`flex items-center gap-1 ${getAvailabilityColor(resource.availability)}`}
                              >
                                <span>
                                  {getAvailabilityIcon(resource.availability)}
                                </span>
                                <span className='capitalize'>
                                  {resource.availability}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
