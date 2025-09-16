import { PageLayout } from '@/components/page-layout';

export default function MyMachinesPage() {
  return (
    <PageLayout title='My Machines' description='Manage your virtual machines'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>My Machines</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the My Machines content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
