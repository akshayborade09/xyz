// Mock data for MKS (Managed Kubernetes Service) Dashboard

export interface MKSCluster {
  id: string;
  name: string;
  region: string;
  status: 'creating' | 'active' | 'updating' | 'deleting' | 'error';
  k8sVersion: string;
  nodeCount: number;
  createdAt: string;
  tags: string[];
  vpcId: string;
  subnetId: string;
  securityGroupIds: string[];
  kubeApiEndpoint: string;
  nodePools: MKSNodePool[];
  addOns: MKSAddOn[];
  podCIDR: string;
  serviceCIDR: string;
  description?: string;
  estimatedCompletionTime?: string;
  creationProgress?: number;
}

export interface MKSNodePool {
  id: string;
  name: string;
  flavor: string;
  desiredCount: number;
  minCount: number;
  maxCount: number;
  diskSize: number;
  taints: string[];
  labels: Record<string, string>;
  status: 'creating' | 'active' | 'updating' | 'deleting' | 'error';
  createdAt: string;
  k8sVersion: string;
  subnetId: string;
}

export interface MKSAddOn {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category:
    | 'monitoring'
    | 'networking'
    | 'security'
    | 'storage'
    | 'development';
  isEnabled: boolean;
  isDefault: boolean;
  isEditable: boolean;
  version: string;
  status: 'active' | 'installing' | 'failed' | 'disabling';
}

export interface MKSRegion {
  id: string;
  name: string;
  displayName: string;
  isAvailable: boolean;
}

export interface MKSPersistentVolume {
  id: string;
  name: string;
  size: number;
  status: 'available' | 'bound' | 'released' | 'failed';
  storageClass: string;
  clusterId: string;
  createdAt: string;
}

// Default Krutrim add-ons
export const defaultKrutrimAddOns: MKSAddOn[] = [
  {
    id: 'addon-monitoring',
    name: 'kube-prometheus-stack',
    displayName: 'Kubernetes Monitoring Stack',
    description:
      'Comprehensive monitoring solution with Prometheus, Grafana, and AlertManager',
    category: 'monitoring',
    isEnabled: true,
    isDefault: true,
    isEditable: true,
    version: 'v0.68.0',
    status: 'active',
  },
  {
    id: 'addon-networking',
    name: 'calico',
    displayName: 'Calico Network Policy',
    description: 'Advanced network policy and security for Kubernetes clusters',
    category: 'networking',
    isEnabled: true,
    isDefault: true,
    isEditable: true,
    version: 'v3.26.1',
    status: 'active',
  },
  {
    id: 'addon-security',
    name: 'cert-manager',
    displayName: 'Certificate Manager',
    description: 'Automated certificate management for Kubernetes workloads',
    category: 'security',
    isEnabled: true,
    isDefault: true,
    isEditable: true,
    version: 'v1.13.3',
    status: 'active',
  },
  {
    id: 'addon-storage',
    name: 'aws-ebs-csi-driver',
    displayName: 'AWS EBS CSI Driver',
    description: 'Container Storage Interface driver for Amazon EBS volumes',
    category: 'storage',
    isEnabled: true,
    isDefault: true,
    isEditable: true,
    version: 'v2.20.0',
    status: 'active',
  },
  {
    id: 'addon-development',
    name: 'helm-controller',
    displayName: 'Helm Controller',
    description: 'GitOps-based Helm chart deployment and management',
    category: 'development',
    isEnabled: false,
    isDefault: true,
    isEditable: true,
    version: 'v0.35.0',
    status: 'active',
  },
];

// Available regions
export const availableRegions: MKSRegion[] = [
  {
    id: 'ap-south-1',
    name: 'ap-south-1',
    displayName: 'Asia Pacific (Mumbai) - Bangalore',
    isAvailable: true,
  },
  {
    id: 'ap-southeast-1',
    name: 'ap-southeast-1',
    displayName: 'Asia Pacific (Singapore) - Hyderabad',
    isAvailable: true,
  },
  {
    id: 'us-east-1',
    name: 'us-east-1',
    displayName: 'US East (N. Virginia)',
    isAvailable: true,
  },
  {
    id: 'us-west-2',
    name: 'us-west-2',
    displayName: 'US West (Oregon)',
    isAvailable: true,
  },
  {
    id: 'eu-west-1',
    name: 'eu-west-1',
    displayName: 'Europe (Ireland)',
    isAvailable: true,
  },
];

// Subnet interface for MKS clusters
export interface MKSSubnet {
  id: string;
  name: string;
  type: 'Public' | 'Private';
  cidr: string;
  availabilityZone: string;
  vpcId: string;
}

