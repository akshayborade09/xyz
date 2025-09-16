'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout } from '../../../../../components/page-layout';
import { Card, CardContent } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Textarea } from '../../../../../components/ui/textarea';
import { Label } from '../../../../../components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../../../../components/ui/radio-group';
import { TooltipWrapper } from '../../../../../components/ui/tooltip-wrapper';
import { HelpCircle } from 'lucide-react';
import { getSubnet } from '../../../../../lib/data';
import { useToast } from '../../../../../hooks/use-toast';

export default function EditSubnetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const subnet = getSubnet(params.id);

  if (!subnet) {
    notFound();
  }

  const [formData, setFormData] = useState({
    name: subnet.name,
    description: subnet.description,
    accessType: subnet.type.toLowerCase(),
    cidr: subnet.cidr,
    gatewayIp: subnet.gatewayIp,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would update the subnet via API
      console.log('Updating subnet description:', formData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Subnet Updated',
        description: `Subnet "${subnet.name}" description has been updated successfully!`,
      });

      router.push(`/networking/subnets/${params.id}`);
    } catch (error) {
      console.error('Error updating subnet:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update subnet description. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/networking', title: 'Networking' },
    { href: '/networking/subnets', title: 'Subnets' },
    { href: `/networking/subnets/${subnet.id}`, title: subnet.name },
    { href: `/networking/subnets/${subnet.id}/edit`, title: 'Edit' },
  ];

  return (
    <PageLayout
      title={`Edit ${subnet.name}`}
      description='Update subnet description'
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                <div className='mb-8'>
                  <div className='mb-5'>
                    <Label htmlFor='name' className='block mb-2 font-medium'>
                      Name
                    </Label>
                    <Input
                      id='name'
                      placeholder='Enter subnet name'
                      value={formData.name}
                      className='focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed'
                      disabled
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Subnet name cannot be modified after creation.
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
                    <p className='text-xs text-muted-foreground mt-1'>
                      Provide a description for this subnet to help with
                      identification and management.
                    </p>
                  </div>

                  <div className='mb-5'>
                    <Label className='block mb-2 font-medium'>
                      Access Type
                    </Label>
                    <RadioGroup
                      value={formData.accessType}
                      className='flex gap-5 mt-2'
                      disabled
                    >
                      <div className='flex items-center'>
                        <RadioGroupItem value='public' id='public' disabled />
                        <Label
                          htmlFor='public'
                          className='ml-2 text-muted-foreground'
                        >
                          Public
                        </Label>
                      </div>
                      <div className='flex items-center'>
                        <RadioGroupItem value='private' id='private' disabled />
                        <Label
                          htmlFor='private'
                          className='ml-2 text-muted-foreground'
                        >
                          Private
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Access type cannot be modified after creation.
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'>
                    <div>
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
                        className='focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed'
                        disabled
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        CIDR block cannot be modified after creation.
                      </p>
                    </div>

                    <div>
                      <div className='flex items-center gap-2 mb-2'>
                        <Label htmlFor='gatewayIp' className='font-medium'>
                          Gateway IP
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
                        className='focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed'
                        disabled
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        Gateway IP cannot be modified after creation.
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
                onClick={() => router.push(`/networking/subnets/${params.id}`)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-black text-white hover:bg-black/90 transition-colors'
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Description'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='w-full lg:w-80 space-y-6'>
          <Card>
            <CardContent className='pt-6'>
              <h3 className='text-base font-semibold mb-4'>Best Practices</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Keep descriptions clear and informative for easy resource
                    identification
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Include the purpose and environment of the subnet in the
                    description
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Use consistent naming conventions across your infrastructure
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Only the description field can be modified after subnet
                    creation
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
