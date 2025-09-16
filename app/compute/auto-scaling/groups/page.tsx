import { PageLayout } from '@/components/page-layout';

export default function AutoScalingGroupsPage() {
  return (
    <PageLayout
      title='Auto Scaling Groups'
      description='Manage your auto scaling groups'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Auto Scaling Groups</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Auto Scaling Groups content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
