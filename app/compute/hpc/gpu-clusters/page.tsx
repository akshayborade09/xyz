'use client';

import { redirect } from 'next/navigation';

export default function GPUClustersPage() {
  // Redirect to main HPC page
  redirect('/compute/hpc');
}
