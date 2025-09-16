'use client';
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter as DialogFooterUI,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { CreditCard, Receipt } from 'lucide-react';

const recentTransactions = [
  { id: 1, date: '2024-05-01', amount: 45, credits: 500 },
  { id: 2, date: '2024-04-15', amount: 10, credits: 100 },
  { id: 3, date: '2024-03-20', amount: 160, credits: 2000 },
];

const mockAddress = {
  name: 'Rakesh Mondal',
  line1: '123 Main St',
  line2: 'Suite 400',
  city: 'Bangalore',
  state: 'KA',
  zip: '560001',
  country: 'India',
};

export default function AddCreditsPage() {
  const [customAmount, setCustomAmount] = useState('');
  const [address, setAddress] = useState(mockAddress);
  const [editAddress, setEditAddress] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    credits: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const router = useRouter();

  // Update order summary when custom amount changes
  React.useEffect(() => {
    if (customAmount) {
      const amount = parseInt(customAmount, 10) || 0;
      const subtotal = amount;
      const tax = Math.round(subtotal * 0.18); // 18% GST
      const total = subtotal + tax;
      setOrderSummary({
        credits: amount,
        subtotal: subtotal,
        tax: tax,
        total: total,
      });
    } else {
      setOrderSummary({ credits: 0, subtotal: 0, tax: 0, total: 0 });
    }
  }, [customAmount]);

  return (
    <PageShell
      title='Add Credits'
      description='Purchase additional credits to continue using Krutrim Cloud services.'
      hideViewDocs={true}
    >
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className='space-y-6 pt-6'>
              {/* Amount and Billing Address Row */}
              <div
                className='flex flex-col md:flex-row gap-6'
                style={{
                  borderRadius: '16px',
                  border: '4px solid #FFF',
                  background:
                    'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                  boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                  padding: '1.5rem',
                }}
              >
                {/* Billing Address */}
                <div className='flex-1 md:order-2 text-right group cursor-pointer'>
                  <div className='mb-2 text-right'>
                    <Button
                      variant='link'
                      size='sm'
                      onClick={() => setEditAddress(true)}
                      className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2'
                    >
                      Edit
                    </Button>
                    <span className='font-medium text-muted-foreground'>
                      Billing Address
                    </span>
                  </div>
                  <div className='text-sm text-muted-foreground text-right'>
                    <div>{address.name}</div>
                    <div>
                      {address.line1}
                      {address.line2 ? ', ' + address.line2 : ''}
                    </div>
                    <div>
                      {address.city}, {address.state} {address.zip}
                    </div>
                    <div>{address.country}</div>
                  </div>
                </div>

                {/* Custom Amount */}
                <div className='flex-1 md:order-1'>
                  <div className='font-medium mb-2 text-2xl'>Enter amount</div>
                  <Input
                    type='number'
                    min={1}
                    placeholder='₹1000'
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className='max-w-xs h-12 text-lg'
                  />
                </div>
              </div>
              {/* Enhanced Order Summary */}
              <div className='pt-4 mt-4 px-6'>
                <div className='font-medium mb-3 text-muted-foreground'>
                  Order Summary
                </div>

                {/* Credits Line Item */}
                <div className='flex items-start gap-3 py-2'>
                  <div className='w-10 h-10 bg-muted rounded-lg flex items-center justify-center'>
                    <CreditCard className='w-5 h-5 text-muted-foreground' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>
                      Krutrim Cloud Credits - {orderSummary.credits} Credits
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Pay as you go credits for cloud services
                    </div>
                  </div>
                  <div className='font-semibold'>
                    ₹{orderSummary.subtotal}.00
                  </div>
                </div>

                {/* Dashed Separator */}
                <div className='border-b border-dashed border-gray-300 my-2'></div>

                {/* Tax Line Item */}
                <div className='flex items-start gap-3 py-2'>
                  <div className='w-10 h-10 bg-muted rounded-lg flex items-center justify-center'>
                    <Receipt className='w-5 h-5 text-muted-foreground' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>Taxes and Fees</div>
                    <div className='text-sm text-muted-foreground'>
                      GST (18%)
                    </div>
                  </div>
                  <div className='font-semibold'>₹{orderSummary.tax}.00</div>
                </div>

                {/* Total */}
                <div className='mt-4 pt-3 border-t'>
                  <div className='flex items-center justify-end gap-2'>
                    <span className='text-xl font-bold'>Total</span>
                    <span className='text-2xl font-bold text-black'>
                      ₹{orderSummary.total}.00
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end gap-2 px-6'>
              <Button variant='outline' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant='default'>Purchase Credits</Button>
            </CardFooter>
          </Card>
        </div>
        {/* Side Panel */}
        <div className='w-full md:w-80 space-y-6'>
          {/* Help Documentation */}
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle className='text-base'>Billing documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground mb-3'>
                Learn about billing, credit management, and payment options to
                optimize your cloud spending.
              </p>
              <Button
                variant='link'
                size='sm'
                className='px-0 h-auto text-sm'
                onClick={() => router.push('/documentation')}
              >
                Learn more →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {recentTransactions.map(tx => (
                  <li key={tx.id} className='flex justify-between text-sm'>
                    <span>{tx.date}</span>
                    <span className='text-muted-foreground'>
                      +{tx.credits} credits
                    </span>
                    <span className='font-medium'>₹{tx.amount}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant='link'
                size='sm'
                className='mt-2 px-0'
                onClick={() => router.push('/billing/transactions')}
              >
                View all transactions →
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Edit Address Dialog */}
        <Dialog open={editAddress} onOpenChange={setEditAddress}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Billing Address</DialogTitle>
            </DialogHeader>
            <div className='space-y-2'>
              <Input
                value={address.name}
                onChange={e => setAddress({ ...address, name: e.target.value })}
                placeholder='Name'
              />
              <Input
                value={address.line1}
                onChange={e =>
                  setAddress({ ...address, line1: e.target.value })
                }
                placeholder='Address Line 1'
              />
              <Input
                value={address.line2}
                onChange={e =>
                  setAddress({ ...address, line2: e.target.value })
                }
                placeholder='Address Line 2'
              />
              <Input
                value={address.city}
                onChange={e => setAddress({ ...address, city: e.target.value })}
                placeholder='City'
              />
              <Input
                value={address.state}
                onChange={e =>
                  setAddress({ ...address, state: e.target.value })
                }
                placeholder='State'
              />
              <Input
                value={address.zip}
                onChange={e => setAddress({ ...address, zip: e.target.value })}
                placeholder='ZIP Code'
              />
              <Input
                value={address.country}
                onChange={e =>
                  setAddress({ ...address, country: e.target.value })
                }
                placeholder='Country'
              />
            </div>
            <DialogFooterUI>
              <Button variant='outline' onClick={() => setEditAddress(false)}>
                Cancel
              </Button>
              <Button variant='default' onClick={() => setEditAddress(false)}>
                Save
              </Button>
            </DialogFooterUI>
          </DialogContent>
        </Dialog>
      </div>
    </PageShell>
  );
}