// Available subnets for MKS clusters
export const mksSubnets: MKSSubnet[] = [
  // Production cluster subnets
  {
    id: 'subnet-prod-1a',
    name: 'prod-public-1a',
    type: 'Public',
    cidr: '10.0.1.0/24',
    availabilityZone: 'ap-south-1a',
    vpcId: 'vpc-prod-001',
  },
  {
    id: 'subnet-prod-1b',
    name: 'prod-private-1b',
    type: 'Private',
    cidr: '10.0.2.0/24',
    availabilityZone: 'ap-south-1b',
    vpcId: 'vpc-prod-001',
  },

  // Staging cluster subnets
  {
    id: 'subnet-staging-1a',
    name: 'staging-public-1a',
    type: 'Public',
    cidr: '10.1.1.0/24',
    availabilityZone: 'ap-southeast-1a',
    vpcId: 'vpc-staging-001',
  },

  // Development cluster subnets
  {
    id: 'subnet-dev-1a',
    name: 'dev-public-1a',
    type: 'Public',
    cidr: '10.2.1.0/24',
    availabilityZone: 'ap-south-1a',
    vpcId: 'vpc-dev-001',
  },

  // Test cluster subnets
  {
    id: 'subnet-test-1a',
    name: 'test-public-1a',
    type: 'Public',
    cidr: '10.3.1.0/24',
    availabilityZone: 'ap-southeast-1a',
    vpcId: 'vpc-test-001',
  },

  // Demo cluster subnets
  {
    id: 'subnet-demo-1a',
    name: 'demo-public-1a',
    type: 'Public',
    cidr: '10.4.1.0/24',
    availabilityZone: 'ap-south-1a',
    vpcId: 'vpc-demo-001',
  },
];

// Available node flavors
export const availableNodeFlavors = [
  {
    id: 't3.medium',
    name: 't3.medium',
    vcpus: 2,
    memory: 4,
    category: 'General Purpose',
  },
  {
    id: 't3.large',
    name: 't3.large',
    vcpus: 2,
    memory: 8,
    category: 'General Purpose',
  },
  {
    id: 'm5.large',
    name: 'm5.large',
    vcpus: 2,
    memory: 8,
    category: 'General Purpose',
  },
  {
    id: 'm5.xlarge',
    name: 'm5.xlarge',
    vcpus: 4,
    memory: 16,
    category: 'General Purpose',
  },
  {
    id: 'c5.large',
    name: 'c5.large',
    vcpus: 2,
    memory: 4,
    category: 'Compute Optimized',
  },
  {
    id: 'c5.xlarge',
    name: 'c5.xlarge',
    vcpus: 4,
    memory: 8,
    category: 'Compute Optimized',
  },
  {
    id: 'r5.large',
    name: 'r5.large',
    vcpus: 2,
    memory: 16,
    category: 'Memory Optimized',
  },
  {
    id: 'r5.xlarge',
    name: 'r5.xlarge',
    vcpus: 4,
    memory: 32,
    category: 'Memory Optimized',
  },
];

