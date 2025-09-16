'use client';

import { redirect } from 'next/navigation';

export default function CPUVMPage() {
  // Redirect to main VMs page with CPU tab
  redirect('/compute/vms');
}
