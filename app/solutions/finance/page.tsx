import { PageShell } from '@/components/page-shell';

export default function FinanceSolutionsPage() {
  return (
    <PageShell
      title='Financial Services Solutions'
      description='AI solutions for financial services industry'
      tabs={[
        { title: 'Overview', href: '/solutions/finance' },
        { title: 'Fraud Detection', href: '/solutions/finance/fraud' },
        { title: 'Customer Insights', href: '/solutions/finance/insights' },
        { title: 'Trading & Investment', href: '/solutions/finance/trading' },
        { title: 'Compliance', href: '/solutions/finance/compliance' },
      ]}
    />
  );
}
