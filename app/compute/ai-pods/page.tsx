import { PageShell } from '@/components/page-shell';

export default function AiPodsPage() {
  return (
    <PageShell
      title='AI Pods'
      description='Manage your AI Pods for specialized AI workloads'
      tabs={[{ title: 'My Pods', href: '/compute/ai-pods/my-pods' }]}
    />
  );
}
