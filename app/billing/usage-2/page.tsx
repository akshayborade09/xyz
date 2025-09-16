'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { ActionMenu } from '@/components/action-menu';
import { StatusBadge } from '@/components/status-badge';
import { UsageActionBar } from '@/components/billing/usage-action-bar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
// Removed PieChart imports as we're now using horizontal bar chart
import {
  ArrowDownTrayIcon,
  CalendarIcon,
  ChevronDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { DateRange } from 'react-day-picker';
import type { Column } from '@/components/ui/shadcn-data-table';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Data for Summary section
const pieData = [
  { name: 'Compute', value: 1291.5, color: '#6366f1' },
  { name: 'Storage', value: 3.168, color: '#f59e42' },
  { name: 'Network', value: 0.008, color: '#10b981' },
  { name: 'Model Catalogue', value: 29.805, color: '#f43f5e' },
  { name: 'Finetuning', value: 20.75, color: '#a21caf' },
  { name: 'Deployment', value: 2972.5, color: '#eab308' },
  { name: 'Evaluation', value: 14.608, color: '#0ea5e9' },
  { name: 'Bhashik', value: 17900, color: '#f87171' },
  { name: 'DIS', value: 43810, color: '#22d3ee' },
  { name: 'Industrial Solutions', value: 1051.32, color: '#a3e635' },
];

const serviceSummary = [
  { name: 'Compute', credits: 1291.5 },
  { name: 'Storage', credits: 3.168 },
  { name: 'Network', credits: 0.008 },
  { name: 'Model Catalogue', credits: 29.805 },
  { name: 'Finetuning', credits: 20.75 },
  { name: 'Deployment', credits: 2972.5 },
  { name: 'Evaluation', credits: 14.608 },
  { name: 'Bhashik', credits: 17900 },
  { name: 'DIS', credits: 43810 },
  { name: 'Industrial Solutions', credits: 1051.32 },
  { name: 'Total', credits: 67093.659 },
];

// Data for Core Infrastructure
const mockCompute = [
  {
    id: 1,
    name: 'Production-VM-01',
    type: 'VM',
    status: 'Running',
    credits: 450,
  },
  { id: 2, name: 'Staging-VM-02', type: 'VM', status: 'Running', credits: 320 },
  { id: 3, name: 'Dev-VM-03', type: 'VM', status: 'Stopped', credits: 180 },
  { id: 4, name: 'GPU-VM-01', type: 'GPU VM', status: 'Running', credits: 750 },
  {
    id: 5,
    name: 'K8s-Node-01',
    type: 'Kubernetes',
    status: 'Running',
    credits: 280,
  },
];
const mockStorage = [
  {
    id: 1,
    name: 'Prod-Volume-01',
    type: 'SSD',
    status: 'Attached',
    credits: 120,
  },
  {
    id: 2,
    name: 'Backup-Volume-01',
    type: 'HDD',
    status: 'Available',
    credits: 80,
  },
  {
    id: 3,
    name: 'Data-Volume-01',
    type: 'SSD',
    status: 'Attached',
    credits: 150,
  },
  {
    id: 4,
    name: 'Cache-Volume-01',
    type: 'NVMe',
    status: 'Attached',
    credits: 200,
  },
  {
    id: 5,
    name: 'Archive-Volume-01',
    type: 'HDD',
    status: 'Available',
    credits: 60,
  },
];
const mockNetwork = [
  { id: 1, name: 'Prod-VPC-01', type: 'VPC', status: 'Active', credits: 90 },
  {
    id: 2,
    name: 'Prod-Subnet-01',
    type: 'Subnet',
    status: 'Active',
    credits: 45,
  },
  {
    id: 3,
    name: 'Load-Balancer-01',
    type: 'Load Balancer',
    status: 'Active',
    credits: 120,
  },
  {
    id: 4,
    name: 'Security-Group-01',
    type: 'Security Group',
    status: 'Active',
    credits: 30,
  },
  { id: 5, name: 'VPN-Gateway-01', type: 'VPN', status: 'Active', credits: 75 },
];
const allInfra = [...mockCompute, ...mockStorage, ...mockNetwork];

// Data for Studio
const mockModelCatalog = [
  { id: 1, name: 'GPT-4-32K', status: 'Active', credits: 250 },
  { id: 2, name: 'Claude-3-Opus', status: 'Active', credits: 300 },
  { id: 3, name: 'Llama-2-70B', status: 'Active', credits: 180 },
  { id: 4, name: 'Stable-Diffusion-XL', status: 'Active', credits: 150 },
  { id: 5, name: 'BERT-Large', status: 'Completed', credits: 80 },
];
const mockFinetune = [
  { id: 1, name: 'Custom-GPT-Model', status: 'Training', credits: 400 },
  { id: 2, name: 'Domain-Specific-BERT', status: 'Completed', credits: 220 },
  { id: 3, name: 'Image-Classifier-V2', status: 'Failed', credits: 150 },
];
const mockDeploy = [
  { id: 1, name: 'Production-API-v1', status: 'Running', credits: 180 },
  { id: 2, name: 'Staging-Model-Deploy', status: 'Running', credits: 90 },
  { id: 3, name: 'Dev-Environment', status: 'Stopped', credits: 45 },
];
const mockEval = [
  { id: 1, name: 'Model-Performance-Test', status: 'Completed', credits: 75 },
  { id: 2, name: 'A-B-Testing-Suite', status: 'Running', credits: 120 },
  { id: 3, name: 'Accuracy-Benchmark', status: 'Pending', credits: 60 },
];
const allStudio = [
  ...mockModelCatalog,
  ...mockFinetune,
  ...mockDeploy,
  ...mockEval,
];

// Data for Solutions
const mockBasic = [
  { id: 1, name: 'Basic-AI-Service-01', status: 'Active', credits: 120 },
  { id: 2, name: 'Basic-NLP-Service-01', status: 'Active', credits: 90 },
  { id: 3, name: 'Basic-Vision-Service-01', status: 'Active', credits: 110 },
  { id: 4, name: 'Basic-Speech-Service-01', status: 'Completed', credits: 70 },
  { id: 5, name: 'Basic-Embedding-Service-01', status: 'Active', credits: 85 },
];
const mockDocInt = [
  { id: 1, name: 'Invoice-Processing-AI', status: 'Active', credits: 200 },
  { id: 2, name: 'Contract-Analysis-Tool', status: 'Active', credits: 180 },
  { id: 3, name: 'Document-Classification', status: 'Paused', credits: 90 },
];
const mockIndustrial = [
  { id: 1, name: 'Manufacturing-Optimizer', status: 'Running', credits: 350 },
  { id: 2, name: 'Supply-Chain-AI', status: 'Active', credits: 280 },
  { id: 3, name: 'Quality-Control-Vision', status: 'Active', credits: 150 },
];
const allSolutions = [...mockBasic, ...mockDocInt, ...mockIndustrial];

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce(
    (sum: number, row: { credits?: number }) => sum + (row.credits || 0),
    0
  );
}

function renderCustomizedLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill='#22223b'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      fontSize={13}
      fontWeight={600}
    >
      {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
    </text>
  );
}

const tabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'core', label: 'Core Infrastructure' },
  { id: 'studio', label: 'AI Studio' },
  { id: 'solutions', label: 'AI Solutions' },
];

// Add default date range
const defaultDateRange: DateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 days ago
  to: new Date(), // today
};

export default function UsageMetricsPage() {
  const pathname = usePathname();

  // State for main tabs
  const getActiveTabFromPath = () => {
    if (pathname.includes('/summary')) {
      return 'summary';
    }
    if (pathname.includes('/core')) {
      return 'core';
    }
    if (pathname.includes('/studio')) {
      return 'studio';
    }
    if (pathname.includes('/solutions')) {
      return 'solutions';
    }
    return 'summary';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [date, setDate] = useState<DateRange | undefined>(defaultDateRange);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResource, setModalResource] = useState<any>(null);

  // State for nested tabs
  const [coreTab, setCoreTab] = useState('compute');
  const [studioTab, setStudioTab] = useState('model');
  const [solutionsTab, setSolutionsTab] = useState('bhashik');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [pathname]);

  // Summary Section Component
  const SummarySection = () => {
    const totalAvailableCredits = 69187.32; // Updated to show desired remaining credits
    const totalUsedCredits = 67093.659;
    const remainingCredits = totalAvailableCredits - totalUsedCredits;

    // Calculate percentages for horizontal bar chart
    const barChartData = pieData
      .map(item => ({
        ...item,
        percentage: ((item.value / totalUsedCredits) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending for better visual hierarchy

    const columns: Column<any>[] = [
      {
        key: 'name',
        label: 'Service',
        sortable: true,
        searchable: true,
        render: (value: string) => (
          <div className='font-medium text-sm'>{value}</div>
        ),
      },
      {
        key: 'credits',
        label: 'Total Credits used',
        sortable: true,
        searchable: true,
        render: (value: number) => (
          <div className='text-sm'>
            ₹{value.toLocaleString(undefined, { minimumFractionDigits: 3 })}
          </div>
        ),
      },
    ];
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col lg:flex-row items-start justify-between gap-4 w-full'>
            {/* Remaining Balance Card - Matching Enter amount style */}
            <div className='flex flex-col items-center justify-center flex-shrink-0'>
              <div
                className='w-full min-w-[280px] text-center'
                style={{
                  borderRadius: '16px',
                  border: '4px solid #FFF',
                  background:
                    'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                  boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                  padding: '1.5rem',
                }}
              >
                <div className='mb-3'>
                  <div className='text-lg font-semibold text-muted-foreground'>
                    Remaining Balance
                  </div>
                </div>
                <div className='text-3xl font-bold text-black mb-2'>
                  ₹
                  {remainingCredits.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className='text-sm text-black bg-green-100 rounded-full px-3 py-1 inline-block'>
                  Available for use
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className='hidden lg:block h-80 border-l border-gray-200 mx-4' />

            {/* Horizontal Bar Chart Section */}
            <div className='flex-1 w-full'>
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-muted-foreground'>
                    Credits Distribution
                  </h3>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>
                      Total Credits Used
                    </span>
                    <span className='text-lg font-semibold text-gray-900'>
                      ₹
                      {totalUsedCredits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Highcharts Horizontal Bar Chart */}
                <div className='h-[400px] w-full'>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      chart: {
                        type: 'bar',
                        height: 400,
                        backgroundColor: 'transparent',
                        style: {
                          fontFamily: 'inherit',
                        },
                      },
                      title: {
                        text: null,
                      },
                      xAxis: {
                        categories: barChartData.map(item => item.name),
                        title: {
                          text: null,
                        },
                        labels: {
                          style: {
                            color: '#6b7280',
                            fontSize: '12px',
                          },
                        },
                        lineWidth: 0,
                        tickWidth: 0,
                      },
                      yAxis: {
                        min: 0,
                        title: {
                          text: null,
                        },
                        labels: {
                          enabled: false,
                        },
                        gridLineWidth: 0,
                      },
                      tooltip: {
                        pointFormat:
                          '<b>{point.category}</b><br/>Credits Used: <b>₹{point.y:,.2f}</b>',
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        borderRadius: 8,
                        shadow: false,
                        style: {
                          fontSize: '12px',
                          color: '#ffffff',
                        },
                      },
                      plotOptions: {
                        bar: {
                          dataLabels: {
                            enabled: true,
                            format: '₹{point.y:,.0f}',
                            style: {
                              color: '#374151',
                              fontSize: '11px',
                              fontWeight: '500',
                            },
                          },
                          borderRadius: 4,
                          pointPadding: 0.05,
                          groupPadding: 0.05,
                        },
                      },
                      legend: {
                        enabled: false,
                      },
                      credits: {
                        enabled: false,
                      },
                      series: [
                        {
                          name: 'Credits Used',
                          data: barChartData.map(item => ({
                            y: item.value,
                            color: item.color,
                            name: item.name,
                          })),
                          showInLegend: false,
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Core Infrastructure Section Component
  const CoreInfrastructureSection = () => {
    const coreTabs = [
      { id: 'compute', label: 'Compute' },
      { id: 'storage', label: 'Storage' },
      { id: 'network', label: 'Network' },
    ];

    // Data for each tab (updated to match VPC structure)
    const computeData = [
      {
        name: 'Machine1',
        type: 'GPU VM',
        flavor: 'A100-NVLINK-1x',
        time: '10 hrs 15 mins',
        rate: '₹105 per hour',
        credits: 1076.25,
      },
      {
        name: 'Machine2',
        type: 'CPU VM',
        flavor: 'CPU-2x-8GB',
        time: '10 hrs 15 mins',
        rate: '₹6.00 per hour',
        credits: 61.5,
      },
      {
        name: 'Machine3',
        type: 'AI Pods',
        flavor: 'A100-NVLINK-Tiny',
        time: '10 hrs 15 mins',
        rate: '₹15 per hour',
        credits: 153.75,
      },
    ];
    const computeTotal = 1291.5;

    const storageData = [
      {
        name: 'Test 1',
        type: 'Volume disk in Pods',
        time: '10 hrs 15mins',
        size: '10 GB',
        rate: '₹ 0.0058/GB/Hr',
        credits: 0.5945,
      },
      {
        name: 'Test 2',
        type: 'Container disk in Pods',
        time: '10 hrs 15mins',
        size: '10 GB',
        rate: '₹ 0.0058/GB/Hr',
        credits: 0.5945,
      },
      {
        name: 'Test 3',
        type: 'Object Storage',
        time: '10 hrs 15mins',
        size: '10 GB',
        rate: '₹1.61/GB/Month',
        credits: 0.2292,
      },
      {
        name: 'Test 4',
        type: 'Volumes',
        time: '10 hrs 15mins',
        size: '10 GB',
        rate: '₹5.95/GB/Month',
        credits: 0.847,
      },
      {
        name: 'Test 5',
        type: 'Snapshot',
        time: '10 hrs 15mins',
        size: '10 GB',
        rate: '₹4.25/GB/Month',
        credits: 0.605,
      },
      {
        name: 'Test 6',
        type: 'Backup',
        time: '10 hrs 15mins',
        size: '10 GB',
        rate: '₹2.09/GB/Month',
        credits: 0.2975,
      },
    ];
    const storageTotal = 3.168;

    const networkData = [
      {
        name: 'VPC_1',
        type: 'VPC',
        time: '10 hrs',
        rate: '₹0.28 /VPC/Month',
        credits: 0.004,
      },
      {
        name: '192.1.1.1',
        type: 'IP Address',
        time: '10 hrs',
        rate: '₹0.28 /IP Address/Month',
        credits: 0.004,
      },
    ];
    const networkTotal = 0.008;

    // Render table for each tab
    const renderTable = () => {
      if (coreTab === 'compute') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Machine name
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Type of service
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Flavour
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Total used time
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total credits used
                  </th>
                </tr>
              </thead>
              <tbody>
                {computeData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.name}</td>
                    <td className='px-3 py-2'>{row.type}</td>
                    <td className='px-3 py-2'>{row.flavor}</td>
                    <td className='px-3 py-2'>{row.time}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {computeTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (coreTab === 'storage') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Name
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Storage Type
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Total used time
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Average Size
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total credits used
                  </th>
                </tr>
              </thead>
              <tbody>
                {storageData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.name}</td>
                    <td className='px-3 py-2'>{row.type}</td>
                    <td className='px-3 py-2'>{row.time}</td>
                    <td className='px-3 py-2'>{row.size}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {storageTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (coreTab === 'network') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Name
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Service type
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Total used time
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total credits used
                  </th>
                </tr>
              </thead>
              <tbody>
                {networkData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.name}</td>
                    <td className='px-3 py-2'>{row.type}</td>
                    <td className='px-3 py-2'>{row.time}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {networkTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    };

    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-lg font-normal'>
            Infrastructure Costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VercelTabs
            tabs={coreTabs}
            activeTab={coreTab}
            onTabChange={setCoreTab}
            size='md'
            className='mb-4'
          />
          {renderTable()}
        </CardContent>
      </Card>
    );
  };

  // Studio Section Component
  const StudioSection = () => {
    const studioTabs = [
      { id: 'model', label: 'Model Catalogue' },
      { id: 'finetune', label: 'Fine Tuning' },
      { id: 'deploy', label: 'Deployment' },
      { id: 'eval', label: 'Evaluation' },
    ];

    // Data for each tab (updated to match VPC structure)
    const modelData = [
      {
        name: 'Phi 4 Reasoning plus',
        inputOutput: 'Input',
        unit: 'Token',
        usedUnit: '1000',
        rate: '₹5.00 per 1M token',
        credits: 0.01,
      },
      {
        name: 'Phi 4 Reasoning plus',
        inputOutput: 'Output',
        unit: 'Token',
        usedUnit: '1000000',
        rate: '₹29.00 per 1M token',
        credits: 29.0,
      },
      {
        name: 'Speecht5-TTS',
        inputOutput: 'Output',
        unit: 'Minute of output audio',
        usedUnit: '10',
        rate: '₹0.04 per minute of output audio',
        credits: 0.4,
      },
      {
        name: 'Whisper-large-v3',
        inputOutput: 'Input',
        unit: 'Minute of input audio',
        usedUnit: '10',
        rate: '₹0.04 per minute of input audio',
        credits: 0.4,
      },
    ];
    const modelTotal = 29.81;

    const finetuneData = [
      {
        jobName: 'Job 1',
        model: 'Llama-3-70B',
        unit: 'Token',
        usedUnit: '100000',
        rate: '₹207.50 per 1M Token',
        credits: 20.75,
      },
    ];
    const finetuneTotal = 20.75;

    const deployData = [
      {
        name: 'Model 1',
        flavour: 'MaaS-H100-80GB-1-Node',
        time: '10 Hrs 15 mins',
        rate: '₹290.00 per hour',
        credits: 2972.5,
      },
    ];
    const deployTotal = 2972.5;

    const evalData = [
      {
        evaluationName: 'Main',
        model: 'Llama 3.1 70B',
        inputOutput: 'Input',
        unit: 'Token',
        usedUnit: '100000',
        rate: '₹73.04 per 1 M Token',
        credits: 7.304,
      },
      {
        evaluationName: 'Main',
        model: 'Llama 3.1 70B',
        inputOutput: 'Output',
        unit: 'Token',
        usedUnit: '100000',
        rate: '₹73.04 per 1 M Token',
        credits: 7.304,
      },
    ];
    const evalTotal = 14.61;

    // Render table for each tab
    const renderTable = () => {
      if (studioTab === 'model') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Model
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Input/Output
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Unit
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Used Unit
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total Credit used
                  </th>
                </tr>
              </thead>
              <tbody>
                {modelData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.name}</td>
                    <td className='px-3 py-2'>{row.inputOutput}</td>
                    <td className='px-3 py-2'>{row.unit}</td>
                    <td className='px-3 py-2'>{row.usedUnit}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {modelTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (studioTab === 'finetune') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Job name
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Model
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Unit
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Used Unit
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total Credit used
                  </th>
                </tr>
              </thead>
              <tbody>
                {finetuneData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.jobName}</td>
                    <td className='px-3 py-2'>{row.model}</td>
                    <td className='px-3 py-2'>{row.unit}</td>
                    <td className='px-3 py-2'>{row.usedUnit}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {finetuneTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (studioTab === 'deploy') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Name
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Flavour
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Total used time
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total credits used
                  </th>
                </tr>
              </thead>
              <tbody>
                {deployData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.name}</td>
                    <td className='px-3 py-2'>{row.flavour}</td>
                    <td className='px-3 py-2'>{row.time}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {deployTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (studioTab === 'eval') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Evaluation Name
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Model
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Input/Output
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Unit
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Used Unit
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total Credit used
                  </th>
                </tr>
              </thead>
              <tbody>
                {evalData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.evaluationName}</td>
                    <td className='px-3 py-2'>{row.model}</td>
                    <td className='px-3 py-2'>{row.inputOutput}</td>
                    <td className='px-3 py-2'>{row.unit}</td>
                    <td className='px-3 py-2'>{row.usedUnit}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {evalTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    };

    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-lg font-normal'>
            Model Development Charges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VercelTabs
            tabs={studioTabs}
            activeTab={studioTab}
            onTabChange={setStudioTab}
            size='md'
            className='mb-4'
          />
          {renderTable()}
        </CardContent>
      </Card>
    );
  };

  // AI Solutions Section Component
  const SolutionsSection = () => {
    const solutionsTabs = [
      { id: 'bhashik', label: 'Bhashik' },
      { id: 'dis', label: 'DIS' },
      { id: 'industrial', label: 'Industrial Solution' },
    ];

    // Data for each tab (updated to match VPC structure)
    const bhashikData = [
      {
        service: 'Text to Speech',
        unit: 'Per 1M input character',
        unitsUsed: '10',
        rate: '₹266 Per 1M input character',
        credits: 2660.0,
      },
      {
        service: 'Text to Speech Translate',
        unit: 'Per 1M input character',
        unitsUsed: '10',
        rate: '₹1262 Per 1M input character',
        credits: 12620.0,
      },
      {
        service: 'Speech to text',
        unit: 'per hour of input audio',
        unitsUsed: '10',
        rate: '₹24 per hour of input audio',
        credits: 240.0,
      },
      {
        service: 'Speech to text long form',
        unit: 'per hour of input audio',
        unitsUsed: '10',
        rate: '₹24 per hour of input audio',
        credits: 240.0,
      },
      {
        service: 'Speech to text translate',
        unit: 'per hour of input audio',
        unitsUsed: '10',
        rate: '₹24 per hour of input audio',
        credits: 240.0,
      },
      {
        service: 'Speech to text translate long form',
        unit: 'per hour of input audio',
        unitsUsed: '10',
        rate: '₹24 per hour of input audio',
        credits: 240.0,
      },
      {
        service: 'Speech to speech translate',
        unit: 'per hour of input audio',
        unitsUsed: '10',
        rate: '₹166 per hour of input audio',
        credits: 1660.0,
      },
    ];
    const bhashikTotal = 17900.0;

    const disData = [
      {
        service: 'DocIntelligenceText Extraction- document',
        unit: 'per 1000 pages',
        unitsUsed: '10',
        rate: '₹100 per 1000 pages',
        credits: 1000.0,
      },
      {
        service: 'DocIntelligenceText extraction- OCR',
        unit: 'per 1000 pages',
        unitsUsed: '10',
        rate: '₹398 per 1000 pages',
        credits: 3980.0,
      },
      {
        service: 'DocIntelligenceExtract information- document',
        unit: 'per 1000 pages',
        unitsUsed: '10',
        rate: '₹1726 per 1000 pages',
        credits: 17260.0,
      },
      {
        service: 'DocIntelligenceExtract information- OCR',
        unit: 'per 1000 pages',
        unitsUsed: '10',
        rate: '₹1726 per 1000 pages',
        credits: 17260.0,
      },
      {
        service: 'DocIntelligenceDocument Summarisation- document',
        unit: 'per 1000 pages',
        unitsUsed: '10',
        rate: '₹166 per 1000 pages',
        credits: 1660.0,
      },
      {
        service: 'DocIntelligenceDocument Summarisation- OCR',
        unit: 'per 1000 pages',
        unitsUsed: '10',
        rate: '₹531 per 1000 pages',
        credits: 5310.0,
      },
      {
        service: 'DocIntelligencePII Masking- document',
        unit: 'per 1000 pages',
        unitsUsed: '10',
        rate: '₹232 per 1000 pages',
        credits: 2320.0,
      },
    ];
    const disTotal = 43810.0;

    const industrialData = [
      {
        notebookName: 'Test 1',
        podStorage: 'Pod',
        flavour: 'A100-NVLINK-Standard-1x',
        rate: '₹ 105 per hour',
        totalUsedUnit: '1',
        totalUsedTime: '10 hrs',
        credits: 1050.0,
      },
      {
        notebookName: 'Test 1',
        podStorage: 'Storage',
        flavour: 'Container Disk',
        rate: '₹ 0.006 Per GB Per Hour',
        totalUsedUnit: '10 GB',
        totalUsedTime: '10 hrs',
        credits: 0.6,
      },
      {
        notebookName: 'Test 1',
        podStorage: 'Storage',
        flavour: 'Volume Disk',
        rate: '₹ 0.006 Per GB Per Hour',
        totalUsedUnit: '10 GB',
        totalUsedTime: '12 hrs',
        credits: 0.72,
      },
    ];
    const industrialTotal = 1051.32;

    // Render table for each tab
    const renderTable = () => {
      if (solutionsTab === 'bhashik') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Service
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Unit
                  </th>
                  <th className='px-3 py-2 text-center text-muted-foreground font-medium'>
                    Units used
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total credits used
                  </th>
                </tr>
              </thead>
              <tbody>
                {bhashikData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.service}</td>
                    <td className='px-3 py-2'>{row.unit}</td>
                    <td className='px-3 py-2 text-center'>{row.unitsUsed}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {bhashikTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (solutionsTab === 'dis') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Service
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Unit
                  </th>
                  <th className='px-3 py-2 text-center text-muted-foreground font-medium'>
                    Units used
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total credits used
                  </th>
                </tr>
              </thead>
              <tbody>
                {disData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.service}</td>
                    <td className='px-3 py-2'>{row.unit}</td>
                    <td className='px-3 py-2 text-center'>{row.unitsUsed}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {disTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (solutionsTab === 'industrial') {
        return (
          <div className='rounded-md border mt-4'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='bg-muted'>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md'>
                    Notebook name
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Pod/Storage
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Flavour
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Rate
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Total used unit
                  </th>
                  <th className='px-3 py-2 text-left text-muted-foreground font-medium'>
                    Total used time
                  </th>
                  <th className='px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md'>
                    Total credits used
                  </th>
                </tr>
              </thead>
              <tbody>
                {industrialData.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b transition-colors hover:bg-gray-50/40'
                  >
                    <td className='px-3 py-2'>{row.notebookName}</td>
                    <td className='px-3 py-2'>{row.podStorage}</td>
                    <td className='px-3 py-2'>{row.flavour}</td>
                    <td className='px-3 py-2'>{row.rate}</td>
                    <td className='px-3 py-2'>{row.totalUsedUnit}</td>
                    <td className='px-3 py-2'>{row.totalUsedTime}</td>
                    <td className='px-3 py-2 text-right'>
                      ₹
                      {row.credits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                <tr className='font-bold'>
                  <td className='rounded-bl-md'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-3 py-2 text-right align-middle font-bold rounded-br-md'>
                    Total&nbsp;&nbsp;&nbsp;₹
                    {industrialTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    };

    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div className='flex flex-col gap-1'>
            <CardTitle className='text-lg font-normal'>
              Deployed AI Charges
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <VercelTabs
            tabs={solutionsTabs}
            activeTab={solutionsTab}
            onTabChange={setSolutionsTab}
            size='md'
            className='mb-4'
          />
          {renderTable()}
        </CardContent>
      </Card>
    );
  };

  // Header actions for billing
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDateSelecting, setIsDateSelecting] = useState(false);

  const datePresets = [
    {
      label: 'Last 7 days',
      range: {
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date(),
      },
    },
    {
      label: 'Last 30 days',
      range: {
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
      },
    },
    {
      label: 'Last 3 months',
      range: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        to: new Date(),
      },
    },
    {
      label: 'This month',
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  ];

  const handleHeaderPresetSelect = (preset: (typeof datePresets)[0]) => {
    setDate(preset.range);
    setIsDatePickerOpen(false);
    setIsDateSelecting(false);
  };

  const handleHeaderDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      setIsDateSelecting(false);
    } else if (selectedDate?.from && !selectedDate?.to) {
      setIsDateSelecting(true);
    } else {
      setIsDateSelecting(false);
    }
  };

  const headerActions = (
    <>
      <Button variant='outline'>Export</Button>
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 min-w-[260px] justify-start text-left font-normal'
          >
            <CalendarIcon className='h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                <span className='text-blue-600'>
                  From: {format(date.from, 'LLL dd, y')} | Select end
                </span>
              )
            ) : (
              'Pick a date range'
            )}
            <ChevronDownIcon className='h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0 flex' align='end'>
          {/* Quick Presets Sidebar */}
          <div className='w-48 p-3 border-r bg-gray-50'>
            <h4 className='font-medium text-sm mb-3 text-gray-700'>
              Quick Select
            </h4>
            <div className='space-y-1'>
              {datePresets.map(preset => (
                <Button
                  key={preset.label}
                  variant='ghost'
                  size='sm'
                  className='w-full justify-start h-8 text-sm'
                  onClick={() => handleHeaderPresetSelect(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Current Selection Status */}
            {date?.from && (
              <div className='mt-4 pt-3 border-t'>
                <h5 className='font-medium text-xs text-gray-600 mb-2'>
                  Current Selection
                </h5>
                <div className='text-xs text-gray-500 space-y-1'>
                  <div>Start: {format(date.from, 'MMM dd, y')}</div>
                  {date.to ? (
                    <div>End: {format(date.to, 'MMM dd, y')}</div>
                  ) : (
                    <div className='text-blue-600'>Select end date →</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Calendar Section */}
          <div className='p-3'>
            {/* Selection Progress Indicator */}
            {isDateSelecting && date?.from && (
              <div className='mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700'>
                <span className='font-medium'>Start:</span>{' '}
                {format(date.from, 'LLL dd, y')}
                <br />
                <span className='text-blue-600'>Now select an end date</span>
              </div>
            )}

            <Calendar
              initialFocus
              mode='range'
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleHeaderDateSelect}
              numberOfMonths={2}
              className='rounded-md'
              modifiers={{
                ...(date?.from && { start: date.from }),
                ...(date?.to && { end: date.to }),
              }}
              modifiersStyles={{
                start: {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 'bold',
                },
                end: {
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Link href='/billing/add-credits'>
        <Button variant='default'>Add Credits</Button>
      </Link>
    </>
  );

  return (
    <PageLayout
      title='Usage Metrics'
      description='Track resource usage and billing information'
      headerActions={headerActions}
    >
      <div className='space-y-6'>
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size='lg'
        />

        {activeTab === 'summary' && <SummarySection />}
        {activeTab === 'core' && <CoreInfrastructureSection />}
        {activeTab === 'studio' && <StudioSection />}
        {activeTab === 'solutions' && <SolutionsSection />}

        {/* Modal for resource details */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resource Details</DialogTitle>
            </DialogHeader>
            <div className='py-4'>
              {modalResource ? (
                <div className='space-y-2'>
                  <div>
                    <span className='font-semibold'>Name:</span>{' '}
                    {modalResource.name}
                  </div>
                  {modalResource.type && (
                    <div>
                      <span className='font-semibold'>Type:</span>{' '}
                      {modalResource.type}
                    </div>
                  )}
                  {modalResource.status && (
                    <div>
                      <span className='font-semibold'>Status:</span>{' '}
                      {modalResource.status}
                    </div>
                  )}
                  <div>
                    <span className='font-semibold'>Credits Used:</span>{' '}
                    {modalResource.credits}
                  </div>
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
