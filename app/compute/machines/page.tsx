import { PageShell } from '@/components/page-shell';

export default function MachinesPage() {
  return (
    <PageShell
      title='Machines'
      description='Manage your virtual machines'
      tabs={[
        { title: 'My Machines', href: '/compute/machines/my-machines' },
        { title: 'Machine Images', href: '/compute/machines/images' },
      ]}
    />
  );
}
