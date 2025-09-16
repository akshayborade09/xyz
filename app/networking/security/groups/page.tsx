import { PageLayout } from '@/components/page-layout';

export default function SecurityGroupsPage() {
  return (
    <PageLayout
      title='Security Groups'
      description='Manage your security groups'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Security Groups</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Security Groups content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
