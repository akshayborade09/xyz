'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { VercelTabs } from '@/components/ui/vercel-tabs';

// Tab content components with empty states
function TextTranslationSection() {
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
            No Text Translations Found
          </h4>
          <div className='text-muted-foreground'>
            <p className='text-sm'>
              Start translating text between languages with high accuracy and
              context awareness.{' '}
              <a
                href='/documentation/text-translation'
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

function LanguageDetectionSection() {
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
            No Language Detections Found
          </h4>
          <div className='text-muted-foreground'>
            <p className='text-sm'>
              Automatically detect the language present in your text content
              with high confidence.{' '}
              <a
                href='/documentation/language-detection'
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

function ExtractionSection() {
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
            No Entity Extractions Found
          </h4>
          <div className='text-muted-foreground'>
            <p className='text-sm'>
              Extract defined entities from your text content with advanced NLP
              techniques.{' '}
              <a
                href='/documentation/entity-extraction'
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

function SentimentAnalysisSection() {
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
            No Sentiment Analysis Found
          </h4>
          <div className='text-muted-foreground'>
            <p className='text-sm'>
              Analyze sentiment and emotional tone in your text content with
              advanced AI models.{' '}
              <a
                href='/documentation/sentiment-analysis'
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

function SummarizationSection() {
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
            No Text Summarizations Found
          </h4>
          <div className='text-muted-foreground'>
            <p className='text-sm'>
              Summarize long text content into concise, meaningful summaries
              using AI.{' '}
              <a
                href='/documentation/text-summarization'
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

const tabs = [
  { id: 'translation', label: 'Text Translation' },
  { id: 'detection', label: 'Language Detection' },
  { id: 'extraction', label: 'Extraction' },
  { id: 'sentiment', label: 'Sentiment Analysis' },
  { id: 'summarization', label: 'Summarization' },
];

export default function TextServicesPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('translation');

  // Set initial tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle tab change without URL navigation
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Get title and description based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case 'translation':
        return {
          title: 'Text Services',
          description:
            'Translate written content between 100+ language pairs with high accuracy.',
        };
      case 'detection':
        return {
          title: 'Text Services',
          description:
            'Automatically detect the language present in your text content.',
        };
      case 'extraction':
        return {
          title: 'Text Services',
          description:
            'Extract defined entities from text using advanced NLP techniques.',
        };
      case 'sentiment':
        return {
          title: 'Text Services',
          description:
            'Analyze sentiment and emotional tone in your text content.',
        };
      case 'summarization':
        return {
          title: 'Text Services',
          description:
            'Summarize long text content into concise, meaningful summaries.',
        };
      default:
        return {
          title: 'Text Services',
          description: 'Comprehensive text processing and analysis services',
        };
    }
  };

  const { title, description } = getPageInfo();

  return (
    <PageLayout title={title} description={description}>
      <div className='space-y-6'>
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size='lg'
        />

        {activeTab === 'translation' && <TextTranslationSection />}
        {activeTab === 'detection' && <LanguageDetectionSection />}
        {activeTab === 'extraction' && <ExtractionSection />}
        {activeTab === 'sentiment' && <SentimentAnalysisSection />}
        {activeTab === 'summarization' && <SummarizationSection />}
      </div>
    </PageLayout>
  );
}
