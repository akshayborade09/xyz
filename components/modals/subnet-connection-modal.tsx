'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Unlink } from 'lucide-react';
import {
  getConnectedSubnets,
  addSubnetConnection,
  removeSubnetConnection,
  subnets,
  getSubnet,
} from '../../lib/data';

interface SubnetConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subnet: {
    id: string;
    name: string;
    vpcName: string;
    type: string;
    status: string;
  } | null;
}

/**
 * @component SubnetConnectionModal
 * @description A modal dialog that manages subnet-to-subnet connections
 * @status Active
 */
export function SubnetConnectionModal({
  isOpen,
  onClose,
  subnet,
}: SubnetConnectionModalProps) {
  const [showConnectView, setShowConnectView] = useState(false);
  const [selectedSubnets, setSelectedSubnets] = useState<string[]>([]);
  const [disconnectingSubnet, setDisconnectingSubnet] = useState<string | null>(
    null
  );

  if (!subnet) {
    return null;
  }

  const connectedSubnetIds = getConnectedSubnets(subnet.id);
  const connectedSubnets = connectedSubnetIds
    .map(id => getSubnet(id))
    .filter(Boolean) as Array<ReturnType<typeof getSubnet> & {}>;

  // Get subnets from the same VPC (excluding current subnet and already connected ones)
  const sameVpcSubnets = subnets.filter(
    s =>
      s.vpcName === subnet.vpcName &&
      s.id !== subnet.id &&
      !connectedSubnetIds.includes(s.id)
  );

  const handleDisconnect = (targetSubnetId: string) => {
    setDisconnectingSubnet(targetSubnetId);
  };

  const confirmDisconnect = () => {
    if (disconnectingSubnet) {
      removeSubnetConnection(subnet.id, disconnectingSubnet);
      setDisconnectingSubnet(null);
    }
  };

  const handleConnect = () => {
    selectedSubnets.forEach(targetId => {
      addSubnetConnection(subnet.id, targetId);
    });
    setSelectedSubnets([]);
    setShowConnectView(false);
  };

  const toggleSubnetSelection = (subnetId: string) => {
    setSelectedSubnets(prev =>
      prev.includes(subnetId)
        ? prev.filter(id => id !== subnetId)
        : [...prev, subnetId]
    );
  };

  const resetModal = () => {
    setShowConnectView(false);
    setSelectedSubnets([]);
    setDisconnectingSubnet(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {showConnectView ? 'Connect Subnets' : 'Subnet Connections'}
          </DialogTitle>
          <DialogDescription>
            {showConnectView
              ? `Select subnets to connect to ${subnet.name}`
              : `Manage connections for ${subnet.name}`}
          </DialogDescription>
        </DialogHeader>

        {/* Disconnect Confirmation Alert */}
        {disconnectingSubnet && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl'>
              <div className='flex items-center gap-3 mb-4'>
                <AlertTriangle className='h-5 w-5 text-orange-500' />
                <h3 className='text-lg font-semibold'>Confirm Disconnection</h3>
              </div>
              <p className='text-sm text-muted-foreground mb-6'>
                Are you sure you want to disconnect from{' '}
                {getSubnet(disconnectingSubnet)?.name}? This action will remove
                the connection between both subnets.
              </p>
              <div className='flex gap-3 justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setDisconnectingSubnet(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={confirmDisconnect}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className='py-4'>
          {showConnectView ? (
            /* Connect View */
            <div className='space-y-4'>
              {sameVpcSubnets.length > 0 ? (
                <div className='space-y-3'>
                  <h4 className='font-medium text-sm'>
                    Available Subnets in {subnet.vpcName}
                  </h4>
                  {sameVpcSubnets.map(availableSubnet => (
                    <div
                      key={availableSubnet.id}
                      className='flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer'
                      onClick={() => toggleSubnetSelection(availableSubnet.id)}
                    >
                      <Checkbox
                        checked={selectedSubnets.includes(availableSubnet.id)}
                        onChange={() => {}} // Handled by onClick above
                      />
                      <div className='flex-1'>
                        <div className='font-medium text-sm'>
                          {availableSubnet.name}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {availableSubnet.cidr}
                        </div>
                      </div>
                      <StatusBadge status={availableSubnet.type} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='text-muted-foreground text-sm mb-4'>
                    No available subnets to connect in the VPC {subnet.vpcName}
                  </div>
                  <Button
                    variant='default'
                    onClick={() =>
                      (window.location.href = '/networking/subnets/create')
                    }
                  >
                    Create Subnet
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Main View */
            <div className='space-y-4'>
              {/* Connected Subnets */}
              {connectedSubnets.length > 0 ? (
                <div className='space-y-3'>
                  <h4 className='font-medium text-sm'>
                    Connected Subnets ({connectedSubnets.length})
                  </h4>
                  {connectedSubnets.map(connectedSubnet => (
                    <div
                      key={connectedSubnet.id}
                      className='flex items-center justify-between p-3 border rounded-lg bg-muted/30'
                    >
                      <div className='flex items-center space-x-3'>
                        <div>
                          <div className='font-medium text-sm'>
                            {connectedSubnet.name}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {connectedSubnet.cidr}
                          </div>
                        </div>
                        <StatusBadge status={connectedSubnet.type} />
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDisconnect(connectedSubnet.id)}
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Unlink className='h-4 w-4 mr-1' />
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='mb-4'>
                    <svg
                      width='120'
                      height='80'
                      viewBox='0 0 120 80'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='mx-auto'
                    >
                      <rect width='120' height='80' fill='#FFFFFF' />
                      <circle
                        cx='30'
                        cy='40'
                        r='12'
                        fill='none'
                        stroke='#E5E7EB'
                        strokeWidth='2'
                      />
                      <circle
                        cx='90'
                        cy='40'
                        r='12'
                        fill='none'
                        stroke='#E5E7EB'
                        strokeWidth='2'
                      />
                      <path
                        d='M42 40H78'
                        stroke='#E5E7EB'
                        strokeWidth='2'
                        strokeDasharray='4 4'
                      />
                    </svg>
                  </div>
                  <h4 className='font-medium text-sm mb-2'>
                    No Connected Subnets
                  </h4>
                  <p className='text-xs text-muted-foreground mb-4'>
                    This subnet is not connected to any other subnets yet.
                  </p>
                  <Button
                    variant='outline'
                    onClick={() => setShowConnectView(true)}
                  >
                    Connect Subnet
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='flex justify-center'>
          {showConnectView ? (
            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={() => setShowConnectView(false)}
              >
                Back
              </Button>
              <Button
                onClick={handleConnect}
                disabled={selectedSubnets.length === 0}
              >
                Connect ({selectedSubnets.length})
              </Button>
            </div>
          ) : connectedSubnets.length > 0 ? (
            <Button variant='outline' onClick={() => setShowConnectView(true)}>
              Connect Subnet
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
