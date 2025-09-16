'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout } from '../../../../components/page-layout';
import { DetailSection } from '../../../../components/detail-section';
import { DetailGrid } from '../../../../components/detail-grid';
import { DetailItem } from '../../../../components/detail-item';
import { Button } from '../../../../components/ui/button';
import {
  getSubnet,
  getVPC,
  getVMAttachedToSubnet,
  getConnectedSubnets,
  vpcs,
} from '../../../../lib/data';
import { DeleteConfirmationModal } from '../../../../components/delete-confirmation-modal';
import { VPCDetailsModal } from '../../../../components/modals/vpc-details-modal';
import { StatusBadge } from '../../../../components/status-badge';
import { ShadcnDataTable } from '../../../../components/ui/shadcn-data-table';
import { Edit, Trash2 } from 'lucide-react';

export default function SubnetDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVPCModalOpen, setIsVPCModalOpen] = useState(false);
  const subnet = getSubnet(params.id);

  if (!subnet) {
    notFound();
  }

  // Get the VPC that this subnet belongs to by finding VPC with matching name
  const associatedVPC = vpcs.find(vpc => vpc.name === subnet.vpcName);

  // Get attached VM if any
  const attachedVM = getVMAttachedToSubnet(subnet.id);

  // Get connected subnets
  const connectedSubnetIds = getConnectedSubnets(subnet.id);
  const connectedSubnets = connectedSubnetIds
    .map(id => getSubnet(id))
    .filter(Boolean);

  const handleDelete = () => {
    // In a real app, this would delete the subnet
    console.log('Deleting Subnet:', subnet.name);
    router.push('/networking/subnets');
  };

  const handleEdit = () => {
    router.push(`/networking/subnets/${subnet.id}/edit`);
  };

  const handleViewVPC = () => {
    setIsVPCModalOpen(true);
  };

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/networking', title: 'Networking' },
    { href: '/networking/subnets', title: 'Subnets' },
    { href: `/networking/subnets/${subnet.id}`, title: subnet.name },
  ];

  return (
    <PageLayout
      title={subnet.name}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      {/* Subnet Basic Information */}
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
          {subnet.name !== 'production-subnet-public' &&
            subnet.name !== 'production-subnet-private' && (
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

        <DetailGrid>
          {/* VPC, Access Type, Status in first row */}
          <div className='col-span-full grid grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                VPC
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {associatedVPC ? (
                  <button
                    onClick={handleViewVPC}
                    className={
                      subnet.vpcName === 'blockchain-vpc'
                        ? 'font-medium hover:underline'
                        : 'text-primary font-medium hover:underline'
                    }
                  >
                    {subnet.vpcName}
                  </button>
                ) : (
                  subnet.vpcName
                )}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Access Type
              </label>
              <div>
                <StatusBadge status={subnet.type} />
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
                <StatusBadge status={subnet.status} />
              </div>
            </div>
            <div className='space-y-1'>
              {/* Empty space for layout consistency */}
            </div>
          </div>

          {/* CIDR, Gateway IP, Created On in second row */}
          <div className='col-span-full grid grid-cols-4 gap-4 mt-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                CIDR
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {subnet.cidr}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Gateway IP
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {subnet.gatewayIp}
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
                {formatDate(subnet.createdOn)}
              </div>
            </div>
            <div className='space-y-1'>
              {/* Empty space for layout consistency */}
            </div>
          </div>

          {/* Description in third row */}
          <div className='col-span-full mt-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Description
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {subnet.description}
              </div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Connected Subnets Section */}
      {connectedSubnets.length > 0 && (
        <div className='bg-card text-card-foreground border-border border rounded-lg p-6 mb-8'>
          <DetailSection
            title={`Connected Subnets (${connectedSubnets.length})`}
          >
            <ShadcnDataTable
              columns={[
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
                  key: 'cidr',
                  label: 'CIDR Block',
                  sortable: true,
                },
                {
                  key: 'type',
                  label: 'Type',
                  sortable: true,
                },
                {
                  key: 'vpcName',
                  label: 'VPC',
                  sortable: true,
                },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  render: (value: string) => <StatusBadge status={value} />,
                },
              ]}
              data={connectedSubnets.filter(Boolean)}
              searchableColumns={['name', 'vpcName']}
              pageSize={10}
              enableSearch={true}
              enableColumnVisibility={false}
              enablePagination={true}
              enableVpcFilter={false}
            />
          </DetailSection>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={subnet.name}
        resourceType='Subnet'
        onConfirm={handleDelete}
      />

      <VPCDetailsModal
        isOpen={isVPCModalOpen}
        onClose={() => setIsVPCModalOpen(false)}
        vpc={associatedVPC}
      />
    </PageLayout>
  );
}
