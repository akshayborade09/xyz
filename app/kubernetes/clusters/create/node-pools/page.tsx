'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Server,
  HardDrive,
  Tag,
  AlertTriangle,
  Download,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockSubnets } from '@/lib/cluster-creation-data';

// Instance flavors from the screenshot
const instanceFlavors = [
  { id: 'cpu-1x-4gb', name: 'CPU-1x-4GB', vcpus: 1, ram: 4, pricePerHour: 3 },
  { id: 'cpu-2x-8gb', name: 'CPU-2x-8GB', vcpus: 2, ram: 8, pricePerHour: 6 },
  {
    id: 'cpu-4x-16gb',
    name: 'CPU-4x-16GB',
    vcpus: 4,
    ram: 16,
    pricePerHour: 13,
  },
  {
    id: 'cpu-8x-32gb',
    name: 'CPU-8x-32GB',
    vcpus: 8,
    ram: 32,
    pricePerHour: 25,
  },
  {
    id: 'cpu-16x-64gb',
    name: 'CPU-16x-64GB',
    vcpus: 16,
    ram: 64,
    pricePerHour: 49,
  },
  {
    id: 'cpu-32x-128gb',
    name: 'CPU-32x-128GB',
    vcpus: 32,
    ram: 128,
    pricePerHour: 97,
  },
];

// Storage presets
const storagePresets = [
  { size: 50, label: '50GB', isDefault: false },
  { size: 100, label: '100GB', isDefault: false },
  { size: 200, label: '200GB', isDefault: true },
  { size: 500, label: '500GB', isDefault: false },
  { size: 1024, label: '1TB', isDefault: false },
];

const storageNotches = [
  { value: 50, label: '50GB' },
  { value: 100, label: '100GB' },
  { value: 200, label: '200GB' },
  { value: 500, label: '500GB' },
  { value: 1024, label: '1TB' },
];

// Types
interface NodePool {
  id: string;
  name: string;
  instanceFlavor: string;
  desiredNodes: number;
  minNodes: number;
  maxNodes: number;
  storageSize: number;
  labels: Label[];
  taints: Taint[];
  tags: Label[];
  subnet: string;
  isDefault: boolean;
}

interface Taint {
  key: string;
  value: string;
  effect: string;
}

interface Label {
  key: string;
  value: string;
}

