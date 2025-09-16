'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../status-badge';
import { DetailGrid } from '../detail-grid';

interface VPCDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vpc:
    | {
        id: string;
        name: string;
        status: string;
        type: string;
        region: string;
        createdOn: string;
        description: string;
        networkName: string;
        resources?: { type: string; name: string; count: number }[];
      }
    | null
    | undefined;
}

/**
 * @component VPCDetailsModal
 * @description A modal dialog that displays VPC details information
 * @status Active
 * @example
 * <VPCDetailsModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   vpc={vpcData}
 * />
 */
export function VPCDetailsModal({
  isOpen,
  onClose,
  vpc,
}: VPCDetailsModalProps) {
  if (!vpc) {
    return null;
  }

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {vpc.name}
          </DialogTitle>
          <DialogDescription>Virtual Private Cloud Details</DialogDescription>
        </DialogHeader>

        {/* VPC Information */}
        <div className='py-4'>
          <div
            className='mb-4 p-4 rounded-lg'
            style={{
              borderRadius: '12px',
              border: '3px solid #FFF',
              background:
                'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
              boxShadow: '0px 6px 25px -6px rgba(0, 27, 135, 0.06)',
            }}
          >
            <DetailGrid>
              {/* VPC ID, Region, Status, Type in first row */}
              <div className='col-span-full grid grid-cols-4 gap-4'>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    VPC ID
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {vpc.id}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Region
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {vpc.region}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Status
                  </label>
                  <div>
                    <StatusBadge status={vpc.status} />
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Type
                  </label>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vpc.type === 'Free'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {vpc.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Network Name, Created On in second row */}
              <div className='col-span-full grid grid-cols-4 gap-4 mt-4'>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Network Name
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {vpc.networkName}
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Created On
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {formatDate(vpc.createdOn)}
                  </div>
                </div>
                <div className='space-y-1'>{/* Empty space */}</div>
                <div className='space-y-1'>{/* Empty space */}</div>
              </div>

              {/* Description */}
              <div className='col-span-full mt-4'>
                <div className='space-y-1'>
                  <label
                    className='text-sm font-normal text-gray-700'
                    style={{ fontSize: '13px' }}
                  >
                    Description
                  </label>
                  <div className='font-medium' style={{ fontSize: '14px' }}>
                    {vpc.description}
                  </div>
                </div>
              </div>
            </DetailGrid>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='border-input hover:bg-secondary transition-colors'
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
