import { PageShell } from '@/components/page-shell';

export default function MapProductsPage() {
  return (
    <PageShell
      title='Products & Services'
      description='Explore our comprehensive mapping and location intelligence offerings'
      tabs={[
        { title: 'Overview', href: '/maps/products' },
        { title: 'Maps API', href: '/maps/products/api' },
        { title: 'Geocoding', href: '/maps/products/geocoding' },
        { title: 'Routing', href: '/maps/products/routing' },
      ]}
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>
            Mapping Products & Services
          </h2>
          <p className='text-muted-foreground mb-4'>
            Explore our suite of mapping and location intelligence products.
            From interactive maps and geocoding to routing and spatial analysis,
            our offerings help businesses leverage location data for improved
            decision-making.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Maps API</h3>
              <p className='text-sm text-muted-foreground'>
                Integrate interactive maps into your applications with our
                comprehensive Maps API.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Geocoding Services</h3>
              <p className='text-sm text-muted-foreground'>
                Convert addresses to coordinates and vice versa with high
                accuracy.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Routing & Navigation</h3>
              <p className='text-sm text-muted-foreground'>
                Calculate optimal routes and provide turn-by-turn navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
