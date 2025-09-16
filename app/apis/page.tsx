import { PageShell } from '@/components/page-shell';

export default function ApisPage() {
  return (
    <PageShell
      title='APIs'
      description='Explore and manage your API services'
      tabs={[
        { title: 'Catalog', href: '/apis/catalog' },
        { title: 'Management', href: '/apis/management' },
        { title: 'Analytics', href: '/apis/analytics' },
        { title: 'Development', href: '/apis/development' },
      ]}
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>API Services Overview</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the API services overview content
          </p>
        </div>
      </div>
    </PageShell>
  );
}
