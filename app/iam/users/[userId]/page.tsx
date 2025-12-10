'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import { DetailGrid } from '@/components/detail-grid';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import {
  getUserById,
  getRolesByUserId,
  getGroupsByUserId,
  type User,
} from '@/lib/iam-data';
import { EditUserAccessModal } from '@/components/modals/edit-user-access-modal';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params.userId as string;
  const user = getUserById(userId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (!user) {
    notFound();
  }

  const roles = getRolesByUserId(userId);
  const groups = getGroupsByUserId(userId);

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    toast({
      title: 'User access updated',
      description: 'User roles and groups have been updated successfully.',
    });
    router.refresh();
  };

  const handleDeleteConfirm = () => {
    toast({
      title: 'User deleted',
      description: `User "${user.name}" has been removed from the organization.`,
    });
    router.push('/iam/users');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const getStatusVariant = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'invited':
        return 'warning';
      case 'pending':
        return 'info';
      case 'suspended':
      case 'blocked':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/iam', title: 'IAM' },
    { href: '/iam/users', title: 'Users' },
    { href: `/iam/users/${userId}`, title: user.name },
  ];

  return (
    <>
      <PageLayout
        title={user.name}
        customBreadcrumbs={customBreadcrumbs}
        hideViewDocs={true}
      >
        {/* User Basic Information - VPC Style */}
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
              onClick={() => setDeleteModalOpen(true)}
              className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>

          <DetailGrid>
            {/* Row 1: Name, Email, Status, Access Type */}
            <div className='col-span-full grid grid-cols-4 gap-4'>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Name
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {user.name}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Email
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {user.email}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Status
                </label>
                <div>
                  <StatusBadge status={getStatusVariant(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </StatusBadge>
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Access Type
                </label>
                <div className='flex gap-1'>
                  {(user.accessType === 'both' || user.accessType === 'console') && (
                    <Badge variant='secondary' className='text-xs'>Console</Badge>
                  )}
                  {(user.accessType === 'both' || user.accessType === 'programmatic') && (
                    <Badge variant='secondary' className='text-xs'>Programmatic</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Dates */}
            <div className='col-span-full grid grid-cols-3 gap-4 mt-4'>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Invited At
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {formatDate(user.invitedAt)}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Activated At
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {formatDate(user.activatedAt)}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Last Active
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {formatDate(user.lastActiveAt)}
                </div>
              </div>
            </div>
          </DetailGrid>
        </div>

        {/* Roles Section */}
        {roles.length > 0 && (
          <div className='bg-card text-card-foreground border-border border rounded-lg p-6 mb-6'>
            <h3 className='text-base font-semibold mb-4'>Roles ({roles.length})</h3>
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

        {/* Groups Section */}
        {groups.length > 0 && (
          <div className='bg-card text-card-foreground border-border border rounded-lg p-6'>
            <h3 className='text-base font-semibold mb-4'>Groups ({groups.length})</h3>
            <div className='border rounded-md'>
              {groups.map((group, index) => (
                <Link
                  key={group.id}
                  href={`/iam/groups/${group.id}`}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors ${
                    index !== groups.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium text-sm text-primary hover:underline'>
                      {group.name}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {group.description}
                    </div>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {group.roleIds.length} {group.roleIds.length === 1 ? 'role' : 'roles'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageLayout>

      <EditUserAccessModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        user={user}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        resourceName={user.name}
        resourceType='User'
      />
    </>
  );
}
