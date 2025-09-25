'use client';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { machineImages as initialMachineImages } from '@/lib/data';
import { ActionMenu } from '@/components/action-menu';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/auth-provider';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

export default function MachineImagesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  const isNewUser = user?.email === 'new.user@krutrim.com';
  const [machineImages, setMachineImages] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      console.log('Setting machineImages based on user:', user.email);
      console.log('Is new user:', isNewUser);
      const images = isNewUser ? [] : initialMachineImages;
      console.log('Setting machineImages to:', images);
      setMachineImages(images);
      setLoading(false);
    }
  }, [user, authLoading, isNewUser]);

  console.log(
    'Render state - user email:',
    user?.email,
    'isNewUser:',
    isNewUser,
    'machineImages length:',
    machineImages.length
  );

  const handleDeleteClick = (image: any) => {
    setSelectedImage(image);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedImage(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedImage) {
      setMachineImages(prev => prev.filter(img => img.id !== selectedImage.id));
      setDeleteModalOpen(false);
      setSelectedImage(null);
      // Show success toast (mock)
      console.log(`Machine image "${selectedImage.name}" deleted successfully`);
    }
  };

  const handleDownload = (image: any) => {
    // Mock download implementation for design mode
    console.log(`Downloading machine image: ${image.name}`);

    // Create a mock download link
    const link = document.createElement('a');
    link.href = image.fileUrl || '#';
    link.download = `${image.name.replace(/\s+/g, '_')}.img`;
    link.style.display = 'none';

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success toast (mock)
    console.log(`Download started for "${image.name}"`);
  };

  // Calculate pricing based on estimated image size (simplified for demo)
  const calculatePricing = () => {
    // For demo purposes, we'll estimate a standard machine image size
    const estimatedSizeGB = 10; // Typical machine image size
    const monthlyPrice = estimatedSizeGB * 4.25; // ₹4.25 per GB per month
    return {
      sizeInGB: estimatedSizeGB.toFixed(2),
      monthlyPrice: monthlyPrice.toFixed(2),
      yearlyPrice: (monthlyPrice * 12).toFixed(2),
    };
  };

  // URL validation function
  const validateImageUrl = (url: string): string | null => {
    if (!url.trim()) {
      return 'Please enter a machine image URL.';
    }
    
    // Check if URL starts with http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'Please enter a valid public URL (must start with http/https).';
    }
    
    // Check if URL has proper file extension (basic validation)
    const validExtensions = ['.img', '.iso', '.qcow2', '.vmdk', '.vhd'];
    const hasValidExtension = validExtensions.some(ext => url.toLowerCase().includes(ext));
    
    if (!hasValidExtension) {
      return 'URL should point to a valid machine image file (.img, .iso, .qcow2, .vmdk, .vhd).';
    }
    
    return null; // Valid URL
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!name.trim()) {
      setUploadError('Machine Image Name is required.');
      return;
    }
    if (!type) {
      setUploadError('Image type is required.');
      return;
    }
    
    // Validate URL
    const urlError = validateImageUrl(imageUrl);
    if (urlError) {
      setUploadError(urlError);
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress with more realistic timing
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95; // Stop at 95% until completion
        }
        // Slower progress at the beginning, faster in the middle
        const increment = prev < 30 ? 2 : prev < 70 ? 5 : 3;
        const newProgress = prev + increment;
        console.log(`Upload progress: ${newProgress.toFixed(0)}%`); // Debug log
        return newProgress;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add the new machine image after upload completes
      setTimeout(() => {
        setMachineImages(prev => [
          {
            id: `mi-${Date.now()}`,
            name,
            type,
            createdOn: new Date().toISOString(),
            size: '10 GB', // Estimated size
            fileUrl: imageUrl,
          },
          ...prev,
        ]);
        setUploading(false);
        setUploadProgress(0);
        setUploadOpen(false);
        setName('');
        setType('');
        setImageUrl('');
      }, 500);
    }, 3000); // Total upload time: 3 seconds
  };

  const columns = [
    {
      key: 'name',
      label: 'Machine Image Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <TooltipWrapper content="Download Machine Image" side="top" align="start">
          <a
            href={row.fileUrl || '#'}
            download={`${value}.img`}
            className='text-black hover:underline cursor-pointer font-medium'
            onClick={(e) => {
              if (!row.fileUrl) {
                e.preventDefault();
                // For demo purposes, create a mock download
                const link = document.createElement('a');
                link.href = 'data:text/plain;charset=utf-8,Mock machine image file';
                link.download = `${value}.img`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          >
            {value}
          </a>
        </TooltipWrapper>
      ),
    },
    { key: 'type', label: 'Type', sortable: true },
    {
      key: 'createdOn',
      label: 'Created On',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    { key: 'size', label: 'Size', sortable: true },
    {
      key: 'actions',
      label: 'Action',
      render: (_: any, row: any) => (
        <div className='flex justify-end'>
          <ActionMenu
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType='Machine Image'
            onDownload={() => handleDownload(row)}
          />
        </div>
      ),
      align: 'right' as const,
    },
  ];

  if (loading || !user) {
    return (
      <PageLayout
        title='Machine Images'
        description='Manage your machine images'
      >
        <div className='flex items-center justify-center h-64'>
          <span className='text-gray-500'>Loading...</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title='Machine Images'
      description='Manage your machine images'
      headerActions={
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button>Add Machine Image</Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl w-[95vw] max-h-[90vh] flex flex-col p-0'>
            <DialogHeader className='flex-shrink-0 px-6 pt-6 pb-4 border-b'>
              <DialogTitle>Add Machine Image</DialogTitle>
              <DialogDescription>
                Add a new machine image for your account.
              </DialogDescription>
            </DialogHeader>
            <div className='flex-1 overflow-y-auto px-6 py-4'>
              <form
                className='space-y-4'
                onSubmit={handleUpload}
                id='machine-image-upload-form'
              >
              <div>
                <label
                  className='block text-sm font-medium mb-1'
                  htmlFor='mi-name'
                >
                  Machine Image Name<span className='text-red-500'>*</span>
                </label>
                <Input
                  id='mi-name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={uploading}
                />
              </div>
              <div>
                <label
                  className='block text-sm font-medium mb-1'
                  htmlFor='mi-type'
                >
                  Image Type<span className='text-red-500'>*</span>
                </label>
                <Select
                  value={type}
                  onValueChange={setType}
                  disabled={uploading}
                  required
                >
                  <SelectTrigger id='mi-type'>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Linux'>Linux</SelectItem>
                    <SelectItem value='Windows'>Windows</SelectItem>
                    <SelectItem value='Other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='block text-sm font-medium mb-1' htmlFor='image-url'>
                  Public Machine Image Link<span className='text-red-500'>*</span>
                </label>
                <p className='text-sm text-gray-600 mb-3'>
                  (Paste the public URL of your machine image file)
                </p>
                <Input
                  id='image-url'
                  type='url'
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setUploadError(''); // Clear error when user types
                  }}
                  placeholder='https://objectstorage.region.example.com/bucket-name/file.img'
                  disabled={uploading}
                  className='mb-4'
                />
                
                {/* Helper Summary */}
                <div 
                  className='p-3 sm:p-4 rounded-lg'
                  style={{
                    boxShadow: 'rgba(14, 114, 180, 0.1) 0px 0px 0px 1px inset',
                    background:
                      'linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)',
                  }}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='text-sm font-medium text-black'>How to generate a public machine image link:</h4>
                    <a 
                      href='/storage/object' 
                      className='group inline-flex items-center gap-1 text-sm text-black hover:underline transition-all duration-200'
                    >
                      Access Object Storage
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0'
                      >
                        <g
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='1.5'
                          stroke='#212121'
                        >
                          <line x1='1.25' y1='10.75' x2='7.073' y2='4.927'></line>
                          <polyline points='7.25 9 7.25 4.75 3 4.75'></polyline>
                          <path d='m2.5,1.25h6.25c1.105,0,2,.895,2,2v6.25'></path>
                        </g>
                      </svg>
                    </a>
                  </div>
                  <ol className='text-sm text-black space-y-2 list-decimal list-inside'>
                    <li>
                      <a 
                        href='/storage/object/create' 
                        className='group inline-flex items-center gap-1 text-black hover:underline transition-all duration-200'
                      >
                        Create a bucket in Object Storage
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='12'
                          height='12'
                          viewBox='0 0 12 12'
                          className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0'
                        >
                          <g
                            fill='none'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='1.5'
                            stroke='#212121'
                          >
                            <line x1='1.25' y1='10.75' x2='7.073' y2='4.927'></line>
                            <polyline points='7.25 9 7.25 4.75 3 4.75'></polyline>
                            <path d='m2.5,1.25h6.25c1.105,0,2,.895,2,2v6.25'></path>
                          </g>
                        </svg>
                      </a>.
                    </li>
                    <li><strong className='text-black font-bold'>Set visibility to Public when creating or configuring the bucket.</strong></li>
                    <li>Upload your machine image file (e.g., .img, .iso).</li>
                    <li>Copy the public URL of the file and paste it here.</li>
                  </ol>
                  <div className='mt-3'>
                    <a 
                      href='/documentation' 
                      className='group inline-flex items-center gap-1 text-sm text-black hover:underline transition-all duration-200'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <BookOpen className='h-3 w-3' />
                      Learn more in documentation
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0'
                      >
                        <g
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='1.5'
                          stroke='#212121'
                        >
                          <line x1='1.25' y1='10.75' x2='7.073' y2='4.927'></line>
                          <polyline points='7.25 9 7.25 4.75 3 4.75'></polyline>
                          <path d='m2.5,1.25h6.25c1.105,0,2,.895,2,2v6.25'></path>
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className='space-y-3'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium'>
                      Creating machine image from selected bucket...
                    </span>
                    <span className='text-muted-foreground'>
                      {uploadProgress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className='h-2' />
                  {imageUrl && (
                    <div className='text-xs text-muted-foreground'>
                      Source: {new URL(imageUrl).hostname}
                    </div>
                  )}
                  <div className='text-xs text-blue-600'>
                    {uploadProgress < 95
                      ? 'Processing machine image from object storage...'
                      : 'Finalizing creation and processing...'}
                  </div>
                </div>
              )}

              {/* URL Preview (when not uploading and URL is valid) */}
              {imageUrl && !uploading && !uploadError && (
                <div className='p-2 sm:p-3 bg-gray-50 rounded-lg border'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 min-w-0 flex-1'>
                      <div className='w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0'>
                        <span className='text-green-600 text-xs font-medium'>
                          URL
                        </span>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='text-sm font-medium truncate'>
                          {imageUrl.split('/').pop() || 'Machine Image'}
                        </div>
                        <div className='text-xs text-muted-foreground truncate'>
                          {imageUrl}
                        </div>
                      </div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setImageUrl('');
                        setUploadError('');
                      }}
                      className='h-6 w-6 p-0 flex-shrink-0'
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}

                </form>
            </div>
            <DialogFooter className='flex-shrink-0 px-6 py-4 border-t bg-white flex flex-col sm:flex-row gap-2 sm:gap-3'>
              <DialogClose asChild>
                <Button
                  type='button'
                  variant='outline'
                  disabled={uploading}
                  className='w-full sm:w-auto'
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='submit'
                form='machine-image-upload-form'
                disabled={uploading}
                className='w-full sm:w-auto'
              >
                {uploading
                  ? `Processing... ${uploadProgress.toFixed(0)}%`
                  : 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {isNewUser && machineImages.length === 0 ? (
        <Card className='mt-8'>
          <CardContent className='p-0'>
            <EmptyState
              title='No Machine Images'
              description='You have not added any machine images yet. Get started by adding your first machine image.'
              actionText='Add Machine Image'
              onAction={() => setUploadOpen(true)}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={machineImages}
          enableSearch
          enablePagination
        />
      )}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        resourceName={selectedImage?.name || ''}
        resourceType='Machine Image'
        onConfirm={handleDeleteConfirm}
      />
    </PageLayout>
  );
}
