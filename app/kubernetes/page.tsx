'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { ActionMenu } from '@/components/action-menu';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { StatusBadge } from '@/components/status-badge';

import { Badge } from '@/components/ui/badge';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ClusterDeleteModal } from '@/components/mks/cluster-delete-modal';
import { ClusterUpgradeModal } from '@/components/mks/cluster-upgrade-modal';
import { NodePoolUpgradeModal } from '@/components/mks/node-pool-upgrade-modal';
import { EditClusterModal } from '@/components/mks/edit-cluster-modal';
import {
  mockMKSClusters,
  type MKSCluster,
  isK8sVersionDeprecated,
  getNextK8sVersion,
} from '@/lib/mks-data';
import {
  MoreVertical,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Download,
} from 'lucide-react';
import Link from 'next/link';

export default function MKSDashboardPage() {
  const router = useRouter();
  const [clusters, setClusters] = useState<MKSCluster[]>(mockMKSClusters);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clusterToDelete, setClusterToDelete] = useState<MKSCluster | null>(
    null
  );
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [clusterToUpgrade, setClusterToUpgrade] = useState<MKSCluster | null>(
    null
  );
  const [nodePoolUpgradeModalOpen, setNodePoolUpgradeModalOpen] =
    useState(false);
  const [clusterForNodePoolUpgrade, setClusterForNodePoolUpgrade] =
    useState<MKSCluster | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clusterToEdit, setClusterToEdit] = useState<MKSCluster | null>(null);

  // Filter clusters to only show Bangalore and Hyderabad regions
  const filteredClusters = clusters.filter(
    cluster =>
      cluster.region === 'ap-south-1' || cluster.region === 'ap-southeast-1'
  );

  const getStatusIcon = (status: MKSCluster['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'creating':
        return <Clock className='h-4 w-4 text-blue-500' />;
      case 'updating':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'deleting':
        return <Clock className='h-4 w-4 text-orange-500' />;
      case 'error':
        return <XCircle className='h-4 w-4 text-red-500' />;
      default:
        return <AlertCircle className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusBadgeVariant = (status: MKSCluster['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'creating':
        return 'secondary';
      case 'updating':
        return 'secondary';
      case 'deleting':
        return 'destructive';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatAge = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return 'Today';
    }
    if (diffInDays === 1) {
      return '1 day ago';
    }
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }
    if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    }
    if (diffInDays < 365) {
      return `${Math.floor(diffInDays / 30)} months ago`;
    }
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getRegionDisplayName = (regionId: string): string => {
    switch (regionId) {
      case 'ap-south-1':
        return 'Bangalore';
      case 'ap-southeast-1':
        return 'Hyderabad';
      default:
        return regionId;
    }
  };

  const handleCreateCluster = () => {
    // Navigate to cluster creation flow
    router.push('/kubernetes/clusters/create');
  };

  const handleDeleteCluster = (cluster: MKSCluster) => {
    setClusterToDelete(cluster);
    setDeleteModalOpen(true);
  };

  const handleUpgradeCluster = (cluster: MKSCluster) => {
    setClusterToUpgrade(cluster);
    setUpgradeModalOpen(true);
  };

  const handleUpgradeNodePools = (cluster: MKSCluster) => {
    setClusterForNodePoolUpgrade(cluster);
    setNodePoolUpgradeModalOpen(true);
  };

  const handleEditCluster = (cluster: MKSCluster) => {
    setClusterToEdit(cluster);
    setEditModalOpen(true);
  };

  const handleSaveClusterEdit = (updatedCluster: MKSCluster) => {
    setClusters(prev =>
      prev.map(cluster =>
        cluster.id === updatedCluster.id ? updatedCluster : cluster
      )
    );
    setEditModalOpen(false);
    setClusterToEdit(null);
  };

  const handleDownloadKubeconfig = (cluster: MKSCluster) => {
    // In a real implementation, this would call the API to get the kubeconfig
    console.log('Downloading kubeconfig for cluster:', cluster.name);

    // Create a mock kubeconfig content
    const kubeconfigContent = `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t
    server: https://${cluster.name}.k8s.example.com:6443
  name: ${cluster.name}
contexts:
- context:
    cluster: ${cluster.name}
    user: ${cluster.name}-admin
  name: ${cluster.name}
current-context: ${cluster.name}
kind: Config
preferences: {}
users:
- name: ${cluster.name}-admin
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t
    client-key-data: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQ==`;

    // Create a blob and download it
    const blob = new Blob([kubeconfigContent], { type: 'text/yaml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cluster.name}-kubeconfig.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = async (clusterId: string) => {
    // In a real implementation, this would call the API to delete the cluster
    console.log('Deleting cluster:', clusterId);
    setClusters(prev => prev.filter(c => c.id !== clusterId));
  };

  const handleConfirmUpgrade = async (
    clusterId: string,
    newVersion: string
  ) => {
    // In a real implementation, this would call the API to upgrade the cluster
    console.log('Upgrading cluster:', clusterId, 'to version:', newVersion);

    // Update the cluster version in local state
    setClusters(prev =>
      prev.map(c =>
        c.id === clusterId
          ? { ...c, k8sVersion: newVersion, status: 'updating' as const }
          : c
      )
    );

    // Simulate upgrade completion after a delay
    setTimeout(() => {
      setClusters(prev =>
        prev.map(c =>
          c.id === clusterId ? { ...c, status: 'active' as const } : c
        )
      );
    }, 3000);
  };

  const handleConfirmNodePoolUpgrade = async (
    selectedNodePoolIds: string[],
    targetVersion: string
  ) => {
    if (!clusterForNodePoolUpgrade) {
      return;
    }

    // In a real implementation, this would call the API to upgrade node pools
    console.log(
      'Upgrading node pools:',
      selectedNodePoolIds,
      'to version:',
      targetVersion
    );

    // Update the cluster's node pools to show upgrading status
    setClusters(prev =>
      prev.map(c =>
        c.id === clusterForNodePoolUpgrade.id
          ? {
              ...c,
              nodePools: c.nodePools.map(pool =>
                selectedNodePoolIds.includes(pool.id)
                  ? { ...pool, status: 'updating' as const }
                  : pool
              ),
            }
          : c
      )
    );

    // Simulate upgrade completion after a delay
    setTimeout(() => {
      setClusters(prev =>
        prev.map(c =>
          c.id === clusterForNodePoolUpgrade.id
            ? {
                ...c,
                nodePools: c.nodePools.map(pool =>
                  selectedNodePoolIds.includes(pool.id)
                    ? { ...pool, status: 'active' as const }
                    : pool
                ),
              }
            : c
        )
      );
    }, 5000);

    setNodePoolUpgradeModalOpen(false);
    setClusterForNodePoolUpgrade(null);
  };

  const handleRefresh = () => {
    console.log(
      '🔄 Refreshing Kubernetes cluster data at:',
      new Date().toLocaleTimeString()
    );
  };

  // Define columns for ShadcnDataTable (matching VPC pattern)
  const columns = [
    {
      key: 'name',
      label: 'Cluster',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <Link
          href={`/kubernetes/clusters/${row.id}`}
          className='text-primary font-medium hover:underline leading-5'
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'region',
      label: 'Region',
      sortable: true,
      render: (value: string) => (
        <Badge variant='secondary' className='text-xs font-medium'>
          {getRegionDisplayName(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'k8sVersion',
      label: 'Kubernetes Version',
      sortable: true,
      render: (value: string, row: any) => (
        <div className='flex items-center gap-2'>
          <Badge variant='secondary' className='font-mono text-xs'>
            {value}
          </Badge>
          {isK8sVersionDeprecated(value) && (
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className='h-4 w-4 text-yellow-500' />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  This version is deprecated. Please upgrade your cluster to a
                  supported Kubernetes version.
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      key: 'nodeCount',
      label: 'Node Pools',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => (
        <div className='text-center font-medium leading-5'>{value}</div>
      ),
    },
    {
      key: 'tags',
      label: 'Tags',
      searchable: true,
      render: (value: string[]) => {
        const displayTags = value.slice(0, 2);
        const remainingCount = value.length - 2;

        return (
          <div className='flex flex-wrap gap-2 max-w-xs'>
            {displayTags.map((tag, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='text-xs font-medium'
              >
                {tag}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <TooltipWrapper content={value.slice(2).join(', ')}>
                <Badge
                  variant='outline'
                  className='text-xs font-medium cursor-help'
                >
                  +{remainingCount}
                </Badge>
              </TooltipWrapper>
            )}
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created On',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className='text-muted-foreground leading-5'>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (value: any, row: any) => {
        const nextVersion = getNextK8sVersion(row.k8sVersion);
        const hasUpdateAvailable = nextVersion !== null;

        const customActions = [];

        // Add Update action only when update is available
        if (hasUpdateAvailable) {
          customActions.push({
            label: 'Update Cluster',
            onClick: () => handleUpgradeCluster(row),
            icon: <RefreshCw className='mr-2 h-4 w-4' />,
          });
        }

        // Add Upgrade Node Pools action only if cluster has node pools and cluster is not being updated
        if (
          row.nodePools &&
          row.nodePools.length > 0 &&
          row.status !== 'updating' &&
          row.status !== 'deleting'
        ) {
          customActions.push({
            label: 'Upgrade Node Pools',
            onClick: () => handleUpgradeNodePools(row),
            icon: <Server className='mr-2 h-4 w-4' />,
          });
        }

        // Add Download Kubeconfig action for active clusters
        if (row.status === 'active') {
          customActions.push({
            label: 'Download Kubeconfig',
            onClick: () => handleDownloadKubeconfig(row),
            icon: <Download className='mr-2 h-4 w-4' />,
          });
        }

        return (
          <div className='flex justify-end'>
            <ActionMenu
              viewHref={`/kubernetes/clusters/${row.id}`}
              onEdit={() => handleEditCluster(row)}
              onCustomDelete={() => handleDeleteCluster(row)}
              resourceName={row.name}
              resourceType='Cluster'
              customActions={customActions}
            />
          </div>
        );
      },
    },
  ];

  const headerActions =
    filteredClusters.length > 0 ? (
      <Button
        onClick={handleCreateCluster}
        className='bg-black text-white hover:bg-black/90'
      >
        Create Cluster
      </Button>
    ) : undefined;

  return (
    <TooltipProvider>
      <PageShell
        title='Managed Kubernetes Service'
        description='Deploy, manage, and scale Kubernetes clusters with enterprise-grade reliability'
        headerActions={headerActions}
      >
        {filteredClusters.length === 0 ? (
          <EmptyState
            title='No Kubernetes clusters yet'
            description='Get started by creating your first Kubernetes cluster. Deploy applications with ease and scale as needed.'
            actionText='Create Cluster'
            onAction={handleCreateCluster}
            icon={
              <div className='w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-12 h-12 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                  />
                </svg>
              </div>
            }
          />
        ) : (
          <ShadcnDataTable
            columns={columns}
            data={filteredClusters}
            searchableColumns={['name', 'tags']}
            pageSize={10}
            enableSearch={true}
            enableColumnVisibility={false}
            enablePagination={true}
            onRefresh={handleRefresh}
            enableAutoRefresh={true}
            enableVpcFilter={false}
          />
        )}

        <ClusterDeleteModal
          cluster={clusterToDelete}
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setClusterToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        <ClusterUpgradeModal
          cluster={clusterToUpgrade}
          isOpen={upgradeModalOpen}
          onClose={() => {
            setUpgradeModalOpen(false);
            setClusterToUpgrade(null);
          }}
          onConfirm={handleConfirmUpgrade}
        />

        {clusterForNodePoolUpgrade && (
          <NodePoolUpgradeModal
            cluster={clusterForNodePoolUpgrade}
            isOpen={nodePoolUpgradeModalOpen}
            onClose={() => {
              setNodePoolUpgradeModalOpen(false);
              setClusterForNodePoolUpgrade(null);
            }}
            onConfirm={handleConfirmNodePoolUpgrade}
          />
        )}

        <EditClusterModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setClusterToEdit(null);
          }}
          cluster={clusterToEdit}
          onSave={handleSaveClusterEdit}
        />
      </PageShell>
    </TooltipProvider>
  );
}
