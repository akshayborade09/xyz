import { PageShell } from '@/components/page-shell';

export default function ModelsPage() {
  return (
    <PageShell
      title='Models'
      description='Manage and monitor your AI models'
      tabs={[
        { title: 'Library', href: '/models/library' },
        { title: 'Training', href: '/models/training' },
        { title: 'Deployment', href: '/models/deployment' },
        { title: 'Monitoring', href: '/models/monitoring' },
      ]}
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Models Overview</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Models overview content
          </p>
        </div>
      </div>
    </PageShell>
  );
}
