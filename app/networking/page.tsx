import { PageShell } from '@/components/page-shell';

export default function NetworkingPage() {
  return (
    <PageShell
      title='Networking'
      description='Configure and manage your network infrastructure'
      tabs={[
        { title: 'Load Balancers', href: '/networking/load-balancing' },
        { title: 'DNS', href: '/networking/dns' },
        { title: 'Security', href: '/networking/security' },
      ]}
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Networking Overview</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Networking overview content
          </p>
        </div>
      </div>
    </PageShell>
  );
}
