import { PageLayout } from '@/components/page-layout';

export default function ManageKubernetesPage() {
  return (
    <PageLayout
      title='Manage Kubernetes'
      description='Create and manage your Kubernetes clusters'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Manage Kubernetes</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Manage Kubernetes content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
