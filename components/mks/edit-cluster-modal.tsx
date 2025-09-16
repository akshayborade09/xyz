'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  X,
} from 'lucide-react';
import {
  type MKSCluster,
  type MKSNodePool,
  type MKSAddOn,
  availableNodeFlavors,
  getRegionDisplayName,
} from '@/lib/mks-data';
import { mockSubnets } from '@/lib/cluster-creation-data';
import { StatusBadge } from '@/components/status-badge';
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
  const [editedAddOns, setEditedAddOns] = useState<MKSAddOn[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddNodePool, setShowAddNodePool] = useState(false);
  const [newNodePool, setNewNodePool] = useState<Partial<EditNodePool>>({
    name: '',
    flavor: 'cpu-2x-8gb',
    desiredCount: 3,
    minCount: 1,
    maxCount: 10,
    diskSize: 200,
    subnetId: mockSubnets[0]?.id || '',
    taints: [],
    labels: {},
    isNew: true,
  });

  // Initialize editing state when modal opens
  useEffect(() => {
    if (isOpen && cluster) {
      setEditedNodePools([...cluster.nodePools]);
      setEditedAddOns([...cluster.addOns]);
      setHasChanges(false);
      setShowAddNodePool(false);
    }
  }, [isOpen, cluster]);

  // Track changes
  useEffect(() => {
    if (!cluster) return;
    
    const nodePoolsChanged = JSON.stringify(editedNodePools) !== JSON.stringify(cluster.nodePools);
    const addOnsChanged = JSON.stringify(editedAddOns) !== JSON.stringify(cluster.addOns);
    
    setHasChanges(nodePoolsChanged || addOnsChanged);
  }, [editedNodePools, editedAddOns, cluster]);

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

  const handleAddNodePool = () => {
    if (!newNodePool.name?.trim()) {
      toast({
        title: 'Pool name required',
        description: 'Please enter a name for the node pool.',
        variant: 'destructive',
      });
      return;
    }

    const pool: EditNodePool = {
      id: `new-pool-${Date.now()}`,
      name: newNodePool.name,
      flavor: newNodePool.flavor || 'cpu-2x-8gb',
      desiredCount: newNodePool.desiredCount || 3,
      minCount: newNodePool.minCount || 1,
      maxCount: newNodePool.maxCount || 10,
      diskSize: newNodePool.diskSize || 200,
      taints: newNodePool.taints || [],
      labels: newNodePool.labels || {},
      status: 'active',
      createdAt: new Date().toISOString(),
      k8sVersion: cluster?.k8sVersion || '1.33.0',
      subnetId: newNodePool.subnetId || mockSubnets[0]?.id || '',
      isNew: true,
    };

    setEditedNodePools(prev => [...prev, pool]);
    setShowAddNodePool(false);
    
    // Reset form
    setNewNodePool({
      name: '',
      flavor: 'cpu-2x-8gb',
      desiredCount: 3,
      minCount: 1,
      maxCount: 10,
      diskSize: 200,
      subnetId: mockSubnets[0]?.id || '',
      taints: [],
      labels: {},
      isNew: true,
    });
  };

  const handleAddOnToggle = (addOnId: string, enabled: boolean) => {
    setEditedAddOns(prev =>
      prev.map(addon =>
        addon.id === addOnId
          ? { ...addon, isEnabled: enabled }
          : addon
      )
    );
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
        addOns: editedAddOns,
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
  const enabledAddOns = editedAddOns.filter(addon => addon.isEnabled);

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
                    You can modify node pools and add-ons. Other cluster settings cannot be changed after creation.
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
                  onClick={() => setShowAddNodePool(true)}
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Node Pool
                </Button>
              </div>

              {/* Add Node Pool Form */}
              {showAddNodePool && (
                <div className='border rounded-lg p-6 bg-blue-50/30 border-blue-200'>
                  <div className='flex items-center justify-between mb-6'>
                    <h4 className='text-lg font-medium'>Add New Node Pool</h4>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setShowAddNodePool(false)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                  
                  <div className='space-y-6'>
                    {/* Basic Configuration */}
                    <div className='grid grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>Pool Name *</Label>
                        <Input
                          value={newNodePool.name || ''}
                          onChange={e => setNewNodePool(prev => ({ ...prev, name: e.target.value }))}
                          placeholder='e.g., worker-pool'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>Instance Flavor *</Label>
                        <Select
                          value={newNodePool.flavor}
                          onValueChange={value => setNewNodePool(prev => ({ ...prev, flavor: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableNodeFlavors.map(flavor => (
                              <SelectItem key={flavor.id} value={flavor.id}>
                                {flavor.id} ({flavor.vcpus} vCPUs, {flavor.memory}GB RAM)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Storage and Subnet */}
                    <div className='grid grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>Disk Size (GB) *</Label>
                        <Input
                          type='number'
                          min='50'
                          max='2000'
                          value={newNodePool.diskSize || 200}
                          onChange={e => setNewNodePool(prev => ({ ...prev, diskSize: parseInt(e.target.value) || 200 }))}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>Subnet *</Label>
                        <Select
                          value={newNodePool.subnetId}
                          onValueChange={value => setNewNodePool(prev => ({ ...prev, subnetId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockSubnets.map(subnet => (
                              <SelectItem key={subnet.id} value={subnet.id}>
                                {subnet.name} ({subnet.cidr})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Node Scaling */}
                    <div className='space-y-3'>
                      <Label className='text-sm font-medium'>Scaling Settings *</Label>
                      <div className='grid grid-cols-3 gap-4'>
                        <div className='space-y-2'>
                          <Label className='text-xs text-muted-foreground'>Min Nodes</Label>
                          <Input
                            type='number'
                            min='0'
                            value={newNodePool.minCount || 1}
                            onChange={e => setNewNodePool(prev => ({ ...prev, minCount: parseInt(e.target.value) || 1 }))}
                            className='text-center'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-xs text-muted-foreground'>Desired Nodes</Label>
                          <Input
                            type='number'
                            min='1'
                            value={newNodePool.desiredCount || 3}
                            onChange={e => setNewNodePool(prev => ({ ...prev, desiredCount: parseInt(e.target.value) || 3 }))}
                            className='text-center'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-xs text-muted-foreground'>Max Nodes</Label>
                          <Input
                            type='number'
                            min='1'
                            value={newNodePool.maxCount || 10}
                            onChange={e => setNewNodePool(prev => ({ ...prev, maxCount: parseInt(e.target.value) || 10 }))}
                            className='text-center'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='flex justify-end gap-3 pt-4 border-t'>
                      <Button variant='outline' onClick={() => setShowAddNodePool(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddNodePool}>
                        Add Node Pool
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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

            {/* Add-ons Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <h3 className='text-base font-semibold'>Add-ons</h3>
                <div className='bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center'>
                  {enabledAddOns.length}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {editedAddOns.map(addon => (
                  <div key={addon.id} className='border rounded-lg p-5'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 min-w-0 space-y-2'>
                        <div className='flex items-center gap-3'>
                          <h4 className='font-medium text-sm'>{addon.displayName}</h4>
                          <Badge variant='outline' className='text-xs'>
                            {addon.version}
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground leading-relaxed'>
                          {addon.description}
                        </p>
                      </div>
                      <Switch
                        checked={addon.isEnabled}
                        onCheckedChange={enabled => handleAddOnToggle(addon.id, enabled)}
                        className='ml-4 flex-shrink-0'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className='flex-shrink-0 border-t pt-6'>
            <div className='flex items-center justify-between w-full'>
              <div className='text-sm text-muted-foreground'>
                {hasChanges ? (
                  <span className='text-orange-600 font-medium'>You have unsaved changes</span>
                ) : (
                  <span>No changes made</span>
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
    </TooltipProvider>
  );
}