'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

interface Tag {
  key: string;
  value: string;
}

interface ScriptsTagsSectionProps {
  sshKey: string;
  startupScript: string;
  tags: Tag[];
  onUpdateSshKey: (key: string) => void;
  onUpdateStartupScript: (script: string) => void;
  onAddTag: () => void;
  onUpdateTag: (index: number, field: 'key' | 'value', value: string) => void;
  onRemoveTag: (index: number) => void;
}

const sshKeys = [
  { value: 'key-production', label: 'production-keypair' },
  { value: 'key-development', label: 'development-keypair' },
  { value: 'key-staging', label: 'staging-keypair' },
];

export function ScriptsTagsSection({
  sshKey,
  startupScript,
  tags,
  onUpdateSshKey,
  onUpdateStartupScript,
  onAddTag,
  onUpdateTag,
  onRemoveTag,
}: ScriptsTagsSectionProps) {
  return (
    <>
      {/* SSH Key */}
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='sshKey'>
            SSH Key <span className='text-red-500'>*</span>
          </Label>
          <Select value={sshKey} onValueChange={onUpdateSshKey}>
            <SelectTrigger>
              <SelectValue placeholder='Select SSH Key to securely access your VMs' />
            </SelectTrigger>
            <SelectContent>
              {sshKeys.map(key => (
                <SelectItem key={key.value} value={key.value}>
                  {key.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Startup Script */}
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='startupScript'>Startup Script</Label>
          <Textarea
            id='startupScript'
            placeholder='#!/bin/bash&#10;# Enter your bash script here'
            value={startupScript}
            onChange={e => onUpdateStartupScript(e.target.value)}
            rows={6}
          />
          <p className='text-xs text-muted-foreground'>
            Only bash format is supported. Script will run on first boot.
          </p>
        </div>
      </div>
    </>
  );
}
