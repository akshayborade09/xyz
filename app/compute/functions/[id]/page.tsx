'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { serverlessFunctions } from '@/lib/data';
import { Edit, Trash2, Copy, Play, Maximize2, Plus, Upload } from 'lucide-react';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Activity, AlertCircle, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export default function ManageFunctionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddTestEventModalOpen, setIsAddTestEventModalOpen] = useState(false);
  const [isUseTemplateModalOpen, setIsUseTemplateModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventJson, setNewEventJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Tabs state
  const [mainTab, setMainTab] = useState('code');
  const [codeTab, setCodeTab] = useState('func-py');
  const [testTab, setTestTab] = useState('func-py');
  const [outputTab, setOutputTab] = useState('output');
  const [testOutputTab, setTestOutputTab] = useState('test-results');
  const [fontSize, setFontSize] = useState('14px');
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [output, setOutput] = useState('');
  const [logs, setLogs] = useState('');
  const [testResults, setTestResults] = useState('');
  const [testLogs, setTestLogs] = useState('');

  // Monitor state
  const [monitorTimeRange, setMonitorTimeRange] = useState('24h');

  // Test events state
  const [testEvents, setTestEvents] = useState([
    {
      id: '1',
      name: 'API Gateway Event',
      config: `{
  "resource": "/{proxy+}",
  "path": "/test/path",
  "httpMethod": "GET",
  "headers": {},
  "queryStringParameters": {
    "param1": "value1"
  },
  "pathParameters": {
    "proxy": "test/path"
  },
  "body": null,
  "isBase64Encoded": false
}`,
    },
  ]);

  // Code files state
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

  const functionData = serverlessFunctions.find(func => func.id === id);

  // Configuration state
  const [configMemory, setConfigMemory] = useState(
    functionData?.memory || '256 MB'
  );
  const [configTimeout, setConfigTimeout] = useState(
    functionData?.timeout?.toString() || '60'
  );
  const [environmentVariables, setEnvironmentVariables] = useState([
    { id: '1', key: 'API_KEY', value: 'your-api-key-here', isDefault: true },
    { id: '2', key: 'DATABASE_URL', value: 'postgresql://localhost:5432/db', isDefault: false },
  ]);

  if (!functionData) {
    return (
      <div className='p-8 text-center text-gray-500'>Function not found</div>
    );
  }

  // Generate function URL
  const functionUrl = `https://${functionData.name}-e2e-faas-30216-dl.serverless.e2enetworks.net/`;

  // Calculate ephemeral storage based on memory (mock calculation)
  const memoryMB = parseInt(functionData.memory);
  const ephemeralStorageGB = Math.max(5, Math.floor(memoryMB / 50));

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const handleEdit = () => {
    toast({
      title: 'Edit Function',
      description: 'Function edit modal would open here',
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Function Deleted',
      description: `Function "${functionData.name}" has been deleted successfully.`,
    });

    router.push('/compute/functions');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(functionUrl);
    toast({
      title: 'URL Copied',
      description: 'Function URL copied to clipboard',
    });
  };

  const handleCodeChange = (
    file: 'funcPy' | 'requirementsTxt',
    value: string
  ) => {
    setCodeFiles(prev => ({ ...prev, [file]: value }));
  };

  const handleRunFunction = () => {
    setIsRunning(true);
    setOutput('');
    setLogs('');

    // Simulate function execution
    setTimeout(() => {
      setOutput('{"message": "Hello from FastAPI GET"}');
      setLogs(`[${new Date().toISOString()}] Function started
[${new Date().toISOString()}] Loading dependencies...
[${new Date().toISOString()}] FastAPI application initialized
[${new Date().toISOString()}] Function executed successfully
[${new Date().toISOString()}] Response: {"message": "Hello from FastAPI GET"}`);
      setIsRunning(false);
    }, 1500);
  };

  const handleDeploy = () => {
    toast({
      title: 'Function Deployed',
      description: 'Your function has been deployed successfully.',
    });
  };

  const handleTest = () => {
    setIsTesting(true);
    setTestResults('');
    setTestLogs('');

    // Simulate test execution
    setTimeout(() => {
      setTestResults('Test completed successfully');
      setTestLogs(`[${new Date().toISOString()}] Test started
[${new Date().toISOString()}] Running test event...
[${new Date().toISOString()}] Test passed
[${new Date().toISOString()}] Response: {"message": "Hello from FastAPI GET"}`);
      setIsTesting(false);
    }, 1500);
  };

  const handleAddTestEvent = () => {
    setIsAddTestEventModalOpen(true);
  };

  const handleSaveTestEvent = () => {
    if (!newEventName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter an event name',
        variant: 'destructive',
      });
      return;
    }

    if (!newEventJson.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter or upload JSON content',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Validate JSON
      JSON.parse(newEventJson);
      
      const newEvent = {
        id: Date.now().toString(),
        name: newEventName,
        config: newEventJson,
      };

      setTestEvents(prev => [...prev, newEvent]);
      setIsAddTestEventModalOpen(false);
      setNewEventName('');
      setNewEventJson('');

      toast({
        title: 'Test Event Added',
        description: `Test event "${newEventName}" has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'Please enter valid JSON format',
        variant: 'destructive',
      });
    }
  };

  const handleUploadJson = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a JSON file',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Validate JSON
        JSON.parse(content);
        setNewEventJson(content);
        toast({
          title: 'File Uploaded',
          description: 'JSON file loaded successfully',
        });
      } catch (error) {
        toast({
          title: 'Invalid JSON',
          description: 'The file does not contain valid JSON',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleRunTestEvent = (eventName: string) => {
    toast({
      title: 'Running Test Event',
      description: `Running test event: ${eventName}`,
    });
  };

  const handleDeleteTestEvent = (eventId: string) => {
    setTestEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: 'Test Event Deleted',
      description: 'Test event has been deleted successfully.',
    });
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

  const updateEnvironmentVariable = (
    id: string,
    field: 'key' | 'value',
    value: string
  ) => {
    setEnvironmentVariables(prev =>
      prev.map(envVar =>
        envVar.id === id ? { ...envVar, [field]: value } : envVar
      )
    );
  };

  const deleteEnvironmentVariable = (id: string) => {
    setEnvironmentVariables(prev => prev.filter(envVar => envVar.id !== id));
  };

  const handleSaveConfiguration = () => {
    toast({
      title: 'Configuration Saved',
      description: 'Function configuration has been updated successfully.',
    });
  };

  const fontSizes = [
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
  ];

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/compute/functions', title: 'Functions' },
    { href: `/compute/functions/${functionData.id}`, title: functionData.name },
  ];

  return (
    <>
      <PageLayout
        title='Manage Function'
        description="View and configure your function's settings, test execution, monitor performance metrics, and manage runtime configuration."
        customBreadcrumbs={customBreadcrumbs}
        hideViewDocs={true}
      >
        {/* Function Basic Information */}
        <div
          className='mb-6 group relative'
          style={{
            borderRadius: '16px',
            border: '4px solid #FFF',
            background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
            boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
            padding: '1.5rem',
          }}
        >
          {/* Overlay Edit/Delete Buttons */}
          <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleEdit}
              className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
              title='Edit'
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsDeleteModalOpen(true)}
              className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
              title='Delete'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-6'>
            {/* Row 1: Name and URL */}
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Name:
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {functionData.name}
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  URL:
                </label>
                <div className='flex items-center gap-2'>
                  <a
                    href={functionUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline font-medium truncate'
                    style={{ fontSize: '14px' }}
                  >
                    {functionUrl}
                  </a>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopyUrl}
                    className='h-6 w-6 p-0 shrink-0'
                  >
                    <Copy className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
            </div>

            {/* Row 2: Runtime and Invocation Count */}
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Runtime:
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {functionData.runtime}
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Invocation Count:
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  0
                </div>
              </div>
            </div>

            {/* Row 3: Last Modified Time and Ephemeral Storage */}
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Last Modified Time:
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {formatDate(functionData.lastUpdated)}
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Ephemeral Storage:
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {ephemeralStorageGB} GB
                </div>
              </div>
            </div>

            {/* Row 4: Execution Timeout and Memory */}
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Execution Timeout:
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {functionData.timeout || 60} seconds
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  className='text-sm font-normal text-gray-700'
                  style={{ fontSize: '13px' }}
                >
                  Memory:
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {functionData.memory}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs Section */}
        <div className='border border-border rounded-lg'>
          <div className='px-4 pt-2'>
            <VercelTabs
              tabs={[
                { id: 'code', label: 'Code' },
                { id: 'test', label: 'Test' },
                { id: 'monitor', label: 'Monitor' },
                { id: 'configuration', label: 'Configuration' },
              ]}
              activeTab={mainTab}
              onTabChange={setMainTab}
              size='lg'
            />
          </div>

          {/* Tab Content */}
          <div>
              {/* Code Tab Content */}
              {mainTab === 'code' && (
                <div className='m-0 space-y-0'>
                  {/* Code Editor Section */}
                  <div>
                    <Tabs
                      value={codeTab}
                      onValueChange={setCodeTab}
                      className='w-full'
                    >
                      <div className='flex items-center justify-between px-4 py-3 bg-white border-b'>
                        <TabsList className='bg-transparent p-0 h-auto border-0 gap-2'>
                          <TabsTrigger
                            value='func-py'
                            className='rounded-full px-4 py-1.5 text-sm font-medium transition-all bg-transparent border border-gray-300 text-gray-700 data-[state=active]:border-gray-800 data-[state=active]:text-gray-700 shadow-none'
                          >
                            func.py
                          </TabsTrigger>
                          <TabsTrigger
                            value='requirements'
                            className='rounded-full px-4 py-1.5 text-sm font-medium transition-all bg-transparent border border-gray-300 text-gray-700 data-[state=active]:border-gray-800 data-[state=active]:text-gray-700 shadow-none'
                          >
                            requirements.txt
                          </TabsTrigger>
                        </TabsList>

                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setIsUseTemplateModalOpen(true)}
                            className='bg-black text-white hover:bg-black/90 hover:text-white border-black h-9'
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
                          <Button variant='ghost' size='icon' className='h-9 w-9'>
                            <Maximize2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>

                      <TabsContent value='func-py' className='m-0 p-0'>
                        <Textarea
                          value={codeFiles.funcPy}
                          onChange={e =>
                            handleCodeChange('funcPy', e.target.value)
                          }
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
                    </Tabs>
                  </div>

                  {/* Action Buttons Section */}
                  <div className='border-t bg-gray-50 px-4 py-3 flex items-center justify-between'>
                    <Badge
                      variant='secondary'
                      className='bg-gray-200 text-gray-700 hover:bg-gray-200'
                    >
                      Changes not deployed
                    </Badge>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='default'
                        onClick={handleRunFunction}
                        disabled={isRunning}
                        className='bg-krutrim-green text-white hover:bg-krutrim-green/90 hover:text-white border-krutrim-green'
                      >
                        <Play className='h-4 w-4 mr-2' />
                        {isRunning ? 'Running...' : 'Run'}
                      </Button>
                      <Button
                        variant='default'
                        size='default'
                        onClick={handleDeploy}
                        className='bg-black text-white hover:bg-black/90'
                      >
                        Deploy
                      </Button>
                    </div>
                  </div>

                  {/* Terminal Output Section */}
                  <div className='border-t'>
                    <div className='px-2 pt-4 bg-white'>
                      <VercelTabs
                        tabs={[
                          { id: 'output', label: 'Output' },
                          { id: 'logs', label: 'Logs' },
                        ]}
                        activeTab={outputTab}
                        onTabChange={setOutputTab}
                        size='md'
                      />
                    </div>

                    {outputTab === 'output' && (
                      <div className='p-6 bg-white min-h-[200px]'>
                        <p className='text-sm text-muted-foreground font-mono'>
                          {output || 'Run the function to see output here.'}
                        </p>
                      </div>
                    )}

                    {outputTab === 'logs' && (
                      <div className='p-6 bg-white min-h-[200px]'>
                        <pre className='text-sm text-muted-foreground font-mono whitespace-pre-wrap'>
                          {logs ||
                            'No logs available yet. Run the function to see logs.'}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Test Tab Content */}
              {mainTab === 'test' && (
                <div className='m-0 space-y-0'>
                  {/* Test Code Editor Section */}
                  <div>
                    <Tabs
                      value={testTab}
                      onValueChange={setTestTab}
                      className='w-full'
                    >
                      <div className='flex items-center justify-between px-4 py-3 bg-white border-b'>
                        <TabsList className='bg-transparent p-0 h-auto border-0 gap-2'>
                          <TabsTrigger
                            value='func-py'
                            className='rounded-full px-4 py-1.5 text-sm font-medium transition-all bg-transparent border border-gray-300 text-gray-700 data-[state=active]:border-gray-800 data-[state=active]:text-gray-700 shadow-none'
                          >
                            func.py
                          </TabsTrigger>
                          <TabsTrigger
                            value='requirements'
                            className='rounded-full px-4 py-1.5 text-sm font-medium transition-all bg-transparent border border-gray-300 text-gray-700 data-[state=active]:border-gray-800 data-[state=active]:text-gray-700 shadow-none'
                          >
                            requirements.txt
                          </TabsTrigger>
                        </TabsList>

                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={handleAddTestEvent}
                            className='bg-black text-white hover:bg-black/90 hover:text-white border-black h-9'
                          >
                            Add test event
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
                          <Button variant='ghost' size='icon' className='h-9 w-9'>
                            <Maximize2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>

                      <TabsContent value='func-py' className='m-0 p-0'>
                        <Textarea
                          value={codeFiles.funcPy}
                          onChange={e =>
                            handleCodeChange('funcPy', e.target.value)
                          }
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
                    </Tabs>
                  </div>

                  {/* Test Button Section */}
                  <div className='border-t bg-gray-50 px-4 py-3 flex items-center justify-end'>
                    <Button
                      variant='default'
                      size='default'
                      onClick={handleTest}
                      disabled={isTesting}
                      className='bg-krutrim-green text-white hover:bg-krutrim-green/90'
                    >
                      {isTesting ? 'Testing...' : 'Test'}
                    </Button>
                  </div>

                  {/* Test Results Section */}
                  <div className='border-t'>
                    <div className='px-2 pt-4 bg-white'>
                      <VercelTabs
                        tabs={[
                          { id: 'test-results', label: 'Test Results' },
                          { id: 'logs', label: 'Logs' },
                          { id: 'test-events', label: 'Test Events' },
                        ]}
                        activeTab={testOutputTab}
                        onTabChange={setTestOutputTab}
                        size='md'
                      />
                    </div>

                    {testOutputTab === 'test-results' && (
                      <div className='p-6 bg-white min-h-[200px]'>
                        <p className='text-sm text-muted-foreground'>
                          {testResults || 'Run a test to see results here.'}
                        </p>
                      </div>
                    )}

                    {testOutputTab === 'logs' && (
                      <div className='p-6 bg-white min-h-[200px]'>
                        <pre className='text-sm text-muted-foreground font-mono whitespace-pre-wrap'>
                          {testLogs ||
                            'No logs available yet. Run a test to see logs.'}
                        </pre>
                      </div>
                    )}

                    {testOutputTab === 'test-events' && (
                      <div className='p-6 bg-white min-h-[200px]'>
                          <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-lg font-semibold'>
                              Saved Test Events
                            </h3>
                            <Button
                              onClick={handleAddTestEvent}
                              className='bg-black text-white hover:bg-black/90'
                            >
                              <Plus className='h-4 w-4 mr-2' />
                              Add Event
                            </Button>
                          </div>

                          {testEvents.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>
                              No test events configured yet. Click &quot;Add
                              Event&quot; to create one.
                            </p>
                          ) : (
                            <div className='space-y-4'>
                              {testEvents.map(event => (
                                <div
                                  key={event.id}
                                  className='border border-border rounded-lg p-4'
                                >
                                  <div className='flex items-center justify-between mb-3'>
                                    <h4 className='font-semibold text-base'>
                                      {event.name}
                                    </h4>
                                    <div className='flex items-center gap-2'>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() =>
                                          handleRunTestEvent(event.name)
                                        }
                                        className='h-8 w-8 text-krutrim-green hover:text-krutrim-green hover:bg-krutrim-green/10'
                                      >
                                        <Play className='h-4 w-4' />
                                      </Button>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() =>
                                          handleDeleteTestEvent(event.id)
                                        }
                                        className='h-8 w-8 text-muted-foreground hover:text-red-600'
                                      >
                                        <Trash2 className='h-4 w-4' />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className='bg-gray-50 rounded-md p-3 border border-gray-200'>
                                    <pre className='text-xs font-mono text-gray-700 whitespace-pre-wrap'>
                                      {event.config}
                                    </pre>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Monitor Tab Content */}
              {mainTab === 'monitor' && (
                <div className='m-0 p-6 space-y-6'>
                  {/* Header with Time Range Selector */}
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold'>Function Metrics</h2>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant={monitorTimeRange === '1h' ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setMonitorTimeRange('1h')}
                        className={monitorTimeRange === '1h' ? 'bg-black text-white hover:bg-black/90' : ''}
                      >
                        Last Hour
                      </Button>
                      <Button
                        variant={monitorTimeRange === '24h' ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setMonitorTimeRange('24h')}
                        className={monitorTimeRange === '24h' ? 'bg-black text-white hover:bg-black/90' : ''}
                      >
                        Last 24 Hours
                      </Button>
                      <Button
                        variant={monitorTimeRange === '7d' ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setMonitorTimeRange('7d')}
                        className={monitorTimeRange === '7d' ? 'bg-black text-white hover:bg-black/90' : ''}
                      >
                        Last 7 Days
                      </Button>
                      <Button
                        variant={monitorTimeRange === '30d' ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setMonitorTimeRange('30d')}
                        className={monitorTimeRange === '30d' ? 'bg-black text-white hover:bg-black/90' : ''}
                      >
                        Last 30 Days
                      </Button>
                    </div>
                  </div>

                  {/* Duration Chart */}
                  <Card>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-2 mb-4'>
                        <Activity className='h-5 w-5 text-muted-foreground' />
                        <h3 className='text-lg font-semibold'>Duration</h3>
                      </div>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                          chart: {
                            type: 'scatter',
                            height: 350,
                            backgroundColor: 'transparent',
                            style: {
                              fontFamily: 'inherit',
                            },
                          },
                          credits: {
                            enabled: false,
                          },
                          title: {
                            text: null,
                          },
                          subtitle: {
                            text: 'Milliseconds',
                            align: 'left',
                            style: {
                              fontSize: '14px',
                              color: '#6b7280',
                            },
                          },
                          xAxis: {
                            type: 'datetime',
                            labels: {
                              format: '{value:%H:%M}',
                              style: {
                                color: '#6b7280',
                              },
                            },
                            gridLineWidth: 1,
                            gridLineColor: '#f3f4f6',
                          },
                          yAxis: {
                            title: {
                              text: null,
                            },
                            labels: {
                              style: {
                                color: '#6b7280',
                              },
                            },
                            gridLineColor: '#f3f4f6',
                          },
                          legend: {
                            enabled: true,
                            align: 'left',
                            verticalAlign: 'bottom',
                            itemStyle: {
                              color: '#374151',
                              fontSize: '13px',
                              fontWeight: 'normal',
                            },
                          },
                          tooltip: {
                            pointFormat: '<b>{point.y:.2f} ms</b>',
                            backgroundColor: '#000000',
                            borderColor: '#000000',
                            borderRadius: 8,
                            style: {
                              color: '#ffffff',
                            },
                          },
                          plotOptions: {
                            scatter: {
                              marker: {
                                radius: 5,
                                symbol: 'circle',
                              },
                            },
                          },
                          series: [
                            {
                              name: 'Minimum [1.39]',
                              color: '#3b82f6',
                              data: [
                                [Date.now() - 7200000, 1.39],
                                [Date.now() - 6000000, 3.2],
                                [Date.now() - 3600000, 0.8],
                                [Date.now() - 1800000, 1.5],
                              ],
                            },
                            {
                              name: 'Average [7.457]',
                              color: '#f97316',
                              data: [
                                [Date.now() - 7200000, 22],
                                [Date.now() - 6000000, 24],
                                [Date.now() - 3600000, 19],
                              ],
                            },
                            {
                              name: 'Maximum [45.49]',
                              color: '#4CAF50',
                              data: [
                                [Date.now() - 7200000, 45.49],
                                [Date.now() - 6000000, 48],
                              ],
                            },
                          ],
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Invocations Chart */}
                  <Card>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-2 mb-4'>
                        <Activity className='h-5 w-5 text-muted-foreground' />
                        <h3 className='text-lg font-semibold'>Invocations</h3>
                      </div>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                          chart: {
                            type: 'column',
                            height: 350,
                            backgroundColor: 'transparent',
                            style: {
                              fontFamily: 'inherit',
                            },
                          },
                          credits: {
                            enabled: false,
                          },
                          title: {
                            text: null,
                          },
                          subtitle: {
                            text: 'Count',
                            align: 'left',
                            style: {
                              fontSize: '14px',
                              color: '#6b7280',
                            },
                          },
                          xAxis: {
                            type: 'datetime',
                            labels: {
                              format: '{value:%H:%M}',
                              style: {
                                color: '#6b7280',
                              },
                            },
                            gridLineWidth: 1,
                            gridLineColor: '#f3f4f6',
                          },
                          yAxis: {
                            title: {
                              text: null,
                            },
                            labels: {
                              style: {
                                color: '#6b7280',
                              },
                            },
                            gridLineColor: '#f3f4f6',
                          },
                          legend: {
                            enabled: true,
                            align: 'left',
                            verticalAlign: 'bottom',
                            itemStyle: {
                              color: '#374151',
                              fontSize: '13px',
                              fontWeight: 'normal',
                            },
                          },
                          tooltip: {
                            pointFormat: '<b>{point.y}</b> invocations',
                            backgroundColor: '#000000',
                            borderColor: '#000000',
                            borderRadius: 8,
                            style: {
                              color: '#ffffff',
                            },
                          },
                          plotOptions: {
                            column: {
                              borderRadius: 4,
                              pointPadding: 0.1,
                              groupPadding: 0.1,
                            },
                          },
                          series: [
                            {
                              name: 'Invocations [sum: 10]',
                              color: '#3b82f6',
                              data: [
                                [Date.now() - 7200000, 2],
                                [Date.now() - 5400000, 1],
                                [Date.now() - 3600000, 3],
                                [Date.now() - 1800000, 4],
                              ],
                            },
                          ],
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Error Count and Success Rate Chart */}
                  <Card>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-2 mb-4'>
                        <AlertCircle className='h-5 w-5 text-muted-foreground' />
                        <h3 className='text-lg font-semibold'>Error count and success rate</h3>
                      </div>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                          chart: {
                            type: 'scatter',
                            height: 350,
                            backgroundColor: 'transparent',
                            style: {
                              fontFamily: 'inherit',
                            },
                          },
                          credits: {
                            enabled: false,
                          },
                          title: {
                            text: null,
                          },
                          subtitle: {
                            text: 'Count',
                            align: 'left',
                            style: {
                              fontSize: '14px',
                              color: '#6b7280',
                            },
                          },
                          xAxis: {
                            type: 'datetime',
                            labels: {
                              format: '{value:%H:%M}',
                              style: {
                                color: '#6b7280',
                              },
                            },
                            gridLineWidth: 1,
                            gridLineColor: '#f3f4f6',
                          },
                          yAxis: [
                            {
                              // Primary Y axis (left) - Error Count
                              title: {
                                text: null,
                              },
                              labels: {
                                style: {
                                  color: '#6b7280',
                                },
                              },
                              gridLineColor: '#f3f4f6',
                              min: 0,
                              max: 1,
                            },
                            {
                              // Secondary Y axis (right) - Success Rate %
                              title: {
                                text: '%',
                                style: {
                                  color: '#6b7280',
                                },
                              },
                              labels: {
                                format: '{value}',
                                style: {
                                  color: '#6b7280',
                                },
                              },
                              opposite: true,
                              min: 0,
                              max: 100,
                              gridLineWidth: 0,
                            },
                          ],
                          legend: {
                            enabled: true,
                            align: 'left',
                            verticalAlign: 'bottom',
                            itemStyle: {
                              color: '#374151',
                              fontSize: '13px',
                              fontWeight: 'normal',
                            },
                          },
                          tooltip: {
                            shared: true,
                            backgroundColor: '#000000',
                            borderColor: '#000000',
                            borderRadius: 8,
                            style: {
                              color: '#ffffff',
                            },
                          },
                          plotOptions: {
                            scatter: {
                              marker: {
                                radius: 5,
                                symbol: 'circle',
                              },
                            },
                            line: {
                              marker: {
                                enabled: false,
                              },
                            },
                          },
                          series: [
                            {
                              name: 'Errors [max: 0]',
                              type: 'scatter',
                              color: '#ef4444',
                              data: [
                                [Date.now() - 6600000, 0.28],
                                [Date.now() - 6000000, 0.26],
                              ],
                              yAxis: 0,
                              tooltip: {
                                pointFormat: '<b>{point.y:.2f}</b> errors',
                              },
                            },
                            {
                              name: 'Success rate [min: 100%]',
                              type: 'line',
                              color: '#4CAF50',
                              dashStyle: 'Dash',
                              data: [
                                [Date.now() - 7200000, 100],
                                [Date.now() - 3600000, 100],
                                [Date.now() - 1800000, 100],
                                [Date.now(), 100],
                              ],
                              yAxis: 1,
                              tooltip: {
                                pointFormat: '<b>{point.y}%</b> success rate',
                              },
                            },
                          ],
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Metrics Cards */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Avg Response Time */}
                    <Card>
                      <CardContent className='p-6'>
                        <div className='space-y-2'>
                          <p className='text-sm text-muted-foreground'>Avg Response Time</p>
                          <p className='text-4xl font-semibold'>142ms</p>
                          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <TrendingDown className='h-4 w-4 text-red-600' />
                            <span className='text-red-600'>12%</span>
                            <span>from yesterday</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Success Rate */}
                    <Card>
                      <CardContent className='p-6'>
                        <div className='space-y-2'>
                          <p className='text-sm text-muted-foreground'>Success Rate</p>
                          <p className='text-4xl font-semibold'>99.73%</p>
                          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <TrendingUp className='h-4 w-4 text-green-600' />
                            <span className='text-green-600'>0.1%</span>
                            <span>from yesterday</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Build Logs */}
                  <div className='space-y-4'>
                    <h3 className='text-xl font-semibold'>Build Logs</h3>
                    <Card>
                      <CardContent className='p-6'>
                        <div className='min-h-[200px] flex items-center justify-center'>
                          <p className='text-sm text-muted-foreground font-mono'>
                            No build logs available.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Runtime Logs */}
                  <div className='space-y-4'>
                    <h3 className='text-xl font-semibold'>Runtime Logs</h3>
                    <Card>
                      <CardContent className='p-6'>
                        <div className='min-h-[200px] flex items-center justify-center'>
                          <p className='text-sm text-muted-foreground font-mono'>
                            No runtime logs available.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Configuration Tab Content */}
              {mainTab === 'configuration' && (
                <div className='m-0 p-6 space-y-8'>
                  {/* Header */}
                  <div>
                    <h2 className='text-xl font-semibold mb-2'>
                      Function Configuration
                    </h2>
                    <p className='text-sm text-muted-foreground'>
                      Configure your function&apos;s runtime settings and
                      environment.
                    </p>
                  </div>

                  {/* Memory and Timeout - Side by Side */}
                  <div className='grid grid-cols-[1fr_1fr_auto] gap-4'>
                    {/* Memory (MB) */}
                    <div className='space-y-2'>
                      <Label htmlFor='config-memory' className='text-base'>
                        Memory (MB)
                      </Label>
                      <Select
                        value={configMemory}
                        onValueChange={setConfigMemory}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='128 MB'>128 MB</SelectItem>
                          <SelectItem value='256 MB'>256 MB</SelectItem>
                          <SelectItem value='512 MB'>512 MB</SelectItem>
                          <SelectItem value='1024 MB'>1024 MB</SelectItem>
                          <SelectItem value='2048 MB'>2048 MB</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className='text-sm text-muted-foreground'>
                        Amount of memory allocated to your function
                      </p>
                    </div>

                    {/* Timeout (seconds) */}
                    <div className='space-y-2'>
                      <Label htmlFor='config-timeout' className='text-base'>
                        Timeout (seconds)
                      </Label>
                      <Input
                        id='config-timeout'
                        type='number'
                        value={configTimeout}
                        onChange={e => setConfigTimeout(e.target.value)}
                        className='w-full'
                        min='1'
                        max='900'
                      />
                      <p className='text-sm text-muted-foreground'>
                        Maximum execution time (1-900 seconds)
                      </p>
                    </div>

                    {/* Spacer to align with Environment Variables delete button column */}
                    <div className='w-10' />
                  </div>

                  {/* Environment Variables */}
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-base font-semibold'>
                        Environment Variables
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        Add environment variables that your function can access
                        at runtime
                      </p>
                    </div>

                    <div className='space-y-3'>
                      {environmentVariables.map(envVar => (
                        <div
                          key={envVar.id}
                          className='grid grid-cols-[1fr_1fr_auto] gap-4 items-center'
                        >
                          <Input
                            value={envVar.key}
                            onChange={e =>
                              updateEnvironmentVariable(
                                envVar.id,
                                'key',
                                e.target.value
                              )
                            }
                            placeholder=''
                            className='font-mono bg-gray-50 border-gray-200'
                          />
                          <Input
                            value={envVar.value}
                            onChange={e =>
                              updateEnvironmentVariable(
                                envVar.id,
                                'value',
                                e.target.value
                              )
                            }
                            placeholder=''
                            className='font-mono bg-white border-gray-200'
                          />
                          {!envVar.isDefault ? (
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => deleteEnvironmentVariable(envVar.id)}
                              className='h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          ) : (
                            <div className='h-10 w-10' />
                          )}
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

                  {/* Save Button */}
                  <div className='pt-4 border-t'>
                    <Button
                      onClick={handleSaveConfiguration}
                      className='bg-black text-white hover:bg-black/90'
                    >
                      Save Configuration
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </PageLayout>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Function</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the function &quot;
              {functionData.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Add Test Event Modal */}
      <Dialog
        open={isAddTestEventModalOpen}
        onOpenChange={setIsAddTestEventModalOpen}
      >
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Add Test Event</DialogTitle>
          </DialogHeader>
          <div className='space-y-6 py-4'>
            {/* Event Name */}
            <div className='space-y-2'>
              <Label htmlFor='event-name' className='text-base font-semibold'>
                Event Name
              </Label>
              <Input
                id='event-name'
                placeholder='e.g., API Gateway Event'
                value={newEventName}
                onChange={e => setNewEventName(e.target.value)}
                className='w-full'
              />
            </div>

            {/* Event JSON */}
            <div className='space-x-4'>
              <Label className='text-base font-semibold'>Event JSON</Label>
              <Button
                variant='outline'
                onClick={handleUploadJson}
                className='w-fit'
              >
                <Upload className='h-4 w-4 mr-2' />
                Upload JSON File
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                accept='.json,application/json'
                onChange={handleFileChange}
                className='hidden'
              />
            </div>

            {/* JSON Textarea */}
            <div className='space-y-2'>
              <Label
                htmlFor='event-json'
                className='text-sm font-normal text-muted-foreground'
              >
                Or paste JSON directly
              </Label>
              <Textarea
                id='event-json'
                value={newEventJson}
                onChange={e => setNewEventJson(e.target.value)}
                className='min-h-[400px] font-mono text-sm text-gray-900 placeholder:text-gray-400'
                placeholder={`{
  "resource": "/{proxy+}",
  "path": "/test/path",
  "httpMethod": "GET",
  "headers": {},
  "queryStringParameters": {
    "param1": "value1"
  },
  "pathParameters": {
    "proxy": "test/path"
  },
  "body": null,
  "isBase64Encoded": false
}`}
              />
              <p className='text-sm text-muted-foreground'>
                Paste valid JSON format for your test event
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsAddTestEventModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTestEvent} className='bg-gray-200 text-gray-800 hover:bg-gray-300'>
              Save Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

