import { PageShell } from '@/components/page-shell';
import { redirect } from 'next/navigation';

export default function UsersPage() {
  // Redirect to the first tab by default
  redirect('/iam/users/list');

  return (
    <PageShell
      title='Users'
      description='Manage your user accounts and permissions'
      tabs={[
        { title: 'All Users', href: '/iam/users/list' },
        { title: 'User Groups', href: '/iam/users/groups' },
        { title: 'Roles', href: '/iam/users/roles' },
        { title: 'Permissions', href: '/iam/users/permissions' },
      ]}
    >
      <div className='rounded-lg border border-dashed p-10 text-center'>
        <h3 className='text-lg font-medium'>User Management</h3>
        <p className='text-sm text-muted-foreground mt-1'>
          Select a tab to manage users and their access
        </p>
      </div>
    </PageShell>
  );
}
