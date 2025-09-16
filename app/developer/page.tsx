import { PageShell } from '@/components/page-shell';

export default function DeveloperPage() {
  return (
    <PageShell
      title='Developer Tools'
      description='Tools and resources for developers'
      tabs={[
        { title: 'SDKs & Libraries', href: '/developer/sdks' },
        { title: 'CI/CD Integration', href: '/developer/cicd' },
        { title: 'Version Control', href: '/developer/version-control' },
        { title: 'Debugging Tools', href: '/developer/debugging' },
      ]}
    />
  );
}
