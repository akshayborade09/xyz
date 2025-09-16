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
import { ImageUpload } from '@/components/ui/image-upload';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/auth-provider';
import { Progress } from '@/components/ui/progress';

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
  const [file, setFile] = useState<File | null>(null);
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

  // Calculate pricing based on file size
  const calculatePricing = (fileSize: number) => {
    const sizeInGB = fileSize / (1024 * 1024 * 1024);
    const monthlyPrice = sizeInGB * 4.25; // ₹4.25 per GB per month
    return {
      sizeInGB: sizeInGB.toFixed(2),
      monthlyPrice: monthlyPrice.toFixed(2),
      yearlyPrice: (monthlyPrice * 12).toFixed(2),
    };
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
    if (!file) {
      setUploadError('Please select a file to upload.');
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
            size: `${(file.size / (1024 * 1024 * 1024)).toFixed(1)} GB`,
            fileUrl: '',
          },
          ...prev,
        ]);
        setUploading(false);
        setUploadProgress(0);
        setUploadOpen(false);
        setName('');
        setType('');
        setFile(null);
      }, 500);
    }, 3000); // Total upload time: 3 seconds
  };

  const columns = [
    {
      key: 'name',
      label: 'Machine Image Name',
      sortable: true,
      searchable: true,
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
            <Button>Upload Machine Image</Button>
          </DialogTrigger>
          <DialogContent className='max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Upload Machine Image</DialogTitle>
              <DialogDescription>
                Upload a new machine image for your account.
              </DialogDescription>
            </DialogHeader>
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
                <label className='block text-sm font-medium mb-1'>
                  Upload Image<span className='text-red-500'>*</span>
                </label>
                {!uploading && (
                  <ImageUpload
                    onFileChange={f => {
                      setFile(f);
                      setUploadError('');
                      if (f) {
                        // File size check (max 1024 GB)
                        const maxBytes = 1024 * 1024 * 1024 * 1024;
                        if (f.size > maxBytes) {
                          setUploadError('File size exceeds 1024 GB limit.');
                          setFile(null);
                          return;
                        }
                        // In prototype mode, allow any file type
                        // No file type restrictions for demo purposes
                      }
                    }}
                    error={uploadError}
                    disabled={uploading}
                    accept='*'
                    maxSizeGB={1024}
                  />
                )}
              </div>

              {/* File Upload Progress */}
              {uploading && (
                <div className='space-y-3'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium'>
                      {file ? `Uploading: ${file.name}` : 'Uploading...'}
                    </span>
                    <span className='text-muted-foreground'>
                      {uploadProgress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className='h-2' />
                  {file && (
                    <div className='text-xs text-muted-foreground'>
                      File size: {(file.size / (1024 * 1024 * 1024)).toFixed(2)}{' '}
                      GB
                    </div>
                  )}
                  <div className='text-xs text-blue-600'>
                    {uploadProgress < 95
                      ? 'Uploading file to our servers...'
                      : 'Finalizing upload and processing...'}
                  </div>
                </div>
              )}

              {/* File Preview (when not uploading) */}
              {file && !uploading && (
                <div className='p-2 sm:p-3 bg-gray-50 rounded-lg border'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 min-w-0 flex-1'>
                      <div className='w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0'>
                        <span className='text-blue-600 text-xs font-medium'>
                          IMG
                        </span>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='text-sm font-medium truncate'>
                          {file.name}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                        </div>
                      </div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setFile(null);
                        setUploadError('');
                      }}
                      className='h-6 w-6 p-0 flex-shrink-0'
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}

              {/* Pricing Summary */}
              <div
                className='p-3 sm:p-4 rounded-lg mt-2'
                style={{
                  boxShadow: 'rgba(14, 114, 180, 0.1) 0px 0px 0px 1px inset',
                  background:
                    'linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)',
                }}
              >
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-sm font-medium text-black'>
                    Pricing Summary
                  </span>
                </div>
                {file ? (
                  (() => {
                    const pricing = calculatePricing(file.size);
                    return (
                      <div className='space-y-2 text-xs'>
                        <div className='flex justify-between'>
                          <span className='text-black'>File Size:</span>
                          <span className='font-semibold text-black'>
                            {pricing.sizeInGB} GB
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-black'>Monthly Storage:</span>
                          <span className='font-semibold text-black'>
                            ₹{pricing.monthlyPrice}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-black'>Yearly Storage:</span>
                          <span className='font-semibold text-black'>
                            ₹{pricing.yearlyPrice}
                          </span>
                        </div>
                        <div className='pt-2 border-t border-gray-200'>
                          <div className='flex justify-between text-xs text-muted-foreground'>
                            <span>Rate: ₹4.25/GB/month</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className='space-y-2 text-xs'>
                    <div className='flex justify-between'>
                      <span className='text-black'>File Size:</span>
                      <span className='font-semibold text-black'>-</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-black'>Monthly Storage:</span>
                      <span className='font-semibold text-black'>₹0.00</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-black'>Yearly Storage:</span>
                      <span className='font-semibold text-black'>₹0.00</span>
                    </div>
                    <div className='pt-2 border-t border-gray-200'>
                      <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>Rate: ₹4.25/GB/month</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
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
                  disabled={uploading}
                  className='w-full sm:w-auto'
                >
                  {uploading
                    ? `Uploading... ${uploadProgress.toFixed(0)}%`
                    : 'Confirm'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {isNewUser && machineImages.length === 0 ? (
        <Card className='mt-8'>
          <CardContent className='p-0'>
            <EmptyState
              title='No Machine Images'
              description='You have not uploaded any machine images yet. Get started by uploading your first machine image.'
              actionText='Upload Machine Image'
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