export default function NodePoolCreationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [nodePools, setNodePools] = useState<NodePool[]>([
    {
      id: '1',
      name: 'default-pool',
      instanceFlavor: 'cpu-2x-8gb',
      desiredNodes: 3,
      minNodes: 1,
      maxNodes: 10,
      storageSize: 200,
      labels: [],
      taints: [],
      tags: [],
      subnet: mockSubnets[0].id,
      isDefault: true,
    },
  ]);

  const [nextPoolId, setNextPoolId] = useState(2);
  const [yamlPreviewOpen, setYamlPreviewOpen] = useState(false);
  const [highlightedStorage, setHighlightedStorage] = useState<string | null>(
    null
  );
  const [draggingStorage, setDraggingStorage] = useState<string | null>(null);
  const [dragValue, setDragValue] = useState<number>(0);

  // Get selected instance flavor details
  const getSelectedFlavor = (flavorId: string) => {
    return instanceFlavors.find(f => f.id === flavorId) || instanceFlavors[1];
  };

  // Calculate costs
  const calculateCosts = useMemo(() => {
    let totalInstanceCost = 0;
    let totalStorageCost = 0;

    nodePools.forEach(pool => {
      const flavor = getSelectedFlavor(pool.instanceFlavor);
      const instanceCost = flavor.pricePerHour * pool.desiredNodes;
      const storageCost = (pool.storageSize / 1000) * 0.1 * pool.desiredNodes; // $0.10 per GB per month
      totalInstanceCost += instanceCost;
      totalStorageCost += storageCost;
    });

    return {
      instanceCost: totalInstanceCost,
      storageCost: totalStorageCost,
      totalCost: totalInstanceCost + totalStorageCost,
    };
  }, [nodePools]);

  // Add new node pool
  const addNodePool = () => {
    const newPool: NodePool = {
      id: nextPoolId.toString(),
      name: `pool-${nextPoolId}`,
      instanceFlavor: 'cpu-2x-8gb',
      desiredNodes: 3,
      minNodes: 1,
      maxNodes: 10,
      storageSize: 200,
      labels: [],
      taints: [],
      tags: [],
      subnet: mockSubnets[0].id,
      isDefault: false,
    };

    setNodePools([...nodePools, newPool]);
    setNextPoolId(nextPoolId + 1);
  };

  // Remove node pool
  const removeNodePool = (poolId: string) => {
    if (nodePools.find(p => p.id === poolId)?.isDefault) {
      toast({
        title: 'Cannot Remove Default Pool',
        description: 'The default node pool cannot be removed.',
        variant: 'destructive',
      });
      return;
    }

    setNodePools(nodePools.filter(p => p.id !== poolId));
  };

  // Update node pool
  const updateNodePool = (poolId: string, updates: Partial<NodePool>) => {
    setNodePools(
      nodePools.map(pool =>
        pool.id === poolId ? { ...pool, ...updates } : pool
      )
    );
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
    field: keyof Taint,
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
    field: keyof Label,
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

  // Add tag
  const addTag = (poolId: string) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      updateNodePool(poolId, {
        tags: [...pool.tags, { key: '', value: '' }],
      });
    }
  };

  // Remove tag
  const removeTag = (poolId: string, index: number) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      updateNodePool(poolId, {
        tags: pool.tags.filter((_, i) => i !== index),
      });
    }
  };

  // Update tag
  const updateTag = (
    poolId: string,
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const pool = nodePools.find(p => p.id === poolId);
    if (pool) {
      const newTags = [...pool.tags];
      newTags[index][field] = value;
      updateNodePool(poolId, { tags: newTags });
    }
  };

  // Validation
  const validateForm = () => {
    for (const pool of nodePools) {
      // Check if name is provided
      if (!pool.name.trim()) {
        return false;
      }
      // Check node count validation
      if (
        pool.minNodes < 0 ||
        pool.maxNodes < pool.minNodes ||
        pool.desiredNodes < pool.minNodes ||
        pool.desiredNodes > pool.maxNodes
      ) {
        return false;
      }
    }
    return true;
  };

  // Handle save and continue
  const handleSaveAndContinue = () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the validation errors before continuing.',
        variant: 'destructive',
      });
      return;
    }

    // In a real implementation, this would save the configuration
    toast({
      title: 'Configuration Saved',
      description: 'Node pool configuration has been saved successfully.',
    });

    // Navigate to next step (would be implemented in real app)
    router.push('/kubernetes/clusters/create/next-step');
  };

  // Generate YAML preview
  const generateYAML = () => {
    const nodePoolsYAML = nodePools
      .map(pool => {
        const flavor = getSelectedFlavor(pool.instanceFlavor);
        let poolYAML = `  - name: ${pool.name}
    instanceType: ${flavor.name}
    vcpus: ${flavor.vcpus}
    memory: ${flavor.ram}GB
    storage: ${pool.storageSize}GB
    scaling:
      desired: ${pool.desiredNodes}
      min: ${pool.minNodes}
      max: ${pool.maxNodes}`;

        // Add labels if any
        if (
          pool.labels.length > 0 &&
          pool.labels.some(label => label.key && label.value)
        ) {
          poolYAML += '\n    labels:';
          pool.labels
            .filter(label => label.key && label.value)
            .forEach(label => {
              poolYAML += `\n      ${label.key}: "${label.value}"`;
            });
        }

        // Add taints if any
        if (
          pool.taints.length > 0 &&
          pool.taints.some(taint => taint.key && taint.value)
        ) {
          poolYAML += '\n    taints:';
          pool.taints
            .filter(taint => taint.key && taint.value)
            .forEach(taint => {
              poolYAML += `\n      - key: "${taint.key}"\n        value: "${taint.value}"\n        effect: ${taint.effect}`;
            });
        }

        // Add tags if any
        if (
          pool.tags.length > 0 &&
          pool.tags.some(tag => tag.key && tag.value)
        ) {
          poolYAML += '\n    tags:';
          pool.tags
            .filter(tag => tag.key && tag.value)
            .forEach(tag => {
              poolYAML += `\n      ${tag.key}: "${tag.value}"`;
            });
        }

        return poolYAML;
      })
      .join('\n');

    const yaml = `apiVersion: v1
kind: Cluster
metadata:
  name: mks-cluster
spec:
  nodePools:
${nodePoolsYAML}`;

    return yaml;
  };

  // Download YAML
  const downloadYAML = () => {
    const yaml = generateYAML();
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mks-cluster-spec.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout
      title='Configure Node Pools'
      description='Configure node pools for your MKS cluster'
    >
      <div className='space-y-6'>
        {/* Rest of the component would go here */}
        <div>Component content placeholder</div>
      </div>
    </PageLayout>
  );
}
