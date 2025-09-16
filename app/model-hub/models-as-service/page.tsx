import { PageShell } from '@/components/page-shell';

export default function ModelsAsServicePage() {
  return (
    <PageShell
      title='Models as a Service'
      description='Deploy and manage AI models as scalable, production-ready services'
      tabs={[
        { title: 'Overview', href: '/model-hub/models-as-service' },
        {
          title: 'Deployments',
          href: '/model-hub/models-as-service/deployments',
        },
        { title: 'Endpoints', href: '/model-hub/models-as-service/endpoints' },
        {
          title: 'Performance',
          href: '/model-hub/models-as-service/performance',
        },
      ]}
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>
            Model Deployment & Serving
          </h2>
          <p className='text-muted-foreground mb-4'>
            Models as a Service (MaaS) provides an end-to-end platform for
            deploying, serving, and managing AI models in production. Deploy
            models with a few clicks, create scalable endpoints, and monitor
            performance - all from a single interface.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>One-Click Deployment</h3>
              <p className='text-sm text-muted-foreground'>
                Deploy AI models to production with a single click.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Scalable Inference</h3>
              <p className='text-sm text-muted-foreground'>
                Auto-scaling infrastructure that grows with your needs.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>API Management</h3>
              <p className='text-sm text-muted-foreground'>
                Create and manage API endpoints for your deployed models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
