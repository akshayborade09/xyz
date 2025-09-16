import { PageLayout } from '@/components/page-layout';

export default function ApiKeysPage() {
  return (
    <PageLayout title='API Keys' description='Manage your API keys'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>API Keys</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the API Keys content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
