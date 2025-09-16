'use client';

import { PageLayout } from '@/components/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Trash2, Shield, Eye, MoreVertical } from 'lucide-react';
import { DetailGrid } from '@/components/detail-grid';
import { useState, use } from 'react';
import { toast } from '@/hooks/use-toast';
import { DeleteCertificateModal } from '@/components/modals/delete-certificate-modal';
import { UpdateCertificateModal } from '@/components/modals/update-certificate-modal';

// Custom Update Icon Component
const UpdateIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 12 12'
    className={className}
  >
    <title>cloud-upload-2</title>
    <g
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.2'
      stroke='currentColor'
    >
      <line x1='6' y1='11.25' x2='6' y2='6'></line>
      <path d='m10.767,7.215c.3-.412.483-.916.483-1.465,0-1.381-1.119-2.5-2.5-2.5-.243,0-.473.046-.695.11-.485-1.51-1.884-2.61-3.555-2.61C2.429.75.75,2.429.75,4.5c0,.847.292,1.62.765,2.248'></path>
      <polyline points='3.5 8.25 6 5.75 8.5 8.25'></polyline>
    </g>
  </svg>
);

interface CertificateDetails {
  id: string;
  certificateName: string;
  certificateId: string;
  krn: string;
  primaryDomain: string;
  type: 'Generic';
  expirationDate: string;
  issueDate: string;
  status: 'active' | 'expired' | 'expiring-soon' | 'pending';
  resourcesAttached: number;
  vpc: string;
  issuer: string;
  serialNumber: string;
  fingerprint: string;
  keySize: string;
  signatureAlgorithm: string;
  alternativeNames: string[];
  tags: { [key: string]: string };
  description?: string;
}

// Helper function to get relative dates
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

