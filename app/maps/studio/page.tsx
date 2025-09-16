import { PageShell } from '@/components/page-shell';

export default function MapStudioPage() {
  return (
    <PageShell
      title='Map Studio'
      description='Create, customize, and analyze maps with advanced AI-powered tools'
      tabs={[
        { title: 'Overview', href: '/maps/studio' },
        { title: 'Map Editor', href: '/maps/studio/editor' },
        { title: 'Spatial Analysis', href: '/maps/studio/analysis' },
        { title: 'Data Visualization', href: '/maps/studio/visualization' },
      ]}
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>Map Studio Platform</h2>
          <p className='text-muted-foreground mb-4'>
            Map Studio provides powerful tools for creating, customizing, and
            analyzing maps. Combine geographic data with AI-powered insights to
            visualize spatial relationships, identify patterns, and make
            data-driven decisions.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Map Creation</h3>
              <p className='text-sm text-muted-foreground'>
                Design custom maps with intuitive editing tools and styling
                options.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Geospatial Analysis</h3>
              <p className='text-sm text-muted-foreground'>
                Analyze geographic data to reveal patterns and insights.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Custom Visualizations</h3>
              <p className='text-sm text-muted-foreground'>
                Create compelling data visualizations using advanced mapping
                techniques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
