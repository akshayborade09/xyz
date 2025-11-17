'use client';
import React, { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { CalendarIcon, RefreshCw, MoreHorizontal, Eye } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import type { Column } from '@/components/ui/shadcn-data-table';
import { UsageActionBar } from '@/components/billing/usage-action-bar';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActionMenu } from '@/components/action-menu';
import { redirect } from 'next/navigation';

const pieData = [
  { name: 'Compute', value: 400, color: '#6366f1' },
  { name: 'Storage', value: 300, color: '#f59e42' },
  { name: 'Networking', value: 300, color: '#10b981' },
  { name: 'AI Studio', value: 200, color: '#f43f5e' },
];

function renderCustomizedLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) {
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

interface ServiceSummaryItem {
  name: string;
  credits: number;
  details: string;
}

const serviceSummary = [
  { name: 'Compute', credits: 400, details: 'View Details' },
  { name: 'Storage', credits: 300, details: 'View Details' },
  { name: 'Networking', credits: 300, details: 'View Details' },
  { name: 'AI Studio', credits: 200, details: 'View Details' },
];

export default function BillingUsageSummaryPage() {
  // Redirect to main Usage page
  redirect('/billing/usage');
}
