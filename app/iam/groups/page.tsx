import { PageLayout } from '@/components/page-layout';

export default function GroupsPage() {
  return (
    <PageLayout title='Groups' description='Manage your user groups'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Groups</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Groups content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
