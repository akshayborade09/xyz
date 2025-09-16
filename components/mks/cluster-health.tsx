'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Server,
  Network,
  Database,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { type MKSCluster } from '@/lib/mks-data';

interface ClusterHealthProps {
  cluster: MKSCluster;
}

export function ClusterHealth({ cluster }: ClusterHealthProps) {
  // Mock health data (in a real implementation, this would come from monitoring APIs)
  const healthData = {
    controlPlane: {
      status: 'healthy',
      cpu: 23,
      memory: 45,
      disk: 12,
      pods: 156,
      lastCheck: '2 minutes ago',
    },
    nodePools: cluster.nodePools.map(pool => ({
      id: pool.id,
      name: pool.name,
      status: pool.status === 'active' ? 'healthy' : pool.status,
      cpu: Math.floor(Math.random() * 60) + 20,
      memory: Math.floor(Math.random() * 70) + 15,
      disk: Math.floor(Math.random() * 40) + 5,
      nodes: pool.desiredCount,
      lastCheck: '1 minute ago',
    })),
    networking: {
      status: 'healthy',
      apiLatency: 45,
      internalLatency: 12,
      externalLatency: 78,
      lastCheck: '30 seconds ago',
    },
    storage: {
      status: 'healthy',
      totalVolumes: 24,
      usedSpace: 67,
      iops: 1250,
      lastCheck: '1 minute ago',
    },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 'error':
        return <XCircle className='h-4 w-4 text-red-600' />;
      case 'warning':
        return <AlertTriangle className='h-4 w-4 text-yellow-600' />;
      case 'updating':
      case 'creating':
        return <Clock className='h-4 w-4 text-blue-600' />;
      default:
        return <Minus className='h-4 w-4 text-gray-600' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'updating':
      case 'creating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (value: number) => {
    if (value < 50) {
      return 'bg-green-500';
    }
    if (value < 80) {
      return 'bg-yellow-500';
    }
    return 'bg-red-500';
  };

  // Mock recent events
  const recentEvents = [
    {
      id: 1,
      timestamp: '2 minutes ago',
      type: 'info',
      message: 'Cluster health check completed successfully',
      component: 'Control Plane',
    },
    {
      id: 2,
      timestamp: '5 minutes ago',
      type: 'info',
      message: 'Node pool scaling completed',
      component: 'Node Pools',
    },
    {
      id: 3,
      timestamp: '10 minutes ago',
      type: 'warning',
      message: 'High memory usage detected on worker nodes',
      component: 'Monitoring',
    },
    {
      id: 4,
      timestamp: '15 minutes ago',
      type: 'info',
      message: 'Add-on update completed',
      component: 'Add-ons',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='h-5 w-5' />
          Health & Status
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Overall Health Status */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200'>
            <CheckCircle className='h-8 w-8 text-green-600 mx-auto mb-2' />
            <div className='text-lg font-bold text-green-600'>Healthy</div>
            <div className='text-sm text-green-700'>Overall Status</div>
          </div>

          <div className='text-center p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <Server className='h-8 w-8 text-blue-600 mx-auto mb-2' />
            <div className='text-lg font-bold text-blue-600'>
              {cluster.nodeCount}
            </div>
            <div className='text-sm text-blue-700'>Active Nodes</div>
          </div>

          <div className='text-center p-4 bg-purple-50 rounded-lg border border-purple-200'>
            <Network className='h-8 w-8 text-purple-600 mx-auto mb-2' />
            <div className='text-lg font-bold text-purple-600'>45ms</div>
            <div className='text-sm text-purple-700'>API Latency</div>
          </div>

          <div className='text-center p-4 bg-orange-50 rounded-lg border border-orange-200'>
            <Database className='h-8 w-8 text-orange-600 mx-auto mb-2' />
            <div className='text-lg font-bold text-orange-600'>24</div>
            <div className='text-sm text-orange-700'>Volumes</div>
          </div>
        </div>

        {/* Component Health */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Component Health</h4>

          {/* Control Plane */}
          <div className='p-4 border rounded-lg'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <Server className='h-4 w-4 text-blue-600' />
                <span className='font-medium'>Control Plane</span>
                <Badge
                  className={`${getStatusColor(healthData.controlPlane.status)} border`}
                >
                  {healthData.controlPlane.status}
                </Badge>
              </div>
              <span className='text-xs text-muted-foreground'>
                Last check: {healthData.controlPlane.lastCheck}
              </span>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <div className='flex items-center justify-between text-sm mb-1'>
                  <span>CPU</span>
                  <span>{healthData.controlPlane.cpu}%</span>
                </div>
                <Progress value={healthData.controlPlane.cpu} className='h-2' />
              </div>
              <div>
                <div className='flex items-center justify-between text-sm mb-1'>
                  <span>Memory</span>
                  <span>{healthData.controlPlane.memory}%</span>
                </div>
                <Progress
                  value={healthData.controlPlane.memory}
                  className='h-2'
                />
              </div>
              <div>
                <div className='flex items-center justify-between text-sm mb-1'>
                  <span>Disk</span>
                  <span>{healthData.controlPlane.disk}%</span>
                </div>
                <Progress
                  value={healthData.controlPlane.disk}
                  className='h-2'
                />
              </div>
              <div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-blue-600'>
                    {healthData.controlPlane.pods}
                  </div>
                  <div className='text-xs text-muted-foreground'>Pods</div>
                </div>
              </div>
            </div>
          </div>

          {/* Node Pools Health */}
          {healthData.nodePools.map(pool => (
            <div key={pool.id} className='p-4 border rounded-lg'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span className='font-medium'>{pool.name}</span>
                  <Badge className={`${getStatusColor(pool.status)} border`}>
                    {pool.status}
                  </Badge>
                </div>
                <span className='text-xs text-muted-foreground'>
                  Last check: {pool.lastCheck}
                </span>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div>
                  <div className='flex items-center justify-between text-sm mb-1'>
                    <span>CPU</span>
                    <span>{pool.cpu}%</span>
                  </div>
                  <Progress value={pool.cpu} className='h-2' />
                </div>
                <div>
                  <div className='flex items-center justify-between text-sm mb-1'>
                    <span>Memory</span>
                    <span>{pool.memory}%</span>
                  </div>
                  <Progress value={pool.memory} className='h-2' />
                </div>
                <div>
                  <div className='flex items-center justify-between text-sm mb-1'>
                    <span>Disk</span>
                    <span>{pool.disk}%</span>
                  </div>
                  <Progress value={pool.disk} className='h-2' />
                </div>
                <div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-green-600'>
                      {pool.nodes}
                    </div>
                    <div className='text-xs text-muted-foreground'>Nodes</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Networking Health */}
          <div className='p-4 border rounded-lg'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <Network className='h-4 w-4 text-green-600' />
                <span className='font-medium'>Networking</span>
                <Badge
                  className={`${getStatusColor(healthData.networking.status)} border`}
                >
                  {healthData.networking.status}
                </Badge>
              </div>
              <span className='text-xs text-muted-foreground'>
                Last check: {healthData.networking.lastCheck}
              </span>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='text-center'>
                <div className='text-lg font-bold text-blue-600'>
                  {healthData.networking.apiLatency}ms
                </div>
                <div className='text-xs text-muted-foreground'>API Latency</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-green-600'>
                  {healthData.networking.internalLatency}ms
                </div>
                <div className='text-xs text-muted-foreground'>Internal</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-purple-600'>
                  {healthData.networking.externalLatency}ms
                </div>
                <div className='text-xs text-muted-foreground'>External</div>
              </div>
            </div>
          </div>

          {/* Storage Health */}
          <div className='p-4 border rounded-lg'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <Database className='h-4 w-4 text-orange-600' />
                <span className='font-medium'>Storage</span>
                <Badge
                  className={`${getStatusColor(healthData.storage.status)} border`}
                >
                  {healthData.storage.status}
                </Badge>
              </div>
              <span className='text-xs text-muted-foreground'>
                Last check: {healthData.storage.lastCheck}
              </span>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='text-center'>
                <div className='text-lg font-bold text-orange-600'>
                  {healthData.storage.totalVolumes}
                </div>
                <div className='text-xs text-muted-foreground'>
                  Total Volumes
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between text-sm mb-1'>
                  <span>Used Space</span>
                  <span>{healthData.storage.usedSpace}%</span>
                </div>
                <Progress
                  value={healthData.storage.usedSpace}
                  className='h-2'
                />
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-purple-600'>
                  {healthData.storage.iops.toLocaleString()}
                </div>
                <div className='text-xs text-muted-foreground'>IOPS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className='space-y-3'>
          <h4 className='font-medium'>Recent Events</h4>
          <div className='space-y-2'>
            {recentEvents.map(event => (
              <div
                key={event.id}
                className='flex items-start gap-3 p-3 bg-muted/30 rounded-lg'
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    event.type === 'info'
                      ? 'bg-blue-500'
                      : event.type === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                ></div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>{event.message}</span>
                    <span className='text-xs text-muted-foreground'>
                      {event.timestamp}
                    </span>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {event.component}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Metrics */}
        <div className='space-y-3'>
          <h4 className='font-medium'>Health Metrics</h4>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center p-3 bg-green-50 rounded-lg border border-green-200'>
              <div className='text-lg font-bold text-green-600'>99.8%</div>
              <div className='text-xs text-green-700'>Uptime</div>
            </div>
            <div className='text-center p-3 bg-blue-50 rounded-lg border border-blue-200'>
              <div className='text-lg font-bold text-blue-600'>156</div>
              <div className='text-xs text-blue-700'>Running Pods</div>
            </div>
            <div className='text-center p-3 bg-purple-50 rounded-lg border border-purple-200'>
              <div className='text-lg font-bold text-purple-600'>45ms</div>
              <div className='text-xs text-purple-700'>Avg Response</div>
            </div>
            <div className='text-center p-3 bg-orange-50 rounded-lg border border-orange-200'>
              <div className='text-lg font-bold text-orange-600'>24</div>
              <div className='text-xs text-orange-700'>Services</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