// Mock clusters data
export const mockMKSClusters: MKSCluster[] = [
  {
    id: 'cluster-1',
    name: 'production-cluster',
    region: 'ap-south-1', // Bangalore
    status: 'active',
    k8sVersion: '1.33.0',
    nodeCount: 12,
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['production', 'web-apps', 'critical'],
    vpcId: 'vpc-prod-001',
    subnetId: 'subnet-prod-1a',
    securityGroupIds: ['sg-prod-cluster'],
    kubeApiEndpoint: 'https://api.production-cluster.k8s.local',
    podCIDR: '10.244.0.0/16',
    serviceCIDR: '10.96.0.0/12',
    nodePools: [
      {
        id: 'np-prod-1',
        name: 'prod-workers',
        flavor: 'm5.xlarge',
        desiredCount: 8,
        minCount: 6,
        maxCount: 12,
        diskSize: 100,
        taints: [],
        labels: { environment: 'production', workload: 'web' },
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        k8sVersion: '1.33.0',
        subnetId: 'subnet-prod-1a',
      },
      {
        id: 'np-prod-2',
        name: 'prod-database',
        flavor: 'r5.xlarge',
        desiredCount: 4,
        minCount: 2,
        maxCount: 6,
        diskSize: 200,
        taints: ['dedicated=database:NoSchedule'],
        labels: { environment: 'production', workload: 'database' },
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        k8sVersion: '1.33.0',
        subnetId: 'subnet-prod-1b',
      },
    ],
    addOns: defaultKrutrimAddOns.map(addon => ({
      ...addon,
      isEnabled: addon.id !== 'addon-development',
    })),
  },
  {
    id: 'cluster-2',
    name: 'staging-cluster',
    region: 'ap-southeast-1', // Hyderabad
    status: 'active',
    k8sVersion: '1.29.0', // Deprecated version
    nodeCount: 6,
    createdAt: '2024-02-20T14:15:00Z',
    tags: ['staging', 'testing'],
    vpcId: 'vpc-staging-001',
    subnetId: 'subnet-staging-1a',
    securityGroupIds: ['sg-staging-cluster'],
    kubeApiEndpoint: 'https://api.staging-cluster.k8s.local',
    podCIDR: '10.245.0.0/16',
    serviceCIDR: '10.97.0.0/12',
    nodePools: [
      {
        id: 'np-staging-1',
        name: 'staging-workers',
        flavor: 't3.large',
        desiredCount: 4,
        minCount: 2,
        maxCount: 8,
        diskSize: 80,
        taints: [],
        labels: { environment: 'staging', workload: 'testing' },
        status: 'active',
        createdAt: '2024-02-20T14:15:00Z',
        k8sVersion: '1.29.0',
        subnetId: 'subnet-staging-1a',
      },
      {
        id: 'np-staging-2',
        name: 'staging-db',
        flavor: 'm5.large',
        desiredCount: 2,
        minCount: 1,
        maxCount: 3,
        diskSize: 100,
        taints: ['dedicated=database:NoSchedule'],
        labels: { environment: 'staging', workload: 'database' },
        status: 'active',
        createdAt: '2024-02-20T14:15:00Z',
        k8sVersion: '1.29.0',
        subnetId: 'subnet-staging-1a',
      },
    ],
    addOns: defaultKrutrimAddOns.map(addon => ({
      ...addon,
      isEnabled: addon.id !== 'addon-development',
    })),
  },
  {
    id: 'cluster-3',
    name: 'development-cluster',
    region: 'ap-south-1', // Bangalore
    status: 'active',
    k8sVersion: '1.30.0',
    nodeCount: 3,
    createdAt: '2024-12-19T09:00:00Z',
    tags: ['development', 'experimental'],
    vpcId: 'vpc-dev-001',
    subnetId: 'subnet-dev-1a',
    securityGroupIds: ['sg-dev-cluster'],
    kubeApiEndpoint: 'https://api.dev-cluster.k8s.local',
    podCIDR: '10.246.0.0/16',
    serviceCIDR: '10.98.0.0/12',
    nodePools: [
      {
        id: 'np-dev-1',
        name: 'dev-workers',
        flavor: 't3.medium',
        desiredCount: 3,
        minCount: 1,
        maxCount: 5,
        diskSize: 50,
        taints: [],
        labels: { environment: 'development', workload: 'experimental' },
        status: 'active',
        createdAt: '2024-12-19T09:00:00Z',
        k8sVersion: '1.29.0',
        subnetId: 'subnet-dev-1a',
      },
    ],
    addOns: defaultKrutrimAddOns.map(addon => ({
      ...addon,
      isEnabled: addon.id === 'addon-monitoring',
    })),
  },
  {
    id: 'cluster-4',
    name: 'test-cluster',
    region: 'ap-southeast-1', // Hyderabad
    status: 'active',
    k8sVersion: '1.31.0',
    nodeCount: 4,
    createdAt: '2024-11-10T16:45:00Z',
    tags: ['testing', 'qa'],
    vpcId: 'vpc-test-001',
    subnetId: 'subnet-test-1a',
    securityGroupIds: ['sg-test-cluster'],
    kubeApiEndpoint: 'https://api.test-cluster.k8s.local',
    podCIDR: '10.247.0.0/16',
    serviceCIDR: '10.99.0.0/12',
    nodePools: [
      {
        id: 'np-test-1',
        name: 'test-workers',
        flavor: 't3.large',
        desiredCount: 4,
        minCount: 2,
        maxCount: 6,
        diskSize: 60,
        taints: [],
        labels: { environment: 'testing', workload: 'qa' },
        status: 'active',
        createdAt: '2024-11-10T16:45:00Z',
        k8sVersion: '1.31.0',
        subnetId: 'subnet-test-1a',
      },
    ],
    addOns: defaultKrutrimAddOns.map(addon => ({
      ...addon,
      isEnabled: addon.id === 'addon-monitoring',
    })),
  },
  {
    id: 'cluster-5',
    name: 'demo-cluster',
    region: 'ap-south-1', // Bangalore
    status: 'active',
    k8sVersion: '1.32.0',
    nodeCount: 2,
    createdAt: '2024-10-05T11:20:00Z',
    tags: ['demo', 'presentation'],
    vpcId: 'vpc-demo-001',
    subnetId: 'subnet-demo-1a',
    securityGroupIds: ['sg-demo-cluster'],
    kubeApiEndpoint: 'https://api.demo-cluster.k8s.local',
    podCIDR: '10.248.0.0/16',
    serviceCIDR: '10.100.0.0/12',
    nodePools: [
      {
        id: 'np-demo-1',
        name: 'demo-workers',
        flavor: 't3.medium',
        desiredCount: 2,
        minCount: 1,
        maxCount: 3,
        diskSize: 40,
        taints: [],
        labels: { environment: 'demo', workload: 'presentation' },
        status: 'active',
        createdAt: '2024-10-05T11:20:00Z',
        k8sVersion: '1.31.0',
        subnetId: 'subnet-demo-1a',
      },
    ],
    addOns: defaultKrutrimAddOns.map(addon => ({
      ...addon,
      isEnabled: addon.id === 'addon-monitoring',
    })),
  },
];

