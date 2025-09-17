'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { autoScalingTemplates } from '@/lib/data';
import {
  Edit,
  Trash2,
  Activity,
  Shield,
  FileText,
} from 'lucide-react';
import { PageLayout } from '@/components/page-layout';
import { DetailGrid } from '@/components/detail-grid';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipContent } from '@/lib/tooltip-content';

// Mock data to match Create Template structure
const instanceTypes = [
  { id: "cpu-1x-4gb", name: "CPU-1x-4GB", vcpus: 1, ram: 4, pricePerHour: 3 },
  { id: "cpu-2x-8gb", name: "CPU-2x-8GB", vcpus: 2, ram: 8, pricePerHour: 6 },
  { id: "t3.medium", name: "t3.medium", vcpus: 2, ram: 4, pricePerHour: 5 },
  { id: "cpu-4x-16gb", name: "CPU-4x-16GB", vcpus: 4, ram: 16, pricePerHour: 13 },
  { id: "cpu-8x-32gb", name: "CPU-8x-32GB", vcpus: 8, ram: 32, pricePerHour: 25 },
  { id: "cpu-16x-64gb", name: "CPU-16x-64GB", vcpus: 16, ram: 64, pricePerHour: 49 },
  { id: "cpu-32x-128gb", name: "CPU-32x-128GB", vcpus: 32, ram: 128, pricePerHour: 97 }
]

const machineImages = [
  { id: "ami-ubuntu-20.04", name: "Ubuntu 20.04 LTS", description: "Latest Ubuntu 20.04 LTS" },
  { id: "ami-ubuntu-22.04", name: "Ubuntu 22.04 LTS", description: "Latest Ubuntu 22.04 LTS" },
  { id: "ami-centos-7", name: "CentOS 7", description: "Latest CentOS 7" },
  { id: "ami-centos-8", name: "CentOS 8", description: "Latest CentOS 8" },
  { id: "ami-rhel-7", name: "Red Hat Enterprise Linux 7", description: "Latest RHEL 7" },
  { id: "ami-rhel-8", name: "Red Hat Enterprise Linux 8", description: "Latest RHEL 8" },
]

const sshKeys = [
  { id: "ssh-key-1", name: "my-key-pair" },
  { id: "ssh-key-2", name: "production-key" },
  { id: "ssh-key-3", name: "development-key" },
]

const mockSecurityGroups = [
  { id: "sg-default", name: "default", description: "Default security group" },
  { id: "sg-web", name: "web-servers", description: "Security group for web servers" },
  { id: "sg-db", name: "database", description: "Security group for database servers" },
  { id: "sg-app", name: "application", description: "Security group for application servers" },
  { id: "sg-cache", name: "cache-servers", description: "Security group for cache servers" }
]