export default function CertificateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateDetails | null>(null);
  const resolvedParams = use(params);

  // Mock certificate data - in real app would fetch based on params.id
  // Using the same data source as the main certificates page
  const mockCertificates = [
    {
      id: 'cert-1',
      certificateName: 'production-ssl-cert',
      certificateId: 'cert-prod-12345',
      primaryDomain: 'api.production.com',
      type: 'Generic',
      expirationDate: getRelativeDate(95), // 95 days from now - Active
      status: 'active',
      resourcesAttached: 5,
      vpc: 'vpc-prod-001',
      tags: {
        Environment: 'Production',
        Team: 'Platform',
      },
    },
    {
      id: 'cert-2',
      certificateName: 'staging-ssl-cert',
      certificateId: 'cert-stage-67890',
      primaryDomain: 'api.staging.com',
      type: 'Generic',
      expirationDate: getRelativeDate(15), // 15 days from now - Expiring soon
      status: 'expiring-soon',
      resourcesAttached: 3,
      vpc: 'vpc-staging-001',
      tags: {
        Environment: 'Staging',
        Team: 'Platform',
      },
    },
    {
      id: 'cert-3',
      certificateName: 'dev-wildcard-cert',
      certificateId: 'cert-dev-11111',
      primaryDomain: '*.development.com',
      type: 'Generic',
      expirationDate: getRelativeDate(180), // 180 days from now - Active
      status: 'active',
      resourcesAttached: 0,
      vpc: 'vpc-dev-001',
      tags: {
        Environment: 'Development',
        Team: 'Platform',
      },
    },
    {
      id: 'cert-4',
      certificateName: 'code-signing-cert',
      certificateId: 'cert-code-22222',
      primaryDomain: 'signing.company.com',
      type: 'Generic',
      expirationDate: getRelativeDate(-45), // 45 days ago - Expired
      status: 'expired',
      resourcesAttached: 0,
      vpc: 'vpc-security-001',
      tags: {
        Environment: 'Production',
        Team: 'Security',
      },
    },
    {
      id: 'cert-5',
      certificateName: 'client-auth-cert',
      certificateId: 'cert-client-33333',
      primaryDomain: 'client.secure.com',
      type: 'Generic',
      expirationDate: getRelativeDate(25), // 25 days from now - Expiring soon
      status: 'active',
      resourcesAttached: 2,
      vpc: 'vpc-prod-001',
      tags: {
        Environment: 'Production',
        Team: 'Security',
      },
    },
    {
      id: 'cert-6',
      certificateName: 'load-balancer-cert',
      certificateId: 'cert-lb-44444',
      primaryDomain: 'lb.production.com',
      type: 'Generic',
      expirationDate: getRelativeDate(7), // 7 days from now - Expiring soon
      status: 'expiring-soon',
      resourcesAttached: 8,
      vpc: 'vpc-prod-001',
      tags: {
        Environment: 'Production',
        Team: 'Platform',
      },
    },
    {
      id: 'cert-7',
      certificateName: 'backup-ssl-cert',
      certificateId: 'cert-backup-55555',
      primaryDomain: 'backup.company.com',
      type: 'Generic',
      expirationDate: getRelativeDate(-10), // 10 days ago - Expired
      status: 'expired',
      resourcesAttached: 0,
      vpc: 'vpc-backup-001',
      tags: {
        Environment: 'Production',
        Team: 'Backup',
      },
    },
    {
      id: 'cert-8',
      certificateName: 'test-environment-cert',
      certificateId: 'cert-test-66666',
      primaryDomain: 'test.internal.com',
      type: 'Generic',
      expirationDate: getRelativeDate(2), // 2 days from now - Expiring soon (critical)
      status: 'expiring-soon',
      resourcesAttached: 1,
      vpc: 'vpc-dev-001',
      tags: {
        Environment: 'Testing',
        Team: 'QA',
      },
    },
    {
      id: 'cert-9',
      certificateName: 'monitoring-cert',
      certificateId: 'cert-monitor-77777',
      primaryDomain: 'monitoring.company.com',
      type: 'Generic',
      expirationDate: getRelativeDate(365), // 1 year from now - Active
      status: 'active',
      resourcesAttached: 12,
      vpc: 'vpc-monitoring-001',
      tags: {
        Environment: 'Production',
        Team: 'Monitoring',
      },
    },
    {
      id: 'cert-10',
      certificateName: 'legacy-app-cert',
      certificateId: 'cert-legacy-88888',
      primaryDomain: 'legacy.oldapp.com',
      type: 'Generic',
      expirationDate: getRelativeDate(-120), // 4 months ago - Expired
      status: 'expired',
      resourcesAttached: 0,
      vpc: 'vpc-legacy-001',
      tags: {
        Environment: 'Production',
        Team: 'Legacy',
      },
    },
  ];

  // Find the certificate by ID
  const baseCertificate =
    mockCertificates.find(cert => cert.id === resolvedParams.id) ||
    mockCertificates[0];

  // Convert to CertificateDetails format with additional fields
  const certificate: CertificateDetails = {
    id: baseCertificate.id,
    certificateName: baseCertificate.certificateName,
    certificateId: baseCertificate.certificateId,
    krn: `krn:krutrim:certificates:in-bangalore-1:123456789:certificate/${baseCertificate.id}`,
    primaryDomain: baseCertificate.primaryDomain,
    type: baseCertificate.type,
    expirationDate: baseCertificate.expirationDate,
    issueDate: new Date(
      new Date(baseCertificate.expirationDate).getTime() -
        365 * 24 * 60 * 60 * 1000
    ).toISOString(), // 1 year before expiration
    status: baseCertificate.status,
    resourcesAttached: baseCertificate.resourcesAttached,
    vpc: baseCertificate.vpc,
    issuer: "Let's Encrypt Authority X3",
    serialNumber: '03:A1:B2:C3:D4:E5:F6:78:90:AB:CD:EF',
    fingerprint:
      'SHA256: 12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC',
    keySize: '2048 bits',
    signatureAlgorithm: 'SHA256withRSA',
    alternativeNames: [
      'api-v2.example.com',
      'staging-api.example.com',
      'dev-api.example.com',
    ],
    tags: baseCertificate.tags,
    description: 'SSL certificate for production API endpoints',
  };

  const handleDelete = () => {
    // Always open the delete modal - it will show appropriate content based on usage
    setSelectedCertificate(certificate);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // Mock delete operation
    if (selectedCertificate) {
      console.log('Deleting certificate:', selectedCertificate.certificateName);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleUpdateCertificate = () => {
    setSelectedCertificate(certificate);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateConfirm = async (data: {
    certificateName: string;
    tags: { [key: string]: string };
  }) => {
    // Mock update operation
    console.log(
      'Updating certificate:',
      certificate.certificateName,
      'with data:',
      data
    );
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedCertificate(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatExpirationDate = (
    dateString: string,
    status: CertificateDetails['status']
  ) => {
    const formattedDate = formatDate(dateString);

    // Color based on status
    if (status === 'expired') {
      // Expired - red text
      return <span className='text-red-600 font-medium'>{formattedDate}</span>;
    } else if (status === 'expiring-soon') {
      // Expiring soon - orange text
      return (
        <span className='text-orange-600 font-medium'>{formattedDate}</span>
      );
    } else {
      // Active/pending - black text
      return <span className='text-black'>{formattedDate}</span>;
    }
  };

  const getStatusBadge = (status: CertificateDetails['status']) => {
    const variants = {
      active: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-700 border-green-200',
      },
      expired: { variant: 'destructive' as const, className: '' },
      'expiring-soon': {
        variant: 'secondary' as const,
        className: 'bg-orange-100 text-orange-700 border-orange-200',
      },
      pending: {
        variant: 'outline' as const,
        className: 'bg-blue-100 text-blue-700 border-blue-200',
      },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const customBreadcrumbs = [
    { href: '/dashboard', title: 'Home' },
    { href: '/administration', title: 'Administration' },
    { href: '/administration/certificates', title: 'Certificate Manager' },
    {
      href: `/administration/certificates/${resolvedParams.id}`,
      title: certificate.certificateName,
    },
  ];

  return (
    <PageLayout
      title={certificate.certificateName}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      {/* General Information */}
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
        {/* Overlay Action Buttons */}
        <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleUpdateCertificate}
                  className='h-8 w-8 p-0 text-muted-foreground hover:text-blue-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                >
                  <UpdateIcon className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update Certificate</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleDelete}
                  className='h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Certificate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className='space-y-6'>
          {/* Row 1: Status | VPC */}
          <div className='col-span-full grid grid-cols-2 gap-4 mt-2'>
            {/* Status */}
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                Status
              </label>
              <div className='flex items-center gap-2'>
                {getStatusBadge(certificate.status)}
                {(certificate.status === 'expiring-soon' ||
                  certificate.status === 'expired') && (
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleUpdateCertificate}
                    className='h-6 px-2 text-xs border-black text-black hover:bg-black hover:text-white'
                  >
                    Update Certificate
                  </Button>
                )}
              </div>
            </div>

            {/* VPC */}
            <div className='space-y-1'>
              <label
                className='text-sm font-normal text-gray-700'
                style={{ fontSize: '13px' }}
              >
                VPC
              </label>
              <div className='font-medium' style={{ fontSize: '14px' }}>
                {certificate.vpc}
              </div>
            </div>
          </div>

          {/* Row 2: KRN (Krutrim Resource Name) */}
          <div className='space-y-1'>
            <label
              className='text-sm font-normal text-gray-700'
              style={{ fontSize: '13px' }}
            >
              KRN (Krutrim Resource Name)
            </label>
            <div className='bg-white/60 rounded-lg p-3 border border-gray-200'>
              <code className='text-sm font-mono break-all text-foreground'>
                {certificate.krn}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Certificate Information */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Certificate Details */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Certificate Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label>Domain Name (CN)</Label>
              <p className='text-sm font-medium'>{certificate.primaryDomain}</p>
            </div>

            <div>
              <Label>Subject Alternative Names</Label>
              <div className='flex flex-wrap gap-2 mt-1'>
                {certificate.alternativeNames.map((name, index) => (
                  <Badge
                    key={index}
                    variant='secondary'
                    className='bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-1'
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Serial Number</Label>
              <p className='font-mono text-sm font-medium'>
                {certificate.serialNumber}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Issuer</Label>
                <p className='text-sm font-medium'>{certificate.issuer}</p>
              </div>

              <div>
                <Label>Signature Algorithm</Label>
                <p className='text-sm font-medium'>
                  {certificate.signatureAlgorithm}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Valid From</Label>
                <p className='text-sm font-medium'>
                  {formatDate(certificate.issueDate)}
                </p>
              </div>

              <div>
                <Label>Valid Till</Label>
                <p className='text-sm font-medium'>
                  {formatDate(certificate.expirationDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Associated Resources */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-lg'>Associated Resources</CardTitle>
              <div className='flex items-center justify-center w-6 h-6 bg-gray-800 text-white rounded-full text-xs font-medium'>
                {certificate.resourcesAttached}
              </div>
            </div>
          </CardHeader>
          {certificate.resourcesAttached > 0 ? (
            <CardContent>
              <div className='rounded-md border'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b bg-muted/50'>
                      <th className='h-10 px-3 text-left align-middle text-xs font-medium text-muted-foreground'>
                        Name
                      </th>
                      <th className='h-10 px-3 text-left align-middle text-xs font-medium text-muted-foreground'>
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='border-b transition-colors hover:bg-muted/50'>
                      <td className='p-3 align-middle'>
                        <div className='flex items-center gap-2'>
                          <a
                            href='/networking/load-balancing/balancer/prod-load-balancer'
                            className='text-primary hover:underline text-sm'
                          >
                            prod-load-balancer
                          </a>
                          <svg
                            className='h-3 w-3 text-muted-foreground'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                            />
                          </svg>
                        </div>
                      </td>
                      <td className='p-3 align-middle text-sm'>
                        Load Balancer
                      </td>
                    </tr>
                    <tr className='border-b transition-colors hover:bg-muted/50'>
                      <td className='p-3 align-middle'>
                        <div className='flex items-center gap-2'>
                          <a
                            href='/networking/api-gateway/api-gateway'
                            className='text-primary hover:underline text-sm'
                          >
                            api-gateway
                          </a>
                          <svg
                            className='h-3 w-3 text-muted-foreground'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                            />
                          </svg>
                        </div>
                      </td>
                      <td className='p-3 align-middle text-sm'>API Gateway</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <div className='text-center py-8 text-gray-500'>
                <p className='text-sm'>
                  No resources are currently attached to this certificate.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Delete Certificate Modal */}
      <DeleteCertificateModal
        open={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        certificate={selectedCertificate}
        onConfirm={handleDeleteConfirm}
      />

      {/* Update Certificate Modal */}
      <UpdateCertificateModal
        open={isUpdateModalOpen}
        onClose={handleUpdateModalClose}
        certificate={selectedCertificate}
        onConfirm={handleUpdateConfirm}
      />
    </PageLayout>
  );
}

// Helper Label component
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className='text-sm font-normal text-gray-700'
      style={{ fontSize: '13px' }}
    >
      {children}
    </label>
  );
}
