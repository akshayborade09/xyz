import { PageShell } from '@/components/page-shell';

export default function DataPage() {
  return (
    <PageShell
      title='Data'
      description='Manage your data resources and pipelines'
      tabs={[
        { title: 'Datasets', href: '/data/datasets' },
        { title: 'Storage', href: '/data/storage' },
        { title: 'Pipelines', href: '/data/pipelines' },
        { title: 'Governance', href: '/data/governance' },
      ]}
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Data Overview</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Data management overview content
          </p>
        </div>
      </div>
    </PageShell>
  );
}
