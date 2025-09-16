export const tooltipContent = {
  // Common actions
  common: {
    viewDocs: 'View documentation for this section',
    export: 'Export data to CSV file',
    refresh: 'Refresh the current view',
    search: 'Search through items',
    filter: 'Filter the displayed items',
    settings: 'Open settings and configuration',
    help: 'Get help and support',
    close: 'Close this panel',
    minimize: 'Minimize this panel',
    maximize: 'Maximize this panel',
    edit: 'Edit this item',
    delete: 'Delete this item',
    view: 'View item details',
    copy: 'Copy to clipboard',
    download: 'Download file',
    upload: 'Upload file',
  },

  // Navigation
  navigation: {
    dashboard: 'Go to main dashboard',
    compute: 'Manage compute resources and virtual machines',
    storage: 'Manage storage volumes and snapshots',
    networking: 'Configure networking and security',
    apis: 'Manage API endpoints and services',
    billing: 'View billing and usage information',
    iam: 'Manage users, roles and permissions',
    settings: 'Account and application settings',
    support: 'Get help and documentation',
  },

  // Compute service
  compute: {
    viewDocs: 'View compute service documentation and tutorials',
    createInstance: 'Launch a new virtual machine instance',
    createPod: 'Create a new AI pod for machine learning workloads',
    manageImages: 'Manage VM images and templates',
    viewMonitoring: 'View resource usage and performance metrics',
    autoScaling: 'Configure automatic scaling policies',
    networking: 'Configure instance networking settings',
    gpu: 'Manage GPU compute resources',
    cpu: 'Manage CPU compute resources',
    kubernetes: 'Manage Kubernetes clusters',
  },

  // Storage service
  storage: {
    viewDocs: 'View storage service documentation and best practices',
    createVolume: 'Create a new storage volume',
    createSnapshot: 'Create a snapshot backup',
    manageSnapshots: 'Manage volume snapshots and backups',
    blockStorage: 'Manage block storage volumes',
    objectStorage: 'Manage object storage buckets',
    attachVolume: 'Attach volume to an instance',
    detachVolume: 'Detach volume from instance',
  },

  // Networking service
  networking: {
    viewDocs: 'View networking documentation and configuration guides',
    createVPC: 'Create a new Virtual Private Cloud',
    createSubnet: 'Create a new subnet within a VPC',
    manageFirewall: 'Configure firewall rules and security groups',
    loadBalancer: 'Configure load balancing settings',
    staticIP: 'Manage static IP addresses',
    dns: 'Configure DNS settings',
    securityGroups: 'Manage network security groups',
    routingProtocol:
      'Choose how DNS queries are routed to your resources. Simple routes to one IP, Weighted distributes traffic by percentage, GeoIP routes by location, HealthPort/HealthURL route only to healthy servers.',
  },

  // APIs service
  apis: {
    viewDocs: 'View API documentation and integration guides',
    createEndpoint: 'Create a new API endpoint',
    analytics: 'View API usage analytics and metrics',
    management: 'Manage API configurations and settings',
    catalog: 'Browse available API services',
    development: 'Access API development tools',
  },

  // Data service
  data: {
    viewDocs: 'View data service documentation',
    createDataset: 'Upload or connect a new dataset',
    pipelines: 'Manage data processing pipelines',
    governance: 'Configure data governance policies',
    processing: 'Manage data processing jobs',
  },

  // AI Solutions
  aiSolutions: {
    viewDocs: 'View AI solutions documentation',
    manufacturing: 'AI solutions for manufacturing industry',
    medicalImaging: 'AI solutions for medical imaging analysis',
    bhashik: 'Natural language processing solutions',
    docIntelligence: 'Document processing and analysis',
  },

  // Model services
  models: {
    viewDocs: 'View model documentation and guides',
    modelHub: 'Browse and deploy pre-trained models',
    training: 'Train custom machine learning models',
    deployment: 'Deploy models to production',
    monitoring: 'Monitor model performance',
    fineTuning: 'Fine-tune existing models',
    evaluation: 'Evaluate model performance',
  },

  // Billing
  billing: {
    viewDocs: 'View billing documentation and pricing guides',
    addCredits: 'Add credits to your account',
    viewUsage: 'View detailed usage reports',
    pricing: 'View pricing information',
    transactions: 'View transaction history',
    quotas: 'Manage service quotas and limits',
    team: 'Manage team billing settings',
  },

  // Security & IAM
  security: {
    viewDocs: 'View security best practices and guides',
    audit: 'View security audit logs',
    compliance: 'Manage compliance settings',
    encryption: 'Configure encryption settings',
    iam: 'Manage identity and access management',
    mfa: 'Configure multi-factor authentication',
    apiKeys: 'Manage API keys and tokens',
    sshKeys: 'Manage SSH key pairs',
  },

  // Status and actions
  status: {
    // Load Balancer specific statuses
    active: 'Serving traffic normally',
    provisioning: 'LB is being set up; resources being allocated',
    error: 'Creation or update failed',
    offline:
      'Not serving traffic (all backends unhealthy, listeners disabled, or admin stopped)',

    // General statuses
    inactive: 'Resource is stopped or not running',
    pending: 'Resource is being created or started',
    warning: 'Resource requires attention',
    success: 'Operation completed successfully',
    loading: 'Operation is in progress',
  },

  // Action buttons
  actions: {
    create: 'Create a new resource',
    start: 'Start this resource',
    stop: 'Stop this resource',
    restart: 'Restart this resource',
    pause: 'Pause this resource',
    resume: 'Resume this resource',
    extend: 'Extend resource lease or duration',
    backup: 'Create a backup of this resource',
    restore: 'Restore from backup',
    scale: 'Scale resource capacity',
    configure: 'Configure resource settings',
    connect: 'Connect to this resource',
    disconnect: 'Disconnect from this resource',
    migrate: 'Migrate this resource',
    clone: 'Create a copy of this resource',
  },
};

// Helper function to get tooltip content with fallback
export function getTooltipContent(
  category: keyof typeof tooltipContent,
  key: string
): string {
  const categoryContent = tooltipContent[category] as Record<string, string>;
  return (
    categoryContent?.[key] ||
    `${key.charAt(0).toUpperCase() + key.slice(1)} action`
  );
}

// Helper function to get contextual tooltip based on pathname
export function getContextualTooltip(pathname: string, action: string): string {
  if (pathname.includes('/compute')) {
    return getTooltipContent('compute', action);
  }
  if (pathname.includes('/storage')) {
    return getTooltipContent('storage', action);
  }
  if (pathname.includes('/networking')) {
    return getTooltipContent('networking', action);
  }
  if (pathname.includes('/apis')) {
    return getTooltipContent('apis', action);
  }
  if (pathname.includes('/data')) {
    return getTooltipContent('data', action);
  }
  if (pathname.includes('/models')) {
    return getTooltipContent('models', action);
  }
  if (pathname.includes('/billing')) {
    return getTooltipContent('billing', action);
  }
  if (pathname.includes('/security') || pathname.includes('/iam')) {
    return getTooltipContent('security', action);
  }

  return getTooltipContent('common', action);
}
