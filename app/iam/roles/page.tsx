import { PageLayout } from '@/components/page-layout';

export default function RolesPage() {
  return (
    <PageLayout title='Roles' description='Manage your IAM roles'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Roles</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Roles content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
