import { PageLayout } from '@/components/page-layout';

export default function ComputeKubernetesPage() {
  return (
    <PageLayout
      title='Kubernetes Clusters'
      description='Manage your Kubernetes clusters'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Kubernetes Clusters</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Kubernetes Clusters content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
