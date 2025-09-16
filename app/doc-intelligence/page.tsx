import { PageShell } from '@/components/page-shell';
import { FileText, FileSearch, ScrollText, Shield } from 'lucide-react';
import Link from 'next/link';

const documentServices = [
  {
    title: 'Extract Text',
    description:
      'Seamlessly extract text from documents, scanned files and images',
    icon: FileText,
    href: '/doc-intelligence/extract-text',
  },
  {
    title: 'Extract Information',
    description: 'Extract key information from your unstructured data',
    icon: FileSearch,
    href: '/doc-intelligence/extract-info',
  },
  {
    title: 'Document Summarization',
    description: 'Upload your file to generate a summary',
    icon: ScrollText,
    href: '/doc-intelligence/summarization',
  },
  {
    title: 'PII Masking',
    description: 'Get PII data masked in your documents',
    icon: Shield,
    href: '/doc-intelligence/pii-masking',
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

export default function DocIntelligenceAllServicesPage() {
  return (
    <PageShell
      title='Document Intelligence'
      description='Comprehensive document processing and analysis services powered by AI'
    >
      <div className='space-y-12'>
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {documentServices.map((service, index) => (
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
      </div>
    </PageShell>
  );
}