export default function TemplateDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const template = autoScalingTemplates.find(t => t.id === id);

  if (!template) {
    return (
      <div className='p-8 text-center text-gray-500'>
        Template not found
      </div>
    );
  }


  // Breadcrumbs
  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/compute', title: 'Compute' },
    { href: '/compute/auto-scaling', title: 'Auto Scaling' },
    { href: `/compute/auto-scaling/templates/${template.id}`, title: "cache-server-template" },
  ];

  // Mock template data to match Create Template structure
  const templateData = {
    // Template Name
    templateName: "cache-server-template",
    
    // Instance Configuration
    instanceName: "cache-server-template-instance",
    instanceType: "t3.medium",
    
    // Storage Configuration
    bootVolumeName: "cache-server-template-boot",
    bootVolumeSize: 20,
    machineImage: template.imageId || "ami-ubuntu-22.04",
    storageVolumes: [
      {
        id: "vol-1",
        name: "data-volume",
        size: 100,
        type: "Standard"
      }
    ],
    
    // Scripts & Tags
    sshKey: template.keyName || "ssh-key-2",
    startupScript: template.userData || "#!/bin/bash\necho 'Template startup script'",
    tags: [
      { key: "Environment", value: "Production" },
      { key: "Template", value: "cache-server-template" },
      { key: "Version", value: "V6" }
    ],
    
    // Network Configuration
    region: "us-east-1",
    vpc: "vpc-1",
    subnet: "subnet-1",
    securityGroups: ["sg-default", "sg-web"],
    
    // Auto Scaling Policies
    scalingPolicies: [
      {
        id: "policy-1",
        type: "Average CPU Utilization",
        upScaleTarget: 70,
        downScaleTarget: 40,
        scaleOutCooldown: 180,
        scaleInCooldown: 300
      },
      {
        id: "policy-2",
        type: "Average Memory Utilization",
        upScaleTarget: 80,
        downScaleTarget: 50,
        scaleOutCooldown: 240,
        scaleInCooldown: 360
      }
    ]
  };

  // Helper functions
  const getInstanceTypeDetails = (typeId: string) => {
    return instanceTypes.find(t => t.id === typeId) || instanceTypes[2]; // default to cpu-4x-16gb
  };

  const getMachineImageDetails = (imageId: string) => {
    return machineImages.find(img => img.id === imageId) || machineImages[1]; // default to Ubuntu 22.04
  };

  const getSSHKeyDetails = (keyId: string) => {
    return sshKeys.find(key => key.id === keyId) || sshKeys[1]; // default to production-key
  };

  const getSecurityGroupDetails = (sgIds: string[]) => {
    return sgIds.map(id => mockSecurityGroups.find(sg => sg.id === id)).filter(Boolean);
  };


  // Action handlers
  const handleEdit = () => {
    window.location.href = `/compute/auto-scaling/templates/${template.id}/edit`;
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    toast({
      title: "Template deleted",
      description: `cache-server-template has been deleted successfully.`,
    });
    setIsDeleteModalOpen(false);
    // In a real app, you would navigate back to the listing page
    // window.location.href = '/compute/auto-scaling';
  };

  const instanceTypeDetails = getInstanceTypeDetails(templateData.instanceType);
  const machineImageDetails = getMachineImageDetails(templateData.machineImage);
  const sshKeyDetails = getSSHKeyDetails(templateData.sshKey);
  const securityGroupDetails = getSecurityGroupDetails(templateData.securityGroups);

  return (
    <PageLayout
      title="cache-server-template"
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      <div className='space-y-8'>
        {/* Template Basic Information */}
        <div
          className='mb-6 group relative'
          style={{
            borderRadius: '16px',
            border: '4px solid #FFF',
            background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
            boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
            padding: '1.5rem',
          }}
        >
          {/* Overlay Edit/Delete Buttons */}
          <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleEdit}
                    className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Template</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleDelete}
                    className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Template</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <DetailGrid>
            {/* Template Name, Type, Flavour, Version, Created On in one row */}
            <div className='col-span-full grid grid-cols-5 gap-4'>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Template Name
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  cache-server-template
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Type
                </label>
                <div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs hover:bg-blue-100 hover:text-blue-800 cursor-default">
                    CPU
                  </Badge>
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Flavour
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  t3.medium
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Version
                </label>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <Badge variant="secondary" className="bg-black text-white text-xs font-medium hover:bg-black hover:text-white cursor-default">
                      V6
                    </Badge>
                  </div>
                  <div className='text-xs text-gray-500'>
                    Latest Version
                  </div>
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Created On
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  22/01/2024
                </div>
              </div>
            </div>
          </DetailGrid>
        </div>

        {/* Main Content - Full Width */}
        <div className="w-full space-y-6">
          {/* Instance Configuration */}
          <div className='bg-card text-card-foreground border-border border rounded-lg'>
            <div className='p-6 pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <h3 className='text-lg font-semibold'>Instance Configuration</h3>
                </div>
              </div>
            </div>
            <div className='px-6 pb-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium leading-none'>Instance Name</h4>
                    </div>
                  </div>
                  <div className='space-y-3 text-xs'>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Name</Label>
                      <div className='mt-1'>
                        <span className='text-sm'>{templateData.instanceName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium leading-none'>Instance Type</h4>
                    </div>
                  </div>
                  <div className='space-y-3 text-xs'>
                    <div className='grid grid-cols-2 gap-6'>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Type</Label>
                        <div className='mt-1'>
                          <span className='text-sm'>{instanceTypeDetails.name}</span>
                        </div>
                      </div>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Specs</Label>
                        <div className='mt-1'>
                          <span className='text-sm'>{instanceTypeDetails.vcpus} vCPU • {instanceTypeDetails.ram} GB RAM</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Price</Label>
                      <div className='mt-1'>
                        <span className='text-sm font-semibold'>₹{instanceTypeDetails.pricePerHour}/hr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Configuration */}
          <div className='bg-card text-card-foreground border-border border rounded-lg'>
            <div className='p-6 pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <h3 className='text-lg font-semibold'>Storage Configuration</h3>
                </div>
              </div>
            </div>
            <div className='px-6 pb-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Bootable Volume */}
                <div className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium leading-none'>Boot Volume</h4>
                    </div>
                  </div>
                  <div className='space-y-3 text-xs'>
                    <div className='grid grid-cols-2 gap-6'>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Volume Name</Label>
                        <div className='mt-1'>
                          <span className='text-sm'>{templateData.bootVolumeName}</span>
                        </div>
                      </div>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Size</Label>
                        <div className='mt-1'>
                          <span className='text-sm'>{templateData.bootVolumeSize} GB</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Machine Image</Label>
                      <div className='mt-1'>
                        <span className='text-sm'>{machineImageDetails.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Storage Volumes */}
                {templateData.storageVolumes.map((volume, index) => (
                  <div key={volume.id} className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-sm font-medium leading-none'>{volume.name}</h4>
                      </div>
                    </div>
                    <div className='space-y-3 text-xs'>
                      <div className='grid grid-cols-2 gap-6'>
                        <div>
                          <Label className='text-xs text-muted-foreground'>Size</Label>
                          <div className='mt-1'>
                            <span className='text-sm'>{volume.size} GB</span>
                          </div>
                        </div>
                        <div>
                          <Label className='text-xs text-muted-foreground'>Type</Label>
                          <div className='mt-1'>
                            <span className='text-sm'>{volume.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scripts & Tags */}
          <div className='bg-card text-card-foreground border-border border rounded-lg'>
            <div className='p-6 pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <h3 className='text-lg font-semibold'>Scripts & Tags</h3>
                </div>
              </div>
            </div>
            <div className='px-6 pb-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* SSH Key */}
                <div className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium leading-none'>SSH Key</h4>
                    </div>
                  </div>
                  <div className='space-y-3 text-xs'>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Key Name</Label>
                      <div className='mt-1'>
                        <span className='text-sm'>{sshKeyDetails.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Startup Script */}
                <div className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium leading-none'>Startup Script</h4>
                    </div>
                  </div>
                  <div className='space-y-3 text-xs'>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Script Content</Label>
                      <div className='mt-1'>
                        <pre className='text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-gray-50 p-2 rounded border'>
                          {templateData.startupScript}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {templateData.tags.map((tag, index) => (
                  <div key={index} className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-sm font-medium leading-none'>Tag: {tag.key}</h4>
                      </div>
                    </div>
                    <div className='space-y-3 text-xs'>
                      <div className='grid grid-cols-2 gap-6'>
                        <div>
                          <Label className='text-xs text-muted-foreground'>Key</Label>
                          <div className='mt-1'>
                            <span className='text-sm'>{tag.key}</span>
                          </div>
                        </div>
                        <div>
                          <Label className='text-xs text-muted-foreground'>Value</Label>
                          <div className='mt-1'>
                            <span className='text-sm'>{tag.value}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Network Configuration */}
          <div className='bg-card text-card-foreground border-border border rounded-lg'>
            <div className='p-6 pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <h3 className='text-lg font-semibold'>Network Configuration</h3>
                </div>
              </div>
            </div>
            <div className='px-6 pb-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Region */}
                <div className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium leading-none'>Region</h4>
                    </div>
                  </div>
                  <div className='space-y-3 text-xs'>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Location</Label>
                      <div className='mt-1'>
                        <span className='text-sm'>US East (N. Virginia)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VPC */}
                <div className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium leading-none'>VPC</h4>
                    </div>
                  </div>
                  <div className='space-y-3 text-xs'>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Network</Label>
                      <div className='mt-1'>
                        <span className='text-sm'>Default VPC (us-east-1)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subnet */}
                <div className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium leading-none'>Subnet</h4>
                    </div>
                  </div>
                  <div className='space-y-3 text-xs'>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Type</Label>
                      <div className='mt-1 flex items-center gap-2'>
                        <span className='text-sm'>Public Subnet</span>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800 cursor-default">
                          Public
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Groups */}
                {securityGroupDetails.map((sg) => (
                  <div key={sg?.id} className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-sm font-medium leading-none'>{sg?.name}</h4>
                      </div>
                    </div>
                    <div className='space-y-3 text-xs'>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Description</Label>
                        <div className='mt-1'>
                          <span className='text-sm'>{sg?.description}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auto Scaling Policies */}
          <div className='bg-card text-card-foreground border-border border rounded-lg'>
            <div className='p-6 pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <h3 className='text-lg font-semibold'>Auto Scaling Policies</h3>
                </div>
              </div>
            </div>
            <div className='px-6 pb-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {templateData.scalingPolicies.map((policy, index) => (
                  <div key={policy.id} className='border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <h4 className='text-sm font-medium leading-none'>{policy.type}</h4>
                        <Badge 
                          variant="secondary" 
                          className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800 cursor-default text-xs h-5"
                        >
                          Active
                        </Badge>
                      </div>
                    </div>
                    
                    <div className='space-y-3 text-xs'>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Type</Label>
                        <div className='mt-1 flex items-center gap-2'>
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-100 text-gray-800 font-medium hover:bg-gray-100 hover:text-gray-800 cursor-default"
                          >
                            {policy.type === "Average CPU Utilization" ? "CPU" : 
                             policy.type === "Average Memory Utilization" ? "Memory" : "Scheduled"}
                          </Badge>
                          <span className="text-sm">{policy.type}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-xs text-muted-foreground">Up Scale Target</Label>
                          <div className="mt-1">
                            <span className="text-sm font-medium">{policy.upScaleTarget}%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Down Scale Target</Label>
                          <div className="mt-1">
                            <span className="text-sm font-medium">{policy.downScaleTarget}%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Scale Out Cooldown</Label>
                          <div className="mt-1">
                            <span className="text-sm">{policy.scaleOutCooldown}s</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Scale In Cooldown</Label>
                          <div className="mt-1">
                            <span className="text-sm">{policy.scaleInCooldown}s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        resourceName="cache-server-template"
        resourceType="Template"
      />
    </PageLayout>
  );
}