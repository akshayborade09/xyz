'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { CreateButton } from '../../../components/create-button';
import { StatusBadge } from '../../../components/status-badge';
import { subnets, getVMAttachedToSubnet } from '../../../lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { ActionMenu } from '../../../components/action-menu';
import { ShadcnDataTable } from '../../../components/ui/shadcn-data-table';
import { RefreshCw } from 'lucide-react';
import {
  DeleteSubnetVMWarningModal,
  DeleteSubnetConfirmationModal,
  DeleteSubnetNameConfirmationModal,
  DeleteSubnetDependencyCheckModal,
} from '../../../components/modals/delete-subnet-modals';
import { canDeleteSubnet } from '../../../lib/data';

import {
  filterDataForUser,
  shouldShowEmptyState,
  getEmptyStateMessage,
} from '../../../lib/demo-data-filter';
import { EmptyState } from '../../../components/ui/empty-state';

export default function SubnetListPage() {
  const router = useRouter();
  const [deleteStep, setDeleteStep] = useState<
    'dependency-check' | 'name-confirmation' | null
  >(null);
  const [selectedSubnet, setSelectedSubnet] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter subnets based on search term and filters
  const filteredSubnets = subnets.filter(subnet => {
    const matchesSearch =
      subnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subnet.vpcName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subnet.cidr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || subnet.status === statusFilter;
    const matchesType = typeFilter === 'all' || subnet.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Apply demo data filtering
  const finalSubnets = filterDataForUser(filteredSubnets);

  const showEmptyState = shouldShowEmptyState() && finalSubnets.length === 0;

  const subnetIcon = (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12 2L2 7L12 12L22 7L12 2Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M2 17L12 22L22 17'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M2 12L12 17L22 12'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );

  const handleDeleteClick = (subnet: any) => {
    setSelectedSubnet(subnet);
    setDeleteStep('dependency-check');
  };

  const handleFinalDelete = async () => {
    // In a real app, this would delete the subnet
    console.log('Deleting subnet:', selectedSubnet?.name);
    setDeleteStep(null);
    setSelectedSubnet(null);
    // Refresh the page to show updated data
    window.location.reload();
  };

  const handleCloseModals = () => {
    setDeleteStep(null);
    setSelectedSubnet(null);
  };

  const handleProceedToConfirmation = () => {
    setDeleteStep('name-confirmation');
  };

  const columns = [
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
      key: 'vpcName',
      label: 'VPC',
      searchable: true,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'cidr',
      label: 'CIDR',
    },
    {
      key: 'gatewayIp',
      label: 'Gateway IP',
    },
    {
      key: 'createdOn',
      label: 'Created On',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <span className='text-muted-foreground'>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className='flex justify-end'>
          <ActionMenu
            editHref={`/networking/subnets/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType='Subnet'
          />
        </div>
      ),
    },
  ];

  // Add actions property to each subnet row for DataTable
  const dataWithActions = finalSubnets.map(subnet => ({
    ...subnet,
    actions: null,
  }));

  const handleRefresh = () => {
    // Add your refresh logic here
    console.log(
      '🔄 Refreshing Subnet data at:',
      new Date().toLocaleTimeString()
    );
    // In a real app, this would typically:
    // - Refetch data from API
    // - Update state
    // - Show loading indicator
    // For demo purposes, we'll just log instead of reloading
    // window.location.reload()
  };

  return (
    <PageShell
      title='Subnets'
      description='Create subnets inside your VPC to neatly separate resources—keeping them secure and helping your network run faster.'
      headerActions={
        <CreateButton href='/networking/subnets/create' label='Create Subnet' />
      }
    >
      {showEmptyState ? (
        <EmptyState
          {...getEmptyStateMessage('subnet')}
          icon={subnetIcon}
          onAction={() => (window.location.href = '/networking/subnets/create')}
        />
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={['name', 'vpcName']}
          pageSize={10}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableAutoRefresh={true}
          enableVpcFilter={true}
          vpcOptions={[
            { value: 'all', label: 'All VPCs' },
            { value: 'production-vpc', label: 'production-vpc' },
            { value: 'development-vpc', label: 'development-vpc' },
            { value: 'staging-vpc', label: 'staging-vpc' },
            { value: 'testing-vpc', label: 'testing-vpc' },
            { value: 'backup-vpc', label: 'backup-vpc' },
            { value: 'analytics-vpc', label: 'analytics-vpc' },
            { value: 'security-vpc', label: 'security-vpc' },
            { value: 'ml-vpc', label: 'ml-vpc' },
            { value: 'cdn-vpc', label: 'cdn-vpc' },
            { value: 'iot-vpc', label: 'iot-vpc' },
            { value: 'gaming-vpc', label: 'gaming-vpc' },
            { value: 'blockchain-vpc', label: 'blockchain-vpc' },
            { value: 'research-vpc', label: 'research-vpc' },
          ]}
        />
      )}

      {/* Step 1: Dependency Check Modal */}
      {selectedSubnet && (
        <DeleteSubnetDependencyCheckModal
          open={deleteStep === 'dependency-check'}
          onClose={handleCloseModals}
          subnet={selectedSubnet}
          onProceed={handleProceedToConfirmation}
        />
      )}

      {/* Step 2: Name Confirmation Modal */}
      {selectedSubnet && (
        <DeleteSubnetNameConfirmationModal
          open={deleteStep === 'name-confirmation'}
          onClose={handleCloseModals}
          subnet={selectedSubnet}
          onConfirm={handleFinalDelete}
        />
      )}
    </PageShell>
  );
}
