'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockRoles, type Role } from '@/lib/iam-data';

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateGroupModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedRoles([]);
    setSearch('');
    onOpenChange(false);
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleCreate = () => {
    // Validate
    if (!name.trim()) return;

    // Mock creation
    console.log('Creating group:', { name, description, roles: selectedRoles });

    // Simulate API call
    setTimeout(() => {
      onSuccess();
      handleClose();
    }, 500);
  };

  const filteredRoles = mockRoles.filter(
    role =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description.toLowerCase().includes(search.toLowerCase())
  );

  const isValid = name.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Create Group
          </DialogTitle>
          <p className='text-sm text-muted-foreground pt-2'>
            Create a new group and assign roles to it
          </p>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-sm font-medium'>
              Group Name <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='name'
              placeholder='Enter group name'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description' className='text-sm font-medium'>
              Description
            </Label>
            <Textarea
              id='description'
              placeholder='Enter group description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Attach Roles</Label>
              <p className='text-xs text-muted-foreground'>
                Select roles to attach to this group (optional)
              </p>
            </div>

            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search roles...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='pl-9'
              />
            </div>

            <div className='max-h-[300px] overflow-y-auto border rounded-md'>
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role, index) => (
                  <div
                    key={role.id}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                      selectedRoles.includes(role.id)
                        ? 'bg-primary/5'
                        : 'hover:bg-muted/50'
                    } ${index !== filteredRoles.length - 1 ? 'border-b' : ''}`}
                    onClick={() => toggleRole(role.id)}
                  >
                    <Checkbox
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => toggleRole(role.id)}
                      onClick={e => e.stopPropagation()}
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-sm truncate'>
                        {role.name}
                      </div>
                      <div className='text-xs text-muted-foreground truncate'>
                        {role.description}
                      </div>
                    </div>
                    <Badge 
                      variant={role.type === 'preset' ? 'secondary' : 'outline'}
                      className='text-[10px] px-1.5 py-0 h-4 capitalize shrink-0'
                    >
                      {role.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-sm text-muted-foreground'>
                  No roles found
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className='flex items-center justify-end gap-2'>
          <Button variant='outline' onClick={handleClose} size='sm'>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!isValid}
            size='sm'
            className='bg-black text-white hover:bg-neutral-800'
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

