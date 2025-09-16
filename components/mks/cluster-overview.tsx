'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Globe,
  Network,
  GitBranch,
  Server,
} from 'lucide-react';
import {
  type MKSCluster,
  isK8sVersionDeprecated,
  getNextK8sVersion,
  getRegionDisplayName,
} from '@/lib/mks-data';

interface ClusterOverviewProps {
  cluster: MKSCluster;
}

export function ClusterOverview({ cluster }: ClusterOverviewProps) {
  const nextVersion = getNextK8sVersion(cluster.k8sVersion);
  const isUpgradeAvailable = nextVersion !== null;
  const isDeprecated = isK8sVersionDeprecated(cluster.k8sVersion);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
      case 'error':
        return <XCircle className='h-5 w-5 text-red-600' />;
      case 'updating':
      case 'creating':
        return <Clock className='h-5 w-5 text-blue-600' />;
      case 'deleting':
        return <AlertTriangle className='h-5 w-5 text-orange-600' />;
      default:
        return <Clock className='h-5 w-5 text-gray-600' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'updating':
      case 'creating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deleting':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Server className='h-5 w-5' />
          Cluster Overview
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Status and Basic Info */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              {getStatusIcon(cluster.status)}
              <span className='text-sm font-medium text-muted-foreground'>
                Status
              </span>
            </div>
            <Badge className={`${getStatusColor(cluster.status)} border`}>
              {cluster.status.charAt(0).toUpperCase() + cluster.status.slice(1)}
            </Badge>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <GitBranch className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium text-muted-foreground'>
                Kubernetes Version
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='font-mono'>
                {cluster.k8sVersion}
              </Badge>
              {isDeprecated && (
                <Badge variant='destructive' className='text-xs'>
                  Deprecated
                </Badge>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Globe className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium text-muted-foreground'>
                Region
              </span>
            </div>
            <Badge variant='outline' className='font-medium'>
              {getRegionDisplayName(cluster.region)}
            </Badge>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Network className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium text-muted-foreground'>
                Pod CIDR
              </span>
            </div>
            <span className='text-lg font-mono font-medium'>
              {cluster.podCIDR}
            </span>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Network className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium text-muted-foreground'>
                Service CIDR
              </span>
            </div>
            <span className='text-lg font-mono font-medium'>
              {cluster.serviceCIDR}
            </span>
          </div>
        </div>

        {/* Version Upgrade Alert */}
        {isUpgradeAvailable && (
          <Alert className='border-blue-200 bg-blue-50'>
            <ArrowUpRight className='h-4 w-4 text-blue-600' />
            <AlertDescription className='text-blue-800'>
              <strong>Action Required:</strong> Your cluster is running on an
              unsupported version. Please upgrade to version {nextVersion} — the
              nearest supported release — to ensure continued security and
              support.
            </AlertDescription>
          </Alert>
        )}

        {isDeprecated && (
          <Alert className='border-red-200 bg-red-50'>
            <AlertTriangle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>
              <strong>Unsupported Version:</strong> Your current Kubernetes
              version ({cluster.k8sVersion}) is no longer supported and will not
              receive security updates. Please upgrade to a supported version
              immediately.
            </AlertDescription>
          </Alert>
        )}

        {/* API Endpoint and Network Info */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Network className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium text-muted-foreground'>
                API Endpoint
              </span>
            </div>
            <div className='bg-muted/50 p-3 rounded-lg'>
              <code className='text-sm font-mono break-all'>
                {cluster.kubeApiEndpoint}
              </code>
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span>Public Access</span>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Globe className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium text-muted-foreground'>
                Network Configuration
              </span>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>VPC:</span>
                <span className='font-mono text-xs'>{cluster.vpcId}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Subnet:</span>
                <span className='font-mono text-xs'>
                  {cluster.subnetId || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {cluster.tags.length > 0 && (
          <div className='space-y-2'>
            <span className='text-sm font-medium text-muted-foreground'>
              Tags
            </span>
            <div className='flex flex-wrap gap-2'>
              {cluster.tags.map(tag => (
                <Badge
                  key={tag}
                  variant='secondary'
                  className='text-xs font-medium'
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
