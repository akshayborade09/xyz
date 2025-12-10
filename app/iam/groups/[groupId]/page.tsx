'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import { DetailGrid } from '@/components/detail-grid';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
  getGroupById,
  getRolesByGroupId,
  getUsersByGroupId,
  canDeleteGroup,
} from '@/lib/iam-data';
import { EditGroupModal } from '@/components/modals/edit-group-modal';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const groupId = params.groupId as string;
  const group = getGroupById(groupId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (!group) {
    notFound();
  }

  const roles = getRolesByGroupId(groupId);
  const users = getUsersByGroupId(groupId);

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    toast({
      title: 'Group updated successfully',
      description: 'The group has been updated.',
    });
    router.refresh();
  };

  const handleDeleteClick = () => {
    const validation = canDeleteGroup(groupId);
    if (!validation.canDelete) {
      toast({
        title: 'Cannot delete group',
        description: validation.reason,
        variant: 'destructive',
      });
      return;
    }
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    toast({
      title: 'Group deleted',
      description: `Group "${group.name}" has been deleted.`,
    });
    router.push('/iam/groups');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/iam', title: 'IAM' },
    { href: '/iam/groups', title: 'Groups' },
    { href: `/iam/groups/${groupId}`, title: group.name },
  ];

  return (
    <>
      <PageLayout
        title={group.name}
        customBreadcrumbs={customBreadcrumbs}
        hideViewDocs={true}
      >
        {/* Group Basic Information - VPC Style */}
        <div
          className='mb-6 group relative'
          style={{
            borderRadius: '16px',
            border: '4px solid #FFF',
            background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
            boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
            padding: '1.5rem',
          }}
        >
          {/* Overlay Edit/Delete Buttons */}
          <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setEditModalOpen(true)}
              className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleDeleteClick}
              className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>

          <DetailGrid>
            {/* Row 1: Group ID, Created At, Roles */}
            <div className='col-span-full grid grid-cols-3 gap-4'>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Group ID
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {group.id}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Created At
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {formatDate(group.createdAt)}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Roles
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {roles.length} {roles.length === 1 ? 'role' : 'roles'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className='col-span-full mt-4'>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Description
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {group.description || 'No description'}
                </div>
              </div>
            </div>
          </DetailGrid>
        </div>

        {/* Roles Section */}
        {roles.length > 0 && (
          <div className='bg-card text-card-foreground border-border border rounded-lg p-6 mb-6'>
            <h3 className='text-base font-semibold mb-4'>Attached Roles ({roles.length})</h3>
            <div className='border rounded-md'>
              {roles.map((role, index) => (
                <Link
                  key={role.id}
                  href={`/iam/roles/${role.id}`}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors ${
                    index !== roles.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium text-sm text-primary hover:underline'>
                      {role.name}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {role.description}
                    </div>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {role.policyIds.length} {role.policyIds.length === 1 ? 'policy' : 'policies'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Users Section */}
        {users.length > 0 && (
          <div className='bg-card text-card-foreground border-border border rounded-lg p-6'>
            <h3 className='text-base font-semibold mb-4'>Users in This Group ({users.length})</h3>
            <div className='border rounded-md'>
              {users.map((user, index) => (
                <Link
                  key={user.id}
                  href={`/iam/users/${user.id}`}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors ${
                    index !== users.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium text-sm text-primary hover:underline'>
                      {user.name}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {user.email}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageLayout>

      <EditGroupModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        group={group}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        resourceName={group.name}
        resourceType='Group'
      />
    </>
  );
}
