'use client';

import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle } from 'lucide-react';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

interface TemplateOptionProps {
  saveAsTemplate: boolean;
  asgName: string;
  onToggleSaveAsTemplate: (checked: boolean) => void;
}

export function TemplateOption({
  saveAsTemplate,
  asgName,
  onToggleSaveAsTemplate,
}: TemplateOptionProps) {
  return (
    <div className='space-y-4'>
      <Label className='text-base font-medium'>Template Option</Label>
      <div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='saveAsTemplate'
            checked={saveAsTemplate}
            onCheckedChange={onToggleSaveAsTemplate}
          />
          <Label htmlFor='saveAsTemplate' className='text-sm'>
            Save as template
          </Label>
          <TooltipWrapper content='When selected, automatically creates a template with the same specification using the name of the ASG.'>
            <HelpCircle className='h-4 w-4 text-muted-foreground' />
          </TooltipWrapper>
        </div>
        {saveAsTemplate && asgName && (
          <p className='text-xs text-muted-foreground mt-2'>
            Template will be created with name: "{asgName} template"
          </p>
        )}
      </div>
    </div>
  );
}
