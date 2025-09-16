import { PageShell } from '@/components/page-shell';

export default function MedicalImagingPage() {
  return (
    <PageShell
      title='Medical Imaging'
      description='AI-powered analysis and insights for medical imaging'
      tabs={[
        { title: 'Overview', href: '/ai-solutions/medical-imaging' },
        { title: 'Radiology', href: '/ai-solutions/medical-imaging/radiology' },
        { title: 'Pathology', href: '/ai-solutions/medical-imaging/pathology' },
        { title: 'Screening', href: '/ai-solutions/medical-imaging/screening' },
      ]}
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>AI for Medical Imaging</h2>
          <p className='text-muted-foreground mb-4'>
            Our medical imaging AI solutions assist healthcare professionals in
            analyzing and interpreting medical images. Improve diagnosis
            accuracy, reduce interpretation time, and enhance patient outcomes
            with our advanced AI models trained on large medical imaging
            datasets.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Diagnostic Assistance</h3>
              <p className='text-sm text-muted-foreground'>
                AI-powered detection and classification of abnormalities in
                medical images.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Image Enhancement</h3>
              <p className='text-sm text-muted-foreground'>
                Improve image quality and visibility of important features.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Quantitative Analysis</h3>
              <p className='text-sm text-muted-foreground'>
                Automatic measurements and quantification of anatomical
                structures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
