'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { TextTranslationPlayground } from '@/components/playground/text-translation-playground';
import { Button } from '@/components/ui/button';
import { SetupCodeModal } from '@/components/modals/setup-code-modal';
import { CreateApiKeyModal } from '@/components/modals/create-api-key-modal';
import { Languages, SearchCheck, FileText, Heart, ScrollText } from 'lucide-react';

const modelData = {
  'text-translation': {
    name: 'Bhashik / Text Translation',
    provider: 'Bhashik',
    modality: 'Text-to-Text',
    license: 'Proprietary',
    inputPrice: '₹581',
    outputPrice: '',
    description: 'Translate written content between languages',
    tags: ['Neural', 'Batch & streaming'],
    cardGradient: 'bg-gradient-to-bl from-slate-100/50 via-white/80 to-white border-slate-200/60',
    logo: <Languages className='h-5 w-5' />,
    inputLabel: 'per 1M input characters',
  },
  'language-detection': {
    name: 'Bhashik / Language Detection',
    provider: 'Bhashik',
    modality: 'Text-to-Text',
    license: 'Proprietary',
    inputPrice: '₹66',
    outputPrice: '',
    description: 'Detect the language present in the text',
    tags: ['Fast', 'Short & long form'],
    cardGradient: 'bg-gradient-to-bl from-indigo-100/50 via-purple-50/30 to-white border-indigo-200/60',
    logo: <SearchCheck className='h-5 w-5' />,
    inputLabel: 'per 1M input characters',
  },
  'text-extraction': {
    name: 'Bhashik / Text Extraction',
    provider: 'Bhashik',
    modality: 'Text-to-Text',
    license: 'Proprietary',
    inputPrice: '₹66',
    outputPrice: '',
    description: 'Extract the set of defined entities from the text',
    tags: ['Custom schema', 'Structured output'],
    cardGradient: 'bg-gradient-to-bl from-slate-100/50 via-white/80 to-white border-slate-200/60',
    logo: <FileText className='h-5 w-5' />,
    inputLabel: 'per 1M input characters',
  },
  'sentiment-analysis': {
    name: 'Bhashik / Sentiment Analysis',
    provider: 'Bhashik',
    modality: 'Text-to-Text',
    license: 'Proprietary',
    inputPrice: '₹66',
    outputPrice: '',
    description: 'Dominant sentiment detection for overall content and specific entity within',
    tags: ['Entity-level', 'Multilingual'],
    cardGradient: 'bg-gradient-to-bl from-orange-100/40 via-amber-50/30 to-white border-amber-200/60',
    logo: <Heart className='h-5 w-5' />,
    inputLabel: 'per 1M input characters',
  },
  'text-summarization': {
    name: 'Bhashik / Summarization',
    provider: 'Bhashik',
    modality: 'Text-to-Text',
    license: 'Proprietary',
    inputPrice: '₹6.0',
    outputPrice: '',
    description: 'Summarize the main points and essence of a text',
    tags: ['Abstractive', 'Configurable length'],
    cardGradient: 'bg-gradient-to-bl from-green-100/40 via-emerald-50/30 to-white border-green-200/60',
    logo: <ScrollText className='h-5 w-5' />,
    inputLabel: 'per 1M input characters',
  },
} as const;

export default function TextTranslationPage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState('text-translation');
  const model = modelData['text-translation'];
  const [isSetupCodeModalOpen, setIsSetupCodeModalOpen] = useState(false);
  const [isCreateApiKeyModalOpen, setIsCreateApiKeyModalOpen] = useState(false);

  useEffect(() => {
    setSelectedModel('text-translation');
  }, []);

  return (
    <PageShell 
      title={model.name} 
      description={model.description}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={() => setIsSetupCodeModalOpen(true)}>View code</Button>
          <Button variant='default' size='sm' onClick={() => setIsCreateApiKeyModalOpen(true)}>Get API key</Button>
        </div>
      }
    >
      <TextTranslationPlayground
        model={model}
        selectedModel={selectedModel}
        modelData={modelData}
        onModelChange={(m) => {
          setSelectedModel(m);
          if (m === 'text-translation') router.push('/playground/text-translation');
          if (m === 'language-detection') router.push('/playground/language-detection');
          if (m === 'text-extraction') router.push('/playground/text-extraction');
          if (m === 'sentiment-analysis') router.push('/playground/sentiment-analysis');
          if (m === 'text-summarization') router.push('/playground/text-summarization');
        }}
      />
      <SetupCodeModal
        open={isSetupCodeModalOpen}
        onClose={() => setIsSetupCodeModalOpen(false)}
        modelId={selectedModel}
      />
      <CreateApiKeyModal
        open={isCreateApiKeyModalOpen}
        onClose={() => setIsCreateApiKeyModalOpen(false)}
      />
    </PageShell>
  );
}


