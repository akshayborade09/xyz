import { PageShell } from '@/components/page-shell';

export default function IamPage() {
  return (
    <PageShell
      title='Identity & Access Management'
      description='Secure and manage access to your Krutrim Cloud resources'
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>IAM Overview</h2>
          <p className='text-muted-foreground mb-4'>
            Identity and Access Management (IAM) enables you to securely control
            access to your Krutrim Cloud resources. Manage users, groups, and
            roles to enforce the principle of least privilege and implement
            fine-grained permissions across your organization.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
            <div className='border rounded-lg p-5'>
              <h3 className='font-medium mb-2'>Users</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Manage user accounts and their individual permissions.
              </p>
              <a href='/iam/users' className='text-sm text-primary'>
                Manage Users →
              </a>
            </div>
            <div className='border rounded-lg p-5'>
              <h3 className='font-medium mb-2'>Groups</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Organize users into groups with shared permissions.
              </p>
              <a href='/iam/groups' className='text-sm text-primary'>
                Manage Groups →
              </a>
            </div>
            <div className='border rounded-lg p-5'>
              <h3 className='font-medium mb-2'>Roles</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Define reusable permission sets for specific job functions.
              </p>
              <a href='/iam/roles' className='text-sm text-primary'>
                Manage Roles →
              </a>
            </div>
            <div className='border rounded-lg p-5'>
              <h3 className='font-medium mb-2'>Policies</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Create and manage access control policies.
              </p>
              <a href='/iam/policy' className='text-sm text-primary'>
                Manage Policies →
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
