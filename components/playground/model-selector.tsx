'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  modelData: Record<string, {
    name: string;
    provider: string;
    logo: React.ReactNode;
    [key: string]: any;
  }>;
}

// Component to render logo with unique IDs using DOM manipulation
function LogoWithUniqueIds({ logo, uniqueSuffix }: { logo: React.ReactNode; uniqueSuffix: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all SVG elements and update their gradient IDs
    const svgs = containerRef.current.querySelectorAll('svg');
    svgs.forEach((svg) => {
      // Update all ID attributes
      const elementsWithId = svg.querySelectorAll('[id]');
      elementsWithId.forEach((el) => {
        const oldId = el.getAttribute('id');
        if (oldId) {
          el.setAttribute('id', `${oldId}-${uniqueSuffix}`);
        }
      });

      // Update all url() references in fill, stroke, etc.
      const elementsWithUrl = svg.querySelectorAll('[fill*="url("], [stroke*="url("]');
      elementsWithUrl.forEach((el) => {
        ['fill', 'stroke'].forEach((attr) => {
          const value = el.getAttribute(attr);
          if (value && value.includes('url(#')) {
            const updated = value.replace(/url\(#([^)]+)\)/g, `url(#$1-${uniqueSuffix})`);
            el.setAttribute(attr, updated);
          }
        });
      });
    });
  }, [uniqueSuffix]);

  return (
    <div ref={containerRef} className='flex-shrink-0'>
      {logo}
    </div>
  );
}

export function ModelSelector({ value, onChange, modelData }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchTerm('');
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Filter models based on search term
  const filteredModels = Object.entries(modelData).filter(([_, model]) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      model.name.toLowerCase().includes(searchLower) ||
      model.provider.toLowerCase().includes(searchLower)
    );
  });

  const selectedModel = modelData[value];

  return (
    <div className='relative z-50' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='w-full h-auto min-h-[40px] py-3 px-3 flex items-center justify-between border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
      >
        <div className='flex items-center gap-2 w-full'>
          <LogoWithUniqueIds logo={selectedModel?.logo} uniqueSuffix={`selected-${value}`} />
          <span className='truncate text-left flex-1 text-sm'>{selectedModel?.name}</span>
        </div>
        <ChevronDown className='h-4 w-4 opacity-50 flex-shrink-0 ml-2' />
      </button>

      {open && (
        <div className='absolute w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[400px] flex flex-col'>
          {/* Search Input */}
          <div className='p-2 border-b'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search models...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-8 h-9'
                autoFocus
              />
            </div>
          </div>

          {/* Model List */}
          <div className='overflow-y-auto max-h-[320px] p-1'>
            {filteredModels.length > 0 ? (
              filteredModels.map(([modelId, model]) => (
                <button
                  key={modelId}
                  type='button'
                  onClick={() => {
                    onChange(modelId);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  className='w-full flex items-center justify-between px-2 py-3 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors'
                >
                  <div className='flex items-center gap-2 w-full'>
                    <LogoWithUniqueIds logo={model.logo} uniqueSuffix={`dropdown-${modelId}`} />
                    <div className='flex flex-col items-start flex-1'>
                      <span className='font-medium truncate'>{model.name}</span>
                      <span className='text-xs text-muted-foreground'>{model.provider}</span>
                    </div>
                  </div>
                  {value === modelId && (
                    <Check className='h-4 w-4 flex-shrink-0 text-primary' />
                  )}
                </button>
              ))
            ) : (
              <div className='px-2 py-6 text-center text-sm text-muted-foreground'>
                No models found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

