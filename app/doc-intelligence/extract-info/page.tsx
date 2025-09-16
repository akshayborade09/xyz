import { PageLayout } from '@/components/page-layout';

function ExtractInformationSection() {
  return (
    <div className='bg-card text-card-foreground border-border border rounded-lg p-6'>
      <div className='flex flex-col items-center justify-center py-12'>
        {/* SVG Illustration */}
        <div className='mb-6'>
          <svg
            width='215'
            height='140'
            viewBox='0 0 215 140'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect width='215' height='140' fill='#FFFFFF'></rect>
            <path
              d='M64 0L64 140'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
              strokeDasharray='3 3'
            ></path>
            <path
              d='M151 0L151 140'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
              strokeDasharray='3 3'
            ></path>
            <path
              d='M215 32H0'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
              strokeDasharray='3 3'
            ></path>
            <path
              d='M215 108H0'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
              strokeDasharray='3 3'
            ></path>
            <path
              d='M215 71H0'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
              strokeDasharray='3 3'
            ></path>
            <path
              d='M199 0L199 140'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
            ></path>
            <path
              d='M16 0L16 140'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
            ></path>
            <path
              d='M0 16L215 16'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
            ></path>
            <path
              d='M0 124L215 124'
              stroke='#EEEFF1'
              strokeWidth='0.8'
              strokeMiterlimit='10'
            ></path>
            <path
              d='M78.6555 76.8751L105.795 63.5757C106.868 63.05 108.132 63.05 109.205 63.5757L136.344 76.8751C137.628 77.5037 138.438 78.7848 138.438 80.1854V90.7764C138.438 92.177 137.628 93.4578 136.344 94.0867L109.205 107.386C108.132 107.912 106.868 107.912 105.795 107.386L78.6555 94.0867C77.3724 93.4581 76.5625 92.177 76.5625 90.7764V80.1854C76.5625 78.7848 77.3724 77.504 78.6555 76.8751Z'
              fill='#FFFFFF'
              stroke='#5C5E63'
              strokeWidth='1.1'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
            <g opacity='0.6'>
              <path
                d='M77.8 78.1958L107.5 93.2146L137.2 78.1958'
                stroke='#5C5E63'
                strokeWidth='0.7'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
              <path
                d='M107.5 107.445V93.2197'
                stroke='#5C5E63'
                strokeWidth='0.7'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
            </g>
            <path
              d='M78.6555 47.0687L105.795 33.7693C106.868 33.2436 108.132 33.2436 109.205 33.7693L136.344 47.0687C137.628 47.6973 138.438 48.9784 138.438 50.379V60.97C138.438 62.3706 137.628 63.6514 136.344 64.2803L109.205 77.5797C108.132 78.1054 106.868 78.1054 105.795 77.5797L78.6555 64.2803C77.3724 63.6517 76.5625 62.3706 76.5625 60.97V50.379C76.5625 48.9784 77.3724 47.6976 78.6555 47.0687Z'
              fill='#FFFFFF'
              stroke='#5C5E63'
              strokeWidth='1.1'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
            <g opacity='0.6'>
              <path
                d='M77.8 48.3943L107.5 63.4133L137.2 48.3943'
                stroke='#5C5E63'
                strokeWidth='0.7'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
              <path
                d='M107.5 77.6435V63.4182'
                stroke='#5C5E63'
                strokeWidth='0.7'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
            </g>
          </svg>
        </div>

        <div className='text-center space-y-4 max-w-md'>
          <h4 className='text-lg font-medium text-foreground'>
            No Information Extractions Found
          </h4>
          <div className='text-muted-foreground'>
            <p className='text-sm'>
              Extract key information from your unstructured data with advanced
              AI models.{' '}
              <a
                href='/documentation/extract-information'
                className='text-primary hover:underline'
              >
                Learn more
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExtractInfoPage() {
  return (
    <PageLayout
      title='Extract Information'
      description='Extract key information from your unstructured data with AI-powered extraction models.'
    >
      <ExtractInformationSection />
    </PageLayout>
  );
}
