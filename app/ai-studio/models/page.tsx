'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ModelsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Overview by default
    router.replace('/ai-studio/models/overview');
  }, [router]);

  return null;
}
