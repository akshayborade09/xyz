import { PageShell } from '@/components/page-shell';
import {
  Languages,
  SearchCheck,
  FileText,
  Heart,
  ScrollText,
  Volume2,
  Mic,
  AudioLines,
} from 'lucide-react';
import Link from 'next/link';

const textServices = [
  {
    title: 'Text Translation',
    description: 'Translate written content between languages',
    icon: Languages,
    href: '/bhashik/text-services?tab=translation',
  },
  {
    title: 'Language Detection',
    description: 'Detect the language present in the text',
    icon: SearchCheck,
    href: '/bhashik/text-services?tab=detection',
  },
  {
    title: 'Extraction',
    description: 'Extract the set of defined entities from the text',
    icon: FileText,
    href: '/bhashik/text-services?tab=extraction',
  },
  {
    title: 'Sentiment Analysis',
    description:
      'Dominant sentiment detection for overall content and specific entity within',
    icon: Heart,
    href: '/bhashik/text-services?tab=sentiment',
  },
  {
    title: 'Summarization',
    description: 'Summarize the main points and essence of a text',
    icon: ScrollText,
    href: '/bhashik/text-services?tab=summarization',
  },
];

const speechServices = [
  {
    title: 'Text to Speech',
    description:
      'Transform written text into natural-sounding speech in multiple languages',
    icon: Volume2,
    href: '/bhashik/speech-services?tab=text-to-speech',
  },
  {
    title: 'Speech to Text',
    description:
      'Precisely capture and transcribe audio into text, making it easy to record and analyse spoken content',
    icon: Mic,
    href: '/bhashik/speech-services?tab=speech-to-text',
  },
  {
    title: 'Speech to Speech',
    description:
      'Directly translate spoken language into another, enabling smooth conversations across languages',
    icon: AudioLines,
    href: '/bhashik/speech-services?tab=speech-to-speech',
  },
];

function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
}) {
  return (
    <Link href={href}>
      <div
        style={{
          borderRadius: '16px',
          border: '4px solid #FFF',
          background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
          boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
          padding: '1.5rem',
        }}
        className='h-full transition-transform hover:scale-105 hover:shadow-lg cursor-pointer'
      >
        <div className='text-center'>
          <div className='flex justify-center mb-4'>
            <Icon className='h-8 w-8 text-muted-foreground' />
          </div>
          <h3 className='text-lg font-semibold mb-3'>{title}</h3>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ServiceSection({
  title,
  services,
}: {
  title: string;
  services: typeof textServices;
}) {
  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-normal'>{title}</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon}
            href={service.href}
          />
        ))}
      </div>
    </div>
  );
}

export default function BhashikPage() {
  return (
    <PageShell
      title='Bhashik'
      description='AI-powered language processing services for text and speech'
    >
      <div className='space-y-12'>
        <ServiceSection title='Text' services={textServices} />
        <ServiceSection title='Speech' services={speechServices} />
      </div>
    </PageShell>
  );
}
