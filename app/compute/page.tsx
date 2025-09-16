import { PageShell } from '@/components/page-shell';

export default function ComputePage() {
  return (
    <PageShell
      title='Compute'
      description='Manage your compute resources and virtual machines'
      tabs={[
        { title: 'Virtual Machines', href: '/compute/vms' },
        { title: 'AI Pods', href: '/compute/ai-pods' },
      ]}
    >
      <div className='rounded-lg border border-dashed p-10 text-center'>
        <h3 className='text-lg font-medium'>Compute Resources</h3>
        <p className='text-sm text-muted-foreground mt-1'>
          Select a tab to manage specific compute resources
        </p>
      </div>
    </PageShell>
  );
}
