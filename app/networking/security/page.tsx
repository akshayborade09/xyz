import { PageShell } from '@/components/page-shell';

export default function NetworkSecurityPage() {
  return (
    <PageShell
      title='Network Security'
      description='Configure your network security settings'
      tabs={[
        { title: 'Security Groups', href: '/networking/security/groups' },
        { title: 'Subnets', href: '/networking/security/subnets' },
        { title: 'Firewall Setup', href: '/networking/security/firewall' },
      ]}
    />
  );
}
