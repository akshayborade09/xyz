import { PageShell } from '@/components/page-shell';

export default function AiManufacturingPage() {
  return (
    <PageShell
      title='Industrial Manufacturing'
      description='AI solutions for manufacturing automation, quality control, and optimization'
      tabs={[
        { title: 'Overview', href: '/ai-solutions/manufacturing' },
        {
          title: 'Quality Control',
          href: '/ai-solutions/manufacturing/quality',
        },
        {
          title: 'Predictive Maintenance',
          href: '/ai-solutions/manufacturing/maintenance',
        },
        {
          title: 'Process Optimization',
          href: '/ai-solutions/manufacturing/optimization',
        },
      ]}
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>AI for Manufacturing</h2>
          <p className='text-muted-foreground mb-4'>
            Our AI manufacturing solutions help optimize industrial processes,
            improve quality control, predict equipment failures, and enhance
            overall operational efficiency. Leverage computer vision, predictive
            analytics, and machine learning to transform your manufacturing
            operations.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Visual Inspection</h3>
              <p className='text-sm text-muted-foreground'>
                Detect defects and quality issues with AI-powered computer
                vision systems.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Equipment Monitoring</h3>
              <p className='text-sm text-muted-foreground'>
                Predict maintenance needs and prevent equipment failures.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Production Optimization</h3>
              <p className='text-sm text-muted-foreground'>
                Increase throughput and reduce waste with AI-driven process
                optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
