import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Users2 } from 'lucide-react';

export default function UsersListPage() {
  return (
    <PageShell
      title='Identity & Access Management - Users'
      description='Manage user access and permissions'
      headerActions={
        <Button className='bg-black text-white rounded-full px-6 py-2 text-base font-medium hover:bg-neutral-800'>
          + Invite User
        </Button>
      }
    >
      <div className='bg-white rounded-2xl border p-8 shadow-sm'>
        <h3 className='text-xl font-bold mb-1 flex items-center gap-2'>
          <Users2 className='h-6 w-6 text-muted-foreground' /> Team Members
        </h3>
        <p className='text-muted-foreground mb-8'>
          Manage users who have access to your organization.
        </p>
        <div className='flex flex-col items-center justify-center py-16'>
          <Users2 className='h-14 w-14 text-muted-foreground mb-4' />
          <div className='text-lg font-semibold mb-1'>No users found</div>
          <div className='text-muted-foreground mb-6'>
            Start by inviting team members to your organization.
          </div>
          <Button className='bg-black text-white rounded-full px-6 py-2 text-base font-medium hover:bg-neutral-800'>
            + Invite Your First User
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
