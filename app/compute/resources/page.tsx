'use client';

import { PageLayout } from '@/components/page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { useState } from 'react';

export default function ComputeResourcesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <PageLayout
      title='Compute Resources'
      description='Manage CPU, GPU and specialized AI hardware'
    >
      <div className='space-y-6'>
        <VercelTabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'gpu', label: 'GPU Resources' },
            { id: 'cpu', label: 'CPU Resources' },
            { id: 'tpu', label: 'TPU Resources' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          size='md'
        />

        {activeTab === 'overview' && (
          <div className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-3'>
              <Card className='p-6'>
                <h3 className='text-xl font-bold mb-2'>GPU Resources</h3>
                <p className='text-muted-foreground'>
                  Manage your GPU resources for AI workloads
                </p>
              </Card>

              <Card className='p-6'>
                <h3 className='text-xl font-bold mb-2'>CPU Resources</h3>
                <p className='text-muted-foreground'>
                  Manage your CPU resources for general computing
                </p>
              </Card>

              <Card className='p-6'>
                <h3 className='text-xl font-bold mb-2'>TPU Resources</h3>
                <p className='text-muted-foreground'>
                  Manage your TPU resources for specialized AI workloads
                </p>
              </Card>
            </div>

            <div>
              <h2 className='text-2xl font-bold mb-4'>Resource Allocation</h2>
              <Card>
                <CardContent className='p-6 min-h-[300px] flex items-center justify-center'>
                  <p className='text-muted-foreground'>
                    Resource allocation chart would appear here
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'gpu' && (
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-xl font-bold mb-4'>GPU Resources</h3>
              <p className='text-muted-foreground mb-4'>
                Manage your GPU resources for AI workloads
              </p>
              <div className='min-h-[300px] flex items-center justify-center border rounded-md'>
                <p className='text-muted-foreground'>
                  GPU resource management interface would appear here
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'cpu' && (
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-xl font-bold mb-4'>CPU Resources</h3>
              <p className='text-muted-foreground mb-4'>
                Manage your CPU resources for general computing
              </p>
              <div className='min-h-[300px] flex items-center justify-center border rounded-md'>
                <p className='text-muted-foreground'>
                  CPU resource management interface would appear here
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'tpu' && (
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-xl font-bold mb-4'>TPU Resources</h3>
              <p className='text-muted-foreground mb-4'>
                Manage your TPU resources for specialized AI workloads
              </p>
              <div className='min-h-[300px] flex items-center justify-center border rounded-md'>
                <p className='text-muted-foreground'>
                  TPU resource management interface would appear here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
