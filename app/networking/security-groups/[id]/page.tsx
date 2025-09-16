'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '../../../../components/page-layout';
import { DetailSection } from '../../../../components/detail-section';
import { DetailGrid } from '../../../../components/detail-grid';
import { DetailItem } from '../../../../components/detail-item';
import { Button } from '../../../../components/ui/button';
import { getSecurityGroup } from '../../../../lib/data';
import { VercelTabs } from '../../../../components/ui/vercel-tabs';
import { StatusBadge } from '../../../../components/status-badge';
import { ShadcnDataTable } from '../../../../components/ui/shadcn-data-table';
import { DeleteConfirmationModal } from '../../../../components/delete-confirmation-modal';
import { useToast } from '../../../../hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';

export default function SecurityGroupDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const sg = getSecurityGroup(params.id);
  const [activeTab, setActiveTab] = useState('inbound');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!sg) {
    notFound();
  }

  const handleDelete = async () => {
    // In a real app, this would delete the security group via API
    console.log('Deleting Security Group:', sg.name);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show success toast
    toast({
      title: 'Security group deleted successfully',
      description: `Security Group "${sg.name}" deleted successfully`,
    });

    // Navigate back to security groups list
    router.push('/networking/security-groups');
  };

  const handleEdit = () => {
    router.push(`/networking/security-groups/${sg.id}/edit`);
  };

  const tabs = [
    { id: 'inbound', label: 'Inbound Rules' },
    { id: 'outbound', label: 'Outbound Rules' },
  ];

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/networking', title: 'Networking' },
    { href: '/networking/security-groups', title: 'Security Groups' },
    { href: `/networking/security-groups/${sg.id}`, title: sg.name },
  ];

  return (
    <PageLayout
      title={sg.name}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      {/* Security Group Basic Information */}
      <div
        className='mb-6 group relative'
        style={{
          borderRadius: '16px',
          border: '4px solid #FFF',
          background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
          boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
          padding: '1.5rem',
        }}
      >
        {/* Overlay Edit/Delete Buttons */}
        <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleEdit}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsDeleteModalOpen(true)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>

        <DetailGrid>
          {/* Security Group ID, VPC, Status, Created On in one row */}
          <div className='col-span-full grid grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Security Group ID
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {sg.id}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                VPC
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {sg.vpcName}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Status
              </label>
              <div>
                <StatusBadge status={sg.status} />
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Created On
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {formatDate(sg.createdOn)}
              </div>
            </div>
          </div>

          {/* Description */}
          {sg.description && (
            <div className='col-span-full'>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Description
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {sg.description}
                </div>
              </div>
            </div>
          )}
        </DetailGrid>
      </div>

      <div className='bg-card text-card-foreground border-border border rounded-lg p-6'>
        <DetailSection title=''>
          <VercelTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            size='md'
          />

          {activeTab === 'inbound' && (
            <div className='mt-6'>
              {sg.inboundRules.length > 0 ? (
                <ShadcnDataTable
                  columns={[
                    {
                      key: 'protocol',
                      label: 'Protocol',
                      sortable: true,
                      render: (value: string) => <StatusBadge status={value} />,
                    },
                    {
                      key: 'portRange',
                      label: 'Port Range',
                      sortable: true,
                      render: (value: string) => (
                        <div className='text-sm'>{value}</div>
                      ),
                    },
                    {
                      key: 'remoteIpPrefix',
                      label: 'Remote IP Prefix',
                      sortable: true,
                      render: (value: string) => (
                        <div className='text-sm'>{value}</div>
                      ),
                    },
                    {
                      key: 'description',
                      label: 'Description',
                      sortable: true,
                      render: (value: string) => (
                        <div className='text-sm'>{value || '-'}</div>
                      ),
                    },
                  ]}
                  data={sg.inboundRules}
                  pageSize={10}
                  enableSearch={true}
                  enableColumnVisibility={false}
                  enablePagination={false}
                />
              ) : (
                <div className='p-8 text-center text-muted-foreground italic text-sm'>
                  No rules defined. All traffic is blocked by default.
                </div>
              )}
            </div>
          )}

          {activeTab === 'outbound' && (
            <div className='mt-6'>
              {sg.outboundRules.length > 0 ? (
                <ShadcnDataTable
                  columns={[
                    {
                      key: 'protocol',
                      label: 'Protocol',
                      sortable: true,
                      render: (value: string) => <StatusBadge status={value} />,
                    },
                    {
                      key: 'portRange',
                      label: 'Port Range',
                      sortable: true,
                      render: (value: string) => (
                        <div className='text-sm'>{value}</div>
                      ),
                    },
                    {
                      key: 'remoteIpPrefix',
                      label: 'Remote IP Prefix',
                      sortable: true,
                      render: (value: string) => (
                        <div className='text-sm'>{value}</div>
                      ),
                    },
                    {
                      key: 'description',
                      label: 'Description',
                      sortable: true,
                      render: (value: string) => (
                        <div className='text-sm'>{value || '-'}</div>
                      ),
                    },
                  ]}
                  data={sg.outboundRules}
                  pageSize={10}
                  enableSearch={true}
                  enableColumnVisibility={false}
                  enablePagination={false}
                />
              ) : (
                <div className='p-8 text-center text-muted-foreground italic text-sm'>
                  No rules defined. All traffic is blocked by default.
                </div>
              )}
            </div>
          )}
        </DetailSection>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={sg.name}
        resourceType='Security Group'
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
