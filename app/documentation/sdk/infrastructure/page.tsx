import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Code } from 'lucide-react';

export default function InfrastructureSDKPage() {
  return (
    <PageLayout
      title='Infrastructure SDK Documentation'
      description='Complete guide to building and managing cloud infrastructure with our SDK'
    >
      <div className='grid gap-6'>
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Code className='h-5 w-5' />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Get started with the Infrastructure SDK in minutes. Install the
              SDK and start managing your cloud resources programmatically.
            </p>
            <div className='bg-muted p-4 rounded-lg font-mono text-sm'>
              <div>npm install @krutrim/infrastructure-sdk</div>
              <div className='mt-2'>pip install krutrim-infrastructure</div>
            </div>
            <div className='flex gap-2'>
              <Button>
                <Download className='h-4 w-4 mr-2' />
                Download SDK
              </Button>
              <Button variant='outline'>
                <ExternalLink className='h-4 w-4 mr-2' />
                View Examples
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className='grid md:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Virtual Machines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Create, manage, and scale virtual machines with comprehensive VM
                management APIs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Handle block storage, object storage, and backup solutions
                programmatically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Networking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Configure VPCs, subnets, security groups, and load balancers
                with ease.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoring & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Set up monitoring, metrics collection, and alerting for your
                infrastructure.
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
              <pre>{`import { InfrastructureClient } from '@krutrim/infrastructure-sdk';

const client = new InfrastructureClient({
  apiKey: 'your-api-key',
  region: 'us-west-1'
});

// Create a virtual machine
const vm = await client.virtualMachines.create({
  name: 'my-vm',
  image: 'ubuntu-20.04',
  size: 't2.micro',
  region: 'us-west-1'
});

console.log('VM created:', vm.id);`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
