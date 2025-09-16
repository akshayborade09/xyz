import { PageShell } from '@/components/page-shell';

export default function SecurityPage() {
  return (
    <PageShell
      title='Security'
      description='Manage security and compliance settings'
      tabs={[
        { title: 'IAM', href: '/security/iam' },
        { title: 'Audit', href: '/security/audit' },
        { title: 'Compliance', href: '/security/compliance' },
        { title: 'Encryption', href: '/security/encryption' },
      ]}
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Security Overview</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Security overview content
          </p>
        </div>
      </div>
    </PageShell>
  );
}
