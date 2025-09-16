'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { type MKSCluster } from '@/lib/mks-data';
import { useToast } from '@/hooks/use-toast';

interface AddOnsEditModalProps {
  cluster: MKSCluster;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCluster: MKSCluster) => void;
}

export function AddOnsEditModal({
  cluster,
  isOpen,
  onClose,
  onUpdate,
}: AddOnsEditModalProps) {
  const { toast } = useToast();

  // State for editing add-ons
  const [editingAddOns, setEditingAddOns] = useState<Record<string, boolean>>(
    {}
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>(
    {}
  );

  // Initialize editing state when modal opens
  useEffect(() => {
    if (isOpen && cluster) {
      const initialState: Record<string, boolean> = {};
      cluster.addOns.forEach(addon => {
        initialState[addon.id] = addon.isEnabled;
      });
      setEditingAddOns(initialState);
      setHasChanges(false);
    }
  }, [isOpen, cluster]);

  const handleAddOnToggle = (addonId: string, enabled: boolean) => {
    setEditingAddOns(prev => ({
      ...prev,
      [addonId]: enabled,
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Check for critical changes that need confirmation
    const criticalChanges = cluster.addOns.filter(addon => {
      const currentState = addon.isEnabled;
      const newState = editingAddOns[addon.id];
      return (
        currentState !== newState &&
        (addon.isDefault ||
          addon.category === 'security' ||
          addon.category === 'monitoring')
      );
    });

    if (criticalChanges.length > 0) {
      setPendingChanges(editingAddOns);
      setShowConfirmation(true);
    } else {
      applyChanges(editingAddOns);
    }
  };

  const applyChanges = (changes: Record<string, boolean>) => {
    const updatedAddOns = cluster.addOns.map(addon => ({
      ...addon,
      isEnabled:
        changes[addon.id] !== undefined ? changes[addon.id] : addon.isEnabled,
    }));

    const updatedCluster = {
      ...cluster,
      addOns: updatedAddOns,
    };

    onUpdate(updatedCluster);
    setHasChanges(false);
    setShowConfirmation(false);
    onClose();
    toast({
      title: 'Add-ons updated',
      description: 'Your add-on configurations have been saved successfully.',
    });
  };

  const handleCancel = () => {
    setHasChanges(false);
    onClose();
  };

  // Categorize add-ons
  const coreAddOns = cluster.addOns.filter(addon => addon.isDefault);
  const optionalAddOns = cluster.addOns.filter(addon => !addon.isDefault);

  // Calculate changes summary
  const changedAddOns = cluster.addOns.filter(addon => {
    const currentState = addon.isEnabled;
    const newState = editingAddOns[addon.id];
    return currentState !== newState;
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='p-0 bg-white max-w-4xl max-h-[85vh] w-[80vw] h-[85vh] overflow-hidden flex flex-col'>
          <DialogHeader className='flex-shrink-0 p-6 border-b'>
            <DialogTitle>Edit Add-ons</DialogTitle>
            <DialogDescription>
              Enable or disable add-ons for your cluster. Some add-ons may
              require confirmation before changes are applied.
            </DialogDescription>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <div className='space-y-6'>
              {/* Add-ons */}
              <div className='space-y-4'>
                {cluster.addOns.map(addon => {
                  const isEnabled =
                    editingAddOns[addon.id] !== undefined
                      ? editingAddOns[addon.id]
                      : addon.isEnabled;
                  const hasChanged = addon.isEnabled !== isEnabled;

                  return (
                    <div
                      key={addon.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        hasChanged
                          ? 'border-orange-200 bg-orange-50/30'
                          : 'border-border'
                      }`}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 space-y-2 pr-4'>
                          <div className='flex items-center gap-2'>
                            <div className='text-sm font-medium'>
                              {addon.displayName}
                            </div>
                            {hasChanged && (
                              <Badge variant='outline' className='text-xs'>
                                {isEnabled ? 'Will Enable' : 'Will Disable'}
                              </Badge>
                            )}
                          </div>
                          <p className='text-sm text-muted-foreground'>
                            {addon.description}
                          </p>
                          <div className='flex items-center gap-2'>
                            <Badge
                              variant='outline'
                              className='text-xs font-mono'
                            >
                              {addon.version}
                            </Badge>
                          </div>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                          <div className='flex items-center space-x-2'>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={checked =>
                                handleAddOnToggle(addon.id, checked)
                              }
                              disabled={!addon.isEditable}
                            />
                            <Label className='text-sm'>
                              {isEnabled ? 'Enabled' : 'Disabled'}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Changes Summary */}
              {hasChanges && changedAddOns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Changes Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {changedAddOns.map(addon => {
                        const willBeEnabled = editingAddOns[addon.id];
                        return (
                          <div
                            key={addon.id}
                            className='flex items-center justify-between text-sm'
                          >
                            <span>{addon.displayName}</span>
                            <Badge
                              variant={willBeEnabled ? 'default' : 'secondary'}
                              className='text-xs'
                            >
                              {willBeEnabled ? 'Will Enable' : 'Will Disable'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter className='flex-shrink-0 p-6 border-t bg-white'>
            <Button variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={!hasChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Critical Changes */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-orange-500' />
              Confirm Critical Changes
            </DialogTitle>
            <DialogDescription>
              You're about to make changes to critical add-ons. Please review
              the impact:
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {cluster.addOns
              .filter(addon => {
                const currentState = addon.isEnabled;
                const newState = pendingChanges[addon.id];
                return (
                  currentState !== newState &&
                  (addon.isDefault ||
                    addon.category === 'security' ||
                    addon.category === 'monitoring')
                );
              })
              .map(addon => {
                const willBeEnabled = pendingChanges[addon.id];
                return (
                  <Alert key={addon.id}>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertDescription>
                      <strong>{addon.displayName}</strong> will be{' '}
                      {willBeEnabled ? 'enabled' : 'disabled'}.
                      {!willBeEnabled && addon.category === 'monitoring' && (
                        <span className='block mt-1 text-sm'>
                          This may affect cluster observability and monitoring
                          capabilities.
                        </span>
                      )}
                      {!willBeEnabled && addon.category === 'security' && (
                        <span className='block mt-1 text-sm'>
                          This may reduce cluster security features.
                        </span>
                      )}
                      {!willBeEnabled && addon.isDefault && (
                        <span className='block mt-1 text-sm'>
                          This is a core add-on and disabling it may impact
                          cluster functionality.
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                );
              })}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => applyChanges(pendingChanges)}>
              Confirm Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
