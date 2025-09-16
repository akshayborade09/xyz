import { PageShell } from '@/components/page-shell';

export default function PrivacyProtectionPage() {
  return (
    <PageShell
      title='Privacy Protection'
      description='Protect sensitive information in documents with redaction and anonymization'
      tabs={[
        { title: 'Overview', href: '/doc-intelligence/privacy' },
        { title: 'PII Detection', href: '/doc-intelligence/privacy/pii' },
        { title: 'Redaction', href: '/doc-intelligence/privacy/redaction' },
        {
          title: 'Anonymization',
          href: '/doc-intelligence/privacy/anonymization',
        },
      ]}
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>
            Document Privacy Protection
          </h2>
          <p className='text-muted-foreground mb-4'>
            Our privacy protection services help you identify, redact, and
            anonymize sensitive information in documents. Ensure compliance with
            privacy regulations like GDPR, HIPAA, and other data protection
            standards.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>PII Detection</h3>
              <p className='text-sm text-muted-foreground'>
                Automatically identify personal identifiable information (PII)
                in documents.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Document Redaction</h3>
              <p className='text-sm text-muted-foreground'>
                Permanently remove or black out sensitive information from
                documents.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Data Anonymization</h3>
              <p className='text-sm text-muted-foreground'>
                Replace sensitive data with pseudonyms while preserving document
                structure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
