import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Code, Sparkles } from 'lucide-react';

export default function AISaaSSDKPage() {
  return (
    <PageLayout
      title='AI SaaS SDK Documentation'
      description='Integrate ready-to-use AI services into your applications'
    >
      <div className='grid gap-6'>
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5' />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Integrate powerful AI capabilities into your applications with our
              pre-built AI services SDK. No training required.
            </p>
            <div className='bg-muted p-4 rounded-lg font-mono text-sm'>
              <div>npm install @krutrim/ai-saas-sdk</div>
              <div className='mt-2'>pip install krutrim-ai-saas</div>
            </div>
            <div className='flex gap-2'>
              <Button>
                <Download className='h-4 w-4 mr-2' />
                Download SDK
              </Button>
              <Button variant='outline'>
                <ExternalLink className='h-4 w-4 mr-2' />
                Try Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className='grid md:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Language Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Access state-of-the-art language models for text generation,
                summarization, and analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Computer Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Image recognition, object detection, and visual analysis
                capabilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Speech Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Speech-to-text, text-to-speech, and voice analysis services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Extract insights from documents, forms, and structured data.
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
              <pre>{`import { AISaaSClient } from '@krutrim/ai-saas-sdk';

const client = new AISaaSClient({
  apiKey: 'your-api-key'
});

// Generate text with language model
const response = await client.language.generate({
  prompt: 'Write a summary of cloud computing benefits',
  maxTokens: 150
});

// Analyze image
const imageAnalysis = await client.vision.analyze({
  imageUrl: 'https://example.com/image.jpg',
  features: ['objects', 'text', 'faces']
});

// Convert speech to text
const transcript = await client.speech.transcribe({
  audioUrl: 'https://example.com/audio.wav',
  language: 'en-US'
});

console.log('Generated text:', response.text);`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
