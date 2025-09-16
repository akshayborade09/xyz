'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  getClusterById,
  getNextK8sVersion,
  getRegionDisplayName,
} from '@/lib/mks-data';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

export default function UpgradeClusterPage() {
  const params = useParams();
  const router = useRouter();
  const clusterId = params.id as string;
  const [cluster, setCluster] = useState(getClusterById(clusterId));
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!cluster) {
    return (
      <PageShell title='Cluster Not Found'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center py-12'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Cluster not found
              </h3>
              <p className='text-sm text-gray-600 mb-6'>
                The requested cluster could not be found.
              </p>
              <Button asChild>
                <Link href='/kubernetes'>Back to Clusters</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const nextVersion = getNextK8sVersion(cluster.k8sVersion);
  const canUpgrade = nextVersion !== null;
  const isLatestVersion = cluster.k8sVersion === '1.33.0';

  const handleUpgrade = async () => {
    if (!nextVersion) {
      return;
    }

    setIsUpgrading(true);
    try {
      // Simulate upgrade process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, this would call the upgrade API
      console.log(
        `Starting upgrade of cluster ${cluster.id} to version ${nextVersion}`
      );

      // Show success message and redirect
      router.push(`/kubernetes/clusters/${cluster.id}?upgrade=started`);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <PageShell
      title={`Upgrade Cluster: ${cluster.name}`}
      description='Upgrade your Kubernetes cluster to a newer version'
      customBreadcrumbs={[
        { title: 'Kubernetes', href: '/kubernetes' },
        { title: 'Clusters', href: '/kubernetes/clusters' },
        { title: cluster.name, href: `/kubernetes/clusters/${cluster.id}` },
        {
          title: 'Upgrade',
          href: `/kubernetes/clusters/${cluster.id}/upgrade`,
        },
      ]}
    >
      <div className='space-y-6'>
        {/* Cluster Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Info className='h-5 w-5' />
              Cluster Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <div className='text-sm font-medium text-muted-foreground mb-2'>
                  Cluster Name
                </div>
                <div className='text-lg font-semibold'>{cluster.name}</div>
              </div>

              <div>
                <div className='text-sm font-medium text-muted-foreground mb-2'>
                  Region
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='font-mono'>
                    {cluster.region}
                  </Badge>
                  <span className='text-sm text-muted-foreground'>
                    {getRegionDisplayName(cluster.region)}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm font-medium text-muted-foreground mb-2'>
                  Current Kubernetes Version
                </div>
                <Badge variant='secondary' className='font-mono text-lg'>
                  v{cluster.k8sVersion}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Status */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              {canUpgrade ? (
                <CheckCircle className='h-5 w-5 text-blue-600' />
              ) : (
                <XCircle className='h-5 w-5 text-red-600' />
              )}
              {canUpgrade ? 'Upgrade Available' : 'No Upgrade Available'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* Current Version Info */}
              <div className='flex items-center justify-between p-4 bg-muted rounded-lg'>
                <span className='text-sm font-medium'>Current Version:</span>
                <Badge variant='secondary' className='font-mono text-lg'>
                  v{cluster.k8sVersion}
                </Badge>
              </div>

              {/* Upgrade Path or No Upgrade Message */}
              {canUpgrade ? (
                <div className='flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <span className='text-sm font-medium text-blue-900'>
                    Upgrade to:
                  </span>
                  <Badge
                    variant='default'
                    className='font-mono text-lg bg-blue-600'
                  >
                    v{nextVersion}
                  </Badge>
                </div>
              ) : (
                <div className='flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg'>
                  <span className='text-sm font-medium text-red-900'>
                    No upgrade available
                  </span>
                  <Badge variant='destructive' className='font-mono text-lg'>
                    Latest version
                  </Badge>
                </div>
              )}

              {/* Specific Message for Latest Version */}
              {isLatestVersion && (
                <Alert>
                  <XCircle className='h-4 w-4' />
                  <AlertDescription>
                    Unable to upgrade. Your cluster has the latest supported
                    Kubernetes version on Krutrim.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Details */}
        {canUpgrade && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* Warning */}
                <Alert>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertDescription>
                    <strong>Important:</strong> Upgrading Kubernetes version may
                    affect workloads due to API deprecations. Ensure your
                    applications are compatible before upgrading.
                  </AlertDescription>
                </Alert>

                {/* What happens during upgrade */}
                <div className='flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <Info className='h-4 w-4 text-blue-600 mt-0.5' />
                  <div className='text-sm text-blue-900'>
                    <p className='font-medium'>What happens during upgrade?</p>
                    <ul className='mt-2 space-y-1 text-blue-800'>
                      <li>• Cluster will be temporarily unavailable</li>
                      <li>• Workloads will be rescheduled</li>
                      <li>• API server will be updated</li>
                      <li>• Node pools will be upgraded sequentially</li>
                      <li>• Estimated downtime: 15-30 minutes</li>
                    </ul>
                  </div>
                </div>

                {/* Pre-upgrade checklist */}
                <div className='p-4 bg-amber-50 border border-amber-200 rounded-lg'>
                  <h4 className='font-medium text-amber-900 mb-2'>
                    Pre-upgrade Checklist
                  </h4>
                  <ul className='text-sm text-amber-800 space-y-1'>
                    <li>• Ensure all workloads are healthy</li>
                    <li>• Check application compatibility with new version</li>
                    <li>• Verify sufficient cluster resources</li>
                    <li>• Review any custom configurations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            onClick={() => router.push(`/kubernetes/clusters/${cluster.id}`)}
            className='flex items-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Cluster
          </Button>

          {canUpgrade && (
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className='bg-blue-600 hover:bg-blue-700 flex items-center gap-2'
            >
              {isUpgrading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Starting Upgrade...
                </>
              ) : (
                <>
                  <ArrowUpRight className='h-4 w-4' />
                  Start Upgrade
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
