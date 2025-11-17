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
import { Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';

const studioTabs = [
  { value: 'all', label: 'All Studio' },
  { value: 'model', label: 'Model Catalog' },
  { value: 'finetune', label: 'Fine-tuning' },
  { value: 'deploy', label: 'Deployment' },
  { value: 'eval', label: 'Evaluation' },
];

const mockModelCatalog = [
  { id: 1, name: 'GPT-4-32K', status: 'Active', credits: 250 },
  { id: 2, name: 'Claude-3-Opus', status: 'Active', credits: 300 },
  { id: 3, name: 'Llama-2-70B', status: 'Active', credits: 180 },
  { id: 4, name: 'Stable-Diffusion-XL', status: 'Active', credits: 150 },
  { id: 5, name: 'BERT-Large', status: 'Completed', credits: 80 },
];

const mockFinetune = [
  { id: 1, name: 'GPT-4-Custom-01', status: 'Active', credits: 450 },
  { id: 2, name: 'Claude-3-Custom-01', status: 'Active', credits: 380 },
  { id: 3, name: 'Llama-2-Custom-01', status: 'Completed', credits: 220 },
  { id: 4, name: 'SDXL-Custom-01', status: 'Active', credits: 280 },
  { id: 5, name: 'BERT-Custom-01', status: 'Completed', credits: 150 },
];

const mockDeploy = [
  { id: 1, name: 'GPT-4-API-01', status: 'Active', credits: 320 },
  { id: 2, name: 'Claude-3-API-01', status: 'Active', credits: 280 },
  { id: 3, name: 'Llama-2-API-01', status: 'Active', credits: 180 },
  { id: 4, name: 'SDXL-API-01', status: 'Active', credits: 150 },
  { id: 5, name: 'BERT-API-01', status: 'Completed', credits: 90 },
];

const mockEval = [
  { id: 1, name: 'GPT-4-Eval-01', status: 'Active', credits: 120 },
  { id: 2, name: 'Claude-3-Eval-01', status: 'Active', credits: 100 },
  { id: 3, name: 'Llama-2-Eval-01', status: 'Completed', credits: 80 },
  { id: 4, name: 'SDXL-Eval-01', status: 'Active', credits: 90 },
  { id: 5, name: 'BERT-Eval-01', status: 'Completed', credits: 60 },
];

const allStudio = [
  ...mockModelCatalog,
  ...mockFinetune,
  ...mockDeploy,
  ...mockEval,
];

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce(
    (sum: number, row: { credits?: number }) => sum + (row.credits || 0),
    0
  );
}

interface StudioItem {
  id: number;
  name: string;
  status: string;
  credits: number;
}

export default function BillingUsageStudioPage() {
  // Redirect to main Usage page
  redirect('/billing/usage');
}
