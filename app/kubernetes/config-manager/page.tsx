import { PageLayout } from '@/components/page-layout';

export default function ConfigManagerPage() {
  return (
    <PageLayout
      title='Kubernetes Configuration Manager'
      description='Manage your Kubernetes configurations'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>
            Kubernetes Configuration Manager
          </h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Kubernetes Configuration Manager
            content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
