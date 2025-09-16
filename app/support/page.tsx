import { PageShell } from '@/components/page-shell';

export default function SupportPage() {
  return (
    <PageShell
      title='Support & Resources'
      description='Get help and access resources'
      tabs={[
        { title: 'Documentation', href: '/support/documentation' },
        { title: 'Community', href: '/support/community' },
        { title: 'Support Tickets', href: '/support/tickets' },
        { title: 'Learning Resources', href: '/support/learning' },
      ]}
    />
  );
}
