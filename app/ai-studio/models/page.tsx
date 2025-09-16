'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ModelsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Model Catalogue by default
    router.replace('/model-hub/catalog');
  }, [router]);

  return null;
}
