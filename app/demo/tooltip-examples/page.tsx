'use client';

import { PageShell } from '@/components/page-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { CreateButton } from '@/components/create-button';
import { StatusBadge } from '@/components/status-badge';
import { ActionMenu } from '@/components/action-menu';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  HelpCircle,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  FileText,
} from 'lucide-react';

export default function TooltipExamplesPage() {
  return (
    <PageShell
      title='Tooltip Examples'
      description='Comprehensive showcase of tooltip implementations across the application'
    >
      <div className='space-y-8'>
        {/* Basic Tooltip Wrapper Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Tooltip Examples</CardTitle>
            <CardDescription>
              Examples using the TooltipWrapper component with different button
              styles and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-4'>
              <TooltipWrapper content='This is a primary action button'>
                <Button>Primary Button</Button>
              </TooltipWrapper>

              <TooltipWrapper content='Secondary action for less important tasks'>
                <Button variant='secondary'>Secondary Button</Button>
              </TooltipWrapper>

              <TooltipWrapper content='Destructive action - use with caution'>
                <Button variant='destructive'>Delete</Button>
              </TooltipWrapper>

              <TooltipWrapper content='Open settings and configuration options'>
                <Button variant='outline' size='icon'>
                  <Settings className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper
                content='Download the selected file'
                side='bottom'
              >
                <Button variant='ghost' size='icon'>
                  <Download className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper
                content='Upload a new file to the system'
                side='left'
              >
                <Button variant='ghost' size='icon'>
                  <Upload className='h-4 w-4' />
                </Button>
              </TooltipWrapper>
            </div>
          </CardContent>
        </Card>

        {/* Icon Button Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Icon Button Tooltips</CardTitle>
            <CardDescription>
              Icon-only buttons that greatly benefit from tooltips to explain
              their purpose
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-4'>
              <TooltipWrapper content='Refresh the current view'>
                <Button variant='outline' size='icon'>
                  <RefreshCw className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper content='Search through items'>
                <Button variant='outline' size='icon'>
                  <Search className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper content='Filter the displayed items'>
                <Button variant='outline' size='icon'>
                  <Filter className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper content='Get help and support'>
                <Button variant='outline' size='icon'>
                  <HelpCircle className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper content='View item details'>
                <Button variant='ghost' size='icon'>
                  <Eye className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper content='Edit this item'>
                <Button variant='ghost' size='icon'>
                  <Edit className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper content='Delete this item permanently'>
                <Button variant='ghost' size='icon'>
                  <Trash2 className='h-4 w-4 text-destructive' />
                </Button>
              </TooltipWrapper>
            </div>
          </CardContent>
        </Card>

        {/* Media Controls with Tooltips */}
        <Card>
          <CardHeader>
            <CardTitle>Media Controls</CardTitle>
            <CardDescription>
              Media control buttons with contextual tooltips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex gap-2'>
              <TooltipWrapper content='Start the process'>
                <Button variant='outline' size='icon'>
                  <Play className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper content='Pause the current operation'>
                <Button variant='outline' size='icon'>
                  <Pause className='h-4 w-4' />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper content='Stop the process completely'>
                <Button variant='outline' size='icon'>
                  <Square className='h-4 w-4' />
                </Button>
              </TooltipWrapper>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Components with Tooltips */}
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Components</CardTitle>
            <CardDescription>
              Existing components updated with tooltip functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {/* Create Button Examples */}
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  Create Buttons with Tooltips
                </h4>
                <div className='flex flex-wrap gap-4'>
                  <CreateButton
                    href='/compute/instances/create'
                    label='Create VM'
                    tooltip='Launch a new virtual machine instance'
                  />
                  <CreateButton
                    href='/storage/volumes/create'
                    label='Create Volume'
                    tooltip='Create a new storage volume for your data'
                  />
                  <CreateButton
                    href='/networking/vpc/create'
                    label='Create VPC'
                    tooltip='Set up a new Virtual Private Cloud'
                  />
                </div>
              </div>

              {/* Status Badge Examples */}
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  Status Badges with Tooltips
                </h4>
                <div className='flex flex-wrap gap-4'>
                  <StatusBadge status='active' />
                  <StatusBadge status='pending' />
                  <StatusBadge status='error' />
                  <StatusBadge status='success' />
                  <StatusBadge status='warning' />
                  <StatusBadge
                    status='custom'
                    tooltip='This is a custom status with a specific tooltip'
                  />
                </div>
              </div>

              {/* Action Menu Example */}
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  Action Menu with Tooltip
                </h4>
                <div className='flex gap-4'>
                  <ActionMenu
                    viewHref='/example/view'
                    editHref='/example/edit'
                    deleteHref='/example/delete'
                    resourceName='example-resource'
                    resourceType='Resource'
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tooltip Positioning Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltip Positioning</CardTitle>
            <CardDescription>
              Examples showing different tooltip positions and alignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-8 place-items-center min-h-[200px]'>
              <TooltipWrapper content='Tooltip positioned on top' side='top'>
                <Button variant='outline'>Top</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content='Tooltip positioned on top-start'
                side='top'
                align='start'
              >
                <Button variant='outline'>Top Start</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content='Tooltip positioned on top-end'
                side='top'
                align='end'
              >
                <Button variant='outline'>Top End</Button>
              </TooltipWrapper>

              <TooltipWrapper content='Tooltip positioned on left' side='left'>
                <Button variant='outline'>Left</Button>
              </TooltipWrapper>

              <TooltipWrapper content='Center positioned tooltip'>
                <Button variant='outline'>Center</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content='Tooltip positioned on right'
                side='right'
              >
                <Button variant='outline'>Right</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content='Tooltip positioned on bottom'
                side='bottom'
              >
                <Button variant='outline'>Bottom</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content='Tooltip positioned on bottom-start'
                side='bottom'
                align='start'
              >
                <Button variant='outline'>Bottom Start</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content='Tooltip positioned on bottom-end'
                side='bottom'
                align='end'
              >
                <Button variant='outline'>Bottom End</Button>
              </TooltipWrapper>
            </div>
          </CardContent>
        </Card>

        {/* Rich Content Tooltips */}
        <Card>
          <CardHeader>
            <CardTitle>Rich Content Tooltips</CardTitle>
            <CardDescription>
              Examples with more complex tooltip content including formatting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-4'>
              <TooltipWrapper
                content={
                  <div className='space-y-1'>
                    <div className='font-medium'>Virtual Machine</div>
                    <div className='text-xs text-muted-foreground'>
                      CPU: 4 cores, RAM: 16GB
                    </div>
                  </div>
                }
              >
                <Button variant='outline'>VM Details</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content={
                  <div className='space-y-1'>
                    <div className='font-medium'>Keyboard Shortcut</div>
                    <div className='text-xs text-muted-foreground'>
                      Press{' '}
                      <kbd className='px-1 py-0.5 bg-muted border rounded text-xs'>
                        Ctrl
                      </kbd>{' '}
                      +
                      <kbd className='px-1 py-0.5 bg-muted border rounded text-xs ml-1'>
                        S
                      </kbd>{' '}
                      to save
                    </div>
                  </div>
                }
              >
                <Button variant='outline'>Save Document</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content={
                  <div className='space-y-1'>
                    <div className='font-medium'>API Status</div>
                    <div className='text-xs text-green-600'>
                      ✓ All systems operational
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Last updated: 2 mins ago
                    </div>
                  </div>
                }
              >
                <Button variant='outline'>System Status</Button>
              </TooltipWrapper>
            </div>
          </CardContent>
        </Card>

        {/* Anti-Cutoff Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Anti-Cutoff & Collision Detection</CardTitle>
            <CardDescription>
              Tooltips that automatically adjust position to prevent being cut
              off at viewport edges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='border rounded-lg p-8 space-y-4'>
              <p className='text-sm text-muted-foreground mb-4'>
                Try hovering over these buttons positioned at different edges to
                see collision detection in action:
              </p>

              {/* View Docs Button Simulation */}
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  View Docs Button Simulation
                </h4>
                <div className='flex justify-end mb-4'>
                  <TooltipWrapper
                    content='View billing documentation and pricing guides'
                    side='bottom'
                    align='end'
                  >
                    <Button
                      variant='ghost'
                      size='sm'
                      className='flex items-center gap-1 font-normal text-foreground'
                    >
                      <FileText className='h-4 w-4' />
                      View Docs
                    </Button>
                  </TooltipWrapper>
                </div>
                <p className='text-xs text-muted-foreground'>
                  ↑ This simulates the "View Docs" button positioning with
                  bottom-aligned tooltip to prevent cutoff
                </p>
              </div>

              {/* Top edge test */}
              <div className='flex justify-center'>
                <TooltipWrapper content='This tooltip automatically repositions to avoid being cut off at the top of the viewport'>
                  <Button variant='outline'>Hover me (Top Edge Test)</Button>
                </TooltipWrapper>
              </div>

              {/* Left and right edge tests */}
              <div className='flex justify-between'>
                <TooltipWrapper
                  content='Long tooltip content that would normally be cut off on the left side, but now repositions intelligently'
                  side='right'
                >
                  <Button variant='outline'>Left Edge</Button>
                </TooltipWrapper>

                <TooltipWrapper
                  content='This tooltip has collision detection and will reposition to stay visible even near viewport edges'
                  side='left'
                >
                  <Button variant='outline'>Right Edge</Button>
                </TooltipWrapper>
              </div>

              {/* Bottom edge test */}
              <div className='flex justify-center'>
                <TooltipWrapper
                  content="Bottom positioned tooltip with collision detection and proper padding to ensure it's never cut off"
                  side='bottom'
                >
                  <Button variant='outline'>Bottom Edge Test</Button>
                </TooltipWrapper>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improved Styling Demo */}
        <Card>
          <CardHeader>
            <CardTitle>New Tooltip Styling</CardTitle>
            <CardDescription>
              Updated tooltips with black background and white text matching the
              table refresh button style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-4'>
              <TooltipWrapper content='Black background with white text for better contrast and consistency'>
                <Button variant='outline'>Hover for New Style</Button>
              </TooltipWrapper>

              <TooltipWrapper content='Increased side offset (8px) for better visual separation'>
                <Button variant='outline'>Better Spacing</Button>
              </TooltipWrapper>

              <TooltipWrapper
                content={
                  <div className='space-y-1'>
                    <div className='font-medium'>Enhanced Tooltips</div>
                    <div className='text-xs opacity-90'>
                      • Black background with white text
                      <br />
                      • Anti-collision detection
                      <br />
                      • Better positioning and padding
                      <br />• Consistent with table styling
                    </div>
                  </div>
                }
              >
                <Button variant='outline'>Rich Content Example</Button>
              </TooltipWrapper>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Guidelines</CardTitle>
            <CardDescription>
              Best practices for implementing tooltips in your components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <h4 className='text-sm font-medium text-green-600 mb-2'>
                  ✅ Do
                </h4>
                <ul className='text-sm text-muted-foreground space-y-1 ml-4'>
                  <li>• Use tooltips for icon-only buttons</li>
                  <li>
                    • Provide context for abbreviated text or technical terms
                  </li>
                  <li>• Include keyboard shortcuts in tooltips</li>
                  <li>• Keep tooltip text concise but descriptive</li>
                  <li>
                    • Use action-oriented language ("View documentation", not
                    "Documentation")
                  </li>
                </ul>
              </div>

              <div>
                <h4 className='text-sm font-medium text-red-600 mb-2'>
                  ❌ Don't
                </h4>
                <ul className='text-sm text-muted-foreground space-y-1 ml-4'>
                  <li>• Add tooltips to self-explanatory text buttons</li>
                  <li>
                    • Use tooltips for critical information (they're not
                    accessible on mobile)
                  </li>
                  <li>• Make tooltip text longer than necessary</li>
                  <li>• Repeat information that's already visible</li>
                  <li>• Use tooltips as a replacement for proper labels</li>
                </ul>
              </div>

              <div>
                <h4 className='text-sm font-medium mb-2'>
                  Implementation Examples
                </h4>
                <div className='bg-muted p-4 rounded-md text-sm font-mono'>
                  <div className='space-y-2'>
                    <div>
                      <span className='text-muted-foreground'>
                        // Basic usage
                      </span>
                      <br />
                      <span>
                        &lt;TooltipWrapper content="Save document"&gt;
                      </span>
                      <br />
                      <span className='ml-4'>
                        &lt;Button&gt;Save&lt;/Button&gt;
                      </span>
                      <br />
                      <span>&lt;/TooltipWrapper&gt;</span>
                    </div>
                    <br />
                    <div>
                      <span className='text-muted-foreground'>
                        // With positioning
                      </span>
                      <br />
                      <span>
                        &lt;TooltipWrapper content="Help" side="right"&gt;
                      </span>
                      <br />
                      <span className='ml-4'>
                        &lt;Button size="icon"&gt;&lt;HelpIcon
                        /&gt;&lt;/Button&gt;
                      </span>
                      <br />
                      <span>&lt;/TooltipWrapper&gt;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
