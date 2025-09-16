import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface KrutrimLogoProps {
  className?: string;
  width?: number;
  height?: number;
  href?: string | null;
  showText?: boolean;
}

export function KrutrimLogo({
  className,
  width = 120,
  height = 40,
  href = '/dashboard',
  showText = true,
}: KrutrimLogoProps) {
  const logo = (
    <div className={cn('flex items-center', className)}>
      <Image
        src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Krutrim%20Logo-4Tg4rR41XtG6ZRdS096MEiUOBWItZH.png'
        alt='Krutrim'
        width={width}
        height={height}
        className='h-auto'
        priority
      />
    </div>
  );

  if (href) {
    return <Link href={href}>{logo}</Link>;
  }

  return logo;
}
