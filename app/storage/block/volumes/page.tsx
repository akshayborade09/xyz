'use client';

import { redirect } from 'next/navigation';

export default function BlockStorageVolumesPage() {
  // Redirect to main Block Storage page
  redirect('/storage/block');
}
