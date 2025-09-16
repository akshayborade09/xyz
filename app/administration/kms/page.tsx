import { PageLayout } from '@/components/page-layout';

export default function KMSPage() {
  return (
    <PageLayout
      title='Key Management System'
      description='Manage your encryption keys, certificates, and security credentials'
    >
      <div className='mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-semibold mb-2'>Storage</h3>
          <p className='text-muted-foreground mb-4'>
            Manage encrypted storage keys and access controls
          </p>
          <a
            href='/administration/kms/storage'
            className='text-primary hover:underline'
          >
            Go to Storage →
          </a>
        </div>

        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-semibold mb-2'>Models</h3>
          <p className='text-muted-foreground mb-4'>
            Configure encryption models and algorithms
          </p>
          <a
            href='/administration/kms/models'
            className='text-primary hover:underline'
          >
            Go to Models →
          </a>
        </div>

        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-semibold mb-2'>Key Management Service</h3>
          <p className='text-muted-foreground mb-4'>
            Centralized key management and security operations
          </p>
          <a
            href='/administration/kms/service'
            className='text-primary hover:underline'
          >
            Go to Service →
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
