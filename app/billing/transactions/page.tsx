'use client';

import React, { useState, useCallback } from 'react';
import { PageLayout } from '@/components/page-layout';
import {
  ShadcnDataTable,
  type Column,
} from '@/components/ui/shadcn-data-table';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock transaction data - Updated to match screenshot
const mockTransactions = [
  {
    orderId: 'order_OdFCIKGdKEButi',
    created: '26th July 2024, 4:58pm',
    transactionType: 'User Paid',
    amount: 1,
    status: 'failed',
  },
  {
    orderId: 'order_Q3491W6mgCAJhw',
    created: '5th March 2025, 3:21pm',
    transactionType: 'User Paid',
    amount: 10,
    status: 'failed',
  },
  {
    orderId: 'order_QwLcMcC9J3dLMf',
    created: '23rd July 2025, 8:11am',
    transactionType: 'User Paid',
    amount: 10,
    status: 'success',
  },
  {
    orderId: 'order_QwtgcDtf2kldlD',
    created: '24th July 2025, 5:31pm',
    transactionType: 'User Paid',
    amount: 10,
    status: 'failed',
  },
  {
    orderId: 'order_QynYBC27UqYug7',
    created: '29th July 2025, 12:49pm',
    transactionType: 'User Paid',
    amount: 100,
    status: 'failed',
  },
  {
    orderId: 'order_QynYQ1iWKM3QpV',
    created: '29th July 2025, 12:49pm',
    transactionType: 'User Paid',
    amount: 10,
    status: 'failed',
  },
  {
    orderId: 'order_QynYbhX2uMkYqb',
    created: '29th July 2025, 12:49pm',
    transactionType: 'User Paid',
    amount: 5.2,
    status: 'failed',
  },
  {
    orderId: 'order_QynYkiwYSrzUo2',
    created: '29th July 2025, 12:49pm',
    transactionType: 'User Paid',
    amount: 1,
    status: 'failed',
  },
  {
    orderId: 'order_R1CTSYwP0kj56t',
    created: '4th August 2025, 2:30pm',
    transactionType: 'User Paid',
    amount: 10,
    status: 'failed',
  },
  {
    orderId: 'KRUTRIM_X5gnkF82',
    created: '5th August 2025, 5:28pm',
    transactionType: 'Free Credit',
    amount: 2000,
    status: 'success',
  },
];

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<
    (typeof mockTransactions)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Simulate data refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: 'Transactions refreshed',
      description: 'Transaction data has been updated successfully.',
    });
  }, [toast]);

  const handleViewDetails = (transaction: (typeof mockTransactions)[0]) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDownloadReceipt = (transactionId: string) => {
    toast({
      title: 'Receipt download started',
      description: `Downloading receipt for transaction ${transactionId}`,
    });
  };

  const columns: Column<(typeof mockTransactions)[0]>[] = [
    {
      key: 'orderId',
      label: 'Order Id',
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className='font-mono text-sm'>{value}</div>
      ),
    },
    {
      key: 'created',
      label: 'Created',
      sortable: true,
      render: (value: string) => (
        <div className='text-sm text-muted-foreground leading-5'>{value}</div>
      ),
    },
    {
      key: 'transactionType',
      label: 'Transaction Type',
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className='text-sm leading-5'>{value}</div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => (
        <div className='flex justify-end'>
          <div className='text-sm font-medium'>
            ₹
            {value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'right' as const,
      render: (value: string) => (
        <div className='flex justify-end'>
          <StatusBadge status={value} />
        </div>
      ),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <PageLayout
      title='Transactions'
      description='View and manage your billing transactions and payment history'
    >
      <div className='space-y-6'>
        {/* Transactions Table */}
        <ShadcnDataTable
          columns={columns}
          data={mockTransactions}
          searchableColumns={['orderId', 'transactionType']}
          defaultSort={{ column: 'created', direction: 'desc' }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableStatusFilter={true}
          statusOptions={statusOptions}
          statusFilterColumn='status'
          onStatusChange={status => {
            console.log('Status filter changed:', status);
          }}
        />

        {/* Transaction Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            className='sm:max-w-2xl'
            style={{
              boxShadow:
                'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px',
            }}
          >
            <DialogHeader className='space-y-3 pb-4'>
              <DialogTitle className='text-lg font-semibold text-black pr-8'>
                Transaction Details
              </DialogTitle>
              <hr className='border-border' />
              <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
                Detailed information for transaction{' '}
                {selectedTransaction?.orderId}
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className='space-y-6 py-2'>
                {/* Basic Information */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Order ID
                    </label>
                    <div className='font-mono text-sm'>
                      {selectedTransaction.orderId}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Created
                    </label>
                    <div className='text-sm text-muted-foreground'>
                      {selectedTransaction.created}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Transaction Type
                    </label>
                    <div className='text-sm'>
                      {selectedTransaction.transactionType}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Status
                    </label>
                    <StatusBadge status={selectedTransaction.status} />
                  </div>
                </div>

                {/* Transaction Details */}
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-muted-foreground'>
                        Amount
                      </label>
                      <div className='text-sm font-medium'>
                        ₹
                        {selectedTransaction.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter
              className='flex gap-3 sm:justify-end'
              style={{ paddingTop: '.5rem' }}
            >
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsModalOpen(false)}
                className='min-w-20'
              >
                Close
              </Button>
              {selectedTransaction?.status === 'success' && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    handleDownloadReceipt(selectedTransaction.orderId)
                  }
                  className='min-w-32'
                >
                  <Download className='h-4 w-4 mr-2' />
                  Download Receipt
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
