'use client';

import { redirect } from 'next/navigation';

export default function AIPodsPage() {
  // Redirect to main VMs page with AI Pods tab
  redirect('/compute/vms');
}
