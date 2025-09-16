import { PageLayout } from '@/components/page-layout';

export default function MfaPage() {
  return (
    <PageLayout title='MFA' description='Manage multi-factor authentication'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>
            Multi-Factor Authentication
          </h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the MFA content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