// Mock persistent volumes
export const mockPersistentVolumes: MKSPersistentVolume[] = [
  {
    id: 'pv-1',
    name: 'app-storage-001',
    size: 100,
    status: 'bound',
    storageClass: 'gp3',
    clusterId: 'cluster-1',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'pv-2',
    name: 'db-storage-001',
    size: 200,
    status: 'bound',
    storageClass: 'io2',
    clusterId: 'cluster-1',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'pv-3',
    name: 'staging-storage-001',
    size: 80,
    status: 'bound',
    storageClass: 'gp3',
    clusterId: 'cluster-2',
    createdAt: '2024-02-20T14:15:00Z',
  },
];

// Helper functions
export const getClusterById = (id: string): MKSCluster | undefined => {
  return mockMKSClusters.find(cluster => cluster.id === id);
};

export const getClustersByRegion = (region: string): MKSCluster[] => {
  return mockMKSClusters.filter(cluster => cluster.region === region);
};

export const getClustersByStatus = (
  status: MKSCluster['status']
): MKSCluster[] => {
  return mockMKSClusters.filter(cluster => cluster.status === status);
};

export const getPersistentVolumesByCluster = (
  clusterId: string
): MKSPersistentVolume[] => {
  return mockPersistentVolumes.filter(pv => pv.clusterId === clusterId);
};

// K8s version management helpers
export const isK8sVersionDeprecated = (version: string): boolean => {
  return version === '1.29.0';
};

export const getNextK8sVersion = (currentVersion: string): string | null => {
  const versionMap: Record<string, string | null> = {
    '1.29.0': '1.30.0',
    '1.30.0': '1.31.0',
    '1.31.0': '1.32.0',
    '1.32.0': '1.33.0',
    '1.33.0': null, // No upgrade available
  };
  return versionMap[currentVersion] || null;
};

// Add-on version upgrade mappings
export const addonVersionUpgrades: Record<string, Record<string, string>> = {
  'addon-monitoring': {
    'v0.68.0': 'v0.69.0',
    'v0.69.0': 'v0.70.0',
  },
  'addon-networking': {
    'v3.26.1': 'v3.27.0',
    'v3.27.0': 'v3.28.0',
  },
  'addon-security': {
    'v1.13.3': 'v1.14.0',
    'v1.14.0': 'v1.15.0',
  },
  'addon-storage': {
    'v2.20.0': 'v2.21.0',
    'v2.21.0': 'v2.22.0',
  },
  'addon-development': {
    'v0.35.0': 'v0.36.0',
    'v0.36.0': 'v0.37.0',
  },
};

// Function to get next available add-on version
export const getNextAddonVersion = (
  addonId: string,
  currentVersion: string
): string | null => {
  const addonUpgrades = addonVersionUpgrades[addonId];
  if (!addonUpgrades) {
    return null;
  }

  return addonUpgrades[currentVersion] || null;
};

export const getRegionDisplayName = (regionId: string): string => {
  const region = availableRegions.find(r => r.id === regionId);
  return region?.displayName || regionId;
};

// Helper function to get subnet details by ID
export const getSubnetById = (subnetId: string): MKSSubnet | undefined => {
  return mksSubnets.find(subnet => subnet.id === subnetId);
};
