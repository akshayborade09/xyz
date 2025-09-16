import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Code,
  Server,
  Database,
  Network,
  Shield,
} from 'lucide-react';

const apiEndpoints = [
  {
    category: 'Virtual Machines',
    icon: <Server className='h-5 w-5' />,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/vms',
        description: 'List all virtual machines',
      },
      {
        method: 'POST',
        path: '/v1/vms',
        description: 'Create a new virtual machine',
      },
      {
        method: 'GET',
        path: '/v1/vms/{id}',
        description: 'Get virtual machine details',
      },
      {
        method: 'PUT',
        path: '/v1/vms/{id}',
        description: 'Update virtual machine',
      },
      {
        method: 'DELETE',
        path: '/v1/vms/{id}',
        description: 'Delete virtual machine',
      },
    ],
  },
  {
    category: 'Storage',
    icon: <Database className='h-5 w-5' />,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/storage/volumes',
        description: 'List storage volumes',
      },
      {
        method: 'POST',
        path: '/v1/storage/volumes',
        description: 'Create storage volume',
      },
      {
        method: 'GET',
        path: '/v1/storage/snapshots',
        description: 'List snapshots',
      },
      {
        method: 'POST',
        path: '/v1/storage/snapshots',
        description: 'Create snapshot',
      },
    ],
  },
  {
    category: 'Networking',
    icon: <Network className='h-5 w-5' />,
    endpoints: [
      { method: 'GET', path: '/v1/networks/vpcs', description: 'List VPCs' },
      { method: 'POST', path: '/v1/networks/vpcs', description: 'Create VPC' },
      {
        method: 'GET',
        path: '/v1/networks/subnets',
        description: 'List subnets',
      },
      {
        method: 'POST',
        path: '/v1/networks/load-balancers',
        description: 'Create load balancer',
      },
    ],
  },
  {
    category: 'Security',
    icon: <Shield className='h-5 w-5' />,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/security/groups',
        description: 'List security groups',
      },
      {
        method: 'POST',
        path: '/v1/security/groups',
        description: 'Create security group',
      },
      {
        method: 'GET',
        path: '/v1/security/keys',
        description: 'List SSH keys',
      },
      { method: 'POST', path: '/v1/security/keys', description: 'Add SSH key' },
    ],
  },
];

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-blue-100 text-blue-800';
    case 'POST':
      return 'bg-green-100 text-green-800';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800';
    case 'DELETE':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function InfrastructureAPIPage() {
  return (
    <PageLayout
      title='Infrastructure API Reference'
      description='Complete API reference for managing cloud infrastructure resources'
    >
      <div className='grid gap-6'>
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Code className='h-5 w-5' />
              API Overview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              The Infrastructure API provides programmatic access to manage
              virtual machines, storage, networking, and security resources.
            </p>
            <div className='flex items-center gap-4'>
              <div className='text-sm'>
                <strong>Base URL:</strong>{' '}
                <code className='bg-muted px-2 py-1 rounded'>
                  https://api.krutrim.com
                </code>
              </div>
              <div className='text-sm'>
                <strong>Version:</strong> <Badge variant='secondary'>v1</Badge>
              </div>
            </div>
            <div className='flex gap-2'>
              <Button>
                <ExternalLink className='h-4 w-4 mr-2' />
                Try in Postman
              </Button>
              <Button variant='outline'>
                <Code className='h-4 w-4 mr-2' />
                OpenAPI Spec
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints by Category */}
        {apiEndpoints.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                {category.icon}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {category.endpoints.map((endpoint, endpointIndex) => (
                  <div
                    key={endpointIndex}
                    className='flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className='font-mono text-sm'>{endpoint.path}</code>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {endpoint.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground mb-4'>
              All API requests require authentication using an API key in the
              Authorization header.
            </p>
            <div className='bg-muted p-4 rounded-lg font-mono text-sm'>
              <div>curl -H "Authorization: Bearer YOUR_API_KEY" \</div>
              <div className='ml-4'>https://api.krutrim.com/v1/vms</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
