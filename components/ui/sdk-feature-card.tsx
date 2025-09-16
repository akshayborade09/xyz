import { ExternalLink, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface SdkFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageUrl?: string;
  reverse?: boolean;
  documentationUrl?: string;
  apiReferenceUrl?: string;
}

function SdkFeatureCard({
  title,
  description,
  icon,
  imageUrl,
  reverse = false,
  documentationUrl,
  apiReferenceUrl,
}: SdkFeatureCardProps) {
  return (
    <div className='w-full py-12 lg:py-20'>
      <div className='container mx-auto'>
        <div className='flex flex-col-reverse lg:flex-row gap-10 lg:items-center'>
          {/* Conditionally render content first or second based on reverse */}
          {!reverse ? (
            <>
              {/* Content Area - Left */}
              <div className='flex gap-6 pl-0 lg:pl-20 flex-col flex-1'>
                <div className='flex gap-4 flex-col'>
                  <h2 className='text-2xl md:text-3xl lg:text-4xl tracking-tight font-semibold text-left leading-tight'>
                    {title}
                  </h2>
                  <p className='text-lg max-w-xl leading-relaxed tracking-tight text-muted-foreground text-left'>
                    {description}
                  </p>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-6 mt-2'>
                  {/* Documentation Link */}
                  {documentationUrl ? (
                    <Link
                      href={documentationUrl}
                      className='flex items-center gap-2 text-foreground hover:underline transition-all duration-200 text-sm'
                    >
                      <BookOpen className='h-4 w-4' />
                      View Documentation
                    </Link>
                  ) : (
                    <span className='flex items-center gap-2 text-muted-foreground text-sm'>
                      <BookOpen className='h-4 w-4' />
                      View Documentation
                    </span>
                  )}

                  {/* API Reference Link */}
                  {apiReferenceUrl ? (
                    <Link
                      href={apiReferenceUrl}
                      className='flex items-center gap-2 text-foreground hover:underline transition-all duration-200 text-sm'
                    >
                      <ExternalLink className='h-4 w-4' />
                      API Reference
                    </Link>
                  ) : (
                    <span className='flex items-center gap-2 text-muted-foreground text-sm'>
                      <ExternalLink className='h-4 w-4' />
                      API Reference
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Area - Right */}
              <div className='rounded-lg w-full aspect-video h-full flex-1 flex items-center justify-center'>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className='w-full h-full object-contain rounded-lg'
                  />
                ) : (
                  <div className='flex flex-col items-center justify-center gap-4'>
                    <div className='text-6xl opacity-60'>{icon}</div>
                    <div className='text-sm text-muted-foreground font-medium tracking-wider uppercase'>
                      {title}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Visual Area - Left */}
              <div className='rounded-lg w-full aspect-video h-full flex-1 flex items-center justify-center'>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className='w-full h-full object-contain rounded-lg'
                  />
                ) : (
                  <div className='flex flex-col items-center justify-center gap-4'>
                    <div className='text-6xl opacity-60'>{icon}</div>
                    <div className='text-sm text-muted-foreground font-medium tracking-wider uppercase'>
                      {title}
                    </div>
                  </div>
                )}
              </div>

              {/* Content Area - Right */}
              <div className='flex gap-6 pl-0 lg:pl-20 flex-col flex-1'>
                <div className='flex gap-4 flex-col'>
                  <h2 className='text-2xl md:text-3xl lg:text-4xl tracking-tight font-semibold text-left leading-tight'>
                    {title}
                  </h2>
                  <p className='text-lg max-w-xl leading-relaxed tracking-tight text-muted-foreground text-left'>
                    {description}
                  </p>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-6 mt-2'>
                  {/* Documentation Link */}
                  {documentationUrl ? (
                    <Link
                      href={documentationUrl}
                      className='flex items-center gap-2 text-foreground hover:underline transition-all duration-200 text-sm'
                    >
                      <BookOpen className='h-4 w-4' />
                      View Documentation
                    </Link>
                  ) : (
                    <span className='flex items-center gap-2 text-muted-foreground text-sm'>
                      <BookOpen className='h-4 w-4' />
                      View Documentation
                    </span>
                  )}

                  {/* API Reference Link */}
                  {apiReferenceUrl ? (
                    <Link
                      href={apiReferenceUrl}
                      className='flex items-center gap-2 text-foreground hover:underline transition-all duration-200 text-sm'
                    >
                      <ExternalLink className='h-4 w-4' />
                      API Reference
                    </Link>
                  ) : (
                    <span className='flex items-center gap-2 text-muted-foreground text-sm'>
                      <ExternalLink className='h-4 w-4' />
                      API Reference
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { SdkFeatureCard };
