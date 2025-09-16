import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Code, Brain } from 'lucide-react';

export default function AIStudioSDKPage() {
  return (
    <PageLayout
      title='AI Studio SDK Documentation'
      description='Build intelligent applications with our AI model training and deployment SDK'
    >
      <div className='grid gap-6'>
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Start building AI applications with our comprehensive machine
              learning SDK. Train, fine-tune, and deploy models at scale.
            </p>
            <div className='bg-muted p-4 rounded-lg font-mono text-sm'>
              <div>npm install @krutrim/ai-studio-sdk</div>
              <div className='mt-2'>pip install krutrim-ai-studio</div>
            </div>
            <div className='flex gap-2'>
              <Button>
                <Download className='h-4 w-4 mr-2' />
                Download SDK
              </Button>
              <Button variant='outline'>
                <ExternalLink className='h-4 w-4 mr-2' />
                View Tutorials
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className='grid md:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Model Training</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Train custom machine learning models with distributed computing
                resources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fine-tuning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Fine-tune pre-trained models for your specific use cases and
                domains.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Deploy models as scalable API endpoints with automatic scaling
                and monitoring.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experiment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Track experiments, compare model performance, and manage model
                versions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Example Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto'>
              <pre>{`import { AIStudioClient } from '@krutrim/ai-studio-sdk';

const client = new AIStudioClient({
  apiKey: 'your-api-key'
});

// Start a training job
const trainingJob = await client.training.create({
  model: 'llama-2-7b',
  dataset: 'my-dataset',
  hyperparameters: {
    learningRate: 0.0001,
    batchSize: 16
  }
});

// Deploy the trained model
const deployment = await client.deployments.create({
  modelId: trainingJob.modelId,
  name: 'my-custom-model',
  instanceType: 'gpu-large'
});

console.log('Model deployed:', deployment.endpoint);`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
