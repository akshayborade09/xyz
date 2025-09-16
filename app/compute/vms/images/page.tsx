'use client';

import { redirect } from 'next/navigation';

export default function MachineImagesPage() {
  // Redirect to main VMs page with Machine Images tab
  redirect('/compute/vms');
}
