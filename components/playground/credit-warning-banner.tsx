'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreditWarningBannerProps {
  onAddCredits: () => void;
}

export function CreditWarningBanner({ onAddCredits }: CreditWarningBannerProps) {
  return (
    <div className="mb-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 border border-orange-200 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
          <span className="text-sm text-orange-800 font-medium">
            You need credits to use this playground. Add credits to get started.
          </span>
        </div>
        <Button 
          onClick={onAddCredits}
          size="sm"
          className="flex-shrink-0"
        >
          Add Credits
        </Button>
      </div>
    </div>
  );
}

