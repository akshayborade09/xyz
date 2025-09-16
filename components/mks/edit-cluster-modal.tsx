'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Info,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import {
  type MKSCluster,
  type MKSNodePool,
  availableNodeFlavors,
  getRegionDisplayName,
} from '@/lib/mks-data';
import { StatusBadge } from '@/components/status-badge';
import { AddNodePoolModal } from '@/components/mks/add-node-pool-modal';
import { useToast } from '@/hooks/use-toast';

interface EditClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cluster: MKSCluster | null;
  onSave?: (updatedCluster: MKSCluster) => void;
}

interface EditNodePool extends MKSNodePool {
  isNew?: boolean;
  isDeleted?: boolean;
}

interface Taint {
  key: string;
  value: string;
  effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
}

interface KeyValuePair {
  key: string;
  value: string;
}

export function EditClusterModal({
  isOpen,
  onClose,
  cluster,
  onSave,
}: EditClusterModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editedNodePools, setEditedNodePools] = useState<EditNodePool[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddNodePoolModal, setShowAddNodePoolModal] = useState(false);

  // Initialize editing state when modal opens
  useEffect(() => {
    if (isOpen && cluster) {
      setEditedNodePools([...cluster.nodePools]);
      setHasChanges(false);
    }
  }, [isOpen, cluster]);

  // Track changes
  useEffect(() => {
    if (!cluster) return;
    
    const nodePoolsChanged = JSON.stringify(editedNodePools) !== JSON.stringify(cluster.nodePools);
    
    setHasChanges(nodePoolsChanged);
  }, [editedNodePools, cluster]);

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
        return <XCircle className='h-4 w-4 text-gray-500' />;
    }
  };

  const handleNodePoolCountChange = (poolId: string, field: 'minCount' | 'desiredCount' | 'maxCount', value: number) => {
    setEditedNodePools(prev =>
      prev.map(pool =>
        pool.id === poolId
          ? { ...pool, [field]: value }
          : pool
      )
    );
  };

  const handleDeleteNodePool = (poolId: string) => {
    const pool = editedNodePools.find(p => p.id === poolId);
    if (!pool) return;

    // If it's a new pool, just remove it
    if (pool.isNew) {
      setEditedNodePools(prev => prev.filter(p => p.id !== poolId));
      return;
    }

    // Check if it's the last existing pool
    const existingPools = editedNodePools.filter(p => !p.isNew && !p.isDeleted);
    if (existingPools.length === 1) {
      toast({
        title: 'Cannot delete node pool',
        description: 'At least one node pool must remain in the cluster.',
        variant: 'destructive',
      });
      return;
    }

    // Mark for deletion
    setEditedNodePools(prev =>
      prev.map(p =>
        p.id === poolId
          ? { ...p, isDeleted: true }
          : p
      )
    );
  };

  const handleAddNodePool = (nodePoolData: Omit<MKSNodePool, 'id' | 'status' | 'createdAt' | 'k8sVersion'>) => {
    const pool: EditNodePool = {
      id: `new-pool-${Date.now()}`,
      name: nodePoolData.name,
      flavor: nodePoolData.flavor,
      desiredCount: nodePoolData.desiredCount,
      minCount: nodePoolData.minCount,
      maxCount: nodePoolData.maxCount,
      diskSize: nodePoolData.diskSize,
      taints: nodePoolData.taints || [],
      labels: nodePoolData.labels || {},
      status: 'active',
      createdAt: new Date().toISOString(),
      k8sVersion: cluster?.k8sVersion || '1.33.0',
      subnetId: nodePoolData.subnetId,
      isNew: true,
    };

    setEditedNodePools(prev => [...prev, pool]);
    setShowAddNodePoolModal(false);
  };


  const handleSave = async () => {
    if (!cluster || !onSave) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Filter out deleted pools and calculate new node count
      const finalNodePools = editedNodePools.filter(pool => !pool.isDeleted);
      const totalNodeCount = finalNodePools.reduce((total, pool) => total + pool.desiredCount, 0);

      const updatedCluster: MKSCluster = {
        ...cluster,
        nodePools: finalNodePools.map(pool => {
          const { isNew, isDeleted, ...poolData } = pool;
          return poolData;
        }),
        addOns: cluster.addOns,
        nodeCount: totalNodeCount,
      };

      onSave(updatedCluster);
      onClose();

      toast({
        title: 'Cluster updated successfully',
        description: 'Your cluster configuration has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update cluster',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      // In a real app, you might want to show a confirmation dialog
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
  };

  if (!cluster) return null;

  const activeNodePools = editedNodePools.filter(pool => !pool.isDeleted);
  const deletedPools = editedNodePools.filter(pool => pool.isDeleted);
  const totalNodeCount = activeNodePools.reduce((total, pool) => total + pool.desiredCount, 0);

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent className='max-w-5xl max-h-[95vh] overflow-hidden flex flex-col'>
          <DialogHeader className='flex-shrink-0 pb-6'>
            <DialogTitle className='text-base font-semibold'>
              Edit Cluster: {cluster.name}
            </DialogTitle>
            <div className='flex items-center gap-6 text-sm text-muted-foreground mt-3'>
              <span>Region: {getRegionDisplayName(cluster.region)}</span>
              <Separator orientation='vertical' className='h-4' />
              <span>K8s: v{cluster.k8sVersion}</span>
              <Separator orientation='vertical' className='h-4' />
              <StatusBadge status={cluster.status} />
            </div>
            <DialogDescription className='mt-16'>
              <Alert className='bg-muted/50 border-muted py-3 px-4'>
                <div className='flex items-start gap-3'>
                  <Info className='h-4 w-4 flex-shrink-0 mt-0.5' />
                  <AlertDescription className='text-muted-foreground text-sm leading-relaxed'>
                    You can modify node pools. Other cluster settings cannot be changed after creation.
                  </AlertDescription>
                </div>
              </Alert>
            </DialogDescription>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto space-y-8 py-2'>
            {/* Node Pools Section */}
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <h3 className='text-base font-semibold'>Node Pools</h3>
                  <div className='bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center'>
                    {activeNodePools.length}
                  </div>
                </div>
                <Button
                  variant='outline'
                  onClick={() => setShowAddNodePoolModal(true)}
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Node Pool
                </Button>
              </div>


              {/* Existing Node Pools */}
              <div className='space-y-4'>
                {activeNodePools.map(pool => {
                  const flavorDetails = availableNodeFlavors.find(f => f.id === pool.flavor);
                  
                  return (
                    <div
                      key={pool.id}
                      className={`border rounded-lg p-6 ${
                        pool.isNew ? 'border-blue-200 bg-blue-50/30' : 'border-border bg-card'
                      }`}
                    >
                      <div className='flex items-start justify-between mb-6'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-3'>
                            <h4 className='text-lg font-medium'>{pool.name}</h4>
                            {pool.isNew && (
                              <Badge variant='outline' className='text-xs bg-green-100 text-green-800 border-green-200'>
                                New
                              </Badge>
                            )}
                          </div>
                          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                            <span className='font-medium'>{pool.flavor}</span>
                            {flavorDetails && (
                              <span>{flavorDetails.vcpus} vCPUs, {flavorDetails.memory}GB RAM</span>
                            )}
                            <span>{pool.diskSize}GB disk</span>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteNodePool(pool.id)}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>

                      <div className='grid grid-cols-3 gap-6'>
                        <div className='space-y-2'>
                          <Label className='text-sm text-muted-foreground'>Min Count</Label>
                          <Input
                            type='number'
                            min='0'
                            max='100'
                            value={pool.minCount}
                            onChange={e => handleNodePoolCountChange(pool.id, 'minCount', parseInt(e.target.value) || 0)}
                            className='text-center'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-sm text-muted-foreground'>Desired Count</Label>
                          <Input
                            type='number'
                            min='0'
                            max='100'
                            value={pool.desiredCount}
                            onChange={e => handleNodePoolCountChange(pool.id, 'desiredCount', parseInt(e.target.value) || 0)}
                            className='text-center'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-sm text-muted-foreground'>Max Count</Label>
                          <Input
                            type='number'
                            min='1'
                            max='100'
                            value={pool.maxCount}
                            onChange={e => handleNodePoolCountChange(pool.id, 'maxCount', parseInt(e.target.value) || 1)}
                            className='text-center'
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {deletedPools.length > 0 && (
                  <div className='border border-red-200 rounded-lg p-4 bg-red-50/30'>
                    <h4 className='font-medium text-red-800 mb-3'>Pools to be deleted:</h4>
                    <div className='space-y-2'>
                      {deletedPools.map(pool => (
                        <div key={pool.id} className='text-sm text-red-700 flex items-center gap-2'>
                          <Trash2 className='h-3 w-3' />
                          {pool.name} ({pool.desiredCount} nodes)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          <DialogFooter className='flex-shrink-0 border-t pt-6'>
            <div className='flex items-center justify-between w-full'>
              <div className='text-sm text-muted-foreground'>
                {hasChanges && (
                  <span className='text-orange-600 font-medium'>You have unsaved changes</span>
                )}
              </div>
              <div className='flex items-center gap-3'>
                <Button variant='outline' onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || isLoading}
                  className='min-w-[140px]'
                >
                  {isLoading ? (
                    <div className='flex items-center gap-2'>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                      Updating...
                    </div>
                  ) : (
                    'Update Cluster'
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Node Pool Modal */}
      <AddNodePoolModal
        isOpen={showAddNodePoolModal}
        onClose={() => setShowAddNodePoolModal(false)}
        onAdd={handleAddNodePool}
        clusterId={cluster.id}
      />
    </TooltipProvider>
  );
}