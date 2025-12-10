'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import { DetailGrid } from '@/components/detail-grid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { getPolicyById, getRolesByPolicyId } from '@/lib/iam-data';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function PolicyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const policyId = params.policyId as string;
  const policy = getPolicyById(policyId);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jsonView, setJsonView] = useState(false);

  if (!policy) {
    notFound();
  }

  const roles = getRolesByPolicyId(policyId);

  const handleDeleteConfirm = () => {
    toast({
      title: 'Policy deleted',
      description: `Policy "${policy.name}" has been deleted.`,
    });
    router.push('/iam/policies');
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(policy, null, 2));
    toast({
      title: 'Copied to clipboard',
      description: 'Policy JSON has been copied.',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const getEffectBadgeVariant = (effect: string) => {
    return effect === 'Allow' ? 'default' : 'destructive';
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/iam', title: 'IAM' },
    { href: '/iam/policies', title: 'Policies' },
    { href: `/iam/policies/${policyId}`, title: policy.name },
  ];

  return (
    <>
      <PageLayout
        title={policy.name}
        customBreadcrumbs={customBreadcrumbs}
        hideViewDocs={true}
      >
        {/* Policy Basic Information - VPC Style */}
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
          {/* Overlay Actions */}
          <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setJsonView(!jsonView)}
              className='h-8 px-3 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
            >
              {jsonView ? <EyeOff className='h-4 w-4 mr-1' /> : <Eye className='h-4 w-4 mr-1' />}
              {jsonView ? 'Hide JSON' : 'View JSON'}
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
            {/* Row 1: Policy ID, Created By, Created At */}
            <div className='col-span-full grid grid-cols-4 gap-4'>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Policy ID
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {policy.id}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Created By
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {policy.creatorName}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Created At
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {formatDate(policy.createdAt)}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-gray-700' style={{ fontSize: '13px' }}>
                  Rules
                </label>
                <div className='font-medium' style={{ fontSize: '14px' }}>
                  {policy.rules.length} {policy.rules.length === 1 ? 'rule' : 'rules'}
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
                  {policy.description || 'No description'}
                </div>
              </div>
            </div>
          </DetailGrid>
        </div>

        {/* JSON View */}
        {jsonView && (
          <div className='bg-card text-card-foreground border-border border rounded-lg p-6 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-semibold'>Policy JSON</h3>
              <Button variant='outline' size='sm' onClick={handleCopyJson}>
                <Copy className='h-4 w-4 mr-1' />
                Copy
              </Button>
            </div>
            <pre className='bg-muted p-4 rounded-md overflow-x-auto text-xs'>
              {JSON.stringify(policy, null, 2)}
            </pre>
          </div>
        )}

        {/* Access Rules Section */}
        {!jsonView && policy.rules.length > 0 && (
          <div className='bg-card text-card-foreground border-border border rounded-lg p-6 mb-6'>
            <h3 className='text-base font-semibold mb-4'>Access Rules ({policy.rules.length})</h3>
            <div className='border rounded-md'>
              {policy.rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className={`px-4 py-3 ${index !== policy.rules.length - 1 ? 'border-b' : ''}`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Badge variant={getEffectBadgeVariant(rule.effect)} className='text-xs'>
                        {rule.effect}
                      </Badge>
                      <span className='font-medium text-sm'>{rule.operation}</span>
                      <span className='text-muted-foreground text-sm'>on</span>
                      <span className='text-sm'>{rule.policyType}</span>
                    </div>
                    <code className='bg-muted px-2 py-1 rounded text-xs'>
                      {rule.resourceName}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roles Using This Policy */}
        {roles.length > 0 && (
          <div className='bg-card text-card-foreground border-border border rounded-lg p-6'>
            <h3 className='text-base font-semibold mb-4'>Roles Using This Policy ({roles.length})</h3>
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
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageLayout>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        resourceName={policy.name}
        resourceType='Policy'
      />
    </>
  );
}
