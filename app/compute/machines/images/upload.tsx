import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const IMAGE_TYPES = [
  { value: 'Linux', label: 'Linux' },
  { value: 'Windows', label: 'Windows' },
  { value: 'Other', label: 'Other' },
];

export default function UploadMachineImagePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setError('');
    if (f) {
      // Simulate file size check (max 1024 GB)
      const maxBytes = 1024 * 1024 * 1024 * 1024;
      if (f.size > maxBytes) {
        setError('File size exceeds 1024 GB limit.');
        setFile(null);
        return;
      }
      // Simulate magic byte (MIME) check (mocked)
      const allowedTypes = [
        'application/octet-stream',
        'application/x-iso9660-image',
        'application/x-img',
      ];
      if (
        !allowedTypes.includes(f.type) &&
        !f.name.endsWith('.img') &&
        !f.name.endsWith('.iso')
      ) {
        setError('File type not allowed. Only valid disk images are accepted.');
        setFile(null);
        return;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Machine Image Name is required.');
      return;
    }
    if (!type) {
      setError('Image type is required.');
      return;
    }
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      // Simulate success and redirect
      router.push('/compute/machines/images');
    }, 1200);
  };

  return (
    <PageLayout
      title='Upload Machine Image'
      description='Upload a new machine image for your account.'
    >
      <div className='flex gap-6 min-h-0'>
        {/* Main Content */}
        <div className='flex-1'>
          <Card>
            <CardContent className='p-6'>
              <form
                className='space-y-6'
                onSubmit={handleSubmit}
                id='machine-image-upload-form'
              >
                <div>
                  <label
                    className='block text-base font-medium mb-1'
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
                    className='block text-base font-medium mb-1'
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
                      {IMAGE_TYPES.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    className='block text-base font-medium mb-1'
                    htmlFor='mi-file'
                  >
                    Upload Image<span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='mi-file'
                    type='file'
                    accept='.img,.iso'
                    onChange={handleFileChange}
                    disabled={uploading}
                    required
                  />
                  <div className='text-xs text-muted-foreground mt-1'>
                    Max file size: 1024 GB. Only valid disk images (.img, .iso)
                    allowed. Magic Byte (MIME) check enforced.
                  </div>
                </div>
                {error && (
                  <div className='text-red-600 text-sm font-medium'>
                    {error}
                  </div>
                )}
                <div className='flex gap-3 justify-end pt-6 border-t'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.push('/compute/machines/images')}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Confirm'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className='w-80 flex-shrink-0 space-y-6'>
          {/* Machine Image Upload Summary */}
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
                <h3 className='text-base font-semibold'>
                  Machine Image Upload
                </h3>
              </div>
            </div>
            <div>
              <div className='space-y-3'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-2xl font-bold'>₹15.00</span>
                  <span className='text-sm text-muted-foreground'>
                    per image
                  </span>
                </div>
                <div className='text-xs text-muted-foreground pt-2 border-t'>
                  <p>• Image Storage: ₹0.08/GB/month</p>
                  <p>• Data Transfer: ₹0.03/GB</p>
                  <p>• Processing Fee: ₹2.00/image</p>
                  <p>• One-time upload and processing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Best Practices</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Ensure images are properly configured before upload
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Use descriptive names for easy identification
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Test images in development before uploading
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Keep images under 1024 GB for optimal performance
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Configuration Tips */}
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Best Practices</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Choose the correct image type (Linux/Windows/Other)
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Verify file format compatibility (.img, .iso)
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                  <span
                    className='text-muted-foreground'
                    style={{ fontSize: '13px' }}
                  >
                    Ensure sufficient disk space for upload
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
