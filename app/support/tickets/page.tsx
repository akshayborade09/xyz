import { PageLayout } from '@/components/page-layout';

export default function SupportTicketsPage() {
  return (
    <PageLayout
      title='Support Tickets'
      description='Manage your support tickets and requests'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Support Tickets</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Support Tickets content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
