'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Circle,
  ArrowRight,
  User,
  Shield,
  CreditCard,
  Clock,
  Star,
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';

interface ProfileCompletionCardProps {
  onVerifyIdentity?: () => void;
}

export function ProfileCompletionCard({
  onVerifyIdentity,
}: ProfileCompletionCardProps) {
  const { user, accessLevel } = useAuth();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  if (!user || accessLevel === 'full') {
    return null;
  }

  const getCompletionData = () => {
    const { basicInfoComplete, identityVerified } = user.profileStatus;

    const steps = [
      {
        id: 'basic',
        label: 'Basic Information',
        description: 'Account setup completed',
        completed: basicInfoComplete,
        icon: User,
        required: true,
      },
      {
        id: 'identity',
        label: 'Identity Verification',
        description: 'Verify your identity for security',
        completed: identityVerified,
        icon: Shield,
        required: true,
      },
    ];

    const completedCount = steps.filter(step => step.completed).length;
    const percentage = Math.round((completedCount / steps.length) * 100);
    const nextStep = steps.find(step => !step.completed);

    return {
      steps,
      completedCount,
      totalSteps: steps.length,
      percentage,
      nextStep,
    };
  };

  const { steps, completedCount, totalSteps, percentage, nextStep } =
    getCompletionData();

  const handleCompleteProfile = () => {
    // If onVerifyIdentity callback is provided, use it instead of navigating
    if (onVerifyIdentity) {
      onVerifyIdentity();
    } else {
      router.push('/dashboard/profile-completion');
    }
  };

  const getProgressColor = () => {
    if (percentage >= 100) {
      return 'bg-green-500';
    }
    if (percentage >= 67) {
      return 'bg-blue-500';
    }
    if (percentage >= 33) {
      return 'bg-amber-500';
    }
    return 'bg-gray-400';
  };

  return (
    <Card
      className='border-0 hover:opacity-90 transition-all duration-200 cursor-pointer'
      style={{
        boxShadow: 'rgba(255, 109, 107, 0.1) 0px 0px 0px 1px inset',
        background:
          'linear-gradient(263deg, rgba(255, 109, 107, 0.08) 6.86%, rgba(255, 109, 107, 0.02) 96.69%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCompleteProfile}
    >
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div
              className='flex items-center justify-center w-8 h-8 rounded-full'
              style={{ backgroundColor: 'rgba(255, 109, 107, 0.1)' }}
            >
              <Star className='h-4 w-4' style={{ color: 'rgb(165, 47, 46)' }} />
            </div>
            <div>
              <CardTitle
                className='text-lg'
                style={{ color: 'rgb(165, 47, 46)' }}
              >
                Verify your identity
              </CardTitle>
              <CardDescription
                className='text-sm'
                style={{ color: 'rgb(165, 47, 46)', opacity: 0.8 }}
              >
                Verify your profile to unlock all Krutrim Cloud
                features—compute, storage, and more.
              </CardDescription>
            </div>
          </div>
          <Badge
            variant='outline'
            className='text-xs font-medium border-0'
            style={{
              backgroundColor:
                percentage === 100
                  ? 'rgba(255, 109, 107, 0.15)'
                  : 'rgba(255, 109, 107, 0.1)',
              color: 'rgb(165, 47, 46)',
            }}
          >
            {completedCount}/{totalSteps} Complete
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <span style={{ color: 'rgb(165, 47, 46)', opacity: 0.8 }}>
              Profile completion
            </span>
            <span className='font-medium' style={{ color: 'rgb(165, 47, 46)' }}>
              {percentage}%
            </span>
          </div>
          <div className='relative'>
            <Progress value={percentage} className='h-2' />
            <div
              className='absolute top-0 left-0 h-2 rounded-full transition-all duration-500'
              style={{
                width: `${percentage}%`,
                backgroundColor: 'rgb(165, 47, 46)',
              }}
            />
          </div>
        </div>

        {/* Steps Overview */}
        <div className='space-y-3'>
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.id} className='flex items-center space-x-3'>
                <div
                  className='flex items-center justify-center w-6 h-6 rounded-full'
                  style={{
                    backgroundColor: step.completed
                      ? 'rgba(255, 109, 107, 0.15)'
                      : 'rgba(255, 109, 107, 0.05)',
                    color: step.completed
                      ? 'rgb(165, 47, 46)'
                      : 'rgba(165, 47, 46, 0.5)',
                  }}
                >
                  {step.completed ? (
                    <CheckCircle className='h-4 w-4' />
                  ) : (
                    <Circle className='h-4 w-4' />
                  )}
                </div>
                <div className='flex-1'>
                  <p
                    className='text-sm font-medium'
                    style={{
                      color: step.completed
                        ? 'rgb(165, 47, 46)'
                        : 'rgba(165, 47, 46, 0.8)',
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className='text-xs'
                    style={{ color: 'rgba(165, 47, 46, 0.6)' }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Step Highlight */}
        {nextStep && (
          <div
            className='mt-4 p-3 rounded-lg'
            style={{
              backgroundColor: 'rgba(255, 109, 107, 0.08)',
              border: '1px solid rgba(255, 109, 107, 0.2)',
            }}
          >
            <div className='flex items-center space-x-2 mb-2'>
              <Clock
                className='h-4 w-4'
                style={{ color: 'rgb(165, 47, 46)' }}
              />
              <span
                className='text-sm font-medium'
                style={{ color: 'rgb(165, 47, 46)' }}
              >
                Next Step
              </span>
            </div>
            <p className='text-sm' style={{ color: 'rgb(165, 47, 46)' }}>
              {nextStep.label}
            </p>
            <p className='text-xs' style={{ color: 'rgba(165, 47, 46, 0.7)' }}>
              {nextStep.description}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <Button
          variant='outline'
          className='w-full mt-4 border-0 hover:opacity-90'
          style={{
            backgroundColor: 'rgba(255, 109, 107, 0.1)',
            color: 'rgb(165, 47, 46)',
            border: '1px solid rgba(255, 109, 107, 0.3)',
          }}
          onClick={handleCompleteProfile}
        >
          <span>
            {nextStep ? `Complete ${nextStep.label}` : 'Verify your identity'}
          </span>
          <ArrowRight
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`}
          />
        </Button>

        {/* Benefits Preview */}
        <div
          className='mt-4 pt-4'
          style={{ borderTop: '1px solid rgba(255, 109, 107, 0.2)' }}
        >
          <p
            className='text-xs mb-2'
            style={{ color: 'rgba(165, 47, 46, 0.7)' }}
          >
            Unlock with profile completion:
          </p>
          <div className='flex flex-wrap gap-1'>
            <Badge
              variant='outline'
              className='text-xs border-0'
              style={{
                backgroundColor: 'rgba(255, 109, 107, 0.08)',
                color: 'rgb(165, 47, 46)',
              }}
            >
              Compute Resources
            </Badge>
            <Badge
              variant='outline'
              className='text-xs border-0'
              style={{
                backgroundColor: 'rgba(255, 109, 107, 0.08)',
                color: 'rgb(165, 47, 46)',
              }}
            >
              Storage Solutions
            </Badge>
            <Badge
              variant='outline'
              className='text-xs border-0'
              style={{
                backgroundColor: 'rgba(255, 109, 107, 0.08)',
                color: 'rgb(165, 47, 46)',
              }}
            >
              Advanced AI
            </Badge>
            <Badge
              variant='outline'
              className='text-xs border-0'
              style={{
                backgroundColor: 'rgba(255, 109, 107, 0.08)',
                color: 'rgb(165, 47, 46)',
              }}
            >
              Priority Support
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
