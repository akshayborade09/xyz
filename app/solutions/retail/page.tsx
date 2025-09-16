import { PageShell } from '@/components/page-shell';

export default function RetailSolutionsPage() {
  return (
    <PageShell
      title='Retail & E-commerce Solutions'
      description='AI solutions for retail and e-commerce industry'
      tabs={[
        { title: 'Overview', href: '/solutions/retail' },
        { title: 'Customer Experience', href: '/solutions/retail/customer' },
        { title: 'Inventory Management', href: '/solutions/retail/inventory' },
        { title: 'Visual Search', href: '/solutions/retail/visual' },
        { title: 'Pricing Optimization', href: '/solutions/retail/pricing' },
      ]}
    />
  );
}
