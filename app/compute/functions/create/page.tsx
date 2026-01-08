'use client';

import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, Maximize2, Plus, Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FunctionFormData {
  region: string;
  runtime: string;
  functionName: string;
  memory: string;
  timeout: number;
  vpcs: string[];
  handler: string;
  description: string;
}

export default function CreateFunctionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formTouched, setFormTouched] = useState(false);
  const [activeTab, setActiveTab] = useState('func-py');
  const [fontSize, setFontSize] = useState('14px');
  const [isUseTemplateModalOpen, setIsUseTemplateModalOpen] = useState(false);

  const [formData, setFormData] = useState<FunctionFormData>({
    region: '',
    runtime: '',
    functionName: '',
    memory: '256 MB',
    timeout: 15,
    vpcs: [],
    handler: '',
    description: '',
  });

  const [codeFiles, setCodeFiles] = useState({
    funcPy: `from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()
app.add_middleware(CORSMiddleware,allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class Payload(BaseModel):
    name: str = "World"


@app.get("/")
async def get_handler():
    return {"message": "Hello from FastAPI GET"}


@app.post("/")
async def post_handler(payload: Payload):
    return {"message": f"Hello, {payload.name}!"}`,
    requirementsTxt: `fastapi==0.109.0
pydantic==2.5.3
uvicorn==0.25.0`,
  });

  const [environmentVariables, setEnvironmentVariables] = useState([
    { id: '1', key: 'API_KEY', value: 'your-api-key-here', isDefault: true },
    { id: '2', key: 'DATABASE_URL', value: 'postgresql://localhost:5432/db', isDefault: false },
  ]);

  const handleInputChange = (field: keyof FunctionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormTouched(true);
  };

  const handleCodeChange = (
    file: 'funcPy' | 'requirementsTxt',
    value: string
  ) => {
    setCodeFiles(prev => ({ ...prev, [file]: value }));
  };

  const addEnvironmentVariable = () => {
    const newVar = {
      id: Date.now().toString(),
      key: '',
      value: '',
      isDefault: false,
    };
    setEnvironmentVariables(prev => [...prev, newVar]);
  };

  const updateEnvironmentVariable = (id: string, field: 'key' | 'value', value: string) => {
    setEnvironmentVariables(prev =>
      prev.map(envVar => (envVar.id === id ? { ...envVar, [field]: value } : envVar))
    );
  };

  const deleteEnvironmentVariable = (id: string) => {
    setEnvironmentVariables(prev => prev.filter(envVar => envVar.id !== id));
  };

  const handleSubmit = async () => {
    setFormTouched(true);

    // Validate required fields
    if (
      !formData.region ||
      !formData.runtime ||
      !formData.functionName ||
      !formData.memory
    ) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Function Created',
        description: `Function "${formData.functionName}" has been created successfully.`,
      });

      // Redirect to manage function page (using existing function for prototype)
      router.push('/compute/functions/func-1');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create function. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    router.push('/compute/functions');
  };

  const regions = [
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'hyderabad', label: 'Hyderabad' },
  ];

  const runtimes = [
    { value: 'Python 3.11', label: 'Python 3.11' },
    { value: 'Node.js 18', label: 'Node.js 18' },
    { value: 'Go 1.21', label: 'Go 1.21' },
  ];

  const memoryOptions = [
    { value: '256 MB', label: '256 MB' },
    { value: '512 MB', label: '512 MB' },
    { value: '1024 MB', label: '1024 MB' },
    { value: '2048 MB', label: '2048 MB' },
    { value: '4096 MB', label: '4096 MB' },
  ];

  const fontSizes = [
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
  ];

  return (
    <>
    <PageLayout
      title='Create Function'
      description="Configure your function's runtime, resources, and execution settings."
    >
      <div className='space-y-6'>
        {/* Section 1: Configuration Fields up to VPC */}
        <Card>
          <CardContent className='pt-6'>
            <div className='space-y-6'>
              {/* Select Region */}
              <div className='space-y-2'>
                <Label htmlFor='region'>
                  Select region: <span className='text-red-500'>*</span>
                </Label>
                <Select
                  value={formData.region}
                  onValueChange={value => handleInputChange('region', value)}
                >
                  <SelectTrigger
                    className={
                      formTouched && !formData.region
                        ? 'border-red-300 bg-red-50'
                        : ''
                    }
                  >
                    <SelectValue placeholder='Select region' />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(r => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select Runtime and Other Configurations Header */}
              <div className='space-y-4'>
                <div>
                  <Label className='text-base font-medium'>
                    Select runtime and other configurations:
                  </Label>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Configure your function's runtime environment, resource
                    allocation, and network settings.
                  </p>
                </div>

                {/* Runtime and Function Name Row */}
                <div className='grid grid-cols-2 gap-4 items-start'>
                  <div className='space-y-2'>
                    <Label htmlFor='runtime'>
                      Runtime <span className='text-red-500'>*</span>
                    </Label>
                    <Select
                      value={formData.runtime}
                      onValueChange={value => handleInputChange('runtime', value)}
                    >
                      <SelectTrigger
                        className={
                          formTouched && !formData.runtime
                            ? 'border-red-300 bg-red-50'
                            : ''
                        }
                      >
                        <SelectValue placeholder='Select runtime' />
                      </SelectTrigger>
                      <SelectContent>
                        {runtimes.map(r => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='functionName'>
                      Function Name <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='functionName'
                      value={formData.functionName}
                      onChange={e =>
                        handleInputChange('functionName', e.target.value)
                      }
                      placeholder='function-81174'
                      className={
                        formTouched && !formData.functionName
                          ? 'border-red-300 bg-red-50'
                          : ''
                      }
                    />
                  </div>
                </div>

                {/* Memory and Timeout Row */}
                <div className='grid grid-cols-2 gap-4 items-start'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Label htmlFor='memory'>
                        Memory (MB) <span className='text-red-500'>*</span>
                      </Label>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                          </TooltipTrigger>
                          <TooltipContent side='right' className='max-w-sm'>
                            <p className='text-sm'>
                              The Memory setting determines the amount of memory available for your function during invocation. vCPUs and ephemeral storage are allocated in proportion to the amount of memory configured. To increase the memory, CPU power and ephemeral storage allocated to your function, select a higher memory configuration.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select
                      value={formData.memory}
                      onValueChange={value => handleInputChange('memory', value)}
                    >
                      <SelectTrigger
                        className={
                          formTouched && !formData.memory
                            ? 'border-red-300 bg-red-50'
                            : ''
                        }
                      >
                        <SelectValue placeholder='Select memory' />
                      </SelectTrigger>
                      <SelectContent>
                        {memoryOptions.map(m => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className='text-xs text-muted-foreground'>
                      Amount of memory allocated to your function
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='timeout'>
                      Timeout (sec) <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='timeout'
                      type='number'
                      value={formData.timeout}
                      onChange={e =>
                        handleInputChange('timeout', parseInt(e.target.value))
                      }
                      placeholder='15'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Maximum execution time (1-900 seconds)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Code Editor with Tabs */}
        <Card>
          <CardContent className='p-0'>
            <div className='border-b px-6 py-4 bg-muted/30'>
              <p className='text-sm text-muted-foreground'>
                Add your code in the code editor or customize your function's
                configuration from the{' '}
                <span className='font-semibold text-foreground'>
                  Function Configuration
                </span>{' '}
                tab after creation.
              </p>
            </div>

            <div>
              <div className='flex items-end justify-between pr-4 py-3 border-b'>
                <div className='px-2'>
                  <VercelTabs
                    tabs={[
                      { id: 'func-py', label: 'func.py' },
                      { id: 'requirements', label: 'requirements.txt' },
                      { id: 'config', label: 'Function Configuration' },
                    ]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    size='md'
                  />
                </div>

                <div className='flex items-center gap-2 self-center'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsUseTemplateModalOpen(true)}
                    className='bg-black text-white hover:bg-black/90 hover:text-white border-black'
                  >
                    Use Template
                  </Button>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className='w-24 h-9 text-xs rounded-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map(fs => (
                        <SelectItem key={fs.value} value={fs.value}>
                          {fs.label}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <Maximize2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              {activeTab === 'func-py' && (
                <Textarea
                  value={codeFiles.funcPy}
                  onChange={e => handleCodeChange('funcPy', e.target.value)}
                  className='min-h-[400px] font-mono rounded-none border-0 resize-none focus-visible:ring-0 bg-[#1e1e1e] text-white p-4'
                  style={{ fontSize }}
                />
              )}

              {activeTab === 'requirements' && (
                <Textarea
                  value={codeFiles.requirementsTxt}
                  onChange={e =>
                    handleCodeChange('requirementsTxt', e.target.value)
                  }
                  className='min-h-[400px] font-mono rounded-none border-0 resize-none focus-visible:ring-0 bg-[#1e1e1e] text-white p-4'
                  style={{ fontSize }}
                />
              )}

              {activeTab === 'config' && (
                <div className='p-6'>
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold'>Function Configuration</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Configure your function's runtime settings and environment.
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>Environment Variables</h4>
                      <p className='text-sm text-muted-foreground mb-4'>
                        Add environment variables that your function can access at runtime
                      </p>
                    </div>

                    <div className='space-y-3'>
                      {environmentVariables.map((envVar, index) => (
                        <div key={envVar.id} className='grid grid-cols-[1fr_1fr_auto] gap-4 items-center'>
                          <Input
                            value={envVar.key}
                            onChange={e =>
                              updateEnvironmentVariable(envVar.id, 'key', e.target.value)
                            }
                            placeholder='Key'
                            className='font-mono'
                            disabled={envVar.isDefault}
                          />
                          <Input
                            value={envVar.value}
                            onChange={e =>
                              updateEnvironmentVariable(envVar.id, 'value', e.target.value)
                            }
                            placeholder='Value'
                            className='font-mono'
                          />
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => deleteEnvironmentVariable(envVar.id)}
                            disabled={envVar.isDefault}
                            className='h-10 w-10'
                          >
                            <Trash2 className='h-4 w-4 text-destructive' />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant='outline'
                      onClick={addEnvironmentVariable}
                      className='w-auto'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Variable
                    </Button>
                  </div>
                </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex items-center justify-end gap-3 pb-6'>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Function</Button>
        </div>
      </div>
    </PageLayout>

      {/* Use Template Modal */}
      <Dialog open={isUseTemplateModalOpen} onOpenChange={setIsUseTemplateModalOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Use Template</DialogTitle>
          </DialogHeader>
          
          <div className='space-y-4 py-4'>
            <p className='text-base text-foreground'>
              Are you sure you want to apply this template?
            </p>
            
            {/* Warning Box */}
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3'>
              <AlertTriangle className='h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5' />
              <div>
                <p className='text-sm text-amber-900'>
                  <span className='font-semibold'>Warning:</span> This will replace all existing code with the template&apos;s code and your current changes won&apos;t be saved.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsUseTemplateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Apply template logic here
                toast({
                  title: 'Template Applied',
                  description: 'The template has been successfully applied to your function.',
                });
                setIsUseTemplateModalOpen(false);
              }}
              className='bg-black text-white hover:bg-black/90'
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

