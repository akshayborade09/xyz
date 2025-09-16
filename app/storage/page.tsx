import { PageShell } from '@/components/page-shell';

export default function StoragePage() {
  return (
    <PageShell
      title='Storage'
      description='Manage your storage resources'
      tabs={[
        { title: 'Object Storage', href: '/storage/object' },
        { title: 'Block Storage', href: '/storage/block' },
      ]}
    />
  );
}
