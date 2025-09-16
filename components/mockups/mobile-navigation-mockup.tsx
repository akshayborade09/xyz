'use client';

import { useState } from 'react';
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  LayoutDashboard,
  Brain,
  Code,
  Briefcase,
  Database,
  Server,
  PenToolIcon as Tool,
  Shield,
  CreditCard,
  HelpCircle,
  Home,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function MobileNavigationMockup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-background border rounded-lg overflow-hidden max-w-md mx-auto'>
      <div className='border-b p-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-0 w-[80%] sm:max-w-sm'>
              <MobileSidebar onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className='font-bold text-lg'>Krutrim Cloud</span>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon'>
            <Search className='h-5 w-5' />
            <span className='sr-only'>Search</span>
          </Button>
          <Button variant='ghost' size='icon'>
            <Bell className='h-5 w-5' />
            <span className='sr-only'>Notifications</span>
          </Button>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <User className='h-5 w-5' />
            <span className='sr-only'>User</span>
          </Button>
        </div>
      </div>

      <div className='p-4'>
        <div className='flex items-center mb-4'>
          <Home className='h-4 w-4 text-muted-foreground' />
          <span className='mx-2 text-muted-foreground'>/</span>
          <span className='text-sm font-medium'>Dashboard</span>
        </div>

        <h1 className='text-2xl font-bold mb-2'>Dashboard</h1>
        <p className='text-muted-foreground text-sm mb-4'>
          Welcome back! Here's an overview of your Krutrim Cloud resources.
        </p>

        <div className='flex overflow-auto pb-2 mb-4 gap-2'>
          <Button variant='secondary' size='sm' className='whitespace-nowrap'>
            <LayoutDashboard className='h-4 w-4 mr-1' />
            Overview
          </Button>
          <Button variant='outline' size='sm' className='whitespace-nowrap'>
            <Server className='h-4 w-4 mr-1' />
            Resources
          </Button>
          <Button variant='outline' size='sm' className='whitespace-nowrap'>
            <Bell className='h-4 w-4 mr-1' />
            Alerts
          </Button>
          <Button variant='outline' size='sm' className='whitespace-nowrap'>
            <Database className='h-4 w-4 mr-1' />
            Storage
          </Button>
        </div>

        <div className='space-y-4'>
          <div className='border rounded-lg p-4'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='font-medium'>Active Models</h3>
              <Brain className='h-4 w-4 text-muted-foreground' />
            </div>
            <p className='text-2xl font-bold'>12</p>
            <p className='text-xs text-muted-foreground'>+2 from last week</p>
          </div>

          <div className='border rounded-lg p-4'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='font-medium'>API Calls</h3>
              <Code className='h-4 w-4 text-muted-foreground' />
            </div>
            <p className='text-2xl font-bold'>1.2M</p>
            <p className='text-xs text-muted-foreground'>+15% from last week</p>
          </div>

          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-2'>Recent Activity</h3>
            <div className='space-y-3'>
              <div className='flex items-start gap-3'>
                <div className='rounded-full bg-primary/10 p-1.5'>
                  <Brain className='h-3.5 w-3.5 text-primary' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Model Deployed</p>
                  <p className='text-xs text-muted-foreground'>
                    30 minutes ago
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='rounded-full bg-primary/10 p-1.5'>
                  <Database className='h-3.5 w-3.5 text-primary' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Dataset Updated</p>
                  <p className='text-xs text-muted-foreground'>2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  return (
    <div className='h-full flex flex-col'>
      <SheetHeader className='border-b p-4'>
        <div className='flex items-center justify-between'>
          <SheetTitle className='text-lg'>Krutrim Cloud</SheetTitle>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='h-5 w-5' />
            <span className='sr-only'>Close</span>
          </Button>
        </div>
      </SheetHeader>

      <div className='p-4 border-b'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input type='search' placeholder='Search...' className='pl-8' />
        </div>
      </div>

      <ScrollArea className='flex-1'>
        <div className='p-4'>
          <Accordion type='multiple' defaultValue={['dashboard']}>
            <AccordionItem value='dashboard'>
              <AccordionTrigger className='py-2'>
                <div className='flex items-center'>
                  <LayoutDashboard className='h-5 w-5 mr-2' />
                  <span>Dashboard</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='pl-7 space-y-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Overview & Analytics
                  </Button>

                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    System Status
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Recent Activities
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Quick Actions
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='models'>
              <AccordionTrigger className='py-2'>
                <div className='flex items-center'>
                  <Brain className='h-5 w-5 mr-2' />
                  <span>AI Models</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='pl-7 space-y-1'>
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
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Model Deployment
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Model Monitoring
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='apis'>
              <AccordionTrigger className='py-2'>
                <div className='flex items-center'>
                  <Code className='h-5 w-5 mr-2' />
                  <span>AI APIs</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='pl-7 space-y-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    API Catalog
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    API Management
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    API Analytics
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Custom API Development
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='solutions'>
              <AccordionTrigger className='py-2'>
                <div className='flex items-center'>
                  <Briefcase className='h-5 w-5 mr-2' />
                  <span>Industry Solutions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='pl-7 space-y-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Healthcare
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Financial Services
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Retail & E-commerce
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Manufacturing
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                  >
                    Media & Entertainment
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className='mt-4 pt-4 border-t'>
            <h3 className='text-xs font-semibold text-muted-foreground mb-2'>
              Supporting Features
            </h3>
            <div className='space-y-1'>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start'
              >
                <Tool className='h-5 w-5 mr-2' />
                Developer Tools
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start'
              >
                <Shield className='h-5 w-5 mr-2' />
                Security & Compliance
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start'
              >
                <CreditCard className='h-5 w-5 mr-2' />
                Billing & Administration
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start'
              >
                <HelpCircle className='h-5 w-5 mr-2' />
                Support & Resources
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className='border-t p-4'>
        <Button variant='outline' className='w-full' onClick={onClose}>
          Close Menu
        </Button>
      </div>
    </div>
  );
}
