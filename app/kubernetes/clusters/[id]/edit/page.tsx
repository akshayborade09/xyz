'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import { DetailGrid } from '@/components/detail-grid';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowUpRight,
  Trash2,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Shield,
  Database,
  HardDrive,
  Network,
  Monitor,
  Package,
  GitBranch,
  Download,
  Key,
  Edit,
} from 'lucide-react';
import {
  getClusterById,
  type MKSCluster,
  isK8sVersionDeprecated,
  getNextK8sVersion,
  getRegionDisplayName,
  availableNodeFlavors,
} from '@/lib/mks-data';
import { NodePoolsSection } from '@/components/mks/node-pools-section';
import { AddOnsSection } from '@/components/mks/add-ons-section';
import { ClusterUpgradeModal } from '@/components/mks/cluster-upgrade-modal';
import { NodePoolEditModal } from '@/components/mks/node-pool-edit-modal';
import { AddOnsEditModal } from '@/components/mks/add-ons-edit-modal';

export default function EditClusterPage() {
  const params = useParams();
  const router = useRouter();
  const clusterId = params.id as string;
  const [cluster, setCluster] = useState<MKSCluster | undefined>(
    getClusterById(clusterId)
  );

  // Modal states
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isNodePoolEditModalOpen, setIsNodePoolEditModalOpen] = useState(false);
  const [isAddOnsEditModalOpen, setIsAddOnsEditModalOpen] = useState(false);
  const [isKubeconfigModalOpen, setIsKubeconfigModalOpen] = useState(false);

  const handleClusterUpdate = (updatedCluster: MKSCluster) => {
    setCluster(updatedCluster);
  };

  if (!cluster) {
    return (
      <PageLayout title='Cluster Not Found'>
        <div className='text-center py-12'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Cluster not found
          </h3>
          <p className='text-sm text-gray-600 mb-6'>
            The requested cluster could not be found.
          </p>
          <Button onClick={() => router.push('/kubernetes')}>
            Back to Clusters
          </Button>
        </div>
      </PageLayout>
    );
  }

  const nextVersion = getNextK8sVersion(cluster.k8sVersion);
  const isUpgradeAvailable = nextVersion !== null;
  const isDeprecated = isK8sVersionDeprecated(cluster.k8sVersion);

  const handleEdit = () => {
    // This is already the edit page, so we can show different edit modals
  };

  const handleConfirmUpgrade = async (
    clusterId: string,
    newVersion: string
  ) => {
    // In a real implementation, this would call the API to upgrade the cluster
    console.log('Upgrading cluster:', clusterId, 'to version:', newVersion);

    // Update the cluster state to show it's updating
    setCluster(prev =>
      prev
        ? { ...prev, k8sVersion: newVersion, status: 'updating' as const }
        : prev
    );
    setIsUpgradeModalOpen(false);
  };

  const handleDownloadKubeconfig = () => {
    // In a real implementation, this would generate and download the kubeconfig file
    console.log('Downloading kubeconfig for cluster:', cluster.id);
    setIsKubeconfigModalOpen(false);
  };

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/kubernetes', title: 'Kubernetes' },
    { href: '/kubernetes/clusters', title: 'Clusters' },
    { href: `/kubernetes/clusters/${cluster.id}`, title: cluster.name },
    { href: `/kubernetes/clusters/${cluster.id}/edit`, title: 'Edit' },
  ];

  const headerActions = (
    <Button
      variant='outline'
      onClick={() => setIsKubeconfigModalOpen(true)}
      size='sm'
    >
      <Download className='h-4 w-4 mr-2' />
      Download Kubeconfig
    </Button>
  );

  return (
    <PageLayout
      title={`Edit ${cluster.name}`}
      customBreadcrumbs={customBreadcrumbs}
      headerActions={headerActions}
      hideViewDocs={true}
    >
      {/* Cluster Basic Information */}
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
        {/* Edit Mode Indicator */}
        <div className='absolute top-4 right-4 flex items-center gap-2 z-10'>
          <Badge
            variant='secondary'
            className='text-xs bg-blue-100 text-blue-800 border-blue-200'
          >
            Edit Mode
          </Badge>
        </div>

        <DetailGrid>
          {/* First row: Cluster ID, Region, Status, Created On */}
          <div className='col-span-full grid grid-cols-4 gap-4 mt-2'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Cluster ID
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {cluster.id}
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
                {getRegionDisplayName(cluster.region)}
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
                <StatusBadge status={cluster.status} />
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
                {formatDate(cluster.createdAt)}
              </div>
            </div>
          </div>

          {/* Second row: VPC, Node Pools, Cluster Version, Node Pool Version */}
          <div className='col-span-full grid grid-cols-4 gap-4 mt-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                VPC
              </label>
              <div
                className='font-medium font-mono'
                style={{ fontSize: '14px' }}
              >
                {cluster.vpcId}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Node Pools
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {cluster.nodePools.length}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Cluster Version
              </label>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='font-mono'>
                  {cluster.k8sVersion}
                </Badge>
                {isDeprecated && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant='destructive'
                          className='text-xs cursor-help'
                        >
                          Unsupported
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          This version is deprecated. Please upgrade your
                          cluster to a supported Kubernetes version.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {isUpgradeAvailable && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => setIsUpgradeModalOpen(true)}
                          variant='outline'
                          size='sm'
                          className='h-6 w-6 p-0 text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50'
                        >
                          <ArrowUpRight className='h-3 w-3' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upgrade to version {nextVersion}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Node Pool Version
              </label>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='font-mono'>
                  {cluster.nodePools.length > 0
                    ? cluster.nodePools[0].k8sVersion
                    : 'N/A'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Additional info row: Pod CIDR, Service CIDR, Subnets, API Endpoint */}
          <div className='col-span-full grid grid-cols-4 gap-4 mt-4'>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Pod CIDR
              </label>
              <div
                className='font-medium font-mono'
                style={{ fontSize: '14px' }}
              >
                {cluster.podCIDR}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Service CIDR
              </label>
              <div
                className='font-medium font-mono'
                style={{ fontSize: '14px' }}
              >
                {cluster.serviceCIDR}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Subnet
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {cluster.subnetId || 'None'}
              </div>
            </div>
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                API Endpoint
              </label>
              <div className='bg-muted/50 p-3 rounded-lg'>
                <code className='text-sm font-mono break-all'>
                  {cluster.kubeApiEndpoint}
                </code>
              </div>
              <div className='flex items-center gap-2 text-xs text-muted-foreground mt-1'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>Public Access</span>
              </div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Node Pools Section with Edit Button */}
      <div className='mb-8'>
        <div className='bg-card text-card-foreground border-border border rounded-lg'>
          <div className='p-6 pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <h3 className='text-lg font-semibold'>Node Pools</h3>
                <div className='bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center'>
                  {cluster.nodePools.length}
                </div>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsNodePoolEditModalOpen(true)}
                className='flex items-center gap-2'
              >
                Edit Node Pools
              </Button>
            </div>
          </div>
          <div className='px-6 pb-6'>
            {cluster.nodePools.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <p>No node pools configured yet.</p>
                <p className='text-sm'>
                  Node pools will appear here once configured.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {cluster.nodePools.map(pool => {
                  const flavorDetails = availableNodeFlavors.find(
                    f => f.id === pool.flavor
                  );
                  const isOutdated =
                    pool.k8sVersion !== cluster.k8sVersion &&
                    pool.k8sVersion < cluster.k8sVersion;

                  return (
                    <div
                      key={pool.id}
                      className='border border-border hover:border-gray-300 transition-colors rounded-lg bg-card p-4 relative'
                    >
                      {/* Header with pool name and status badges */}
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1 min-w-0'>
                          <h4 className='text-sm font-medium leading-none truncate'>
                            {pool.name}
                          </h4>
                        </div>

                        <div className='flex items-center gap-2 flex-shrink-0'>
                          <Badge
                            variant='secondary'
                            className={`text-xs h-5 cursor-default ${
                              pool.status === 'active'
                                ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800'
                                : 'hover:bg-secondary hover:text-secondary-foreground'
                            }`}
                          >
                            {pool.status.charAt(0).toUpperCase() +
                              pool.status.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Pool details */}
                      <div className='space-y-3 text-xs'>
                        <div>
                          <Label className='text-xs text-muted-foreground'>
                            Instance Flavour
                          </Label>
                          <div className='mt-1'>
                            {flavorDetails ? (
                              <span className='text-sm'>
                                {pool.flavor} ({flavorDetails.vcpus} vCPUs,{' '}
                                {flavorDetails.memory}GB RAM)
                              </span>
                            ) : (
                              <span className='text-sm'>{pool.flavor}</span>
                            )}
                          </div>
                        </div>

                        <div className='grid grid-cols-3 gap-6'>
                          <div>
                            <Label className='text-xs text-muted-foreground'>
                              Disk Size
                            </Label>
                            <div className='mt-1'>{pool.diskSize} GB</div>
                          </div>
                          <div>
                            <Label className='text-xs text-muted-foreground'>
                              K8s Version
                            </Label>
                            <div className='flex items-center gap-2 mt-1'>
                              <Badge
                                variant='outline'
                                className='text-xs font-mono'
                              >
                                v{pool.k8sVersion}
                              </Badge>
                              {isOutdated && (
                                <Badge
                                  variant='outline'
                                  className='text-xs text-orange-600 border-orange-200'
                                >
                                  Outdated
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className='text-xs text-muted-foreground'>
                            Node Counts
                          </Label>
                          <div className='flex items-center gap-8 mt-2'>
                            <div className='text-center'>
                              <div className='text-xs text-muted-foreground mb-1'>
                                Min
                              </div>
                              <div className='font-semibold text-lg'>
                                {pool.minCount}
                              </div>
                            </div>
                            <div className='text-center'>
                              <div className='text-xs text-muted-foreground mb-1'>
                                Desired
                              </div>
                              <div className='font-semibold text-lg'>
                                {pool.desiredCount}
                              </div>
                            </div>
                            <div className='text-center'>
                              <div className='text-xs text-muted-foreground mb-1'>
                                Max
                              </div>
                              <div className='font-semibold text-lg'>
                                {pool.maxCount}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add-ons Section with Edit Button */}
      <div className='mb-8'>
        <div className='bg-card text-card-foreground border-border border rounded-lg'>
          <div className='p-6 pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <h3 className='text-lg font-semibold'>Add-ons</h3>
                <div className='bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center'>
                  {cluster.addOns.filter(addon => addon.isEnabled).length}
                </div>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsAddOnsEditModalOpen(true)}
                className='flex items-center gap-2'
              >
                Edit Add-ons
              </Button>
            </div>
          </div>
          <div className='px-6 pb-6'>
            {cluster.addOns.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <p>No add-ons available for this cluster.</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                {cluster.addOns.map(addon => (
                  <div
                    key={addon.id}
                    className='p-4 border rounded-lg relative'
                  >
                    <Badge
                      variant='outline'
                      className='absolute top-3 right-3 text-xs font-medium'
                    >
                      {addon.version}
                    </Badge>
                    <div className='space-y-1 pr-16'>
                      <div className='text-sm font-medium leading-none'>
                        {addon.displayName}
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {addon.description}
                      </p>
                      <div className='flex items-center gap-2 mt-2'>
                        <Badge
                          variant={addon.isEnabled ? 'default' : 'secondary'}
                          className='text-xs'
                        >
                          {addon.isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Kubeconfig Modal */}
      <Dialog
        open={isKubeconfigModalOpen}
        onOpenChange={setIsKubeconfigModalOpen}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Key className='h-5 w-5' />
              Download Kubeconfig
            </DialogTitle>
            <DialogDescription>
              Download the kubeconfig file to connect to your cluster using
              kubectl or other Kubernetes tools.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                <strong>Important:</strong> This kubeconfig file uses
                token-based authentication. The authentication token will expire
                in <strong>15 minutes</strong> for security reasons.
              </AlertDescription>
            </Alert>

            <div className='bg-muted/50 p-4 rounded-lg'>
              <h4 className='font-medium mb-2'>What you'll get:</h4>
              <ul className='text-sm space-y-1 text-muted-foreground'>
                <li>• Cluster API endpoint configuration</li>
                <li>• Authentication token (valid for 15 minutes)</li>
                <li>• Cluster CA certificate</li>
                <li>• Context configuration for kubectl</li>
              </ul>
            </div>

            <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
              <h4 className='font-medium text-blue-900 mb-2'>
                Usage Instructions:
              </h4>
              <ol className='text-sm space-y-1 text-blue-800'>
                <li>1. Download the kubeconfig file</li>
                <li>
                  2. Set KUBECONFIG environment variable or use --kubeconfig
                  flag
                </li>
                <li>3. Run kubectl commands within 15 minutes</li>
                <li>4. Re-download if token expires</li>
              </ol>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsKubeconfigModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownloadKubeconfig}
              className='bg-blue-600 hover:bg-blue-700'
            >
              <Download className='h-4 w-4 mr-2' />
              Download Kubeconfig
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Cluster Modal */}
      <ClusterUpgradeModal
        cluster={cluster}
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onConfirm={handleConfirmUpgrade}
      />

      {/* Node Pool Edit Modal */}
      <NodePoolEditModal
        cluster={cluster}
        isOpen={isNodePoolEditModalOpen}
        onClose={() => setIsNodePoolEditModalOpen(false)}
        onUpdate={handleClusterUpdate}
      />

      {/* Add-ons Edit Modal */}
      <AddOnsEditModal
        cluster={cluster}
        isOpen={isAddOnsEditModalOpen}
        onClose={() => setIsAddOnsEditModalOpen(false)}
        onUpdate={handleClusterUpdate}
      />
    </PageLayout>
  );
}
