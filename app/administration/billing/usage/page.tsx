'use client';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChartContainer } from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { VercelTabs } from '@/components/ui/vercel-tabs';

const mockSummary = {
  totalCredits: 1234,
  change: 12.5,
  chartData: [
    { name: 'Core Infrastructure', value: 482, color: '#6366f1' },
    { name: 'Studio', value: 605, color: '#10b981' },
    { name: 'Solutions', value: 147, color: '#f59e42' },
  ],
  table: [
    {
      name: 'Core Infrastructure',
      credits: 482,
      percent: 39.1,
      change: 5.2,
    },
    { name: 'Studio', credits: 605, percent: 49.0, change: 18.7 },
    { name: 'Solutions', credits: 147, percent: 11.9, change: 8.9 },
  ],
};

const quickActions = [
  { label: 'Export Report', variant: 'outline' },
  { label: 'Add Credits', variant: 'default' },
  { label: 'Billing Support', variant: 'secondary' },
];

export default function BillingUsagePage() {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [openAccordion, setOpenAccordion] = useState(['summary']);
  const [activeTab, setActiveTab] = useState('usage-statistics');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDateSelecting, setIsDateSelecting] = useState(false);

  const tabs = [
    { id: 'credit-balance', label: 'Credit Balance' },
    { id: 'add-credits', label: 'Add Credits' },
    { id: 'usage-statistics', label: 'Usage Statistics' },
  ];

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

  const handlePresetSelect = (preset: (typeof datePresets)[0]) => {
    setDate(preset.range);
    setIsDatePickerOpen(false);
    setIsDateSelecting(false);
  };

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      setIsDateSelecting(false);
    } else if (selectedDate?.from && !selectedDate?.to) {
      setIsDateSelecting(true);
    } else {
      setIsDateSelecting(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-6'>
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          size='md'
        />
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='flex items-center gap-2 min-w-[240px] justify-start text-left font-normal'
            >
              {date?.from ? (
                date.to ? (
                  <>
                    {date.from.toLocaleDateString()} -{' '}
                    {date.to.toLocaleDateString()}
                  </>
                ) : (
                  <span className='text-blue-600'>
                    From: {date.from.toLocaleDateString()} | Select end
                  </span>
                )
              ) : (
                'Select Date Range'
              )}
              <ChevronDown className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0 flex'>
            {/* Quick Presets Sidebar */}
            <div className='w-48 p-4 border-r bg-gray-50'>
              <h4 className='font-medium text-sm mb-3 text-gray-700'>
                Quick Select
              </h4>
              <div className='space-y-2'>
                {datePresets.map(preset => (
                  <Button
                    key={preset.label}
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start h-9 text-sm text-left px-3 py-2 hover:bg-gray-100'
                    onClick={() => handlePresetSelect(preset)}
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
                    <div>Start: {date.from.toLocaleDateString()}</div>
                    {date.to ? (
                      <div>End: {date.to.toLocaleDateString()}</div>
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
                <div className='mb-3 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700'>
                  <span className='font-medium'>Start:</span>{' '}
                  {date.from.toLocaleDateString()}
                  <br />
                  <span className='text-gray-600'>Now select an end date</span>
                </div>
              )}

              <Calendar
                mode='range'
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
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
      </div>

      {activeTab === 'usage-statistics' && (
        <div>
          <Accordion
            type='multiple'
            value={openAccordion}
            onValueChange={setOpenAccordion}
            className='mb-6'
          >
            <AccordionItem value='summary'>
              <AccordionTrigger className='text-lg font-semibold bg-muted px-4 rounded-t-md'>
                Summary
              </AccordionTrigger>
              <AccordionContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <Card className='col-span-1 flex flex-col justify-between'>
                    <CardHeader>
                      <CardTitle>Total Credits Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='text-4xl font-bold mb-2'>
                        {mockSummary.totalCredits.toLocaleString()}
                      </div>
                      <div className='text-green-600 font-medium mb-4'>
                        +{mockSummary.change}% vs previous period
                      </div>
                      {/* Placeholder for line chart */}
                      <div className='h-24 bg-muted rounded flex items-center justify-center text-muted-foreground'>
                        Usage trend chart
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='col-span-1 flex flex-col items-center justify-center'>
                    <CardHeader>
                      <CardTitle>Credit Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width='100%' height={180}>
                        <PieChart>
                          <Pie
                            data={mockSummary.chartData}
                            dataKey='value'
                            nameKey='name'
                            cx='50%'
                            cy='50%'
                            outerRadius={60}
                            label
                          >
                            {mockSummary.chartData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card className='col-span-1'>
                    <CardHeader>
                      <CardTitle>Service Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ShadcnDataTable
                        columns={[
                          {
                            key: 'name',
                            label: 'Service Name',
                            sortable: true,
                            searchable: true,
                            render: (value: string) => (
                              <div
                                className='font-medium text-primary underline cursor-pointer text-sm'
                                onClick={() =>
                                  setOpenAccordion([
                                    value.toLowerCase().replace(/ /g, '-'),
                                  ])
                                }
                              >
                                {value}
                              </div>
                            ),
                          },
                          {
                            key: 'credits',
                            label: 'Credits Used',
                            sortable: true,
                            render: (value: number) => (
                              <div className='text-sm'>{value}</div>
                            ),
                          },
                          {
                            key: 'percent',
                            label: '% of Total',
                            sortable: true,
                            render: (value: number) => (
                              <div className='text-sm'>{value}%</div>
                            ),
                          },
                          {
                            key: 'change',
                            label: 'Change vs Previous',
                            sortable: true,
                            render: (value: number) => (
                              <div className='text-green-600 font-medium text-sm'>
                                +{value}%
                              </div>
                            ),
                          },
                        ]}
                        data={[
                          ...mockSummary.table,
                          {
                            name: 'Total',
                            credits: mockSummary.totalCredits,
                            percent: 100,
                            change: mockSummary.change,
                          },
                        ]}
                        pageSize={10}
                        enableSearch={false}
                        enableColumnVisibility={false}
                        enablePagination={false}
                      />
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='core-infrastructure'>
              <AccordionTrigger className='text-lg font-semibold bg-muted px-4'>
                Core Infrastructure
              </AccordionTrigger>
              <AccordionContent>
                <div className='p-4 text-muted-foreground'>
                  Detailed Core Infrastructure usage goes here.
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='studio'>
              <AccordionTrigger className='text-lg font-semibold bg-muted px-4'>
                Studio
              </AccordionTrigger>
              <AccordionContent>
                <div className='p-4 text-muted-foreground'>
                  Detailed Studio usage goes here.
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='solutions'>
              <AccordionTrigger className='text-lg font-semibold bg-muted px-4'>
                Solutions
              </AccordionTrigger>
              <AccordionContent>
                <div className='p-4 text-muted-foreground'>
                  Detailed Solutions usage goes here.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Card className='mt-6'>
            <CardContent className='flex flex-col md:flex-row items-center justify-between gap-4 p-6'>
              <div className='font-semibold text-lg mb-2 md:mb-0'>
                Quick Actions
              </div>
              <div className='flex gap-2 flex-wrap'>
                {quickActions.map(action => (
                  <Button key={action.label} variant={action.variant as any}>
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Credit Balance Tab */}
      {activeTab === 'credit-balance' && (
        <div className='p-8 text-muted-foreground'>
          Credit Balance details coming soon.
        </div>
      )}

      {/* Add Credits Tab */}
      {activeTab === 'add-credits' && (
        <div className='p-8 text-muted-foreground'>
          Add Credits functionality coming soon.
        </div>
      )}
    </div>
  );
}
