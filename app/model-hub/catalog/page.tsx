'use client';

import { useState, useMemo } from 'react';
import { PageShell } from '@/components/page-shell';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  ExternalLink,
  Code,
  Gauge,
  Zap,
  Brain,
  Key,
} from 'lucide-react';
import {
  models,
  type Model,
  getModelsByType,
  getAllModels,
  getModelsByCapability,
  searchModels,
} from '@/lib/data';

// Capability filter options
const capabilityFilters = [
  { id: 'summarization', label: 'Summarization', icon: Brain },
  { id: 'context-rag', label: 'Context & RAG', icon: Search },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'fast-cost-efficient', label: 'Fast & Cost-efficient', icon: Zap },
  {
    id: 'complex-writing-conversations',
    label: 'Complex writing & Conversations',
    icon: Brain,
  },
  {
    id: 'function-calling-tools',
    label: 'Function calling & Tools',
    icon: Key,
  },
  { id: 'reasoning', label: 'Reasoning', icon: Gauge },
  { id: 'text-generation', label: 'Text Generation', icon: Brain },
  { id: 'vision-understanding', label: 'Vision Understanding', icon: Brain },
  { id: 'image-generation', label: 'Image Generation', icon: Brain },
  { id: 'audio-transcription', label: 'Audio Transcription', icon: Brain },
  { id: 'audio-generation', label: 'Audio Generation', icon: Brain },
];

function ModelCard({ model }: { model: Model }) {
  return (
    <Card className='relative overflow-hidden'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded bg-primary/10 flex items-center justify-center'>
              <Code className='h-4 w-4' />
            </div>
            <div>
              <CardTitle className='text-lg font-medium'>
                {model.name}
              </CardTitle>
              <p className='text-sm text-muted-foreground'>{model.provider}</p>
            </div>
          </div>
          <Button variant='ghost' size='sm'>
            <ExternalLink className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <Badge variant='outline' className='text-xs'>
            Description
          </Badge>
          <Badge variant='outline' className='text-xs'>
            License
          </Badge>
        </div>

        <div className='space-y-3'>
          {/* Flavor section */}
          <div>
            <span className='text-sm font-medium'>Flavor</span>
            <span className='float-right text-sm font-medium'>Base</span>
          </div>

          {/* Pricing */}
          <div className='space-y-1'>
            <div className='flex justify-between text-sm'>
              <span>Input tokens, 1M</span>
              <span className='font-medium'>
                ${model.pricing.inputTokens.toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Output tokens, 1M</span>
              <span className='font-medium'>
                ${model.pricing.outputTokens.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Performance metrics */}
          <div className='space-y-1'>
            <div className='flex justify-between text-sm'>
              <span>Tokens per sec</span>
              <span className='font-medium'>
                {model.performance.tokensPerSec}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Quantization</span>
              <span className='font-medium'>
                {model.performance.quantization}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Quality</span>
              <span className='font-medium'>{model.performance.quality}</span>
            </div>
          </div>
        </div>

        {/* Context window tags */}
        <div className='flex flex-wrap gap-1'>
          <Badge variant='secondary' className='text-xs'>
            {model.contextWindow}
          </Badge>
          <Badge variant='secondary' className='text-xs'>
            code
          </Badge>
          <Badge variant='secondary' className='text-xs'>
            JSON mode
          </Badge>
          {model.tags.includes('math') && (
            <Badge variant='secondary' className='text-xs'>
              math
            </Badge>
          )}
          {model.tags.includes('reasoning') && (
            <Badge variant='secondary' className='text-xs'>
              reasoning
            </Badge>
          )}
        </div>

        {/* Action button */}
        <Button variant='outline' className='w-full' size='sm'>
          <ExternalLink className='h-4 w-4 mr-2' />
          Go to playground
        </Button>
      </CardContent>
    </Card>
  );
}

// Tab definitions for VercelTabs
const tabs = [
  { id: 'all', label: 'All Models' },
  { id: 'text', label: 'Text' },
  { id: 'embedding', label: 'Embedding' },
  { id: 'audio', label: 'Audio' },
  { id: 'vision', label: 'Vision' },
];

export default function ModelCatalogPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    []
  );

  // Filter models based on active tab, search, and capabilities
  const filteredModels = useMemo(() => {
    let filtered: Model[];

    // Get models based on active tab
    if (activeTab === 'all') {
      filtered = getAllModels();
    } else {
      filtered = getModelsByType(
        activeTab as 'text' | 'embedding' | 'audio' | 'vision'
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = searchModels(searchQuery);
      if (activeTab === 'all') {
        filtered = searchResults;
      } else {
        filtered = searchResults.filter(model => model.type === activeTab);
      }
    }

    // Apply capability filters
    if (selectedCapabilities.length > 0) {
      filtered = filtered.filter(model =>
        selectedCapabilities.some(capability =>
          model.capabilities.includes(capability)
        )
      );
    }

    return filtered;
  }, [activeTab, searchQuery, selectedCapabilities]);

  const toggleCapability = (capabilityId: string) => {
    setSelectedCapabilities(prev =>
      prev.includes(capabilityId)
        ? prev.filter(id => id !== capabilityId)
        : [...prev, capabilityId]
    );
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <PageShell
      title='Models'
      description='Explore our comprehensive library of AI models including text generation, embedding, audio processing, and computer vision models.'
      headerActions={
        <Button variant='outline' size='sm'>
          <Key className='h-4 w-4 mr-2' />
          Get API key
        </Button>
      }
    >
      <div className='space-y-6'>
        {/* VercelTabs following Block Storage pattern */}
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size='lg'
        />

        {/* Tab content - no sidebar, full width */}
        <div className='space-y-6'>
          {/* Search and filters */}
          <div className='space-y-4'>
            {/* Search bar */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Name, provider or tag'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* Capability filters */}
            <div className='flex flex-wrap gap-2'>
              {capabilityFilters.map(filter => {
                const Icon = filter.icon;
                const isSelected = selectedCapabilities.includes(filter.id);

                return (
                  <Button
                    key={filter.id}
                    variant={isSelected ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => toggleCapability(filter.id)}
                    className='h-8'
                  >
                    <Icon className='h-3 w-3 mr-1' />
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Models grid - full width, more models per row */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {filteredModels.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>
                No models found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
