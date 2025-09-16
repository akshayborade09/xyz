'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/status-badge';
import { targetGroups } from '@/lib/data';
import { ActionMenu } from '@/components/action-menu';
import { ShadcnDataTable } from '@/components/ui/shadcn-data-table';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { useToast } from '@/hooks/use-toast';
import {
  filterDataForUser,
  shouldShowEmptyState,
  getEmptyStateMessage,
} from '@/lib/demo-data-filter';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export default function TargetGroupsSection() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTargetGroup, setSelectedTargetGroup] = useState<any>(null);

  // Filter data based on user type for demo
  const filteredTargetGroups = filterDataForUser(targetGroups);
  const showEmptyState =
    shouldShowEmptyState() && filteredTargetGroups.length === 0;

  const targetGroupIcon = (
    <svg
      width='320'
      height='240'
      viewBox='0 0 320 240'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='w-72'
    >
      <rect width='320' height='240' fill='white' />

      {/* Target Group container */}
      <rect
        x='40'
        y='60'
        width='240'
        height='120'
        rx='12'
        fill='#F3E5F5'
        stroke='#9C27B0'
        strokeWidth='2'
        strokeDasharray='8 4'
      />
      <text
        x='160'
        y='50'
        textAnchor='middle'
        fill='#7B1FA2'
        fontSize='12'
        fontWeight='bold'
      >
        Target Group
      </text>

      {/* Load Balancer at top */}
      <rect
        x='135'
        y='20'
        width='50'
        height='25'
        rx='6'
        fill='#4CAF50'
        stroke='#2E7D32'
        strokeWidth='2'
      />
      <text
        x='160'
        y='37'
        textAnchor='middle'
        fill='white'
        fontSize='10'
        fontWeight='bold'
      >
        LB
      </text>

      {/* Connection from LB to Target Group */}
      <line
        x1='160'
        y1='45'
        x2='160'
        y2='60'
        stroke='#666'
        strokeWidth='2'
        markerEnd='url(#arrowhead)'
      />

      {/* Target instances inside the group */}
      <rect
        x='60'
        y='80'
        width='35'
        height='25'
        rx='4'
        fill='#E8F5E8'
        stroke='#4CAF50'
        strokeWidth='1'
      />
      <text x='77.5' y='95' textAnchor='middle' fill='#2E7D32' fontSize='8'>
        VM1
      </text>
      <circle cx='87' cy='77' r='3' fill='#4CAF50' />

      <rect
        x='110'
        y='80'
        width='35'
        height='25'
        rx='4'
        fill='#E8F5E8'
        stroke='#4CAF50'
        strokeWidth='1'
      />
      <text x='127.5' y='95' textAnchor='middle' fill='#2E7D32' fontSize='8'>
        VM2
      </text>
      <circle cx='137' cy='77' r='3' fill='#4CAF50' />

      <rect
        x='175'
        y='80'
        width='35'
        height='25'
        rx='4'
        fill='#FFF3E0'
        stroke='#FF9800'
        strokeWidth='1'
      />
      <text x='192.5' y='95' textAnchor='middle' fill='#E65100' fontSize='8'>
        VM3
      </text>
      <circle cx='202' cy='77' r='3' fill='#FF9800' />

      <rect
        x='225'
        y='80'
        width='35'
        height='25'
        rx='4'
        fill='#FFEBEE'
        stroke='#F44336'
        strokeWidth='1'
      />
      <text x='242.5' y='95' textAnchor='middle' fill='#C62828' fontSize='8'>
        VM4
      </text>
      <circle cx='252' cy='77' r='3' fill='#F44336' />

      {/* Health Check configuration */}
      <rect
        x='60'
        y='120'
        width='200'
        height='45'
        rx='6'
        fill='#F8F9FA'
        stroke='#E0E0E0'
        strokeWidth='1'
      />
      <text x='70' y='135' fill='#666' fontSize='10' fontWeight='bold'>
        Health Check Settings:
      </text>
      <text x='70' y='147' fill='#666' fontSize='9'>
        Path: /health | Protocol: HTTP | Port: 80
      </text>
      <text x='70' y='158' fill='#666' fontSize='9'>
        Interval: 30s | Timeout: 5s | Threshold: 2/3
      </text>

      {/* Legend */}
      <circle cx='50' cy='200' r='4' fill='#4CAF50' />
      <text x='60' y='205' fill='#666' fontSize='10'>
        Healthy
      </text>

      <circle cx='120' cy='200' r='4' fill='#FF9800' />
      <text x='130' y='205' fill='#666' fontSize='10'>
        Warning
      </text>

      <circle cx='190' cy='200' r='4' fill='#F44336' />
      <text x='200' y='205' fill='#666' fontSize='10'>
        Unhealthy
      </text>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id='arrowhead'
          markerWidth='10'
          markerHeight='7'
          refX='9'
          refY='3.5'
          orient='auto'
        >
          <polygon points='0 0, 10 3.5, 0 7' fill='#666' />
        </marker>
      </defs>

      {/* Background grid */}
      <defs>
        <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
          <path
            d='M 20 0 L 0 0 0 20'
            fill='none'
            stroke='#f0f0f0'
            strokeWidth='1'
          />
        </pattern>
      </defs>
      <rect width='320' height='240' fill='url(#grid)' opacity='0.3' />
    </svg>
  );

  const handleDeleteClick = (targetGroup: any) => {
    setSelectedTargetGroup(targetGroup);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTargetGroup) {
      return;
    }

    // In a real app, this would delete the target group via API
    console.log('Deleting Target Group:', selectedTargetGroup.name);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show success toast
    toast({
      title: 'Target group deleted successfully',
      description: `Target Group "${selectedTargetGroup.name}" deleted successfully`,
    });

    // Close modal and clear selection
    setIsDeleteModalOpen(false);
    setSelectedTargetGroup(null);

    // In a real app, you would refresh the data here
    // For now, we'll just reload the page
    window.location.reload();
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/networking/load-balancing/target-groups/${row.id}`}
          className='text-primary font-medium hover:underline leading-5'
        >
          {value}
        </a>
      ),
    },
    {
      key: 'loadBalancer',
      label: 'Load Balancer',
      searchable: true,
      render: (value: string) => (
        <div className='leading-5'>{value || '—'}</div>
      ),
    },
    {
      key: 'targetMembers',
      label: 'Target Group Members',
      render: (value: any[], row: any) => {
        if (!value || value.length === 0) {
          return (
            <span className='text-muted-foreground leading-5'>No targets</span>
          );
        }

        // Filter to only show VMs with healthy/unhealthy status
        const filteredMembers = value.filter(
          member =>
            member.type === 'VM' &&
            (member.status === 'healthy' || member.status === 'unhealthy')
        );

        if (filteredMembers.length === 0) {
          return (
            <span className='text-muted-foreground leading-5'>
              No VM targets
            </span>
          );
        }

        // Count VMs only
        const vmCount = filteredMembers.length;

        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className='leading-5 cursor-pointer text-primary hover:underline'>
                {vmCount} VM{vmCount > 1 ? 's' : ''}
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              className='min-w-80 max-w-md'
              side='top'
              align='start'
            >
              <div className='space-y-3'>
                <h4 className='font-semibold text-sm'>Target Group Members</h4>
                <div className='space-y-3'>
                  {filteredMembers.slice(0, 3).map((member, index) => (
                    <div key={member.id} className='space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium text-sm'>
                          {member.name}
                        </span>
                        <span className='text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground'>
                          {member.type}
                        </span>
                      </div>
                      <div className='text-xs text-muted-foreground pl-0'>
                        {member.ipAddress}:{member.port}
                      </div>
                    </div>
                  ))}
                  {filteredMembers.length > 3 && (
                    <div className='text-xs text-muted-foreground text-center pt-2 border-t'>
                      +{filteredMembers.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      key: 'healthCheck',
      label: 'Health Check',
      render: (value: any) => (
        <div className='leading-5'>
          <div className='text-sm'>{value?.protocol || '—'}</div>
          <div className='text-xs text-muted-foreground'>
            {value?.interval && value?.timeout
              ? `Every ${value.interval}s, ${value.timeout}s timeout`
              : '—'}
          </div>
        </div>
      ),
    },

    {
      key: 'createdOn',
      label: 'Created On',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className='text-muted-foreground leading-5'>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className='flex justify-end'>
          <ActionMenu
            viewHref={`/networking/load-balancing/target-groups/${row.id}`}
            editHref={`/networking/load-balancing/target-groups/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType='Target Group'
          />
        </div>
      ),
    },
  ];

  // Add actions property to each target group row for DataTable
  const dataWithActions = filteredTargetGroups.map(tg => ({
    ...tg,
    actions: null,
  }));

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      {showEmptyState ? (
        <Card className='mt-8'>
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('target-group')}
              icon={targetGroupIcon}
              onAction={() =>
                (window.location.href =
                  '/networking/load-balancing/target-groups/create')
              }
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={['name', 'loadBalancer']}
          pageSize={10}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableVpcFilter={true}
          searchPlaceholder='Search TG name...'
          vpcOptions={[
            { value: 'all', label: 'All VPCs' },
            { value: 'production-vpc', label: 'production-vpc' },
            { value: 'development-vpc', label: 'development-vpc' },
            { value: 'staging-vpc', label: 'staging-vpc' },
          ]}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTargetGroup(null);
        }}
        resourceName={selectedTargetGroup?.name || ''}
        resourceType='Target Group'
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
