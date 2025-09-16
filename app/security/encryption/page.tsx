import { PageLayout } from '@/components/page-layout';

export default function SecurityEncryptionPage() {
  return (
    <PageLayout
      title='Encryption'
      description='Manage encryption for your data and applications'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Encryption</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Encryption content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
