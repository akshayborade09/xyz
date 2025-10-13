'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreditWarningBannerProps {
  onAddCredits: () => void;
}

export function CreditWarningBanner({ onAddCredits }: CreditWarningBannerProps) {
  return (
    <div className="rounded-lg border-l-4 border-l-orange-500 bg-orange-50 border border-orange-200 p-3 md:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-orange-600 flex-shrink-0" />
          <span className="text-xs md:text-sm text-orange-800 font-medium">
            You need credits to use this playground. Add credits to get started.
          </span>
        </div>
        <Button 
          onClick={onAddCredits}
          size="sm"
          className="flex-shrink-0 w-full sm:w-auto"
        >
          Add Credits
        </Button>
      </div>
    </div>
  );
}

