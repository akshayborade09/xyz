import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useImageUpload } from '@/components/hooks/use-image-upload';
import { ImagePlus, X, Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
  accept?: string;
  maxSizeGB?: number;
}

export function ImageUpload({
  onFileChange,
  error,
  disabled,
  accept = '.img,.iso',
  maxSizeGB = 1024,
}: ImageUploadProps) {
  const {
    file,
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    setFile,
  } = useImageUpload({
    onUpload: file => onFileChange(file),
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        // File size check
        if (file.size > maxSizeGB * 1024 * 1024 * 1024) {
          onFileChange(null);
          setFile(null);
          return;
        }
        // Accept check
        if (!accept.split(',').some(ext => file.name.endsWith(ext.trim()))) {
          onFileChange(null);
          setFile(null);
          return;
        }
        const fakeEvent = {
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(fakeEvent);
      }
    },
    [handleFileChange, accept, maxSizeGB, onFileChange, setFile]
  );

  return (
    <div className='w-full'>
      <Input
        type='file'
        accept={accept}
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />

      {!previewUrl ? (
        <div
          onClick={disabled ? undefined : handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex h-40 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted',
            isDragging && 'border-primary/50 bg-primary/5',
            disabled && 'opacity-60 pointer-events-none'
          )}
        >
          <div className='rounded-full bg-background p-3 shadow-sm'>
            <ImagePlus className='h-6 w-6 text-muted-foreground' />
          </div>
          <div className='text-center'>
            <p className='text-sm font-medium'>
              Click to select or drag and drop file here
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Machine image files (.img, .iso). Max size: {maxSizeGB} GB.
            </p>
          </div>
        </div>
      ) : (
        <div className='relative'>
          <div className='group relative h-40 overflow-hidden rounded-lg border'>
            <Image
              src={previewUrl}
              alt='Preview'
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            <div className='absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100' />
            <div className='absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
              <Button
                size='sm'
                variant='secondary'
                onClick={handleThumbnailClick}
                className='h-9 w-9 p-0'
                disabled={disabled}
              >
                <Upload className='h-4 w-4' />
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={handleRemove}
                className='h-9 w-9 p-0'
                disabled={disabled}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
          {fileName && (
            <div className='mt-2 flex items-center gap-2 text-sm text-muted-foreground'>
              <span className='truncate'>{fileName}</span>
              <button
                onClick={handleRemove}
                className='ml-auto rounded-full p-1 hover:bg-muted'
                disabled={disabled}
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          )}
        </div>
      )}
      {error && (
        <div className='text-red-600 text-sm font-medium mt-2'>{error}</div>
      )}
    </div>
  );
}
