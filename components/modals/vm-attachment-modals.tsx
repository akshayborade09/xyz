'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Shield,
  HardDrive,
  Wifi,
  Trash2,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import {
  attachSecurityGroup,
  detachSecurityGroup,
  attachReservedIP,
  attachRandomIP,
  detachIP,
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

// Types for the modals
interface Volume {
  id: string;
  name: string;
  size: string;
  type: 'bootable' | 'storage';
  status: 'available' | 'attached';
  source?: string;
}

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  rules: number;
}

interface PublicIP {
  id: string;
  address: string;
  type: 'reserved' | 'random';
  status: 'available' | 'attached';
}

// Volume Management Modal
interface VolumeManagementModalProps {
  open: boolean;
  onClose: () => void;
  vmName: string;
  attachedVolumes: { bootable: Volume[]; storage: Volume[] };
  availableVolumes: Volume[];
}

export function VolumeManagementModal({
  open,
  onClose,
  vmName,
  attachedVolumes,
  availableVolumes,
}: VolumeManagementModalProps) {
  const [changeBootableModalOpen, setChangeBootableModalOpen] = useState(false);
  const [attachStorageModalOpen, setAttachStorageModalOpen] = useState(false);
  const [detachVolumeModalOpen, setDetachVolumeModalOpen] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <HardDrive className='h-5 w-5' />
              Manage Volumes - {vmName}
            </DialogTitle>
            <DialogDescription>
              Attach or detach volumes from your virtual machine
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            {/* Bootable Volumes Section */}
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-lg font-medium'>Bootable Volume</h3>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setChangeBootableModalOpen(true)}
                >
                  Change Bootable Volume
                </Button>
              </div>
              <div className='space-y-2'>
                {attachedVolumes.bootable.map(volume => (
                  <div
                    key={volume.id}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div>
                      <div className='font-medium'>{volume.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {volume.size} - {volume.type}
                      </div>
                    </div>
                    <Badge variant='secondary'>Attached</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Volumes Section */}
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-lg font-medium'>Storage Volumes</h3>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setAttachStorageModalOpen(true)}
                >
                  Attach Storage Volume
                </Button>
              </div>
              <div className='space-y-2'>
                {attachedVolumes.storage.length === 0 ? (
                  <div className='text-center py-4 text-muted-foreground'>
                    No storage volumes attached
                  </div>
                ) : (
                  attachedVolumes.storage.map(volume => (
                    <div
                      key={volume.id}
                      className='flex items-center justify-between p-3 border rounded-lg'
                    >
                      <div>
                        <div className='font-medium'>{volume.name}</div>
                        <div className='text-sm text-muted-foreground'>
                          {volume.size} - {volume.type}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary'>Attached</Badge>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            setSelectedVolume(volume);
                            setDetachVolumeModalOpen(true);
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Bootable Volume Modal */}
      <ChangeBootableVolumeModal
        open={changeBootableModalOpen}
        onClose={() => setChangeBootableModalOpen(false)}
        vmName={vmName}
        availableVolumes={availableVolumes.filter(v => v.type === 'bootable')}
      />

      {/* Attach Storage Volume Modal */}
      <AttachStorageVolumeModal
        open={attachStorageModalOpen}
        onClose={() => setAttachStorageModalOpen(false)}
        vmName={vmName}
        availableVolumes={availableVolumes.filter(v => v.type === 'storage')}
      />

      {/* Detach Volume Modal */}
      {selectedVolume && (
        <DetachVolumeModal
          open={detachVolumeModalOpen}
          onClose={() => {
            setDetachVolumeModalOpen(false);
            setSelectedVolume(null);
          }}
          volume={selectedVolume}
        />
      )}
    </>
  );
}

// Change Bootable Volume Modal
interface ChangeBootableVolumeModalProps {
  open: boolean;
  onClose: () => void;
  vmName: string;
  availableVolumes: Volume[];
}

function ChangeBootableVolumeModal({
  open,
  onClose,
  vmName,
  availableVolumes,
}: ChangeBootableVolumeModalProps) {
  const [selectedVolumeId, setSelectedVolumeId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedVolumeId) {
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Change Bootable Volume</DialogTitle>
          <DialogDescription>
            A new bootable volume has to be attached with the VM. Please select
            from the below volumes to attach to the VM. Please note that this
            will restart the machine.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Alert>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              This action will restart your virtual machine.
            </AlertDescription>
          </Alert>

          {availableVolumes.length === 0 ? (
            <div className='text-center py-4'>
              <p className='text-muted-foreground mb-4'>
                No bootable volumes available
              </p>
              <Button variant='outline'>
                <Plus className='mr-2 h-4 w-4' />
                Create New Bootable Volume
              </Button>
            </div>
          ) : (
            <RadioGroup
              value={selectedVolumeId}
              onValueChange={setSelectedVolumeId}
            >
              <div className='space-y-2'>
                {availableVolumes.map(volume => (
                  <div
                    key={volume.id}
                    className='flex items-center space-x-2 p-3 border rounded-lg'
                  >
                    <RadioGroupItem
                      value={volume.id}
                      id={volume.id}
                      className='accent-black'
                    />
                    <Label
                      htmlFor={volume.id}
                      className='flex-1 cursor-pointer'
                    >
                      <div className='font-medium'>{volume.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {volume.size}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedVolumeId || loading}
          >
            {loading ? 'Confirming...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Attach Storage Volume Modal
interface AttachStorageVolumeModalProps {
  open: boolean;
  onClose: () => void;
  vmName: string;
  availableVolumes: Volume[];
}

function AttachStorageVolumeModal({
  open,
  onClose,
  vmName,
  availableVolumes,
}: AttachStorageVolumeModalProps) {
  const [selectedVolumeId, setSelectedVolumeId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedVolumeId) {
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Attach Storage Volume</DialogTitle>
          <DialogDescription>
            A new storage volume has to be attached with the VM. Please select
            from the below volumes to attach to the VM. Please note that this
            will restart the machine.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Alert>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              This action will restart your virtual machine.
            </AlertDescription>
          </Alert>

          {availableVolumes.length === 0 ? (
            <div className='text-center py-4'>
              <p className='text-muted-foreground mb-4'>
                No storage volumes available
              </p>
              <Button variant='outline'>
                <Plus className='mr-2 h-4 w-4' />
                Create New Storage Volume
              </Button>
            </div>
          ) : (
            <RadioGroup
              value={selectedVolumeId}
              onValueChange={setSelectedVolumeId}
            >
              <div className='space-y-2'>
                {availableVolumes.map(volume => (
                  <div
                    key={volume.id}
                    className='flex items-center space-x-2 p-3 border rounded-lg'
                  >
                    <RadioGroupItem
                      value={volume.id}
                      id={volume.id}
                      className='accent-black'
                    />
                    <Label
                      htmlFor={volume.id}
                      className='flex-1 cursor-pointer'
                    >
                      <div className='font-medium'>{volume.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {volume.size}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedVolumeId || loading}
          >
            {loading ? 'Confirming...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Detach Volume Modal
interface DetachVolumeModalProps {
  open: boolean;
  onClose: () => void;
  volume: Volume;
}

function DetachVolumeModal({ open, onClose, volume }: DetachVolumeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Are you sure you want to detach the volume?</DialogTitle>
          <DialogDescription>
            The VM won't be able access the data present in the volume. Please
            note that this will restart the machine.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              Detaching <strong>{volume.name}</strong> will restart your VM and
              make the data inaccessible.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Detaching...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Security Group Management Modal
interface SecurityGroupManagementModalProps {
  open: boolean;
  onClose: () => void;
  vmId: string;
  vmName: string;
  attachedSecurityGroups: SecurityGroup[];
  availableSecurityGroups: SecurityGroup[];
}

export function SecurityGroupManagementModal({
  open,
  onClose,
  vmId,
  vmName,
  attachedSecurityGroups,
  availableSecurityGroups,
}: SecurityGroupManagementModalProps) {
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [detachModalOpen, setDetachModalOpen] = useState(false);
  const [selectedSecurityGroup, setSelectedSecurityGroup] =
    useState<SecurityGroup | null>(null);

  // Local state to track current attached and available security groups
  const [currentAttachedGroups, setCurrentAttachedGroups] = useState<
    SecurityGroup[]
  >(attachedSecurityGroups);
  const [currentAvailableGroups, setCurrentAvailableGroups] = useState<
    SecurityGroup[]
  >(availableSecurityGroups);

  // Update local state when props change
  useEffect(() => {
    setCurrentAttachedGroups(attachedSecurityGroups);
    setCurrentAvailableGroups(availableSecurityGroups);
  }, [attachedSecurityGroups, availableSecurityGroups]);

  // Handle successful attachment
  const handleAttachmentSuccess = (attachedGroup: SecurityGroup) => {
    setCurrentAttachedGroups(prev => [...prev, attachedGroup]);
    setCurrentAvailableGroups(prev =>
      prev.filter(sg => sg.id !== attachedGroup.id)
    );
    setAttachModalOpen(false);
  };

  // Handle successful detachment
  const handleDetachmentSuccess = (detachedGroup: SecurityGroup) => {
    setCurrentAttachedGroups(prev =>
      prev.filter(sg => sg.id !== detachedGroup.id)
    );
    setCurrentAvailableGroups(prev => [...prev, detachedGroup]);
    setDetachModalOpen(false);
    setSelectedSecurityGroup(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Manage Security Groups - {vmName}
            </DialogTitle>
            <DialogDescription>
              Attach or detach security groups from your virtual machine
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Attached Security Groups</h3>
              {currentAttachedGroups.length === 0 && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setAttachModalOpen(true)}
                >
                  Attach Security Group
                </Button>
              )}
            </div>

            <div className='space-y-2'>
              {currentAttachedGroups.length === 0 ? (
                <div className='text-center py-4 text-muted-foreground'>
                  No security groups attached
                </div>
              ) : (
                <>
                  {currentAttachedGroups.map(sg => (
                    <div
                      key={sg.id}
                      className='flex items-center justify-between p-3 border rounded-lg'
                    >
                      <div
                        className='flex-1 cursor-pointer'
                        onClick={() => {
                          /* Show details */
                        }}
                      >
                        <div className='font-medium'>{sg.name}</div>
                        <div className='text-sm text-muted-foreground'>
                          {sg.description}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {sg.rules} rules
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary'>Attached</Badge>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            setSelectedSecurityGroup(sg);
                            setDetachModalOpen(true);
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className='text-sm text-muted-foreground mt-2'>
                    <p>• Only one security group can be attached at a time</p>
                    <p>
                      • Detach the current security group to attach a different
                      one
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attach Security Group Modal */}
      <AttachSecurityGroupModal
        open={attachModalOpen}
        onClose={() => setAttachModalOpen(false)}
        vmId={vmId} // Pass vmName as vmId
        vmName={vmName}
        availableSecurityGroups={currentAvailableGroups}
        onAttachmentSuccess={handleAttachmentSuccess}
      />

      {/* Detach Security Group Modal */}
      {selectedSecurityGroup && (
        <DetachSecurityGroupModal
          open={detachModalOpen}
          onClose={() => {
            setDetachModalOpen(false);
            setSelectedSecurityGroup(null);
          }}
          vmId={vmId} // Pass vmName as vmId
          securityGroup={selectedSecurityGroup}
          onDetachmentSuccess={handleDetachmentSuccess}
        />
      )}
    </>
  );
}

// Attach Security Group Modal
interface AttachSecurityGroupModalProps {
  open: boolean;
  onClose: () => void;
  vmId: string;
  vmName: string;
  availableSecurityGroups: SecurityGroup[];
  onAttachmentSuccess?: (attachedGroup: SecurityGroup) => void;
}

function AttachSecurityGroupModal({
  open,
  onClose,
  vmId,
  vmName,
  availableSecurityGroups,
  onAttachmentSuccess,
}: AttachSecurityGroupModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!selectedGroupId) {
      return;
    }
    setLoading(true);
    try {
      const attachedGroup = await attachSecurityGroup(vmId, selectedGroupId);
      if (attachedGroup) {
        toast({
          title: `Security Group "${attachedGroup.name}" attached`,
          description: `Security Group "${attachedGroup.name}" has been attached to your VM.`,
        });
        if (onAttachmentSuccess) {
          onAttachmentSuccess(attachedGroup);
        }
      } else {
        toast({
          title: 'Failed to attach Security Group',
          description:
            'Could not attach the selected security group. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error attaching security group:', error);
      toast({
        title: 'Failed to attach Security Group',
        description:
          'Could not attach the selected security group. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Attach Security Group</DialogTitle>
          <DialogDescription>
            Select a security group to attach to your virtual machine
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {availableSecurityGroups.length === 0 ? (
            <div className='text-center py-4'>
              <p className='text-muted-foreground mb-4'>
                No security groups available
              </p>
              <Button variant='outline'>
                <Plus className='mr-2 h-4 w-4' />
                Create Security Group
              </Button>
            </div>
          ) : (
            <RadioGroup
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
            >
              <div className='space-y-2'>
                {availableSecurityGroups.map(sg => (
                  <div
                    key={sg.id}
                    className='flex items-center space-x-2 p-3 border rounded-lg'
                  >
                    <RadioGroupItem
                      value={sg.id}
                      id={sg.id}
                      className='accent-black'
                    />
                    <Label htmlFor={sg.id} className='flex-1 cursor-pointer'>
                      <div className='font-medium'>{sg.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {sg.description}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedGroupId || loading}
          >
            {loading ? 'Attaching...' : 'Attach'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Detach Security Group Modal
interface DetachSecurityGroupModalProps {
  open: boolean;
  onClose: () => void;
  vmId: string;
  securityGroup: SecurityGroup;
  onDetachmentSuccess?: (detachedGroup: SecurityGroup) => void;
}

function DetachSecurityGroupModal({
  open,
  onClose,
  vmId,
  securityGroup,
  onDetachmentSuccess,
}: DetachSecurityGroupModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const detachedGroup = await detachSecurityGroup(vmId, securityGroup.id);
      if (detachedGroup) {
        toast({
          title: `Security Group "${detachedGroup.name}" detached`,
          description: `Security Group "${detachedGroup.name}" has been detached from your VM.`,
        });
        if (onDetachmentSuccess) {
          onDetachmentSuccess(detachedGroup);
        }
      } else {
        toast({
          title: 'Failed to detach Security Group',
          description: 'Could not detach the security group. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error detaching security group:', error);
      toast({
        title: 'Failed to detach Security Group',
        description: 'Could not detach the security group. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to detach the security group?
          </DialogTitle>
          <DialogDescription>
            This will affect Ingress and Egress traffic to and from your VM
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              Detaching <strong>{securityGroup.name}</strong> will affect
              network traffic rules for your VM.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Detaching...' : 'Detach'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Public IP Management Modal
interface PublicIPManagementModalProps {
  open: boolean;
  onClose: () => void;
  vmName: string;
  attachedIPs: PublicIP[];
  availableIPs: PublicIP[];
}

export function PublicIPManagementModal({
  open,
  onClose,
  vmName,
  attachedIPs,
  availableIPs,
}: PublicIPManagementModalProps) {
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [detachModalOpen, setDetachModalOpen] = useState(false);
  const [selectedIP, setSelectedIP] = useState<PublicIP | null>(null);
  const [isIPAttached, setIsIPAttached] = useState(false);
  const [attachedIP, setAttachedIP] = useState<PublicIP | null>(null);
  const [isIPDetached, setIsIPDetached] = useState(false);
  const [detachedIP, setDetachedIP] = useState<PublicIP | null>(null);

  // For demo purposes, let's simulate the scenario where IP gets attached
  const handleAttachIP = () => {
    setAttachModalOpen(true);
  };

  const handleAttachConfirm = async () => {
    // Simulate attaching the first available IP
    if (availableIPs.length > 0) {
      const ipToAttach = availableIPs[0];
      setAttachedIP(ipToAttach);
      setIsIPAttached(true);
      setIsIPDetached(false);
      setDetachedIP(null);
    }
    setAttachModalOpen(false);
  };

  const handleDetachIP = (ip: PublicIP) => {
    setSelectedIP(ip);
    setDetachModalOpen(true);
  };

  const handleDetachConfirm = async () => {
    if (selectedIP) {
      setIsIPAttached(false);
      setAttachedIP(null);
      setDetachedIP(selectedIP);
      setIsIPDetached(true);
      setDetachModalOpen(false);
      setSelectedIP(null);
    }
  };

  // Show attached state for demo
  const showAttachedState = isIPAttached && attachedIP;
  const showDetachedState = isIPDetached && detachedIP;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Wifi className='h-5 w-5' />
              Manage Public IP - {vmName}
            </DialogTitle>
            <DialogDescription>
              Attach or detach public IP addresses from your virtual machine
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            <div>
              <h3 className='text-lg font-medium'>Public IP Status</h3>
            </div>

            <div className='space-y-2'>
              {showDetachedState ? (
                // Show detached state
                <div className='space-y-4'>
                  <Alert>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertDescription>
                      The public IP address has been detached from this
                      instance. You can assign a new IP address.
                    </AlertDescription>
                  </Alert>

                  <div
                    className='p-4 rounded-lg border'
                    style={{
                      borderRadius: '16px',
                      border: '4px solid #FFF',
                      background:
                        'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                      boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                    }}
                  >
                    <div className='text-center'>
                      <Button onClick={handleAttachIP}>Attach New IP</Button>
                    </div>
                  </div>
                </div>
              ) : showAttachedState ? (
                // Show attached state (after attachment)
                <div className='space-y-4'>
                  <Alert>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertDescription>
                      Public IP address <strong>{attachedIP.address}</strong>{' '}
                      has been successfully attached to this instance.
                    </AlertDescription>
                  </Alert>

                  <div className='flex items-center justify-between p-3 border rounded-lg'>
                    <div>
                      <div className='font-medium'>{attachedIP.address}</div>
                      <div className='text-sm text-muted-foreground'>
                        Type: {attachedIP.type}
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDetachIP(attachedIP)}
                      className='text-gray-600 hover:text-gray-800'
                    >
                      Detach
                    </Button>
                  </div>

                  <div className='text-sm text-muted-foreground'>
                    <p>• The IP address is now active and accessible</p>
                    <p>• Network traffic can now reach this instance</p>
                    <p>• You can detach this IP if needed</p>
                  </div>
                </div>
              ) : attachedIPs.length === 0 ? (
                <div className='space-y-4'>
                  <div className='text-center py-8'>
                    <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                      <Wifi className='h-8 w-8 text-gray-400' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                      No Public IP Attached
                    </h3>
                    <p className='text-gray-500 mb-4'>
                      This instance doesn't have a public IP address attached.
                      Attach one to enable external network access.
                    </p>
                    <Button onClick={handleAttachIP}>Attach Public IP</Button>
                  </div>

                  <div className='text-sm text-muted-foreground'>
                    <p>• Public IPs allow external access to your instance</p>
                    <p>
                      • You can choose from reserved IPs or assign a random one
                    </p>
                    <p>• There may be additional charges for IP addresses</p>
                  </div>
                </div>
              ) : (
                // Show attached state
                <>
                  {attachedIPs.map(ip => (
                    <div
                      key={ip.id}
                      className='flex items-center justify-between p-3 border rounded-lg'
                    >
                      <div>
                        <div className='font-medium'>{ip.address}</div>
                        <div className='text-sm text-muted-foreground'>
                          Type: {ip.type}
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDetachIP(ip)}
                        className='text-gray-600 hover:text-gray-800'
                      >
                        Detach
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={onClose}>
              {showAttachedState
                ? 'Done'
                : showDetachedState
                  ? 'Close'
                  : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attach Public IP Modal */}
      <AttachPublicIPModal
        open={attachModalOpen}
        onClose={() => setAttachModalOpen(false)}
        vmName={vmName}
        availableIPs={availableIPs}
        onConfirm={handleAttachConfirm}
      />

      {/* Detach Public IP Modal */}
      {selectedIP && (
        <DetachPublicIPModal
          open={detachModalOpen}
          onClose={() => {
            setDetachModalOpen(false);
            setSelectedIP(null);
          }}
          publicIP={selectedIP}
          onConfirm={handleDetachConfirm}
        />
      )}
    </>
  );
}

// Attach Public IP Modal
interface AttachPublicIPModalProps {
  open: boolean;
  onClose: () => void;
  vmName: string;
  availableIPs: PublicIP[];
  onConfirm?: () => void;
}

function AttachPublicIPModal({
  open,
  onClose,
  vmName,
  availableIPs,
  onConfirm,
}: AttachPublicIPModalProps) {
  const [selectedIPId, setSelectedIPId] = useState('');
  const [assignRandomIP, setAssignRandomIP] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!selectedIPId && !assignRandomIP) {
      return;
    }
    setLoading(true);
    try {
      let ipToAttach: PublicIP | null = null;
      if (assignRandomIP) {
        ipToAttach = await attachRandomIP(vmName);
      } else if (selectedIPId) {
        ipToAttach = await attachReservedIP(vmName, selectedIPId);
      }

      if (ipToAttach) {
        toast({
          title: `Public IP "${ipToAttach.address}" attached`,
          description: `Public IP "${ipToAttach.address}" has been attached to your VM.`,
        });
        if (onConfirm) {
          onConfirm();
        }
      } else {
        toast({
          title: 'Failed to attach Public IP',
          description:
            'Could not attach the selected public IP. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error attaching public IP:', error);
      toast({
        title: 'Failed to attach Public IP',
        description:
          'Could not attach the selected public IP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Attach Public IP</DialogTitle>
          <DialogDescription>
            Select a reserved IP address or assign a random one to your virtual
            machine
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Random IP Checkbox */}
          <div className='flex items-center space-x-2 p-3 border rounded-lg'>
            <Checkbox
              id='random-ip'
              checked={assignRandomIP}
              onCheckedChange={checked => {
                setAssignRandomIP(checked as boolean);
                if (checked) {
                  setSelectedIPId('');
                }
              }}
              className='accent-black'
            />
            <Label htmlFor='random-ip' className='flex-1 cursor-pointer'>
              <div className='font-medium'>
                Assign a random Public IP address
              </div>
            </Label>
          </div>

          {assignRandomIP && (
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                Please note that you will be charged Rs 0.28 per hour extra for
                the IP address
              </AlertDescription>
            </Alert>
          )}

          {!assignRandomIP && (
            <>
              {availableIPs.length === 0 ? (
                <div className='text-center py-4'>
                  <p className='text-muted-foreground mb-4'>
                    No reserved IP addresses available
                  </p>
                  <Button variant='outline'>
                    <Plus className='mr-2 h-4 w-4' />
                    Reserve Public IP
                  </Button>
                </div>
              ) : (
                <RadioGroup
                  value={selectedIPId}
                  onValueChange={setSelectedIPId}
                >
                  <div className='space-y-2'>
                    {availableIPs.map(ip => (
                      <div
                        key={ip.id}
                        className='flex items-center space-x-2 p-3 border rounded-lg'
                      >
                        <RadioGroupItem
                          value={ip.id}
                          id={ip.id}
                          className='accent-black'
                        />
                        <Label
                          htmlFor={ip.id}
                          className='flex-1 cursor-pointer'
                        >
                          <div className='font-medium'>{ip.address}</div>
                          <div className='text-sm text-muted-foreground'>
                            Reserved IP
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={(!selectedIPId && !assignRandomIP) || loading}
          >
            {loading ? 'Attaching...' : 'Attach'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Detach Public IP Modal
interface DetachPublicIPModalProps {
  open: boolean;
  onClose: () => void;
  publicIP: PublicIP;
  onConfirm?: () => void;
}

function DetachPublicIPModal({
  open,
  onClose,
  publicIP,
  onConfirm,
}: DetachPublicIPModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const detachedIP = await detachIP(publicIP.id);
      if (detachedIP) {
        toast({
          title: `Public IP "${detachedIP.address}" detached`,
          description: `Public IP "${detachedIP.address}" has been detached from your VM.`,
        });
        if (onConfirm) {
          onConfirm();
        }
      } else {
        toast({
          title: 'Failed to detach Public IP',
          description: 'Could not detach the public IP. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error detaching public IP:', error);
      toast({
        title: 'Failed to detach Public IP',
        description: 'Could not detach the public IP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to detach the Public IP address?
          </DialogTitle>
          <DialogDescription>
            This will affect Ingress and Egress traffic to and from and the
            access to your VM
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              Detaching <strong>{publicIP.address}</strong> will affect network
              access to your VM.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Detaching...' : 'Detach'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
