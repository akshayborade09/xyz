'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Image,
  Mic,
  Layers,
  Star,
  Clock,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  BarChart3,
  Zap,
  MessageSquare,
  FileText,
  Sparkles,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ApiCatalogMockup() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>API Catalog</h1>
        <p className='text-muted-foreground mt-1'>
          Browse and discover AI APIs for your applications
        </p>
      </div>

      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='relative w-full md:w-96'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search APIs...'
            className='pl-8'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <Filter className='h-4 w-4' />
            Filters
            <ChevronDown className='h-4 w-4' />
          </Button>

          <Select defaultValue='all'>
            <SelectTrigger className='w-[160px] h-9'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              <SelectItem value='nlp'>Natural Language</SelectItem>
              <SelectItem value='vision'>Computer Vision</SelectItem>
              <SelectItem value='speech'>Speech & Audio</SelectItem>
              <SelectItem value='multimodal'>Multimodal</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue='popular'>
            <SelectTrigger className='w-[160px] h-9'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='popular'>Most Popular</SelectItem>
              <SelectItem value='newest'>Newest</SelectItem>
              <SelectItem value='name'>Name (A-Z)</SelectItem>
              <SelectItem value='price'>Price (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue='all' className='space-y-4'>
        <TabsList className='flex flex-wrap'>
          <TabsTrigger value='all'>All APIs</TabsTrigger>
          <TabsTrigger value='nlp' className='flex items-center gap-1'>
            <MessageSquare className='h-4 w-4' />
            Natural Language
          </TabsTrigger>
          <TabsTrigger value='vision' className='flex items-center gap-1'>
            <Image className='h-4 w-4' />
            Computer Vision
          </TabsTrigger>
          <TabsTrigger value='speech' className='flex items-center gap-1'>
            <Mic className='h-4 w-4' />
            Speech & Audio
          </TabsTrigger>
          <TabsTrigger value='multimodal' className='flex items-center gap-1'>
            <Layers className='h-4 w-4' />
            Multimodal
          </TabsTrigger>
          <TabsTrigger value='featured' className='flex items-center gap-1'>
            <Star className='h-4 w-4' />
            Featured
          </TabsTrigger>
          <TabsTrigger value='new' className='flex items-center gap-1'>
            <Clock className='h-4 w-4' />
            New Releases
          </TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Card>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>Text Analysis API</CardTitle>
                    <CardDescription>
                      Extract insights from text data
                    </CardDescription>
                  </div>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <FileText className='h-5 w-5 text-primary' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <Badge variant='secondary'>Natural Language</Badge>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700'
                  >
                    <CheckCircle2 className='mr-1 h-3 w-3' /> Verified
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Analyze text for sentiment, entities, keywords, and more.
                  Supports multiple languages and custom models.
                </p>
                <div className='flex items-center gap-4 mt-4'>
                  <div className='flex items-center gap-1'>
                    <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      99.8% Uptime
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Zap className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      50ms Latency
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' size='sm'>
                  Documentation
                </Button>
                <Button size='sm'>
                  Try API
                  <ArrowUpRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>
                      Image Recognition API
                    </CardTitle>
                    <CardDescription>
                      Identify objects in images
                    </CardDescription>
                  </div>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Image className='h-5 w-5 text-primary' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <Badge variant='secondary'>Computer Vision</Badge>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700'
                  >
                    <CheckCircle2 className='mr-1 h-3 w-3' /> Verified
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Detect objects, scenes, faces, and text in images. Includes
                  classification, detection, and segmentation.
                </p>
                <div className='flex items-center gap-4 mt-4'>
                  <div className='flex items-center gap-1'>
                    <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      99.9% Uptime
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Zap className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      120ms Latency
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' size='sm'>
                  Documentation
                </Button>
                <Button size='sm'>
                  Try API
                  <ArrowUpRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>
                      Speech-to-Text API
                    </CardTitle>
                    <CardDescription>
                      Convert speech to written text
                    </CardDescription>
                  </div>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Mic className='h-5 w-5 text-primary' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <Badge variant='secondary'>Speech & Audio</Badge>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700'
                  >
                    <CheckCircle2 className='mr-1 h-3 w-3' /> Verified
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Transcribe audio to text with high accuracy. Supports multiple
                  languages, speaker diarization, and custom vocabulary.
                </p>
                <div className='flex items-center gap-4 mt-4'>
                  <div className='flex items-center gap-1'>
                    <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      99.7% Uptime
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Zap className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      Real-time
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' size='sm'>
                  Documentation
                </Button>
                <Button size='sm'>
                  Try API
                  <ArrowUpRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>
                      Multimodal Generation API
                    </CardTitle>
                    <CardDescription>
                      Generate text, images, and audio
                    </CardDescription>
                  </div>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Sparkles className='h-5 w-5 text-primary' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <Badge variant='secondary'>Multimodal</Badge>
                  <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                    New
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Generate and transform content across modalities. Create
                  images from text, describe images, and more.
                </p>
                <div className='flex items-center gap-4 mt-4'>
                  <div className='flex items-center gap-1'>
                    <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      99.5% Uptime
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Zap className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      1-2s Latency
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' size='sm'>
                  Documentation
                </Button>
                <Button size='sm'>
                  Try API
                  <ArrowUpRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>Translation API</CardTitle>
                    <CardDescription>
                      Translate text between languages
                    </CardDescription>
                  </div>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <MessageSquare className='h-5 w-5 text-primary' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <Badge variant='secondary'>Natural Language</Badge>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700'
                  >
                    <CheckCircle2 className='mr-1 h-3 w-3' /> Verified
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Translate text between 100+ languages with high accuracy.
                  Supports document translation and custom terminology.
                </p>
                <div className='flex items-center gap-4 mt-4'>
                  <div className='flex items-center gap-1'>
                    <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      99.9% Uptime
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Zap className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      80ms Latency
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' size='sm'>
                  Documentation
                </Button>
                <Button size='sm'>
                  Try API
                  <ArrowUpRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>
                      Video Analysis API
                    </CardTitle>
                    <CardDescription>Analyze video content</CardDescription>
                  </div>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Image className='h-5 w-5 text-primary' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <Badge variant='secondary'>Computer Vision</Badge>
                  <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                    New
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Extract insights from video content. Detect objects, scenes,
                  actions, and generate captions.
                </p>
                <div className='flex items-center gap-4 mt-4'>
                  <div className='flex items-center gap-1'>
                    <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      99.6% Uptime
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Zap className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                      Batch processing
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' size='sm'>
                  Documentation
                </Button>
                <Button size='sm'>
                  Try API
                  <ArrowUpRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className='flex justify-center mt-8'>
            <Button variant='outline'>Load More APIs</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
