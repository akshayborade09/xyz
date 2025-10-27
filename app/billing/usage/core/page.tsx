'use client';
import React, { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import { VercelTabs } from '@/components/ui/vercel-tabs';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { UsageActionBar } from '@/components/billing/usage-action-bar';
import type { DateRange } from 'react-day-picker';
import Link from 'next/link';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActionMenu } from '@/components/action-menu';
import { StatusBadge } from '@/components/status-badge';
import type { Column } from '@/components/ui/shadcn-data-table';
import { redirect } from 'next/navigation';

interface CoreInfrastructureItem {
  id: number;
  name: string;
  type: string;
  status: string;
  credits: number;
}

const coreTabs = [
  { value: 'all', label: 'All Infrastructure' },
  { value: 'compute', label: 'Compute' },
  { value: 'storage', label: 'Storage' },
  { value: 'network', label: 'Network' },
];

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

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce(
    (sum: number, row: { credits?: number }) => sum + (row.credits || 0),
    0
  );
}

export default function BillingUsageCorePage() {
  // Redirect to main Usage page
  redirect('/billing/usage');
}
