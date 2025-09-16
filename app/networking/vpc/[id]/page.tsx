'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout } from '../../../../components/page-layout';
import { DetailSection } from '../../../../components/detail-section';
import { DetailGrid } from '../../../../components/detail-grid';
import { DetailItem } from '../../../../components/detail-item';
import { Button } from '../../../../components/ui/button';
import { getVPC, subnets } from '../../../../lib/data';
import { DeleteConfirmationModal } from '../../../../components/delete-confirmation-modal';
import { ShadcnDataTable } from '../../../../components/ui/shadcn-data-table';
import { StatusBadge } from '../../../../components/status-badge';
import { VPCDeletionStatus } from '../../../../components/vpc-deletion-status';
import { Edit, Trash2 } from 'lucide-react';
import { EmptyState } from '../../../../components/ui/empty-state';

// Dummy snapshots data for design mode
const vpcSnapshots = []; // Replace with filtered dummy data if available

export default function VPCDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const vpc = getVPC(params.id);

  if (!vpc) {
    notFound();
  }

  const handleDelete = () => {
    // In a real app, this would delete the VPC
    console.log('Deleting VPC:', vpc.name);
    router.push('/networking/vpc');
  };

  const handleEdit = () => {
    router.push(`/networking/vpc/${vpc.id}/edit`);
  };

  const handleCreateSubnet = () => {
    router.push(`/networking/subnets/create?vpc=${vpc.name}`);
  };

  // Filter subnets that belong to this VPC
  const vpcSubnets = subnets.filter(subnet => subnet.vpcName === vpc.name);

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Subnet table columns
  const subnetColumns = [
    {
      key: 'name',
      label: 'Subnet Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/networking/subnets/${row.id}`}
          className='text-primary font-medium hover:underline'
        >
          {value}
        </a>
      ),
    },
    {
      key: 'availabilityZone',
      label: 'Availability Zone',
      sortable: true,
    },
    {
      key: 'cidrBlock',
      label: 'CIDR Block',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'description',
      label: 'Description',
      searchable: true,
      render: (value: string) => (
        <div className='max-w-xs truncate' title={value}>
          {value}
        </div>
      ),
    },
  ];

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/networking', title: 'Networking' },
    { href: '/networking/vpc', title: 'VPC' },
    { href: `/networking/vpc/${vpc.id}`, title: vpc.name },
  ];

  return (
    <PageLayout
      title={vpc.name}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      {/* VPC Basic Information */}
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
        {vpc.status !== 'deleting' && (
          <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleEdit}
              className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
            >
              <Edit className='h-4 w-4' />
            </Button>
            {vpc.name !== 'production-vpc' && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsDeleteModalOpen(true)}
                className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>
        )}

        <DetailGrid>
          {/* VPC ID, Region, Status, Created On in one row */}
          <div className='col-span-full grid grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                VPC ID
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {vpc.id}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Region
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {vpc.region}
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
                {vpc.status === 'deleting' ? (
                  <VPCDeletionStatus vpc={vpc} compact={true} />
                ) : (
                  <StatusBadge status={vpc.status} />
                )}
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
                {formatDate(vpc.createdOn)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='col-span-full'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Description
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {vpc.description}
              </div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Subnets Section */}
      {vpcSubnets.length > 0 && (
        <div className='bg-card text-card-foreground border-border border rounded-lg p-6 mb-8'>
          <DetailSection title={`Subnets (${vpcSubnets.length})`}>
            <ShadcnDataTable
              columns={subnetColumns}
              data={vpcSubnets}
              searchableColumns={['name', 'description']}
              pageSize={10}
              enableSearch={true}
              enableColumnVisibility={false}
              enablePagination={true}
              enableVpcFilter={false}
            />
          </DetailSection>
        </div>
      )}

      {/* Snapshots Section */}
      {vpcSnapshots.length === 0 ? (
        <EmptyState
          title='No Snapshots Available'
          description='Create snapshots to back up your VPC configuration and restore it when needed. Snapshots help you recover quickly from accidental changes or failures.'
          actionText='Create Snapshot'
          onAction={() =>
            router.push(`/networking/vpc/${vpc.id}/snapshots/create`)
          }
        />
      ) : (
        <DetailSection title={`Snapshots (${vpcSnapshots.length})`}>
          <></>
          {/* Render snapshot table or cards here */}
        </DetailSection>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={vpc.name}
        resourceType='VPC'
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
