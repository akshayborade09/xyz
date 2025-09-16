import { PageShell } from '@/components/page-shell';

export default function SettingsPage() {
  return (
    <PageShell
      title='Settings'
      description='Configure and manage your Krutrim Cloud account settings'
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>Account Settings</h2>
          <p className='text-muted-foreground mb-4'>
            Manage your account settings, security configurations, and developer
            tools. Configure API access, multi-factor authentication, and
            integration options from this central dashboard.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
            <div className='border rounded-lg p-5'>
              <h3 className='font-medium mb-2'>API Keys</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Create and manage API keys for programmatic access.
              </p>
              <a href='/settings/api-keys' className='text-sm text-primary'>
                Manage API Keys →
              </a>
            </div>
            <div className='border rounded-lg p-5'>
              <h3 className='font-medium mb-2'>Multi-Factor Authentication</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Set up MFA to enhance account security.
              </p>
              <a href='/settings/mfa' className='text-sm text-primary'>
                Configure MFA →
              </a>
            </div>
            <div className='border rounded-lg p-5'>
              <h3 className='font-medium mb-2'>VS Studio Integration</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Connect Krutrim Cloud with Visual Studio.
              </p>
              <a href='/settings/vs-studio' className='text-sm text-primary'>
                Setup Integration →
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
