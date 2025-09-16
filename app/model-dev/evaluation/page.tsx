'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { Button } from '@/components/ui/button';
import { CreateButton } from '@/components/create-button';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { StatusBadge } from '@/components/status-badge';
import { ActionMenu } from '@/components/action-menu';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { useToast } from '@/hooks/use-toast';
import {
  filterDataForUser,
  shouldShowEmptyState,
  getEmptyStateMessage,
} from '@/lib/demo-data-filter';
import { EmptyState } from '@/components/ui/empty-state';

// Mock data for model evaluations
const mockModelEvaluations = [
  {
    id: 'eval-001',
    evaluationName: 'Image Classification Accuracy',
    model: 'ResNet-50-v2',
    task: 'Image Classification',
    dataset: 'ImageNet-1K',
    jobStatus: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    timeRemaining: '-',
  },
  {
    id: 'eval-002',
    evaluationName: 'NLP Sentiment Analysis',
    model: 'BERT-large',
    task: 'Sentiment Analysis',
    dataset: 'IMDB Reviews',
    jobStatus: 'running',
    createdAt: '2024-01-20T14:22:00Z',
    timeRemaining: '2h 15m',
  },
  {
    id: 'eval-003',
    evaluationName: 'Object Detection Test',
    model: 'YOLOv8-medium',
    task: 'Object Detection',
    dataset: 'COCO-2017',
    jobStatus: 'pending',
    createdAt: '2024-02-01T09:15:00Z',
    timeRemaining: 'Waiting',
  },
  {
    id: 'eval-004',
    evaluationName: 'Speech Recognition Eval',
    model: 'Whisper-large-v3',
    task: 'Speech Recognition',
    dataset: 'LibriSpeech-test',
    jobStatus: 'failed',
    createdAt: '2024-02-10T16:45:00Z',
    timeRemaining: '-',
  },
  {
    id: 'eval-005',
    evaluationName: 'Language Translation',
    model: 'T5-base',
    task: 'Machine Translation',
    dataset: 'WMT-2023',
    jobStatus: 'running',
    createdAt: '2024-02-15T12:30:00Z',
    timeRemaining: '45m',
  },
];

// Mock data for performance evaluations
const mockPerformanceEvaluations = [
  {
    id: 'perf-001',
    evaluationName: 'Inference Latency Test',
    model: 'ResNet-50-v2',
    jobStatus: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    timeRemaining: '-',
  },
  {
    id: 'perf-002',
    evaluationName: 'Throughput Benchmark',
    model: 'BERT-large',
    jobStatus: 'running',
    createdAt: '2024-01-20T14:22:00Z',
    timeRemaining: '1h 30m',
  },
  {
    id: 'perf-003',
    evaluationName: 'Memory Usage Analysis',
    model: 'YOLOv8-medium',
    jobStatus: 'pending',
    createdAt: '2024-02-01T09:15:00Z',
    timeRemaining: 'Waiting',
  },
  {
    id: 'perf-004',
    evaluationName: 'GPU Utilization Test',
    model: 'Whisper-large-v3',
    jobStatus: 'completed',
    createdAt: '2024-02-10T16:45:00Z',
    timeRemaining: '-',
  },
  {
    id: 'perf-005',
    evaluationName: 'Load Testing',
    model: 'T5-base',
    jobStatus: 'failed',
    createdAt: '2024-02-15T12:30:00Z',
    timeRemaining: '-',
  },
];

