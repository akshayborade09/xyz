'use client';

import { redirect } from 'next/navigation';

export default function TemplatesPage() {
  // Redirect to main Auto Scaling page
  redirect('/compute/auto-scaling');
}
