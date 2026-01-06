'use client';

import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { vpcs } from '@/lib/data';
import { HelpCircle, Play, Maximize2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

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
  const [vpcSelectorOpen, setVpcSelectorOpen] = useState(false);
  const [vpcSearchTerm, setVpcSearchTerm] = useState('');
  const vpcSelectorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('func-py');
  const [outputTab, setOutputTab] = useState('output');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [logs, setLogs] = useState('');
  const [fontSize, setFontSize] = useState('14px');

  const [formData, setFormData] = useState<FunctionFormData>({
    region: '',
    runtime: '',
    functionName: '',
    memory: '128 MB',
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

  const handleRunFunction = () => {
    setIsRunning(true);
    setOutput('');
    setLogs('');

    // Simulate function execution
    setTimeout(() => {
      setOutput('Run the function to see output here.');
      setLogs(`[2024-02-22 10:30:15] Function started
[2024-02-22 10:30:15] Loading dependencies...
[2024-02-22 10:30:16] FastAPI application initialized
[2024-02-22 10:30:16] Function ready`);
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    setFormTouched(true);

    // Validate required fields
    if (
      !formData.region ||
      !formData.runtime ||
      !formData.functionName ||
      !formData.memory ||
      formData.vpcs.length === 0
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

      router.push('/compute/functions');
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

  // Close VPC selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        vpcSelectorRef.current &&
        !vpcSelectorRef.current.contains(event.target as Node)
      ) {
        setVpcSelectorOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    { value: '128 MB', label: '128 MB' },
    { value: '256 MB', label: '256 MB' },
    { value: '512 MB', label: '512 MB' },
    { value: '1024 MB', label: '1024 MB' },
    { value: '2048 MB', label: '2048 MB' },
  ];

  const fontSizes = [
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
  ];

  const filteredVPCs = vpcs.filter(
    vpc =>
      vpc.name.toLowerCase().includes(vpcSearchTerm.toLowerCase()) ||
      vpc.id.toLowerCase().includes(vpcSearchTerm.toLowerCase())
  );

  const selectedVPCs = vpcs.filter(vpc => formData.vpcs.includes(vpc.id));

  const toggleVPC = (vpcId: string) => {
    setFormData(prev => ({
      ...prev,
      vpcs: prev.vpcs.includes(vpcId)
        ? prev.vpcs.filter(id => id !== vpcId)
        : [...prev.vpcs, vpcId]
    }));
    setFormTouched(true);
  };

  return (
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
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

                {/* VPC */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Label htmlFor='vpc'>
                      VPC <span className='text-red-500'>*</span>
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent side='right' className='max-w-sm'>
                          <p className='text-sm'>
                            Select a VPC to provide your function access to resources
                            within your virtual private cloud
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className='relative' ref={vpcSelectorRef}>
                    <button
                      type='button'
                      onClick={() => setVpcSelectorOpen(!vpcSelectorOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2 border border-input rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formTouched && formData.vpcs.length === 0
                          ? 'border-red-300 bg-red-50'
                          : 'bg-background'
                      }`}
                    >
                      <span
                        className={
                          selectedVPCs.length > 0 ? 'text-foreground' : '!text-[#64748b]'
                        }
                      >
                        {selectedVPCs.length > 0
                          ? `${selectedVPCs.length} VPC${selectedVPCs.length > 1 ? 's' : ''} selected`
                          : 'Select VPCs'}
                      </span>
                      <ChevronDown className='h-4 w-4 opacity-50' />
                    </button>
                    {vpcSelectorOpen && (
                      <div className='absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md'>
                        <div className='p-2 border-b'>
                          <div className='relative'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                              placeholder='Search VPCs...'
                              value={vpcSearchTerm}
                              onChange={e => setVpcSearchTerm(e.target.value)}
                              className='pl-8'
                            />
                          </div>
                        </div>
                        <div className='p-1 max-h-64 overflow-y-auto'>
                          {filteredVPCs.map(vpc => (
                            <div
                              key={vpc.id}
                              className='flex items-center gap-2 px-2 py-2 text-sm hover:bg-accent rounded-sm cursor-pointer'
                              onClick={() => toggleVPC(vpc.id)}
                            >
                              <Checkbox
                                checked={formData.vpcs.includes(vpc.id)}
                                onCheckedChange={() => toggleVPC(vpc.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className='flex flex-col items-start flex-1'>
                                <span className='font-medium'>{vpc.name}</span>
                                <span className='text-xs text-muted-foreground'>
                                  {vpc.id} • {vpc.region}
                                </span>
                              </div>
                            </div>
                          ))}
                          {filteredVPCs.length === 0 && vpcSearchTerm && (
                            <div className='px-2 py-2 text-sm text-muted-foreground'>
                              No VPCs found matching &quot;{vpcSearchTerm}&quot;
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
                tab after creation. You can add environment variables, attach a VPC
                or enable code signing.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
              <div className='flex items-end justify-between pl-2 pr-4 py-3 border-b'>
                <TabsList className='bg-transparent p-0 h-auto'>
                  <TabsTrigger
                    value='func-py'
                    className='data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2'
                  >
                    func.py
                  </TabsTrigger>
                  <TabsTrigger
                    value='requirements'
                    className='data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2'
                  >
                    requirements.txt
                  </TabsTrigger>
                  <TabsTrigger
                    value='config'
                    className='data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2'
                  >
                    Function Configuration
                  </TabsTrigger>
                </TabsList>

                <div className='flex items-center gap-2 self-center'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='bg-black text-white hover:bg-black/90 hover:text-white border-black'
                  >
                    Use Template
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleRunFunction}
                    disabled={isRunning}
                    className='bg-krutrim-green text-white hover:bg-krutrim-green/90 hover:text-white border-krutrim-green'
                  >
                    <Play className='h-3 w-3 mr-1' />
                    {isRunning ? 'Running...' : 'Run'}
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

              <TabsContent value='func-py' className='m-0 p-0'>
                <Textarea
                  value={codeFiles.funcPy}
                  onChange={e => handleCodeChange('funcPy', e.target.value)}
                  className='min-h-[400px] font-mono rounded-none border-0 resize-none focus-visible:ring-0 bg-[#1e1e1e] text-white p-4'
                  style={{ fontSize }}
                />
              </TabsContent>

              <TabsContent value='requirements' className='m-0 p-0'>
                <Textarea
                  value={codeFiles.requirementsTxt}
                  onChange={e =>
                    handleCodeChange('requirementsTxt', e.target.value)
                  }
                  className='min-h-[400px] font-mono rounded-none border-0 resize-none focus-visible:ring-0 bg-[#1e1e1e] text-white p-4'
                  style={{ fontSize }}
                />
              </TabsContent>

              <TabsContent value='config' className='m-0 p-6'>
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Section 3: Terminal Output and Logs */}
        <Card>
          <CardContent className='p-0'>
            <Tabs value={outputTab} onValueChange={setOutputTab} className='w-full'>
              <div className='border-b px-2 pt-2'>
                <TabsList className='bg-transparent p-0 h-auto'>
                  <TabsTrigger
                    value='output'
                    className='data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2'
                  >
                    Output
                  </TabsTrigger>
                  <TabsTrigger
                    value='logs'
                    className='data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2'
                  >
                    Logs
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value='output' className='m-0'>
                <div className='p-6'>
                  <p className='text-sm text-muted-foreground font-mono'>
                    {output || 'Run the function to see output here.'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value='logs' className='m-0'>
                <div className='p-6'>
                  <pre className='text-sm text-muted-foreground font-mono whitespace-pre-wrap'>
                    {logs || 'No logs available yet. Run the function to see logs.'}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
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
  );
}

