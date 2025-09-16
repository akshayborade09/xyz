'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { ALBFormData } from '../alb-create-form';

interface SummarySectionProps {
  formData: ALBFormData;
  updateFormData: (section: string, data: any) => void;
  onPrevious: () => void;
  onSubmit: () => Promise<void>;
}

export function SummarySection({
  formData,
  onPrevious,
  onSubmit,
}: SummarySectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'healthy':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bg: 'bg-green-100',
        };
      case 'unhealthy':
        return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Summary</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Review your load balancer configuration before creating. You can go
          back to any section to make changes.
        </p>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Basic Configuration */}
        <div>
          <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            Basic Configuration
          </h3>
          <div className='bg-muted/20 p-4 rounded-lg space-y-3'>
            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Name
                </div>
                <div className='font-medium'>
                  {formData.name || 'Not specified'}
                </div>
              </div>
              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Type
                </div>
                <Badge variant='outline'>{formData.loadBalancerType}</Badge>
              </div>
              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Region
                </div>
                <div>{formData.region || 'Not specified'}</div>
              </div>
              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  VPC
                </div>
                <div>{formData.vpc || 'Not specified'}</div>
              </div>
              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Subnet
                </div>
                <div>{formData.subnet || 'Not specified'}</div>
              </div>
            </div>
            {formData.description && (
              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Description
                </div>
                <div className='text-sm'>{formData.description}</div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Listeners */}
        <div>
          <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            Listeners ({formData.listeners.length})
          </h3>
          <div className='space-y-3'>
            {formData.listeners.map((listener, index) => (
              <div key={listener.id} className='bg-muted/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>
                    {listener.name || `Listener ${index + 1}`}
                  </h4>
                  <Badge variant='outline'>
                    {listener.protocol}:{listener.port}
                  </Badge>
                </div>
                <div className='grid md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Protocol:</span>{' '}
                    {listener.protocol}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Port:</span>{' '}
                    {listener.port}
                  </div>
                  {listener.alpnProtocol && (
                    <div>
                      <span className='text-muted-foreground'>ALPN:</span>{' '}
                      {listener.alpnProtocol}
                    </div>
                  )}
                  {listener.certificate && (
                    <div>
                      <span className='text-muted-foreground'>
                        Certificate:
                      </span>{' '}
                      {listener.certificate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Policies */}
        <div>
          <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            Policies ({formData.policies.length})
          </h3>
          <div className='space-y-3'>
            {formData.policies.map((policy, index) => (
              <div key={policy.id} className='bg-muted/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>
                    {policy.name || `Policy ${index + 1}`}
                  </h4>
                  <Badge variant='secondary'>{policy.action}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rules */}
        <div>
          <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            Rules ({formData.rules.length})
          </h3>
          <div className='space-y-3'>
            {formData.rules.map((rule, index) => (
              <div key={rule.id} className='bg-muted/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>Rule {index + 1}</h4>
                  <Badge variant='outline'>{rule.ruleType}</Badge>
                </div>
                <div className='grid md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Type:</span>{' '}
                    {rule.ruleType}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Comparator:</span>{' '}
                    {rule.comparator}
                  </div>
                  {rule.key && (
                    <div>
                      <span className='text-muted-foreground'>Key:</span>{' '}
                      {rule.key}
                    </div>
                  )}
                  <div>
                    <span className='text-muted-foreground'>Value:</span>{' '}
                    {rule.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Pools */}
        <div>
          <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            Pools ({formData.pools.length})
          </h3>
          <div className='space-y-3'>
            {formData.pools.map((pool, index) => (
              <div key={pool.id} className='bg-muted/20 p-4 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>
                    {pool.name || `Pool ${index + 1}`}
                  </h4>
                  <Badge variant='outline'>{pool.protocol}</Badge>
                </div>
                <div className='grid md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Algorithm:</span>{' '}
                    {pool.algorithm}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Target Group:</span>{' '}
                    {pool.targetGroup}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Estimated Configuration Impact */}
        <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <h4 className='font-semibold text-blue-900 mb-2'>
            Configuration Impact
          </h4>
          <div className='space-y-2 text-sm text-blue-700'>
            <div>
              • Load balancer will be created in{' '}
              <strong>{formData.region}</strong> region
            </div>
            <div>
              • Traffic will be distributed across{' '}
              <strong>{formData.listeners.length}</strong> listener(s)
            </div>
            <div>
              • <strong>{formData.policies.length}</strong> policy(ies) and{' '}
              <strong>{formData.rules.length}</strong> rule(s) will be applied
            </div>
            <div>
              • Traffic will be routed to{' '}
              <strong>{formData.pools.length}</strong> pool(s) with configured
              algorithms
            </div>
            <div>
              • Estimated setup time: <strong>5-10 minutes</strong>
            </div>
          </div>
        </div>

        {/* Final Validation */}
        <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
          <div className='flex items-center gap-2 mb-2'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            <h4 className='font-semibold text-green-900'>Ready to Create</h4>
          </div>
          <p className='text-sm text-green-700'>
            All required configurations have been completed. Your Application
            Load Balancer will be created with the above settings.
          </p>
        </div>
      </CardContent>

      <CardFooter className='flex justify-between'>
        <Button
          type='button'
          variant='outline'
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          ← Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className='bg-black text-white hover:bg-black/90 min-w-32'
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              Creating...
            </div>
          ) : (
            'Create Load Balancer'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
