import { PageShell } from '@/components/page-shell';

export default function ApiManagementPage() {
  return (
    <PageShell
      title='API Management'
      description='Manage API keys, versions, and documentation'
      tabs={[
        { title: 'Overview', href: '/apis/management' },
        { title: 'API Keys', href: '/apis/management/keys' },
        { title: 'Versions', href: '/apis/management/versions' },
        { title: 'Documentation', href: '/apis/management/docs' },
      ]}
    />
  );
}
