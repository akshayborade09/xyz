import { PageShell } from '@/components/page-shell';

export default function IAMUsersPage() {
  return (
    <PageShell
      title='Identity & Access Management - Users'
      description='Manage user access and permissions'
      tabs={[
        { title: 'All Users', href: '/administration/iam/users' },
        { title: 'User Groups', href: '/administration/iam/users/groups' },
        { title: 'Roles', href: '/administration/iam/users/roles' },
        { title: 'Permissions', href: '/administration/iam/users/permissions' },
      ]}
    >
      <div className='rounded-lg border border-dashed p-10 text-center'>
        <h3 className='text-lg font-medium'>IAM Users Content</h3>
        <p className='text-sm text-muted-foreground mt-1'>
          This is a placeholder for IAM users management interface
        </p>
      </div>
    </PageShell>
  );
}
