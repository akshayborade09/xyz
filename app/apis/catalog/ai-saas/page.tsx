import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Code,
  Sparkles,
  MessageSquare,
  Eye,
  Mic,
  FileText,
} from 'lucide-react';

const apiEndpoints = [
  {
    category: 'Language Models',
    icon: <MessageSquare className='h-5 w-5' />,
    endpoints: [
      {
        method: 'POST',
        path: '/v1/language/generate',
        description: 'Generate text completion',
      },
      {
        method: 'POST',
        path: '/v1/language/chat',
        description: 'Chat with language model',
      },
      {
        method: 'POST',
        path: '/v1/language/summarize',
        description: 'Summarize text content',
      },
      {
        method: 'POST',
        path: '/v1/language/translate',
        description: 'Translate text',
      },
    ],
  },
  {
    category: 'Computer Vision',
    icon: <Eye className='h-5 w-5' />,
    endpoints: [
      {
        method: 'POST',
        path: '/v1/vision/analyze',
        description: 'Analyze image content',
      },
      {
        method: 'POST',
        path: '/v1/vision/detect',
        description: 'Detect objects in image',
      },
      {
        method: 'POST',
        path: '/v1/vision/ocr',
        description: 'Extract text from image',
      },
      {
        method: 'POST',
        path: '/v1/vision/classify',
        description: 'Classify image content',
      },
    ],
  },
  {
    category: 'Speech Processing',
    icon: <Mic className='h-5 w-5' />,
    endpoints: [
      {
        method: 'POST',
        path: '/v1/speech/transcribe',
        description: 'Convert speech to text',
      },
      {
        method: 'POST',
        path: '/v1/speech/synthesize',
        description: 'Convert text to speech',
      },
      {
        method: 'POST',
        path: '/v1/speech/analyze',
        description: 'Analyze speech patterns',
      },
      {
        method: 'GET',
        path: '/v1/speech/voices',
        description: 'List available voices',
      },
    ],
  },
  {
    category: 'Document Intelligence',
    icon: <FileText className='h-5 w-5' />,
    endpoints: [
      {
        method: 'POST',
        path: '/v1/documents/extract',
        description: 'Extract data from documents',
      },
      {
        method: 'POST',
        path: '/v1/documents/classify',
        description: 'Classify document type',
      },
      {
        method: 'POST',
        path: '/v1/documents/forms',
        description: 'Process form data',
      },
      {
        method: 'POST',
        path: '/v1/documents/tables',
        description: 'Extract table data',
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

export default function AISaaSAPIPage() {
  return (
    <PageLayout
      title='AI SaaS API Reference'
      description='Complete API reference for ready-to-use AI services and capabilities'
    >
      <div className='grid gap-6'>
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5' />
              API Overview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              The AI SaaS API provides instant access to powerful AI
              capabilities including language models, computer vision, speech
              processing, and document intelligence.
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
              Here's an example of how to generate text using the language model
              API:
            </p>
            <div className='bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto'>
              <pre>{`curl -X POST "https://api.krutrim.com/v1/language/generate" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Write a brief explanation of cloud computing",
    "max_tokens": 150,
    "temperature": 0.7,
    "model": "krutrim-large"
  }'

# Response
{
  "text": "Cloud computing is a technology that delivers computing services...",
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 45,
    "total_tokens": 57
  }
}`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
