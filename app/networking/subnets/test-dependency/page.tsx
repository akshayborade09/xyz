'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { DeleteSubnetDependencyCheckModal } from '@/components/modals/delete-subnet-modals';
import { canDeleteSubnet } from '@/lib/data';

export default function TestSubnetDependencyPage() {
  const [dependencyModalOpen, setDependencyModalOpen] = useState(false);

  // Test subnet data
  const testSubnet = {
    id: 'subnet-18',
    name: 'microservices-subnet-public',
    vpcName: 'microservices-vpc',
    type: 'Public',
    status: 'Active',
    cidr: '10.13.1.0/24',
    gatewayIp: '10.13.1.1',
    createdOn: '2024-12-19T10:16:30Z',
  };

  // Check dependencies
  const dependencyCheck = canDeleteSubnet(testSubnet.name);

  return (
    <PageLayout
      title='Subnet Dependency Test'
      description='Testing subnet deletion dependency validation'
    >
      <div className='space-y-6'>
        <div className='p-6 border rounded-lg'>
          <h3 className='text-lg font-semibold mb-4'>
            Test Subnet: {testSubnet.name}
          </h3>

          <div className='space-y-4'>
            <div>
              <h4 className='font-medium mb-2'>Dependency Check Results:</h4>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>Can Delete:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${dependencyCheck.canDelete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {dependencyCheck.canDelete ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>VMs Found:</span>
                  <span className='px-2 py-1 rounded text-xs bg-blue-100 text-blue-800'>
                    {dependencyCheck.dependencies.vmCount}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>IPs Found:</span>
                  <span className='px-2 py-1 rounded text-xs bg-blue-100 text-blue-800'>
                    {dependencyCheck.dependencies.ipCount}
                  </span>
                </div>
              </div>
            </div>

            {dependencyCheck.dependencies.vmCount > 0 && (
              <div>
                <h4 className='font-medium mb-2'>Virtual Machines:</h4>
                <div className='space-y-2'>
                  {dependencyCheck.vms.map(vm => (
                    <div
                      key={vm.id}
                      className='p-3 border rounded-lg bg-muted/50'
                    >
                      <div className='font-medium text-sm'>{vm.name}</div>
                      <div className='text-xs text-muted-foreground'>
                        ID: {vm.id} • Status: {vm.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dependencyCheck.dependencies.ipCount > 0 && (
              <div>
                <h4 className='font-medium mb-2'>IP Addresses:</h4>
                <div className='space-y-2'>
                  {dependencyCheck.ips.map(ip => (
                    <div
                      key={ip.id}
                      className='p-3 border rounded-lg bg-muted/50'
                    >
                      <div className='font-medium text-sm'>{ip.name}</div>
                      <div className='text-xs text-muted-foreground'>
                        {ip.ipAddress} • Type: {ip.type} • Status: {ip.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex gap-4'>
          <Button onClick={() => setDependencyModalOpen(true)}>
            Test Dependency Check Modal
          </Button>
        </div>
      </div>

      <DeleteSubnetDependencyCheckModal
        open={dependencyModalOpen}
        onClose={() => setDependencyModalOpen(false)}
        subnet={testSubnet}
        onProceed={() => {
          console.log('Proceeding with subnet deletion...');
          setDependencyModalOpen(false);
        }}
      />
    </PageLayout>
  );
}
