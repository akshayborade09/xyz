import { PageLayout } from '@/components/page-layout';

export default function SecurityAuditPage() {
  return (
    <PageLayout
      title='Audit Logs'
      description='View and analyze audit logs for your account'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Audit Logs</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Audit Logs content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
