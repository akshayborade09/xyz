'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, AlertTriangle, CheckCircle2, Server } from 'lucide-react';
import {
  type MKSCluster,
  type MKSNodePool,
  getNextK8sVersion,
} from '@/lib/mks-data';
import { useToast } from '@/hooks/use-toast';

interface NodePoolUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  cluster: MKSCluster;
  onConfirm: (selectedNodePoolIds: string[], targetVersion: string) => void;
  preselectedNodePoolId?: string | null;
}

interface NodePoolUpgradeInfo {
  nodePool: MKSNodePool;
  currentVersion: string;
  nextVersion: string | null;
  canUpgrade: boolean;
  isSelected: boolean;
}

export function NodePoolUpgradeModal({
  isOpen,
  onClose,
  cluster,
  onConfirm,
  preselectedNodePoolId,
}: NodePoolUpgradeModalProps) {
  const { toast } = useToast();
  const [selectedNodePools, setSelectedNodePools] = useState<Set<string>>(
    new Set()
  );
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Calculate upgrade info for each node pool (memoized to prevent infinite loops)
  const { nodePoolUpgradeInfo, upgradeableNodePools, nonUpgradeableNodePools } =
    useMemo(() => {
      const info: NodePoolUpgradeInfo[] = cluster.nodePools.map(nodePool => {
        const currentVersion = nodePool.k8sVersion;
        const nextVersion = getNextK8sVersion(currentVersion);
        const canUpgrade =
          nextVersion !== null && currentVersion !== cluster.k8sVersion;

        return {
          nodePool,
          currentVersion,
          nextVersion,
          canUpgrade,
          isSelected: false,
        };
      });

      return {
        nodePoolUpgradeInfo: info,
        upgradeableNodePools: info.filter(info => info.canUpgrade),
        nonUpgradeableNodePools: info.filter(info => !info.canUpgrade),
      };
    }, [cluster.nodePools, cluster.k8sVersion]);

  // Handle individual node pool selection
  const handleNodePoolToggle = (nodePoolId: string) => {
    const newSelected = new Set(selectedNodePools);
    if (newSelected.has(nodePoolId)) {
      newSelected.delete(nodePoolId);
    } else {
      newSelected.add(nodePoolId);
    }
    setSelectedNodePools(newSelected);
  };

  // Handle select all toggle
  const handleSelectAllToggle = () => {
    if (selectedNodePools.size === upgradeableNodePools.length) {
      // Deselect all
      setSelectedNodePools(new Set());
    } else {
      // Select all upgradeable
      setSelectedNodePools(new Set(upgradeableNodePoolIds));
    }
  };

  // Handle upgrade confirmation
  const handleUpgrade = async () => {
    if (selectedNodePools.size === 0) {
      toast({
        title: 'No Node Pools Selected',
        description: 'Please select at least one node pool to upgrade.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpgrading(true);

    try {
      // Get the target version (all selected pools will upgrade to the next version)
      const firstSelectedPool = upgradeableNodePools.find(info =>
        selectedNodePools.has(info.nodePool.id)
      );
      const targetVersion = firstSelectedPool?.nextVersion || '';

      await onConfirm(Array.from(selectedNodePools), targetVersion);

      toast({
        title: 'Node Pool Upgrade Started',
        description: `Upgrading ${selectedNodePools.size} node pool${selectedNodePools.size > 1 ? 's' : ''} to version ${targetVersion}.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Upgrade Failed',
        description: 'Failed to start node pool upgrade. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  // Memoize upgradeable node pool IDs to avoid dependency issues
  const upgradeableNodePoolIds = useMemo(
    () => upgradeableNodePools.map(info => info.nodePool.id),
    [upgradeableNodePools]
  );

  // Handle preselection when modal opens
  useEffect(() => {
    if (isOpen) {
      if (preselectedNodePoolId) {
        // Preselect specific node pool if it's upgradeable
        if (upgradeableNodePoolIds.includes(preselectedNodePoolId)) {
          setSelectedNodePools(new Set([preselectedNodePoolId]));
        } else {
          setSelectedNodePools(new Set());
        }
      } else if (preselectedNodePoolId === null) {
        // null means preselect all upgradeable node pools
        setSelectedNodePools(new Set(upgradeableNodePoolIds));
      } else {
        // undefined means no preselection
        setSelectedNodePools(new Set());
      }
    }
  }, [isOpen, preselectedNodePoolId, upgradeableNodePoolIds]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col'>
        <DialogHeader className='space-y-3 pb-4'>
          <DialogTitle className='text-base font-semibold text-black pr-8'>
            Upgrade Node Pools
          </DialogTitle>
          <hr className='border-border' />
          <DialogDescription>
            Select node pools to upgrade to their next Kubernetes version. Node
            pools can only be upgraded if the cluster is already on a newer
            version.
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto space-y-4'>
          {/* Cluster Version Info */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4 text-blue-600' />
              <span className='text-sm font-medium text-blue-900'>
                Cluster Version: {cluster.k8sVersion}
              </span>
            </div>
          </div>

          {/* Upgradeable Node Pools */}
          {upgradeableNodePools.length > 0 && (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='font-medium text-sm'>
                  Available for Upgrade ({upgradeableNodePools.length})
                </h4>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleSelectAllToggle}
                  className='h-8'
                >
                  {selectedNodePools.size === upgradeableNodePools.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>

              <div className='space-y-2'>
                {upgradeableNodePools.map(info => (
                  <div
                    key={info.nodePool.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      selectedNodePools.has(info.nodePool.id)
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='flex items-center space-x-3'>
                      <Checkbox
                        checked={selectedNodePools.has(info.nodePool.id)}
                        onCheckedChange={() =>
                          handleNodePoolToggle(info.nodePool.id)
                        }
                      />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h5 className='font-medium text-sm'>
                              {info.nodePool.name}
                            </h5>
                            <div className='flex items-center gap-2 mt-1'>
                              <Badge variant='outline' className='text-xs'>
                                {info.currentVersion}
                              </Badge>
                              <ArrowRight className='h-3 w-3 text-gray-400' />
                              <Badge
                                variant='default'
                                className='text-xs bg-green-100 text-green-800 border-green-200'
                              >
                                {info.nextVersion}
                              </Badge>
                            </div>
                          </div>
                          <div className='text-right text-xs text-gray-500'>
                            <div>{info.nodePool.desiredCount} nodes</div>
                            <div className='capitalize'>
                              {info.nodePool.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-upgradeable Node Pools */}
          {nonUpgradeableNodePools.length > 0 && (
            <div className='space-y-3'>
              <h4 className='font-medium text-sm text-gray-500'>
                Up to Date ({nonUpgradeableNodePools.length})
              </h4>
              <div className='space-y-2'>
                {nonUpgradeableNodePools.map(info => (
                  <div
                    key={info.nodePool.id}
                    className='border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75'
                  >
                    <div className='flex items-center space-x-3'>
                      <Checkbox checked={false} disabled={true} />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h5 className='font-medium text-sm text-gray-700'>
                              {info.nodePool.name}
                            </h5>
                            <div className='flex items-center gap-2 mt-1'>
                              <Badge variant='secondary' className='text-xs'>
                                {info.currentVersion}
                              </Badge>
                              <span className='text-xs text-gray-500'>
                                Already up to date
                              </span>
                            </div>
                          </div>
                          <div className='text-right text-xs text-gray-500'>
                            <div>{info.nodePool.desiredCount} nodes</div>
                            <div className='capitalize'>
                              {info.nodePool.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No upgradeable pools message */}
          {upgradeableNodePools.length === 0 && (
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                All node pools are already up to date with the cluster version.
                No upgrades are available at this time.
              </AlertDescription>
            </Alert>
          )}

          {/* Warning for upgrade process */}
          {upgradeableNodePools.length > 0 && (
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription className='text-sm'>
                <strong>Note:</strong> Upgrading node pools will cause a rolling
                update. Workloads may experience brief disruptions during the
                upgrade process.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className='flex-shrink-0'>
          <Button variant='outline' onClick={onClose} disabled={isUpgrading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={selectedNodePools.size === 0 || isUpgrading}
            className='min-w-[120px]'
          >
            {isUpgrading ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Upgrading...
              </>
            ) : (
              `Upgrade ${selectedNodePools.size || ''} Node Pool${selectedNodePools.size !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
