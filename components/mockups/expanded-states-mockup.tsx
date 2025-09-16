'use client';

import type React from 'react';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Brain,
  Code,
  Search,
  Bell,
  User,
  Menu,
  X,
  Settings,
  LogOut,
  UserCircle,
  Filter,
  Check,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ExpandedStatesMockup() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    dashboard: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>Navigation States</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <h2 className='text-xl font-bold mb-4'>Left Sidebar States</h2>
            <div className='border rounded-lg overflow-hidden'>
              <div className='bg-background p-4 border-b flex items-center justify-between'>
                <div className='flex items-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  >
                    {sidebarExpanded ? (
                      <ChevronLeft className='h-4 w-4' />
                    ) : (
                      <ChevronRight className='h-4 w-4' />
                    )}
                    <span className='sr-only'>Toggle sidebar</span>
                  </Button>
                  <span className='font-medium ml-2'>Sidebar</span>
                </div>
              </div>

              <div className='flex'>
                <div
                  className={`border-r bg-background transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-16'}`}
                >
                  <div className='p-2'>
                    <div className='space-y-1'>
                      <Button
                        variant={
                          activeSection === 'dashboard' ? 'secondary' : 'ghost'
                        }
                        className={`w-full justify-start ${!sidebarExpanded && 'justify-center px-0'}`}
                        onClick={() => {
                          setActiveSection('dashboard');
                          if (sidebarExpanded) {
                            toggleSection('dashboard');
                          }
                        }}
                      >
                        <LayoutDashboard className='h-5 w-5' />
                        {sidebarExpanded && (
                          <>
                            <span className='ml-2'>Dashboard</span>
                            <div className='ml-auto'>
                              {expandedSections['dashboard'] ? (
                                <ChevronDown className='h-4 w-4' />
                              ) : (
                                <ChevronRight className='h-4 w-4' />
                              )}
                            </div>
                          </>
                        )}
                      </Button>

                      {sidebarExpanded && expandedSections['dashboard'] && (
                        <div className='ml-6 mt-1 space-y-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full justify-start'
                          >
                            Overview
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full justify-start'
                          >
                            System Status
                          </Button>
                        </div>
                      )}

                      <Button
                        variant={
                          activeSection === 'models' ? 'secondary' : 'ghost'
                        }
                        className={`w-full justify-start ${!sidebarExpanded && 'justify-center px-0'}`}
                        onClick={() => {
                          setActiveSection('models');
                          if (sidebarExpanded) {
                            toggleSection('models');
                          }
                        }}
                      >
                        <Brain className='h-5 w-5' />
                        {sidebarExpanded && (
                          <>
                            <span className='ml-2'>AI Models</span>
                            <div className='ml-auto'>
                              {expandedSections['models'] ? (
                                <ChevronDown className='h-4 w-4' />
                              ) : (
                                <ChevronRight className='h-4 w-4' />
                              )}
                            </div>
                          </>
                        )}
                      </Button>

                      {sidebarExpanded && expandedSections['models'] && (
                        <div className='ml-6 mt-1 space-y-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full justify-start'
                          >
                            Model Library
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full justify-start'
                          >
                            Model Training
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex-1 p-4 bg-muted/20'>
                  <div className='h-32 flex items-center justify-center text-muted-foreground text-sm'>
                    Content area
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <h2 className='text-xl font-bold mb-4'>Dropdown Menus</h2>
            <div className='flex flex-wrap gap-4'>
              <div>
                <h3 className='text-sm font-medium mb-2'>User Menu</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      className='rounded-full'
                    >
                      <User className='h-5 w-5' />
                      <span className='sr-only'>User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserCircle className='mr-2 h-4 w-4' />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className='mr-2 h-4 w-4' />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className='mr-2 h-4 w-4' />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h3 className='text-sm font-medium mb-2'>
                  Navigation Dropdown
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline'>
                      <Code className='mr-2 h-4 w-4' />
                      <span>AI APIs</span>
                      <ChevronDown className='ml-2 h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>API Catalog</DropdownMenuItem>
                    <DropdownMenuItem>API Management</DropdownMenuItem>
                    <DropdownMenuItem>API Analytics</DropdownMenuItem>
                    <DropdownMenuItem>Custom API Development</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h3 className='text-sm font-medium mb-2'>Filter Popover</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline'>
                      <Filter className='mr-2 h-4 w-4' />
                      <span>Filters</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-80'>
                    <div className='space-y-4'>
                      <h3 className='font-medium'>Filter Options</h3>
                      <div className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                          <Checkbox id='filter-1' />
                          <Label htmlFor='filter-1'>Natural Language</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Checkbox id='filter-2' />
                          <Label htmlFor='filter-2'>Computer Vision</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Checkbox id='filter-3' />
                          <Label htmlFor='filter-3'>Speech & Audio</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Checkbox id='filter-4' />
                          <Label htmlFor='filter-4'>Multimodal</Label>
                        </div>
                      </div>
                      <div className='flex justify-between'>
                        <Button variant='outline' size='sm'>
                          Reset
                        </Button>
                        <Button size='sm'>Apply Filters</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <h2 className='text-xl font-bold mb-4'>Mobile Navigation</h2>
            <div className='border rounded-lg overflow-hidden max-w-sm mx-auto'>
              <div className='bg-background p-4 border-b flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Menu className='h-5 w-5' />
                  <span className='font-bold'>Krutrim Cloud</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Search className='h-5 w-5' />
                  <Bell className='h-5 w-5' />
                  <User className='h-5 w-5' />
                </div>
              </div>

              <div className='p-4'>
                <div className='border rounded-lg p-4 mb-4'>
                  <h3 className='font-medium mb-2'>Mobile Menu (Expanded)</h3>
                  <div className='border rounded-lg bg-background'>
                    <div className='p-4 border-b flex items-center justify-between'>
                      <span className='font-bold'>Krutrim Cloud</span>
                      <X className='h-5 w-5' />
                    </div>
                    <ScrollArea className='h-64'>
                      <div className='p-4 space-y-2'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <LayoutDashboard className='h-5 w-5 mr-2' />
                            <span>Dashboard</span>
                          </div>
                          <ChevronDown className='h-4 w-4' />
                        </div>
                        <div className='pl-7 space-y-1'>
                          <div className='py-1 px-2 text-sm rounded-md bg-accent'>
                            Overview
                          </div>
                          <div className='py-1 px-2 text-sm'>System Status</div>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <Brain className='h-5 w-5 mr-2' />
                            <span>AI Models</span>
                          </div>
                          <ChevronRight className='h-4 w-4' />
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <div className='border rounded-lg p-4'>
                  <h3 className='font-medium mb-2'>Mobile Filter (Expanded)</h3>
                  <div className='border rounded-lg bg-background'>
                    <div className='p-4 border-b'>
                      <h4 className='font-medium'>Filter Options</h4>
                    </div>
                    <div className='p-4 space-y-3'>
                      <div>
                        <h5 className='text-sm font-medium mb-2'>Categories</h5>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Checkbox id='m-filter-1' />
                              <Label htmlFor='m-filter-1'>
                                Natural Language
                              </Label>
                            </div>
                            <span className='text-xs text-muted-foreground'>
                              24
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Checkbox id='m-filter-2' checked />
                              <Label htmlFor='m-filter-2'>
                                Computer Vision
                              </Label>
                            </div>
                            <span className='text-xs text-muted-foreground'>
                              18
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='pt-2 flex justify-between'>
                        <Button variant='outline' size='sm'>
                          Reset
                        </Button>
                        <Button size='sm'>
                          <Check className='mr-2 h-4 w-4' />
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
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
      <path d='m15 18-6-6 6-6' />
    </svg>
  );
}
