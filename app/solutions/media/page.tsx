import { PageShell } from '@/components/page-shell';

export default function MediaSolutionsPage() {
  return (
    <PageShell
      title='Media & Entertainment Solutions'
      description='AI solutions for media and entertainment industry'
      tabs={[
        { title: 'Overview', href: '/solutions/media' },
        { title: 'Content Analysis', href: '/solutions/media/analysis' },
        { title: 'Content Creation', href: '/solutions/media/creation' },
        { title: 'Content Moderation', href: '/solutions/media/moderation' },
        { title: 'Audience Engagement', href: '/solutions/media/engagement' },
      ]}
    />
  );
}
