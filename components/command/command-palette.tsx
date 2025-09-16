'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  Server,
  Database,
  Brain,
  Code,
  Settings,
  FileText,
  HelpCircle,
  User,
  CreditCard,
  LayoutDashboard,
  Zap,
  ChevronRight,
  Cpu,
  Network,
  Shield,
} from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  shortcut?: string;
  action?: () => void;
  category: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample command items
  const commandItems: CommandItem[] = [
    // Navigation commands
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      icon: <LayoutDashboard className='h-4 w-4' />,
      href: '/dashboard',
      category: 'navigation',
    },
    {
      id: 'compute',
      title: 'Compute Resources',
      icon: <Server className='h-4 w-4' />,
      href: '/compute/resources',
      category: 'navigation',
    },
    {
      id: 'models',
      title: 'AI Models',
      icon: <Brain className='h-4 w-4' />,
      href: '/models/library',
      category: 'navigation',
    },
    {
      id: 'apis',
      title: 'API Catalog',
      icon: <Code className='h-4 w-4' />,
      href: '/apis/catalog',
      category: 'navigation',
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: <Database className='h-4 w-4' />,
      href: '/data/datasets',
      category: 'navigation',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className='h-4 w-4' />,
      href: '/settings',
      category: 'navigation',
    },

    // Actions
    {
      id: 'new-machine',
      title: 'Launch a new machine',
      description: 'Create a new compute instance',
      icon: <Server className='h-4 w-4' />,
      href: '/compute/resources/new',
      category: 'action',
    },
    {
      id: 'deploy-model',
      title: 'Deploy a model',
      description: 'Deploy an AI model to production',
      icon: <Zap className='h-4 w-4' />,
      href: '/models/deployment/new',
      category: 'action',
    },
    {
      id: 'create-dataset',
      title: 'Create a dataset',
      description: 'Upload or connect to a new dataset',
      icon: <Database className='h-4 w-4' />,
      href: '/data/datasets/new',
      category: 'action',
    },
    {
      id: 'new-api',
      title: 'Create an API endpoint',
      description: 'Set up a new API endpoint',
      icon: <Code className='h-4 w-4' />,
      href: '/apis/management/new',
      category: 'action',
    },

    // Tools
    {
      id: 'docs',
      title: 'Documentation',
      icon: <FileText className='h-4 w-4' />,
      href: '/support/documentation',
      category: 'tool',
    },
    {
      id: 'billing',
      title: 'Billing & Usage',
      icon: <CreditCard className='h-4 w-4' />,
      href: '/billing',
      category: 'tool',
    },
    {
      id: 'profile',
      title: 'User Profile',
      icon: <User className='h-4 w-4' />,
      href: '/settings/profile',
      category: 'tool',
    },
    {
      id: 'help',
      title: 'Get Help',
      icon: <HelpCircle className='h-4 w-4' />,
      href: '/support',
      category: 'tool',
    },

    // Resources
    {
      id: 'gpu-resources',
      title: 'GPU Resources',
      icon: <Cpu className='h-4 w-4' />,
      href: '/compute/resources/gpu',
      category: 'resource',
    },
    {
      id: 'networking',
      title: 'Networking',
      icon: <Network className='h-4 w-4' />,
      href: '/networking',
      category: 'resource',
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: <Shield className='h-4 w-4' />,
      href: '/security',
      category: 'resource',
    },
    {
      id: 'command-palette',
      title: 'Open Command Palette',
      description: 'Access all commands quickly',
      icon: <Command className='h-4 w-4' />,
      shortcut: '⌘+K',
      category: 'tool',
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      description: 'Perform common tasks quickly',
      icon: <Zap className='h-4 w-4' />,
      category: 'tool',
    },
    {
      id: 'search-docs',
      title: 'Search Documentation',
      description: 'Find help and guides',
      icon: <FileText className='h-4 w-4' />,
      href: '/support/documentation',
      category: 'tool',
    },
  ];

  // Filter items based on search query
  const filteredItems =
    searchQuery.trim() === ''
      ? commandItems
      : commandItems.filter(
          item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description &&
              item.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // Group items by category
  const groupedItems: Record<string, CommandItem[]> = {};
  filteredItems.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < filteredItems.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          const selectedItem = filteredItems[selectedIndex];
          if (selectedItem) {
            if (selectedItem.href) {
              router.push(selectedItem.href);
              onOpenChange(false);
            } else if (selectedItem.action) {
              selectedItem.action();
              onOpenChange(false);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredItems, selectedIndex, router, onOpenChange]);

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation':
        return 'Navigation';
      case 'action':
        return 'Actions';
      case 'tool':
        return 'Tools';
      case 'resource':
        return 'Resources';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='p-0 gap-0 max-w-2xl'>
        <div className='flex items-center border-b p-4'>
          <Command className='h-5 w-5 mr-2 text-muted-foreground' />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder='Search commands, resources, documentation...'
            className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0'
            autoComplete='off'
          />
          <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
            <span className='text-xs'>⌘</span>K
          </kbd>
        </div>

        <ScrollArea className='max-h-[60vh]'>
          <div className='p-2'>
            {Object.keys(groupedItems).length > 0 ? (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className='mb-4'>
                  <div className='px-2 py-1.5 text-xs font-semibold text-muted-foreground'>
                    {getCategoryLabel(category)}
                  </div>
                  <div className='mt-1'>
                    {items.map((item, index) => {
                      const itemIndex = filteredItems.findIndex(
                        i => i.id === item.id
                      );
                      const isSelected = itemIndex === selectedIndex;

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center px-2 py-1.5 rounded-md text-sm ${
                            isSelected
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent/50'
                          } cursor-pointer`}
                          onClick={() => {
                            if (item.href) {
                              router.push(item.href);
                              onOpenChange(false);
                            } else if (item.action) {
                              item.action();
                              onOpenChange(false);
                            }
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                        >
                          <div className='h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center mr-3'>
                            {item.icon}
                          </div>
                          <div className='flex-1 flex flex-col'>
                            <span className='font-medium'>{item.title}</span>
                            {item.description && (
                              <span className='text-xs text-muted-foreground'>
                                {item.description}
                              </span>
                            )}
                          </div>
                          {item.shortcut && (
                            <div className='flex items-center gap-1'>
                              {item.shortcut.split('+').map((key, i) => (
                                <kbd
                                  key={i}
                                  className='px-1.5 py-0.5 bg-muted border rounded text-xs'
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                          {item.href && (
                            <ChevronRight className='h-4 w-4 ml-2 text-muted-foreground' />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className='py-6 text-center text-muted-foreground'>
                No results found
              </div>
            )}
          </div>
        </ScrollArea>

        <div className='p-2 border-t text-xs text-muted-foreground flex items-center justify-between'>
          <div>
            <kbd className='px-1.5 py-0.5 bg-muted border rounded text-xs mr-1'>
              ↑
            </kbd>
            <kbd className='px-1.5 py-0.5 bg-muted border rounded text-xs mr-1'>
              ↓
            </kbd>
            to navigate
          </div>
          <div>
            <kbd className='px-1.5 py-0.5 bg-muted border rounded text-xs mr-1'>
              Enter
            </kbd>
            to select
          </div>
          <div>
            <kbd className='px-1.5 py-0.5 bg-muted border rounded text-xs mr-1'>
              Esc
            </kbd>
            to close
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
