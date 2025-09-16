'use client';

import type React from 'react';
import { useEffect } from 'react';
import { CommandPalette } from './command-palette';
import {
  CommandPaletteContextProvider,
  useCommandPalette,
} from './command-palette-context';

function CommandPaletteWrapper({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useCommandPalette();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  return (
    <>
      <CommandPalette open={open} onOpenChange={setOpen} />
      {children}
    </>
  );
}

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommandPaletteContextProvider>
      <CommandPaletteWrapper>{children}</CommandPaletteWrapper>
    </CommandPaletteContextProvider>
  );
}
