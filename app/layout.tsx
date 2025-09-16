import type React from 'react';
import './globals.css';
import ClientLayout from './client-layout';
import { CommandPaletteProvider } from '@/components/command/command-palette-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/css/opensauce.css'
        />
      </head>
      <body className='font-opensauceOne'>
        <CommandPaletteProvider>
          <ClientLayout>{children}</ClientLayout>
        </CommandPaletteProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: 'v0.dev',
};
