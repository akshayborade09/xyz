import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Code,
  Brain,
  Zap,
  BarChart3,
  Settings,
} from 'lucide-react';

const apiEndpoints = [
  {
    category: 'Model Training',
    icon: <Brain className='h-5 w-5' />,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/training/jobs',
        description: 'List training jobs',
      },
      {
        method: 'POST',
        path: '/v1/training/jobs',
        description: 'Start a training job',
      },
      {
        method: 'GET',
        path: '/v1/training/jobs/{id}',
        description: 'Get training job status',
      },
      {
        method: 'DELETE',
        path: '/v1/training/jobs/{id}',
        description: 'Cancel training job',
      },
    ],
  },
  {
    category: 'Model Deployment',
    icon: <Zap className='h-5 w-5' />,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/deployments',
        description: 'List model deployments',
      },
      {
        method: 'POST',
        path: '/v1/deployments',
        description: 'Deploy a model',
      },
      {
        method: 'GET',
        path: '/v1/deployments/{id}',
        description: 'Get deployment details',
      },
      {
        method: 'PUT',
        path: '/v1/deployments/{id}/scale',
        description: 'Scale deployment',
      },
      {
        method: 'DELETE',
        path: '/v1/deployments/{id}',
        description: 'Delete deployment',
      },
    ],
  },
  {
    category: 'Experiments',
    icon: <BarChart3 className='h-5 w-5' />,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/experiments',
        description: 'List experiments',
      },
      {
        method: 'POST',
        path: '/v1/experiments',
        description: 'Create experiment',
      },
      {
        method: 'GET',
        path: '/v1/experiments/{id}/metrics',
        description: 'Get experiment metrics',
      },
      {
        method: 'POST',
        path: '/v1/experiments/{id}/compare',
        description: 'Compare experiments',
      },
    ],
  },
  {
    category: 'Model Management',
    icon: <Settings className='h-5 w-5' />,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/models',
        description: 'List available models',
      },
      {
        method: 'GET',
        path: '/v1/models/{id}',
        description: 'Get model details',
      },
      {
        method: 'GET',
        path: '/v1/models/{id}/versions',
        description: 'List model versions',
      },
      {
        method: 'POST',
        path: '/v1/models/{id}/fine-tune',
        description: 'Fine-tune model',
      },
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

export default function AIStudioAPIPage() {
  return (
    <PageLayout
      title='AI Studio API Reference'
      description='Complete API reference for AI model training, deployment, and management'
    >
      <div className='grid gap-6'>
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              API Overview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              The AI Studio API enables you to train, deploy, and manage machine
              learning models at scale with comprehensive MLOps capabilities.
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

        {/* Example Request */}
        <Card>
          <CardHeader>
            <CardTitle>Example Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground mb-4'>
              Here's an example of how to start a training job using the API:
            </p>
            <div className='bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto'>
              <pre>{`curl -X POST "https://api.krutrim.com/v1/training/jobs" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-2-7b",
    "dataset": "my-dataset-id",
    "hyperparameters": {
      "learning_rate": 0.0001,
      "batch_size": 16,
      "epochs": 3
    },
    "compute": {
      "instance_type": "gpu-large",
      "instance_count": 1
    }
  }'`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
