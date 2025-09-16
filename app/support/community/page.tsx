import { PageLayout } from '@/components/page-layout';

export default function SupportCommunityPage() {
  return (
    <PageLayout
      title='Community'
      description='Connect with the Krutrim Cloud community'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Community</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Community content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
