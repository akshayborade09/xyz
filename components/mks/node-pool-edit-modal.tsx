'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import {
  type MKSCluster,
  type MKSNodePool,
  availableNodeFlavors,
} from '@/lib/mks-data';
import { useToast } from '@/hooks/use-toast';

// Mock data for subnets and security groups (in real app, this would come from props or API)
const mockSubnets = [
  { id: 'subnet-1', name: 'Private Subnet A', cidr: '10.0.1.0/24' },
  { id: 'subnet-2', name: 'Private Subnet B', cidr: '10.0.2.0/24' },
  { id: 'subnet-3', name: 'Public Subnet A', cidr: '10.0.3.0/24' },
];

const mockSecurityGroups = [
  { id: 'sg-default', name: 'default', description: 'Default security group' },
  {
    id: 'sg-web',
    name: 'web-servers',
    description: 'Security group for web servers',
  },
  {
    id: 'sg-db',
    name: 'database',
    description: 'Security group for database servers',
  },
];

interface NodePoolEditModalProps {
  cluster: MKSCluster;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCluster: MKSCluster) => void;
}

export function NodePoolEditModal({
  cluster,
  isOpen,
  onClose,
  onUpdate,
}: NodePoolEditModalProps) {
  const { toast } = useToast();

  // Convert cluster node pools to editable format
  const [nodePools, setNodePools] = useState<
    Array<{
      id: string;
      name: string;
      instanceFlavor: string;
      storageSize: number;
      subnetId: string;
      securityGroupId?: string;
      desiredNodes: number;
      minNodes: number;
      maxNodes: number;
      taints: Array<{ key: string; value: string; effect: string }>;
      labels: Array<{ key: string; value: string }>;
      tags: Array<{ key: string; value: string }>;
      isDefault: boolean;
      status?: string;
      k8sVersion?: string;
    }>
  >([]);

  const [nextPoolId, setNextPoolId] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [poolToDelete, setPoolToDelete] = useState<any>(null);

  // Initialize editing state when modal opens
  useEffect(() => {
    if (isOpen && cluster) {
      const convertedPools = cluster.nodePools.map((pool, index) => ({
        id: pool.id,
        name: pool.name,
        instanceFlavor: pool.flavor,
        storageSize: pool.diskSize,
        subnetId: pool.subnetId || mockSubnets[0].id,
        securityGroupId: undefined,
        desiredNodes: pool.desiredCount,
        minNodes: pool.minCount,
        maxNodes: pool.maxCount,
        taints: [],
        labels: [],
        tags: [],
        isDefault: index === 0, // First pool is typically default
        status: pool.status,
        k8sVersion: pool.k8sVersion,
      }));
      setNodePools(convertedPools);
      setNextPoolId(cluster.nodePools.length + 1);
      setHasChanges(false);
    }
  }, [isOpen, cluster]);

  // Add new node pool
  const addNodePool = () => {
    const newPool = {
      id: `pool-${nextPoolId}`,
      name: `pool-${nextPoolId}`,
      instanceFlavor: 'cpu-2x-8gb',
      storageSize: 100,
      subnetId: mockSubnets[0].id,
      securityGroupId: undefined,
      desiredNodes: 2,
      minNodes: 1,
      maxNodes: 5,
      taints: [{ key: '', value: '', effect: 'NoSchedule' }],
      labels: [{ key: '', value: '' }],
      tags: [{ key: '', value: '' }],
      isDefault: false,
    };

    setNodePools([...nodePools, newPool]);
    setNextPoolId(nextPoolId + 1);
    setHasChanges(true);
  };

  // Remove node pool
  const removeNodePool = (poolId: string) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool?.isDefault) {
      toast({
        title: 'Cannot Remove Default Pool',
        description: 'The default node pool cannot be removed.',
        variant: 'destructive',
      });
      return;
    }

    if (nodePools.length === 1) {
      toast({
        title: 'Cannot delete node pool',
        description: 'At least one node pool must remain in the cluster.',
        variant: 'destructive',
      });
      return;
    }

    setNodePools(nodePools.filter(p => p.id !== poolId));
    setHasChanges(true);
  };

  // Update node pool
  const updateNodePool = (poolId: string, updates: any) => {
    setNodePools(
      nodePools.map(pool =>
        pool.id === poolId ? { ...pool, ...updates } : pool
      )
    );
    setHasChanges(true);
  };

  // Add taint
  const addTaint = (poolId: string) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      updateNodePool(poolId, {
        taints: [...pool.taints, { key: '', value: '', effect: 'NoSchedule' }],
      });
    }
  };

  // Remove taint
  const removeTaint = (poolId: string, index: number) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      updateNodePool(poolId, {
        taints: pool.taints.filter((_, i) => i !== index),
      });
    }
  };

  // Update taint
  const updateTaint = (
    poolId: string,
    index: number,
    field: string,
    value: string
  ) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      const updatedTaints = pool.taints.map((taint, i) =>
        i === index ? { ...taint, [field]: value } : taint
      );
      updateNodePool(poolId, { taints: updatedTaints });
    }
  };

  // Add label
  const addLabel = (poolId: string) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      updateNodePool(poolId, {
        labels: [...pool.labels, { key: '', value: '' }],
      });
    }
  };

  // Remove label
  const removeLabel = (poolId: string, index: number) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      updateNodePool(poolId, {
        labels: pool.labels.filter((_, i) => i !== index),
      });
    }
  };

  // Update label
  const updateLabel = (
    poolId: string,
    index: number,
    field: string,
    value: string
  ) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      const updatedLabels = pool.labels.map((label, i) =>
        i === index ? { ...label, [field]: value } : label
      );
      updateNodePool(poolId, { labels: updatedLabels });
    }
  };

  const handleSaveChanges = () => {
    // Convert back to MKSNodePool format
    const updatedPools = nodePools.map(pool => ({
      id: pool.id,
      name: pool.name,
      flavor: pool.instanceFlavor,
      diskSize: pool.storageSize,
      subnetId: pool.subnetId,
      desiredCount: pool.desiredNodes,
      minCount: pool.minNodes,
      maxCount: pool.maxNodes,
      taints: [],
      labels: {},
      status: pool.status || 'active',
      createdAt: new Date().toISOString(),
      k8sVersion: pool.k8sVersion || cluster.k8sVersion,
    }));

    const updatedCluster = {
      ...cluster,
      nodePools: updatedPools,
      nodeCount: updatedPools.reduce(
        (total, pool) => total + pool.desiredCount,
        0
      ),
    };

    onUpdate(updatedCluster);
    setHasChanges(false);
    onClose();
    toast({
      title: 'Node pools updated',
      description:
        'Your node pool configurations have been saved successfully.',
    });
  };

  const handleCancel = () => {
    setHasChanges(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='p-0 bg-white max-w-4xl max-h-[85vh] w-[80vw] h-[85vh] overflow-hidden flex flex-col'>
        <DialogHeader className='flex-shrink-0 p-6 border-b'>
          <DialogTitle>Edit Node Pools</DialogTitle>
          <DialogDescription>
            Configure node pools for your cluster. You can add, remove, and
            modify node pool settings.
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto p-6'>
          <div className='space-y-6'>
            {/* Node Pools */}
            {nodePools.map((pool, index) => (
              <Card key={pool.id}>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div>
                        <CardTitle className='text-lg'>
                          {pool.name}
                          {pool.isDefault && (
                            <Badge variant='secondary' className='ml-2'>
                              Default Node Pool (required)
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                    {!pool.isDefault && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeNodePool(pool.id)}
                        className='text-destructive hover:text-destructive'
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Pool Name */}
                  <div className='space-y-2'>
                    <Label htmlFor={`pool-name-${pool.id}`}>
                      Node Pool Name
                    </Label>
                    <Input
                      id={`pool-name-${pool.id}`}
                      placeholder='Enter node pool name'
                      value={pool.name}
                      onChange={e =>
                        updateNodePool(pool.id, { name: e.target.value })
                      }
                      disabled={pool.isDefault}
                    />
                  </div>

                  {/* Instance Configuration */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor={`instance-flavor-${pool.id}`}>
                        Instance Flavor
                      </Label>
                      <Select
                        value={pool.instanceFlavor}
                        onValueChange={value =>
                          updateNodePool(pool.id, { instanceFlavor: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select instance flavor' />
                        </SelectTrigger>
                        <SelectContent>
                          {availableNodeFlavors.map(flavor => (
                            <SelectItem key={flavor.id} value={flavor.id}>
                              <div className='flex items-center justify-between w-full'>
                                <span>{flavor.name}</span>
                                <span className='text-muted-foreground text-sm ml-2'>
                                  {flavor.vcpus} vCPUs, {flavor.memory}GB RAM -
                                  ${flavor.hourlyCost}/hr
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor={`storage-size-${pool.id}`}>
                        Storage Size (GB)
                      </Label>
                      <Input
                        id={`storage-size-${pool.id}`}
                        type='number'
                        min='20'
                        max='1000'
                        value={pool.storageSize}
                        onChange={e =>
                          updateNodePool(pool.id, {
                            storageSize: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Networking Configuration */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor={`subnet-${pool.id}`}>Subnet</Label>
                      <Select
                        value={pool.subnetId}
                        onValueChange={value =>
                          updateNodePool(pool.id, { subnetId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select subnet' />
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

                    <div className='space-y-2'>
                      <Label htmlFor={`security-group-${pool.id}`}>
                        Security Group (Optional)
                      </Label>
                      <Select
                        value={pool.securityGroupId || 'none'}
                        onValueChange={value =>
                          updateNodePool(pool.id, {
                            securityGroupId:
                              value === 'none' ? undefined : value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select security group' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='none'>None</SelectItem>
                          {mockSecurityGroups.map(sg => (
                            <SelectItem key={sg.id} value={sg.id}>
                              {sg.name} - {sg.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Node Scaling Configuration */}
                  <div className='space-y-4'>
                    <Label>Node Scaling Configuration</Label>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor={`min-nodes-${pool.id}`}
                          className='text-sm'
                        >
                          Min Nodes
                        </Label>
                        <Input
                          id={`min-nodes-${pool.id}`}
                          type='number'
                          min='0'
                          max='100'
                          value={pool.minNodes}
                          onChange={e =>
                            updateNodePool(pool.id, {
                              minNodes: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor={`desired-nodes-${pool.id}`}
                          className='text-sm'
                        >
                          Desired Nodes
                        </Label>
                        <Input
                          id={`desired-nodes-${pool.id}`}
                          type='number'
                          min='1'
                          max='100'
                          value={pool.desiredNodes}
                          onChange={e =>
                            updateNodePool(pool.id, {
                              desiredNodes: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor={`max-nodes-${pool.id}`}
                          className='text-sm'
                        >
                          Max Nodes
                        </Label>
                        <Input
                          id={`max-nodes-${pool.id}`}
                          type='number'
                          min='1'
                          max='100'
                          value={pool.maxNodes}
                          onChange={e =>
                            updateNodePool(pool.id, {
                              maxNodes: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Validation Warnings */}
                  {pool.minNodes > pool.desiredNodes && (
                    <Alert>
                      <AlertTriangle className='h-4 w-4' />
                      <AlertDescription>
                        Minimum nodes ({pool.minNodes}) cannot be greater than
                        desired nodes ({pool.desiredNodes}).
                      </AlertDescription>
                    </Alert>
                  )}
                  {pool.desiredNodes > pool.maxNodes && (
                    <Alert>
                      <AlertTriangle className='h-4 w-4' />
                      <AlertDescription>
                        Desired nodes ({pool.desiredNodes}) cannot be greater
                        than maximum nodes ({pool.maxNodes}).
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Add Node Pool Button */}
            <Card className='border-dashed'>
              <CardContent className='flex flex-col items-center justify-center py-8'>
                <Button onClick={addNodePool} variant='outline' size='lg'>
                  Add Node Pool
                </Button>
                <p className='text-sm text-muted-foreground mt-2'>
                  Add additional node pools for different workload requirements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className='flex-shrink-0 p-6 border-t bg-white'>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={!hasChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