// Model Evaluation Table Component
function ModelEvaluationSection() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();

  // Filter data based on user type for demo
  const filteredModelEvaluations = filterDataForUser(mockModelEvaluations);
  const showEmptyState =
    shouldShowEmptyState() && filteredModelEvaluations.length === 0;

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Mock API call
      console.log('Deleting evaluation:', selectedItem?.id);
      toast({
        title: 'Evaluation Deleted',
        description: `${selectedItem?.evaluationName} has been deleted successfully.`,
      });
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete the evaluation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    toast({
      title: 'Refreshed',
      description: 'Model evaluations data has been refreshed.',
    });
  };

  const columns = [
    {
      key: 'evaluationName',
      label: 'Evaluation Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <div className='font-medium leading-5'>{value}</div>
      ),
    },
    {
      key: 'model',
      label: 'Model',
      sortable: true,
      searchable: true,
      render: (value: string) => <div className='leading-5'>{value}</div>,
    },
    {
      key: 'task',
      label: 'Task',
      sortable: true,
      render: (value: string) => <div className='leading-5'>{value}</div>,
    },
    {
      key: 'dataset',
      label: 'Dataset',
      sortable: true,
      render: (value: string) => <div className='leading-5'>{value}</div>,
    },
    {
      key: 'jobStatus',
      label: 'Job Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      sortable: true,
      render: (value: string) => (
        <div className='leading-5'>{new Date(value).toLocaleDateString()}</div>
      ),
    },
    {
      key: 'timeRemaining',
      label: 'Time Remaining',
      sortable: true,
      render: (value: string) => <div className='leading-5'>{value}</div>,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className='flex justify-end'>
          <ActionMenu
            viewHref={`/model-dev/evaluation/${row.id}`}
            editHref={`/model-dev/evaluation/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.evaluationName}
            resourceType='Evaluation'
            deleteLabel='Delete Evaluation'
          />
        </div>
      ),
    },
  ];

  // Add actions property to each evaluation row for DataTable
  const dataWithActions = filteredModelEvaluations.map(evaluation => ({
    ...evaluation,
    actions: null,
  }));

  return (
    <>
      {showEmptyState ? (
        <EmptyState {...getEmptyStateMessage('model-evaluation')} />
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={['evaluationName', 'model']}
          defaultSort={{ column: 'createdAt', direction: 'desc' }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableStatusFilter={true}
          statusOptions={[
            { value: 'all', label: 'All Evaluations' },
            { value: 'completed', label: 'Completed' },
            { value: 'running', label: 'Running' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
          ]}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        resourceName={selectedItem?.evaluationName || ''}
        resourceType='Evaluation'
      />
    </>
  );
}

// Performance Evaluation Table Component
function PerformanceEvaluationSection() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();

  // Filter data based on user type for demo
  const filteredPerformanceEvaluations = filterDataForUser(
    mockPerformanceEvaluations
  );
  const showEmptyState =
    shouldShowEmptyState() && filteredPerformanceEvaluations.length === 0;

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Mock API call
      console.log('Deleting performance evaluation:', selectedItem?.id);
      toast({
        title: 'Performance Evaluation Deleted',
        description: `${selectedItem?.evaluationName} has been deleted successfully.`,
      });
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description:
          'Failed to delete the performance evaluation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    toast({
      title: 'Refreshed',
      description: 'Performance evaluations data has been refreshed.',
    });
  };

  const columns = [
    {
      key: 'evaluationName',
      label: 'Evaluation Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <div className='font-medium leading-5'>{value}</div>
      ),
    },
    {
      key: 'model',
      label: 'Model',
      sortable: true,
      searchable: true,
      render: (value: string) => <div className='leading-5'>{value}</div>,
    },
    {
      key: 'jobStatus',
      label: 'Job Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      sortable: true,
      render: (value: string) => (
        <div className='leading-5'>{new Date(value).toLocaleDateString()}</div>
      ),
    },
    {
      key: 'timeRemaining',
      label: 'Time Remaining',
      sortable: true,
      render: (value: string) => <div className='leading-5'>{value}</div>,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className='flex justify-end'>
          <ActionMenu
            viewHref={`/model-dev/evaluation/performance/${row.id}`}
            editHref={`/model-dev/evaluation/performance/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.evaluationName}
            resourceType='Performance Evaluation'
            deleteLabel='Delete Performance Evaluation'
          />
        </div>
      ),
    },
  ];

  // Add actions property to each evaluation row for DataTable
  const dataWithActions = filteredPerformanceEvaluations.map(evaluation => ({
    ...evaluation,
    actions: null,
  }));

  return (
    <>
      {showEmptyState ? (
        <EmptyState {...getEmptyStateMessage('performance-evaluation')} />
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={['evaluationName', 'model']}
          defaultSort={{ column: 'createdAt', direction: 'desc' }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableStatusFilter={true}
          statusOptions={[
            { value: 'all', label: 'All Evaluations' },
            { value: 'completed', label: 'Completed' },
            { value: 'running', label: 'Running' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
          ]}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        resourceName={selectedItem?.evaluationName || ''}
        resourceType='Performance Evaluation'
      />
    </>
  );
}

const tabs = [
  { id: 'model', label: 'Model Evaluation' },
  { id: 'performance', label: 'Performance Evaluation' },
];

export default function ModelEvaluationPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/performance')) {
      return 'performance';
    }
    return 'model'; // default to model evaluation
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Handle tab change without URL navigation to prevent refreshes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Don't navigate - just change the local state
  };

  // Update active tab when URL changes (for direct navigation)
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [pathname]);

  // Get title and description based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case 'model':
        return {
          title: 'Model Evaluation',
          description:
            'Evaluate AI model accuracy, performance metrics, and quality across different tasks and datasets.',
        };
      case 'performance':
        return {
          title: 'Model Evaluation',
          description:
            'Assess model performance characteristics including latency, throughput, and resource utilization.',
        };
      default:
        return {
          title: 'Model Evaluation',
          description:
            'Comprehensive evaluation tools for AI model assessment.',
        };
    }
  };

  const { title, description } = getPageInfo();

  return (
    <PageLayout
      title={title}
      description={description}
      headerActions={
        <div className='flex gap-2'>
          <Button variant='outline'>Compare</Button>
          <CreateButton
            href='/model-dev/evaluation/create'
            label='New Evaluation'
          />
        </div>
      }
    >
      <div className='space-y-6'>
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size='lg'
        />

        {activeTab === 'model' && <ModelEvaluationSection />}
        {activeTab === 'performance' && <PerformanceEvaluationSection />}
      </div>
    </PageLayout>
  );
}
