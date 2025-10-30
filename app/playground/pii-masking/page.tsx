'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { ExtractTextPlayground } from '@/components/playground/extract-text-playground';
import { Button } from '@/components/ui/button';
import { SetupCodeModal } from '@/components/modals/setup-code-modal';
import { CreateApiKeyModal } from '@/components/modals/create-api-key-modal';

export default function PIIMaskingPlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState('pii-masking');
  const router = useRouter();
  const [isSetupCodeModalOpen, setIsSetupCodeModalOpen] = useState(false);
  const [isCreateApiKeyModalOpen, setIsCreateApiKeyModalOpen] = useState(false);

  const modelData = {
    'extract-text': {
      name: 'Doc Intelligence/Extract Text',
      provider: 'Krutrim',
      modality: 'OCR',
      license: 'Proprietary',
      inputPrice: '₹99.60',
      outputPrice: '₹398.4',
      description: 'Seamlessly extract text from documents, scanned files and images',
      tags: ['OCR', 'PDF/Image', 'Multilingual'],
      inputLabel: 'per Document',
      outputLabel: 'per OCR',
      cardGradient: 'bg-gradient-to-bl from-slate-100/50 via-white/80 to-white border-slate-200/60',
      logo: null,
    },
    'extract-info': {
      name: 'Doc Intelligence/Extract Information',
      provider: 'Krutrim',
      modality: 'OCR',
      license: 'Proprietary',
      inputPrice: '₹1726.40',
      outputPrice: '',
      inputLabel: 'per Document',
      description: 'Extract key information from your unstructured data',
      tags: ['Custom schema', 'Entities', 'JSON'],
      cardGradient: 'bg-gradient-to-bl from-indigo-100/50 via-purple-50/30 to-white border-indigo-200/60',
      logo: null,
    },
    'doc-summarization': {
      name: 'Doc Intelligence/Document Summarization',
      provider: 'Krutrim',
      modality: 'Summarization',
      license: 'Proprietary',
      inputPrice: '₹166.00',
      outputPrice: '₹531.20',
      inputLabel: 'per Document',
      outputLabel: 'per OCR',
      description: 'Upload your file to generate a summary',
      tags: ['Abstractive', 'Configurable length'],
      cardGradient: 'bg-gradient-to-bl from-green-100/50 via-emerald-50/30 to-white border-green-200/60',
      logo: null,
    },
    'pii-masking': {
      name: 'Document Intelligence/PII Masking',
      provider: 'Krutrim',
      modality: 'PII Masking',
      license: 'Proprietary',
      inputPrice: '₹232.40',
      outputPrice: '',
      inputLabel: 'per Document',
      description: 'Get PII data masked in your documents',
      tags: ['PII', 'GDPR', 'HIPAA'],
      cardGradient: 'bg-gradient-to-bl from-orange-100/40 via-amber-50/30 to-white border-amber-200/60',
      logo: null,
    },
  } as const;

  const model = modelData['pii-masking'];

  useEffect(() => {
    setSelectedModel('pii-masking');
  }, []);

  return (
    <PageShell
      title='Document Intelligence / PII Masking'
      description='Get PII data masked in your documents'
      headerActions={
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={() => setIsSetupCodeModalOpen(true)}>View code</Button>
          <Button variant='default' size='sm' onClick={() => setIsCreateApiKeyModalOpen(true)}>Get API key</Button>
        </div>
      }
    >
      <ExtractTextPlayground
        model={model}
        selectedModel={selectedModel}
        modelData={modelData}
        onModelChange={(m) => {
          setSelectedModel(m);
          if (m === 'extract-text') router.push('/playground/extract-text');
          if (m === 'extract-info') router.push('/playground/extract-info');
          if (m === 'doc-summarization') router.push('/playground/doc-summarization');
          if (m === 'pii-masking') router.push('/playground/pii-masking');
        }}
      />
      <SetupCodeModal open={isSetupCodeModalOpen} onClose={() => setIsSetupCodeModalOpen(false)} modelId={selectedModel} />
      <CreateApiKeyModal open={isCreateApiKeyModalOpen} onClose={() => setIsCreateApiKeyModalOpen(false)} />
    </PageShell>
  );
}


