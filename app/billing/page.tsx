import { PageShell } from '@/components/page-shell';

export default function BillingPage() {
  return (
    <PageShell
      title='Billing & Subscriptions'
      description='Manage your billing and subscription information'
      tabs={[
        { title: 'Usage Metrics', href: '/billing/usage' },
        { title: 'Transactions', href: '/billing/transactions' },
        { title: 'Pricing', href: '/billing/pricing' },
      ]}
    />
  );
}
