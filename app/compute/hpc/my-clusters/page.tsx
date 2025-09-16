'use client';

import { redirect } from 'next/navigation';

export default function MyClustersPage() {
  // Redirect to main HPC page
  redirect('/compute/hpc');
}
