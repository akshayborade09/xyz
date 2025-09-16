import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const speechServices = [
  {
    title: 'Speech Recognition',
    description:
      'Convert spoken language into written text with high precision and support for multiple languages',
    features: [
      'Multi-language Support',
      'Real-time Processing',
      'Noise Reduction',
    ],
    href: '/bhashik/speech/recognition',
  },
  {
    title: 'Speech Synthesis',
    description:
      'Generate natural-sounding speech from text in multiple voices and languages',
    features: [
      'Multiple Voice Options',
      'Emotion Control',
      'Custom Voice Training',
    ],
    href: '/bhashik/speech/synthesis',
  },
  {
    title: 'Voice Identification',
    description:
      'Identify and authenticate speakers based on their unique voice characteristics',
    features: ['Speaker Verification', 'Voice Biometrics', 'Anti-spoofing'],
    href: '/bhashik/speech/voice-id',
  },
  {
    title: 'Speech Translation',
    description:
      'Directly translate spoken language into another language with real-time processing',
    features: [
      'Real-time Translation',
      'Voice Preservation',
      'Multi-language Support',
    ],
    href: '/bhashik/speech/translation',
  },
  {
    title: 'Voice Analytics',
    description:
      'Analyze speech patterns, emotions, and characteristics for insights',
    features: [
      'Emotion Detection',
      'Accent Recognition',
      'Speech Quality Analysis',
    ],
    href: '/bhashik/speech/analytics',
  },
  {
    title: 'Audio Enhancement',
    description:
      'Improve audio quality and remove background noise from speech recordings',
    features: ['Noise Cancellation', 'Audio Upscaling', 'Quality Enhancement'],
    href: '/bhashik/speech/enhancement',
  },
];

function ServiceCard({
  title,
  description,
  features,
  href,
}: {
  title: string;
  description: string;
  features: string[];
  href: string;
}) {
  return (
    <div
      style={{
        borderRadius: '16px',
        border: '4px solid #FFF',
        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
        padding: '1.5rem',
      }}
      className='h-full flex flex-col'
    >
      <div className='flex-1'>
        <h3 className='text-lg font-semibold mb-3'>{title}</h3>
        <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>
          {description}
        </p>

        <div className='space-y-2 mb-6'>
          {features.map((feature, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div className='w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0'></div>
              <span className='text-xs text-muted-foreground'>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Button asChild variant='outline' size='sm' className='w-full'>
        <Link href={href}>Try Service</Link>
      </Button>
    </div>
  );
}

export default function BhashikSpeechPage() {
  return (
    <PageShell
      title='Speech Services'
      description='Advanced speech recognition and synthesis services powered by Bhashik AI'
      tabs={[
        { title: 'Overview', href: '/bhashik/speech' },
        { title: 'Speech to Text', href: '/bhashik/speech/recognition' },
        { title: 'Text to Speech', href: '/bhashik/speech/synthesis' },
        { title: 'Voice Identification', href: '/bhashik/speech/voice-id' },
      ]}
    >
      <div className='space-y-8'>
        {/* Overview Section */}
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
          <h2 className='text-xl font-semibold mb-4'>Speech Technologies</h2>
          <p className='text-muted-foreground mb-4'>
            Bhashik's speech services provide cutting-edge speech recognition
            and synthesis capabilities with support for multiple Indian
            languages and dialects. Our models are optimized for accuracy,
            speed, and natural-sounding output.
          </p>
          <div className='flex flex-wrap gap-3'>
            <div className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium'>
              Indian Languages
            </div>
            <div className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium'>
              Real-time Processing
            </div>
            <div className='bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium'>
              Natural Voice
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <h2 className='text-xl font-semibold mb-6'>Available Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {speechServices.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                features={service.features}
                href={service.href}
              />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
