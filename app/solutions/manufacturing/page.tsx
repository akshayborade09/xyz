import { PageShell } from '@/components/page-shell';

export default function ManufacturingSolutionsPage() {
  return (
    <PageShell
      title='Manufacturing Solutions'
      description='AI solutions for manufacturing industry'
      tabs={[
        { title: 'Overview', href: '/solutions/manufacturing' },
        {
          title: 'Predictive Maintenance',
          href: '/solutions/manufacturing/maintenance',
        },
        { title: 'Quality Control', href: '/solutions/manufacturing/quality' },
        {
          title: 'Supply Chain',
          href: '/solutions/manufacturing/supply-chain',
        },
        {
          title: 'Process Optimization',
          href: '/solutions/manufacturing/process',
        },
      ]}
    />
  );
}
