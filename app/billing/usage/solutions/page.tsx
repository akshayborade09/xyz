'use client';
import React, { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Filter, MoreHorizontal } from 'lucide-react';
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

const solutionsTabs = [
  { value: 'all', label: 'All Solutions' },
  { value: 'basic', label: 'Basic' },
  { value: 'docint', label: 'Document Intelligence' },
  { value: 'industrial', label: 'Industrial Solutions' },
];

const mockBasic = [
  { id: 1, name: 'Basic-AI-Service-01', status: 'Active', credits: 120 },
  { id: 2, name: 'Basic-NLP-Service-01', status: 'Active', credits: 90 },
  { id: 3, name: 'Basic-Vision-Service-01', status: 'Active', credits: 110 },
  { id: 4, name: 'Basic-Speech-Service-01', status: 'Completed', credits: 70 },
  { id: 5, name: 'Basic-Embedding-Service-01', status: 'Active', credits: 85 },
];
const mockDocInt = [
  { id: 1, name: 'Doc-Extraction-01', status: 'Active', credits: 180 },
  { id: 2, name: 'Doc-Classification-01', status: 'Active', credits: 150 },
  { id: 3, name: 'Doc-Summarization-01', status: 'Active', credits: 200 },
  { id: 4, name: 'Doc-Translation-01', status: 'Completed', credits: 120 },
  { id: 5, name: 'Doc-QA-01', status: 'Active', credits: 160 },
];
const mockIndustrial = [
  {
    id: 1,
    name: 'Manufacturing-AI-01',
    type: 'Pod',
    status: 'Active',
    credits: 450,
  },
  {
    id: 2,
    name: 'Healthcare-AI-01',
    type: 'Pod',
    status: 'Active',
    credits: 380,
  },
  { id: 3, name: 'Retail-AI-01', type: 'Pod', status: 'Active', credits: 320 },
  { id: 4, name: 'Finance-AI-01', type: 'Pod', status: 'Active', credits: 400 },
  {
    id: 5,
    name: 'Logistics-AI-01',
    type: 'Pod',
    status: 'Completed',
    credits: 280,
  },
];
const allSolutions = [...mockBasic, ...mockDocInt, ...mockIndustrial];

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce(
    (sum: number, row: { credits?: number }) => sum + (row.credits || 0),
    0
  );
}

interface SolutionsItem {
  id: number;
  name: string;
  status: string;
  credits: number;
}

export default function BillingUsageSolutionsPage() {
  // Redirect to main Usage page
  redirect('/billing/usage');
}
