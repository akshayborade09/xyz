import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const textServices = [
  {
    title: 'Multi-lingual Translation',
    description:
      'Translate text between 100+ language pairs with high accuracy and context awareness',
    features: [
      '100+ Language Pairs',
      'Context-Aware Translation',
      'Batch Processing',
    ],
    href: '/bhashik/text/translation',
  },
  {
    title: 'Sentiment Analysis',
    description:
      'Understand the emotional tone and opinion in text content with advanced sentiment detection',
    features: ['Emotion Detection', 'Opinion Mining', 'Confidence Scoring'],
    href: '/bhashik/text/sentiment',
  },
  {
    title: 'Entity Recognition',
    description:
      'Identify and classify named entities in unstructured text with high precision',
    features: [
      'Named Entity Recognition',
      'Custom Entity Types',
      'Multi-language Support',
    ],
    href: '/bhashik/text/entities',
  },
  {
    title: 'Language Detection',
    description:
      'Automatically detect the language present in text with high accuracy',
    features: ['200+ Languages', 'Script Detection', 'Confidence Levels'],
    href: '/bhashik/text/detection',
  },
  {
    title: 'Text Summarization',
    description:
      'Generate concise summaries capturing the main points and essence of text',
    features: [
      'Extractive Summarization',
      'Abstractive Summarization',
      'Custom Length',
    ],
    href: '/bhashik/text/summarization',
  },
  {
    title: 'Text Extraction',
    description:
      'Extract structured information and defined entities from unstructured text',
    features: ['Information Extraction', 'Custom Schemas', 'Structured Output'],
    href: '/bhashik/text/extraction',
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

export default function BhashikTextPage() {
  return (
    <PageShell
      title='Text Services'
      description="Explore and utilize Bhashik's comprehensive text processing services"
      tabs={[
        { title: 'Overview', href: '/bhashik/text' },
        { title: 'Translation', href: '/bhashik/text/translation' },
        { title: 'Sentiment Analysis', href: '/bhashik/text/sentiment' },
        { title: 'Entity Recognition', href: '/bhashik/text/entities' },
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
          <h2 className='text-xl font-semibold mb-4'>
            Language Processing Capabilities
          </h2>
          <p className='text-muted-foreground mb-4'>
            Bhashik offers state-of-the-art natural language processing
            capabilities for Indian and global languages. Our text services
            provide powerful tools for understanding, analyzing, and
            transforming text across multiple languages and domains.
          </p>
          <div className='flex flex-wrap gap-3'>
            <div className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium'>
              100+ Languages
            </div>
            <div className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium'>
              Real-time Processing
            </div>
            <div className='bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium'>
              High Accuracy
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <h2 className='text-xl font-semibold mb-6'>Available Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {textServices.map((service, index) => (
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
