import { PageLayout } from '@/components/page-layout';

export default function FirewallPage() {
  return (
    <PageLayout
      title='Firewall Setup'
      description='Configure your firewall settings'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Firewall Setup</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Firewall Setup content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
