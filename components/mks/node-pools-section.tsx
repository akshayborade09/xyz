'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  AlertTriangle,
  RefreshCw,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import {
  type MKSCluster,
  type MKSNodePool,
  availableNodeFlavors,
  getSubnetById,
} from '@/lib/mks-data';
import { NodePoolUpgradeModal } from './node-pool-upgrade-modal';
import { useToast } from '@/hooks/use-toast';

interface NodePoolsSectionProps {
  cluster: MKSCluster;
  onUpdate?: (updatedCluster: MKSCluster) => void;
}

export function NodePoolsSection({ cluster, onUpdate }: NodePoolsSectionProps) {
  const { toast } = useToast();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [preselectedNodePoolId, setPreselectedNodePoolId] = useState<
    string | null
  >(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingPools, setEditingPools] = useState<
    Record<
      string,
      {
        name: string;
        desiredCount: number;
        minCount: number;
        maxCount: number;
      }
    >
  >({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [poolToDelete, setPoolToDelete] = useState<MKSNodePool | null>(null);

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const getFlavorDetails = (flavorId: string) => {
    return availableNodeFlavors.find(f => f.id === flavorId);
  };

  // Check if node pool version is behind cluster version
  const isNodePoolOutdated = (
    nodePoolVersion: string,
    clusterVersion: string
  ) => {
    // Simple version comparison - in real implementation, use semver or similar
    return (
      nodePoolVersion !== clusterVersion && nodePoolVersion < clusterVersion
    );
  };

  // Check if any node pools need upgrading
  const hasOutdatedNodePools = cluster.nodePools.some(pool =>
    isNodePoolOutdated(pool.k8sVersion, cluster.k8sVersion)
  );

  // Initialize editing state when entering edit mode
  useEffect(() => {
    if (isEditing && cluster) {
      const initialState: Record<
        string,
        {
          name: string;
          desiredCount: number;
          minCount: number;
          maxCount: number;
        }
      > = {};
      cluster.nodePools.forEach(pool => {
        initialState[pool.id] = {
          name: pool.name,
          desiredCount: pool.desiredCount,
          minCount: pool.minCount,
          maxCount: pool.maxCount,
        };
      });
      setEditingPools(initialState);
      setHasChanges(false);
    }
  }, [isEditing, cluster]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingPools({});
    setHasChanges(false);
  };

  const handlePoolChange = (
    poolId: string,
    field: keyof (typeof editingPools)[string],
    value: string | number
  ) => {
    setEditingPools(prev => ({
      ...prev,
      [poolId]: {
        ...prev[poolId],
        [field]: field === 'name' ? (value as string) : Number(value),
      },
    }));
    setHasChanges(true);
  };

  const saveChanges = () => {
    if (!onUpdate) {
      return;
    }

    const updatedPools = cluster.nodePools.map(pool => {
      const changes = editingPools[pool.id];
      if (changes) {
        return {
          ...pool,
          name: changes.name,
          desiredCount: changes.desiredCount,
          minCount: changes.minCount,
          maxCount: changes.maxCount,
        };
      }
      return pool;
    });

    const updatedCluster = {
      ...cluster,
      nodePools: updatedPools,
      nodeCount: updatedPools.reduce(
        (total, pool) => total + pool.desiredCount,
        0
      ),
    };

    onUpdate(updatedCluster);
    setIsEditing(false);
    setHasChanges(false);
    toast({
      title: 'Node pools updated',
      description:
        'Your node pool configurations have been saved successfully.',
    });
  };

  const handleDeletePool = (pool: MKSNodePool) => {
    // Check if it's the last pool
    if (cluster.nodePools.length === 1) {
      toast({
        title: 'Cannot delete node pool',
        description: 'At least one node pool must remain in the cluster.',
        variant: 'destructive',
      });
      return;
    }
    setPoolToDelete(pool);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePool = () => {
    if (!poolToDelete || !onUpdate) {
      return;
    }

    const updatedPools = cluster.nodePools.filter(
      pool => pool.id !== poolToDelete.id
    );
    const updatedCluster = {
      ...cluster,
      nodePools: updatedPools,
      nodeCount: updatedPools.reduce(
        (total, pool) => total + pool.desiredCount,
        0
      ),
    };

    onUpdate(updatedCluster);
    setIsDeleteModalOpen(false);
    setPoolToDelete(null);
    toast({
      title: 'Node pool deleted',
      description: `Node pool "${poolToDelete.name}" has been removed from the cluster.`,
    });
  };

  const handleNodePoolUpgradeConfirm = async (
    selectedNodePoolIds: string[],
    targetVersion: string
  ) => {
    // In a real implementation, this would call the API to upgrade node pools
    console.log(
      'Upgrading node pools:',
      selectedNodePoolIds,
      'to version:',
      targetVersion
    );
    setIsUpgradeModalOpen(false);
  };

  return (
    <TooltipProvider>
      <div className='bg-card text-card-foreground border-border border rounded-lg'>
        <div className='p-6 pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <h3 className='text-lg font-semibold'>Node Pools</h3>
              <div className='bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center'>
                {cluster.nodePools.length}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {hasOutdatedNodePools && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setPreselectedNodePoolId(null);
                    setIsUpgradeModalOpen(true);
                  }}
                  className='flex items-center gap-2'
                >
                  <RefreshCw className='h-4 w-4' />
                  Upgrade
                </Button>
              )}
            </div>
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
                const flavorDetails = getFlavorDetails(pool.flavor);
                const subnetDetails = getSubnetById(pool.subnetId);
                const isDefault =
                  pool.name === 'prod-workers' ||
                  pool.name === 'staging-workers' ||
                  pool.name === 'dev-workers';
                const isOutdated = isNodePoolOutdated(
                  pool.k8sVersion,
                  cluster.k8sVersion
                );

                const currentPoolData = isEditing
                  ? editingPools[pool.id]
                  : pool;

                return (
                  <div
                    key={pool.id}
                    className={`border transition-colors rounded-lg bg-card p-4 relative ${
                      isEditing
                        ? 'border-blue-200 bg-blue-50/30'
                        : 'border-border hover:border-gray-300'
                    }`}
                  >
                    {/* Header with pool name and status badges */}
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1 min-w-0'>
                        {isEditing ? (
                          <Input
                            value={currentPoolData?.name || pool.name}
                            onChange={e =>
                              handlePoolChange(pool.id, 'name', e.target.value)
                            }
                            className='h-7 text-sm font-medium'
                            placeholder='Pool name'
                          />
                        ) : (
                          <h4 className='text-sm font-medium leading-none truncate'>
                            {pool.name}
                          </h4>
                        )}
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
                          {capitalizeFirstLetter(pool.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Fields in specified order */}
                    <div className='space-y-3 text-xs'>
                      {/* 1) Instance flavour (flavour name, vcpu count and ram) */}
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

                      {/* 2) Subnet, Disk Size and K8s Version in same row */}
                      <div className='grid grid-cols-3 gap-6'>
                        {/* Subnet */}
                        <div>
                          <Label className='text-xs text-muted-foreground'>
                            Subnet
                          </Label>
                          <div className='mt-1'>
                            {subnetDetails ? (
                              <div className='text-sm font-medium'>
                                {subnetDetails.name}
                              </div>
                            ) : (
                              <span className='text-sm'>{pool.subnetId}</span>
                            )}
                          </div>
                        </div>

                        {/* Disk Size */}
                        <div>
                          <Label className='text-xs text-muted-foreground'>
                            Disk Size
                          </Label>
                          <div className='mt-1'>{pool.diskSize} GB</div>
                        </div>

                        {/* K8s Version */}
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
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                  setPreselectedNodePoolId(pool.id);
                                  setIsUpgradeModalOpen(true);
                                }}
                                className='text-xs h-6 px-2 text-orange-600 border-orange-200 hover:bg-orange-50'
                              >
                                Upgrade
                              </Button>
                            )}
                          </div>
                          {isOutdated && (
                            <div className='text-xs text-orange-600 mt-1'>
                              Cluster: v{cluster.k8sVersion}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4) Node counts (min, desired, max) */}
                      <div>
                        <Label className='text-xs text-muted-foreground'>
                          Node Counts
                        </Label>
                        {isEditing ? (
                          <div className='grid grid-cols-3 gap-3 mt-2'>
                            <div>
                              <Label className='text-xs text-muted-foreground mb-1 block'>
                                Min
                              </Label>
                              <Input
                                type='number'
                                min='0'
                                max='100'
                                value={
                                  currentPoolData?.minCount || pool.minCount
                                }
                                onChange={e =>
                                  handlePoolChange(
                                    pool.id,
                                    'minCount',
                                    e.target.value
                                  )
                                }
                                className='h-8 text-sm'
                              />
                            </div>
                            <div>
                              <Label className='text-xs text-muted-foreground mb-1 block'>
                                Desired
                              </Label>
                              <Input
                                type='number'
                                min='0'
                                max='100'
                                value={
                                  currentPoolData?.desiredCount ||
                                  pool.desiredCount
                                }
                                onChange={e =>
                                  handlePoolChange(
                                    pool.id,
                                    'desiredCount',
                                    e.target.value
                                  )
                                }
                                className='h-8 text-sm'
                              />
                            </div>
                            <div>
                              <Label className='text-xs text-muted-foreground mb-1 block'>
                                Max
                              </Label>
                              <Input
                                type='number'
                                min='1'
                                max='100'
                                value={
                                  currentPoolData?.maxCount || pool.maxCount
                                }
                                onChange={e =>
                                  handlePoolChange(
                                    pool.id,
                                    'maxCount',
                                    e.target.value
                                  )
                                }
                                className='h-8 text-sm'
                              />
                            </div>
                          </div>
                        ) : (
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
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Pool Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-red-500' />
              Delete Node Pool
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete node pool "{poolToDelete?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
              <h4 className='font-medium text-red-900 mb-2'>This will:</h4>
              <ul className='text-sm space-y-1 text-red-800'>
                <li>
                  • Terminate all {poolToDelete?.desiredCount} nodes in this
                  pool
                </li>
                <li>• Reschedule workloads to other node pools</li>
                <li>• Remove the node pool configuration permanently</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDeletePool}>
              <Trash2 className='h-4 w-4 mr-2' />
              Delete Node Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Node Pool Upgrade Modal */}
      <NodePoolUpgradeModal
        cluster={cluster}
        isOpen={isUpgradeModalOpen}
        onClose={() => {
          setIsUpgradeModalOpen(false);
          setPreselectedNodePoolId(null);
        }}
        onConfirm={handleNodePoolUpgradeConfirm}
        preselectedNodePoolId={preselectedNodePoolId}
      />
    </TooltipProvider>
  );
}
