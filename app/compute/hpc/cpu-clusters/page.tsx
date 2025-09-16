'use client';

import { redirect } from 'next/navigation';

export default function CPUClustersPage() {
  // Redirect to main HPC page
  redirect('/compute/hpc');
}
