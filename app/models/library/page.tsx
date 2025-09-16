import {
  Brain,
  Search,
  Filter,
  ChevronDown,
  Grid3X3,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ModelLibraryPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Model Library</h1>
        <p className='text-muted-foreground mt-1'>
          Browse and select from available AI models
        </p>
      </div>

      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='relative w-full md:w-96'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search models...'
            className='pl-8'
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
            </SelectContent>
          </Select>

          <div className='flex items-center border rounded-md'>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <Grid3X3 className='h-4 w-4' />
            </Button>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Model Card 1 */}
        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-start justify-between'>
              <div className='space-y-1'>
                <CardTitle className='text-lg'>Text Generation</CardTitle>
                <CardDescription>
                  General purpose text generation model
                </CardDescription>
              </div>
              <div className='rounded-full bg-primary/10 p-2'>
                <Brain className='h-5 w-5 text-primary' />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2 mb-4'>
              <Badge variant='secondary'>Natural Language</Badge>
              <Badge variant='outline'>v2.1</Badge>
            </div>
            <p className='text-sm text-muted-foreground'>
              Generate human-like text for various applications including
              content creation, chatbots, and more.
            </p>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button variant='outline' size='sm'>
              Details
            </Button>
            <Button size='sm'>Deploy</Button>
          </CardFooter>
        </Card>

        {/* Model Card 2 */}
        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-start justify-between'>
              <div className='space-y-1'>
                <CardTitle className='text-lg'>Image Classification</CardTitle>
                <CardDescription>Identify objects in images</CardDescription>
              </div>
              <div className='rounded-full bg-primary/10 p-2'>
                <Brain className='h-5 w-5 text-primary' />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2 mb-4'>
              <Badge variant='secondary'>Computer Vision</Badge>
              <Badge variant='outline'>v1.3</Badge>
            </div>
            <p className='text-sm text-muted-foreground'>
              Classify images into thousands of categories with high accuracy.
              Ideal for content moderation and tagging.
            </p>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button variant='outline' size='sm'>
              Details
            </Button>
            <Button size='sm'>Deploy</Button>
          </CardFooter>
        </Card>

        {/* Model Card 3 */}
        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-start justify-between'>
              <div className='space-y-1'>
                <CardTitle className='text-lg'>Speech Recognition</CardTitle>
                <CardDescription>Convert speech to text</CardDescription>
              </div>
              <div className='rounded-full bg-primary/10 p-2'>
                <Brain className='h-5 w-5 text-primary' />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2 mb-4'>
              <Badge variant='secondary'>Speech & Audio</Badge>
              <Badge variant='outline'>v2.0</Badge>
            </div>
            <p className='text-sm text-muted-foreground'>
              Transcribe audio to text with high accuracy. Supports multiple
              languages and speaker diarization.
            </p>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button variant='outline' size='sm'>
              Details
            </Button>
            <Button size='sm'>Deploy</Button>
          </CardFooter>
        </Card>

        {/* More model cards would go here */}
      </div>

      <div className='flex justify-center mt-4'>
        <Button variant='outline'>Load More Models</Button>
      </div>
    </div>
  );
}
