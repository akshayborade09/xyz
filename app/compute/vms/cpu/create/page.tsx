'use client';

import dynamic from 'next/dynamic';

// Force this page to be dynamic by using dynamic import with ssr: false
const CreateVMClient = dynamic(() => import('./create-vm-client'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center min-h-screen'>
      Loading...
    </div>
  ),
});

export default function CreateVMPage() {
  return <CreateVMClient />;
}
