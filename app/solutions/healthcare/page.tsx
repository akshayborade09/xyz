import { PageShell } from '@/components/page-shell';

export default function HealthcareSolutionsPage() {
  return (
    <PageShell
      title='Healthcare Solutions'
      description='AI solutions for healthcare industry'
      tabs={[
        { title: 'Overview', href: '/solutions/healthcare' },
        { title: 'Medical Imaging', href: '/solutions/healthcare/imaging' },
        {
          title: 'Clinical Documentation',
          href: '/solutions/healthcare/documentation',
        },
        { title: 'Patient Care', href: '/solutions/healthcare/patient-care' },
      ]}
    />
  );
}
