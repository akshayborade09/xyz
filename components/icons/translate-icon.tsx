/**
 * @component TranslateIcon
 * @description SVG icon for translation and language-related features
 *
 * This icon component is intended for use in internationalization features
 * of the Krutrim Cloud platform. It will be used in language selection
 * dropdowns, translation tools, and other i18n-related UI elements.
 *
 * @status Planned - Not currently in use
 * @plannedFor Internationalization system (Q3 2023)
 *
 * @example
 * // Future implementation in language selector
 * import { TranslateIcon } from "@/components/icons/translate-icon";
 *
 * export function LanguageSelector() {
 *   return (
 *     <Button variant="ghost" size="sm">
 *       <TranslateIcon className="h-4 w-4 mr-2" />
 *       Change Language
 *     </Button>
 *   );
 * }
 *
 * @see Related components:
 * - LanguageSelector
 * - LocaleProvider
 * - TranslationTools
 *
 * @todo Implement language selection dropdown when i18n system is added
 * @todo Consider adding animation for language switching
 */
import type { SVGProps } from 'react';

export function TranslateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M5 8l6 6' />
      <path d='M4 14h7' />
      <path d='M2 5h12' />
      <path d='M7 2h1' />
      <path d='M22 22l-5-10-5 10' />
      <path d='M14 18h6' />
    </svg>
  );
}
