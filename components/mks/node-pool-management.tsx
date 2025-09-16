'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Server,
  Save,
  X,
} from 'lucide-react';
import {
  type MKSCluster,
  type MKSNodePool,
  availableNodeFlavors,
} from '@/lib/mks-data';

interface NodePoolManagementProps {
  cluster: MKSCluster;
  onUpdate: (updatedCluster: MKSCluster) => void;
  isEditMode?: boolean;
}

export function NodePoolManagement({
  cluster,
  onUpdate,
  isEditMode = false,
}: NodePoolManagementProps) {
  const [isAddPoolOpen, setIsAddPoolOpen] = useState(false);
  const [editingPool, setEditingPool] = useState<MKSNodePool | null>(null);
  const [isEditPoolOpen, setIsEditPoolOpen] = useState(false);
  const [isDeletePoolOpen, setIsDeletePoolOpen] = useState(false);
  const [poolToDelete, setPoolToDelete] = useState<MKSNodePool | null>(null);

  // Inline editing state for node pool counts
  const [editingNodePools, setEditingNodePools] = useState<
    Record<string, { desiredCount: number; minCount: number; maxCount: number }>
  >({});
  const [hasNodePoolChanges, setHasNodePoolChanges] = useState(false);

  // Add pool form state
  const [newPool, setNewPool] = useState({
    name: '',
    flavor: '',
    desiredCount: 1,
    minCount: 1,
    maxCount: 3,
    diskSize: 100,
    labels: {} as Record<string, string>,
  });

  // Edit pool form state
  const [editPool, setEditPool] = useState({
    desiredCount: 1,
    minCount: 1,
    maxCount: 3,
  });

  // Initialize inline editing state when component mounts or cluster changes
  useEffect(() => {
    if (cluster) {
      const initialNodePoolState: Record<
        string,
        { desiredCount: number; minCount: number; maxCount: number }
      > = {};
      cluster.nodePools.forEach(pool => {
        initialNodePoolState[pool.id] = {
          desiredCount: pool.desiredCount,
          minCount: pool.minCount,
          maxCount: pool.maxCount,
        };
      });
      setEditingNodePools(initialNodePoolState);
    }
  }, [cluster]);

  // Handle inline editing changes
  const handleNodePoolChange = (
    poolId: string,
    field: 'desiredCount' | 'minCount' | 'maxCount',
    value: number
  ) => {
    setEditingNodePools(prev => ({
      ...prev,
      [poolId]: {
        ...prev[poolId],
        [field]: value,
      },
    }));
    setHasNodePoolChanges(true);
  };

  // Save inline editing changes
  const saveNodePoolChanges = () => {
    const updatedPools = cluster.nodePools.map(pool => {
      const edits = editingNodePools[pool.id];
      if (edits) {
        return {
          ...pool,
          desiredCount: edits.desiredCount,
          minCount: edits.minCount,
          maxCount: edits.maxCount,
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
    setHasNodePoolChanges(false);
  };

  // Cancel inline editing changes
  const cancelNodePoolChanges = () => {
    if (cluster) {
      const initialNodePoolState: Record<
        string,
        { desiredCount: number; minCount: number; maxCount: number }
      > = {};
      cluster.nodePools.forEach(pool => {
        initialNodePoolState[pool.id] = {
          desiredCount: pool.desiredCount,
          minCount: pool.minCount,
          maxCount: pool.maxCount,
        };
      });
      setEditingNodePools(initialNodePoolState);
      setHasNodePoolChanges(false);
    }
  };

  const handleAddPool = () => {
    if (!newPool.name || !newPool.flavor) {
      return;
    }

    const pool: MKSNodePool = {
      id: `np-${Date.now()}`,
      name: newPool.name,
      flavor: newPool.flavor,
      desiredCount: newPool.desiredCount,
      minCount: newPool.minCount,
      maxCount: newPool.maxCount,
      diskSize: newPool.diskSize,
      taints: [],
      labels: newPool.labels,
      status: 'creating',
      createdAt: new Date().toISOString(),
    };

    const updatedCluster = {
      ...cluster,
      nodePools: [...cluster.nodePools, pool],
      nodeCount: cluster.nodeCount + pool.desiredCount,
    };

    onUpdate(updatedCluster);
    setIsAddPoolOpen(false);
    setNewPool({
      name: '',
      flavor: '',
      desiredCount: 1,
      minCount: 1,
      maxCount: 3,
      diskSize: 100,
      labels: {},
    });
  };

  const handleEditPool = () => {
    if (!editingPool) {
      return;
    }

    const updatedPools = cluster.nodePools.map(pool => {
      if (pool.id === editingPool.id) {
        const nodeCountDiff = editPool.desiredCount - pool.desiredCount;
        return {
          ...pool,
          desiredCount: editPool.desiredCount,
          minCount: editPool.minCount,
          maxCount: editPool.maxCount,
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
    setIsEditPoolOpen(false);
    setEditingPool(null);
  };

  const handleDeletePool = () => {
    if (!poolToDelete) {
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
    setIsDeletePoolOpen(false);
    setPoolToDelete(null);
  };

  const openEditPool = (pool: MKSNodePool) => {
    setEditingPool(pool);
    setEditPool({
      desiredCount: pool.desiredCount,
      minCount: pool.minCount,
      maxCount: pool.maxCount,
    });
    setIsEditPoolOpen(true);
  };

  const openDeletePool = (pool: MKSNodePool) => {
    setPoolToDelete(pool);
    setIsDeletePoolOpen(true);
  };

  const validateNodeCounts = (min: number, desired: number, max: number) => {
    return min > 0 && min <= desired && desired <= max;
  };

  const getFlavorDetails = (flavorId: string) => {
    return availableNodeFlavors.find(f => f.id === flavorId);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Node Pool Management</h3>
        <div className='flex items-center gap-2'>
          {isEditMode && hasNodePoolChanges && (
            <>
              <Button
                variant='outline'
                size='sm'
                onClick={cancelNodePoolChanges}
                className='h-8'
              >
                <X className='h-4 w-4 mr-2' />
                Cancel
              </Button>
              <Button
                size='sm'
                onClick={saveNodePoolChanges}
                className='bg-black text-white hover:bg-black/90 h-8'
              >
                <Save className='h-4 w-4 mr-2' />
                Save Changes
              </Button>
            </>
          )}
          <Button
            onClick={() => setIsAddPoolOpen(true)}
            className='bg-black text-white hover:bg-black/90'
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Node Pool
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Server className='h-5 w-5' />
            Current Node Pools
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cluster.nodePools.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <Server className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No node pools configured yet.</p>
              <p className='text-sm'>
                Add your first node pool to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Flavor</TableHead>
                  <TableHead>Nodes</TableHead>
                  <TableHead>Disk Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Labels</TableHead>
                  <TableHead className='w-[100px]'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cluster.nodePools.map(pool => {
                  const flavorDetails = getFlavorDetails(pool.flavor);
                  return (
                    <TableRow key={pool.id}>
                      <TableCell className='font-medium'>{pool.name}</TableCell>
                      <TableCell>
                        <div>
                          <Badge
                            variant='outline'
                            className='font-mono text-xs'
                          >
                            {pool.flavor}
                          </Badge>
                          {flavorDetails && (
                            <p className='text-xs text-muted-foreground mt-1'>
                              {flavorDetails.vcpus} vCPUs,{' '}
                              {flavorDetails.memory}GB RAM
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <Label
                                htmlFor={`desired-${pool.id}`}
                                className='text-xs'
                              >
                                Desired:
                              </Label>
                              <Input
                                id={`desired-${pool.id}`}
                                type='number'
                                min='1'
                                value={
                                  editingNodePools[pool.id]?.desiredCount ||
                                  pool.desiredCount
                                }
                                onChange={e =>
                                  handleNodePoolChange(
                                    pool.id,
                                    'desiredCount',
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className='w-16 h-8 text-xs'
                              />
                            </div>
                            <div className='flex items-center gap-2'>
                              <Label
                                htmlFor={`min-${pool.id}`}
                                className='text-xs'
                              >
                                Min:
                              </Label>
                              <Input
                                id={`min-${pool.id}`}
                                type='number'
                                min='1'
                                value={
                                  editingNodePools[pool.id]?.minCount ||
                                  pool.minCount
                                }
                                onChange={e =>
                                  handleNodePoolChange(
                                    pool.id,
                                    'minCount',
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className='w-16 h-8 text-xs'
                              />
                            </div>
                            <div className='flex items-center gap-2'>
                              <Label
                                htmlFor={`max-${pool.id}`}
                                className='text-xs'
                              >
                                Max:
                              </Label>
                              <Input
                                id={`max-${pool.id}`}
                                type='number'
                                min='1'
                                value={
                                  editingNodePools[pool.id]?.maxCount ||
                                  pool.maxCount
                                }
                                onChange={e =>
                                  handleNodePoolChange(
                                    pool.id,
                                    'maxCount',
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className='w-16 h-8 text-xs'
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className='font-medium'>
                              {pool.desiredCount}
                            </span>
                            <p className='text-xs text-muted-foreground'>
                              min: {pool.minCount}, max: {pool.maxCount}
                            </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{pool.diskSize} GB</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            pool.status === 'active' ? 'default' : 'secondary'
                          }
                        >
                          {pool.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {Object.entries(pool.labels).map(([key, value]) => (
                            <Badge
                              key={key}
                              variant='outline'
                              className='text-xs'
                            >
                              {key}={value}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openEditPool(pool)}
                            className='h-8 w-8 p-0'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openDeletePool(pool)}
                            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Node Pool Dialog */}
      <Dialog open={isAddPoolOpen} onOpenChange={setIsAddPoolOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Add Node Pool</DialogTitle>
            <DialogDescription>
              Create a new node pool for your cluster. You can configure the
              instance type, node counts, and other settings.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='pool-name'>Node Pool Name</Label>
              <Input
                id='pool-name'
                value={newPool.name}
                onChange={e => setNewPool({ ...newPool, name: e.target.value })}
                placeholder='e.g., workers, database'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='pool-flavor'>Instance Flavor</Label>
              <Select
                value={newPool.flavor}
                onValueChange={value =>
                  setNewPool({ ...newPool, flavor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select instance type' />
                </SelectTrigger>
                <SelectContent>
                  {availableNodeFlavors.map(flavor => (
                    <SelectItem key={flavor.id} value={flavor.id}>
                      <div className='flex items-center justify-between w-full'>
                        <span>{flavor.name}</span>
                        <span className='text-muted-foreground text-xs'>
                          {flavor.vcpus}vCPU, {flavor.memory}GB
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='min-count'>Min Nodes</Label>
                <Input
                  id='min-count'
                  type='number'
                  min='1'
                  value={newPool.minCount}
                  onChange={e =>
                    setNewPool({
                      ...newPool,
                      minCount: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='desired-count'>Desired Nodes</Label>
                <Input
                  id='desired-count'
                  type='number'
                  min='1'
                  value={newPool.desiredCount}
                  onChange={e =>
                    setNewPool({
                      ...newPool,
                      desiredCount: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='max-count'>Max Nodes</Label>
                <Input
                  id='max-count'
                  type='number'
                  min='1'
                  value={newPool.maxCount}
                  onChange={e =>
                    setNewPool({
                      ...newPool,
                      maxCount: parseInt(e.target.value) || 3,
                    })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='disk-size'>Disk Size (GB)</Label>
              <Input
                id='disk-size'
                type='number'
                min='20'
                value={newPool.diskSize}
                onChange={e =>
                  setNewPool({
                    ...newPool,
                    diskSize: parseInt(e.target.value) || 100,
                  })
                }
              />
            </div>

            {!validateNodeCounts(
              newPool.minCount,
              newPool.desiredCount,
              newPool.maxCount
            ) && (
              <Alert>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  Node counts must follow: 0 &lt; min ≤ desired ≤ max
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddPoolOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddPool}
              disabled={
                !newPool.name ||
                !newPool.flavor ||
                !validateNodeCounts(
                  newPool.minCount,
                  newPool.desiredCount,
                  newPool.maxCount
                )
              }
              className='bg-black text-white hover:bg-black/90'
            >
              Add Node Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Node Pool Dialog */}
      <Dialog open={isEditPoolOpen} onOpenChange={setIsEditPoolOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Node Pool: {editingPool?.name}</DialogTitle>
            <DialogDescription>
              Modify the node counts for this node pool. Changes will be applied
              immediately.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-min-count'>Min Nodes</Label>
                <Input
                  id='edit-min-count'
                  type='number'
                  min='1'
                  value={editPool.minCount}
                  onChange={e =>
                    setEditPool({
                      ...editPool,
                      minCount: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-desired-count'>Desired Nodes</Label>
                <Input
                  id='edit-desired-count'
                  type='number'
                  min='1'
                  value={editPool.desiredCount}
                  onChange={e =>
                    setEditPool({
                      ...editPool,
                      desiredCount: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-max-count'>Max Nodes</Label>
                <Input
                  id='edit-max-count'
                  type='number'
                  min='1'
                  value={editPool.maxCount}
                  onChange={e =>
                    setEditPool({
                      ...editPool,
                      maxCount: parseInt(e.target.value) || 3,
                    })
                  }
                />
              </div>
            </div>

            {!validateNodeCounts(
              editPool.minCount,
              editPool.desiredCount,
              editPool.maxCount
            ) && (
              <Alert>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  Node counts must follow: 0 &lt; min ≤ desired ≤ max
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsEditPoolOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditPool}
              disabled={
                !validateNodeCounts(
                  editPool.minCount,
                  editPool.desiredCount,
                  editPool.maxCount
                )
              }
              className='bg-black text-white hover:bg-black/90'
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Node Pool Dialog */}
      <Dialog open={isDeletePoolOpen} onOpenChange={setIsDeletePoolOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-red-600'>Delete Node Pool</DialogTitle>
            <DialogDescription>
              This will permanently delete the node pool "{poolToDelete?.name}".
              All nodes in this pool will be terminated.
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              <strong>Warning:</strong> Deleting this node pool will terminate
              all nodes and may cause service disruption if workloads are
              running on them. Make sure to drain the nodes first.
            </AlertDescription>
          </Alert>

          <div className='bg-muted/50 p-4 rounded-lg'>
            <h4 className='font-medium mb-2'>Node Pool Details:</h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Name:</span>
                <span className='font-medium'>{poolToDelete?.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Current Nodes:</span>
                <span className='font-medium'>
                  {poolToDelete?.desiredCount}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Instance Type:</span>
                <span className='font-medium'>{poolToDelete?.flavor}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeletePoolOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDeletePool}>
              Delete Node Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
