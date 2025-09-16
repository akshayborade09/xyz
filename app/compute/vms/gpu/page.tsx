'use client';

import { redirect } from 'next/navigation';

export default function GPUVMPage() {
  // Redirect to main VMs page with GPU tab
  redirect('/compute/vms');
}
