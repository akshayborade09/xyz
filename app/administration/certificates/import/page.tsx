'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';

import {
  Upload,
  FileText,
  ChevronDown,
  Search,
  Check,
  Trash2,
} from 'lucide-react';
import { vpcs } from '@/lib/data';
import { CreateVPCModal } from '@/components/modals/vm-creation-modals';
import { useToast } from '@/hooks/use-toast';

interface CertificateImportData {
  certificateName: string;
  certificateFile: File | null;
  vpc: string;
  tags: Array<{ key: string; value: string }>;
}

export default function ImportCertificatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [formData, setFormData] = useState<CertificateImportData>({
    certificateName: '',
    certificateFile: null,
    vpc: '',
    tags: [{ key: '', value: '' }],
  });

  // Function to check if all mandatory fields are filled
  const isFormValid = () => {
    const hasValidName = formData.certificateName.trim().length > 0;
    const hasValidVPC = formData.vpc.length > 0;
    const hasValidFile = formData.certificateFile !== null;

    return hasValidName && hasValidVPC && hasValidFile;
  };

  const handleInputChange = (
    field: keyof CertificateImportData,
    value: any
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleFileChange = (
    field: keyof CertificateImportData,
    file: File | null
  ) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleVPCChange = (vpc: string) => {
    if (vpc === '__create_new__') {
      setShowCreateVPCModal(true);
    } else {
      setFormData(prev => ({ ...prev, vpc }));
    }
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleVPCCreated = (vpcId: string) => {
    setFormData(prev => ({ ...prev, vpc: vpcId }));
    setShowCreateVPCModal(false);
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { key: '', value: '' }],
    }));
  };

  const updateTag = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const newTags = [...prev.tags];
      newTags[index][field] = value;
      return { ...prev, tags: newTags };
    });
  };

  const removeTag = (index: number) => {
    setFormData(prev => {
      const newTags = prev.tags.filter((_, i) => i !== index);
      return {
        ...prev,
        tags: newTags.length === 0 ? [{ key: '', value: '' }] : newTags,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTouched) {
      setFormTouched(true);
    }

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success toast
      toast({
        title: 'Certificate Uploaded Successfully',
        description: `Certificate "${formData.certificateName}" has been uploaded and is ready to use.`,
      });

      // Redirect to certificates list
      router.push('/administration/certificates');
    } catch (error) {
      // Show error toast
      toast({
        title: 'Upload Failed',
        description:
          'There was an error uploading your certificate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // File Upload Component
  const FileUploadField = ({
    label,
    field,
    accept,
    required = false,
    description,
  }: {
    label: string;
    field: keyof CertificateImportData;
    accept: string;
    required?: boolean;
    description?: string;
  }) => (
    <div className='mb-5'>
      <Label htmlFor={field} className='block mb-2 font-medium'>
        {label} {required && <span className='text-destructive'>*</span>}
      </Label>
      <div
        className='border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer'
        onClick={() => document.getElementById(field)?.click()}
      >
        <div className='flex flex-col items-center justify-center space-y-3 text-center'>
          <Upload className='h-8 w-8 text-gray-400' />
          <div className='text-sm'>
            {formData[field] ? (
              <div className='space-y-2'>
                <Badge
                  variant='secondary'
                  className='bg-green-100 text-green-700 border-green-200'
                >
                  <FileText className='h-3 w-3 mr-1' />
                  {(formData[field] as File)?.name}
                </Badge>
                <div className='text-xs text-green-600 font-medium'>
                  File uploaded successfully
                </div>
              </div>
            ) : (
              <div className='space-y-1'>
                <div>
                  <span className='font-medium text-gray-700'>
                    Click to upload
                  </span>
                  <span className='text-gray-500'> or drag and drop</span>
                </div>
                <div className='text-xs text-gray-500'>
                  Supported formats: {accept.split(',').join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <input
        id={field}
        type='file'
        accept={accept}
        onChange={e => handleFileChange(field, e.target.files?.[0] || null)}
        className='hidden'
        required={required}
      />
      {description && (
        <p className='text-xs text-muted-foreground mt-1'>{description}</p>
      )}
    </div>
  );

  // VPC Selector Component
  const VPCSelector = () => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVPCs = vpcs.filter(
      vpc =>
        vpc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vpc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vpc.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedVPC = vpcs.find(vpc => vpc.id === formData.vpc);

    return (
      <div className='relative'>
        <button
          type='button'
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm bg-background ${
            formTouched && !formData.vpc
              ? 'border-red-300 bg-red-50'
              : 'border-input'
          }`}
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
            <div className='p-1 max-h-60 overflow-y-auto'>
              <button
                type='button'
                onClick={() => {
                  handleVPCChange('__create_new__');
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
                    handleVPCChange(vpc.id);
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
                  {formData.vpc === vpc.id && <Check className='h-4 w-4' />}
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
    );
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/administration', title: 'Administration' },
    { href: '/administration/certificates', title: 'Certificate Manager' },
    {
      href: '/administration/certificates/import',
      title: 'Upload Certificate',
    },
  ];

  return (
    <PageLayout
      title='Upload Certificate'
      description='Import SSL/TLS certificates for load balancers and other infrastructure'
      customBreadcrumbs={customBreadcrumbs}
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleSubmit}>
                {/* Certificate Details */}
                <div className='mb-8'>
                  {/* Certificate Name */}
                  <div className='mb-5'>
                    <Label
                      htmlFor='certificateName'
                      className='block mb-2 font-medium'
                    >
                      Certificate Name{' '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='certificateName'
                      placeholder='Enter certificate name'
                      value={formData.certificateName}
                      onChange={e =>
                        handleInputChange('certificateName', e.target.value)
                      }
                      className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formTouched && !formData.certificateName.trim()
                          ? 'border-red-300 bg-red-50'
                          : ''
                      }`}
                      required
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Choose a descriptive name for easy identification
                    </p>
                  </div>

                  {/* VPC Selection */}
                  <div className='mb-5'>
                    <Label className='block mb-2 font-medium'>
                      Select VPC <span className='text-destructive'>*</span>
                    </Label>
                    <VPCSelector />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Choose the VPC where this certificate will be used
                    </p>
                  </div>

                  {/* Certificate File Upload */}
                  <FileUploadField
                    label='Certificate File'
                    field='certificateFile'
                    accept='.p12,.pem'
                    required={true}
                    description='Upload your SSL/TLS certificate file (.p12, .pem)'
                  />

                  {/* Tags */}
                  <div className='mb-5'>
                    <Label className='block mb-2 font-medium'>Tags</Label>
                    <p className='text-xs text-muted-foreground mb-3'>
                      Add tags to help organize and identify your certificate
                    </p>
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
                </div>
              </form>
            </CardContent>

            <div className='flex justify-end gap-4 px-6 pb-6'>
              <Button
                type='button'
                variant='outline'
                className='hover:bg-secondary transition-colors'
                onClick={() => router.push('/administration/certificates')}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!isFormValid() || isLoading}
                className={`transition-colors ${
                  isFormValid() && !isLoading
                    ? 'bg-black text-white hover:bg-black/90 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
              >
                {isLoading
                  ? 'Uploading...'
                  : !isFormValid()
                    ? formTouched
                      ? 'Fill Required Fields'
                      : 'Upload Certificate'
                    : 'Upload Certificate'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className='w-full md:w-80 space-y-6'>
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
                    Use certificates issued by trusted Certificate Authorities
                    (CAs).
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Ensure the certificate file is a bundled package containing
                    the server certificate, private key, and full chain of
                    intermediate certificates.
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Keep private keys secure and never share them.
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Use clear, descriptive names for easy identification.
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Apply tags to organize and track certificates efficiently.
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Keep file size under 5 MB.
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
        preselectedRegion={undefined}
      />
    </PageLayout>
  );
}
