'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import type { ALBFormData } from '../alb-create-form';

interface PolicyRulesSectionProps {
  formData: ALBFormData;
  updateFormData: (section: string, data: any) => void;
  isSection?: boolean;
}

interface Policy {
  id: string;
  name: string;
  action: string;
}

interface Rule {
  id: string;
  ruleType: string;
  comparator: string;
  value: string;
  key?: string;
}

export function PolicyRulesSection({
  formData,
  updateFormData,
  isSection = false,
}: PolicyRulesSectionProps) {
  const [policies, setPolicies] = useState<Policy[]>(formData.policies);
  const [rules, setRules] = useState<Rule[]>(formData.rules);

  // Sync props to local state when they change
  useEffect(() => {
    setPolicies(formData.policies);
  }, [formData.policies]);

  useEffect(() => {
    setRules(formData.rules);
  }, [formData.rules]);

  const actionOptions = [
    { value: 'redirect-to-url', label: 'Redirect to URL' },
    { value: 'reject', label: 'Reject' },
    { value: 'forward-to-target-group', label: 'Forward to Target Group' },
  ];

  const ruleTypeOptions = [
    { value: 'host-header', label: 'Host Header', requiresKey: false },
    { value: 'path-pattern', label: 'Path Pattern', requiresKey: false },
    { value: 'http-header', label: 'HTTP Header', requiresKey: true },
    {
      value: 'http-request-method',
      label: 'HTTP Request Method',
      requiresKey: false,
    },
    { value: 'query-string', label: 'Query String', requiresKey: true },
    { value: 'source-ip', label: 'Source IP', requiresKey: false },
  ];

  const comparatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts-with', label: 'Starts With' },
    { value: 'ends-with', label: 'Ends With' },
    { value: 'matches-pattern', label: 'Matches Pattern' },
  ];

  const updatePolicy = (id: string, field: string, value: string) => {
    setPolicies(
      policies.map(policy =>
        policy.id === id ? { ...policy, [field]: value } : policy
      )
    );
  };

  const updateRule = (id: string, field: string, value: string) => {
    setRules(
      rules.map(rule => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
  };

  const addRule = () => {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      ruleType: '',
      comparator: '',
      value: '',
      key: '',
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    if (rules.length > 1) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const getRuleTypeInfo = (ruleType: string) => {
    return ruleTypeOptions.find(option => option.value === ruleType);
  };

  const isFormValid = () => {
    const policiesValid = policies.every(
      policy => policy.name.trim().length > 0 && policy.action.length > 0
    );

    const rulesValid = rules.every(rule => {
      const ruleInfo = getRuleTypeInfo(rule.ruleType);
      const basicValid =
        rule.ruleType.length > 0 &&
        rule.comparator.length > 0 &&
        rule.value.trim().length > 0;

      if (ruleInfo?.requiresKey) {
        return basicValid && rule.key && rule.key.trim().length > 0;
      }

      return basicValid;
    });

    return policiesValid && rulesValid;
  };

  useEffect(() => {
    updateFormData('policyRules', { policies, rules });
  }, [policies, rules]);

  return (
    <div className='space-y-8'>
      {/* Policy Section */}
      <div>
        <div className='space-y-4'>
          {policies.map((policy, index) => (
            <div key={policy.id} className='relative'>
              <div className='mb-3'>
                <h4 className='font-medium text-sm'>Policy Configuration</h4>
              </div>

              <div className='grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20'>
                {/* Policy Name */}
                <div>
                  <Label className='block mb-2 font-medium'>
                    Policy Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    placeholder='e.g., api-routing-policy, web-redirect-policy'
                    value={policy.name}
                    onChange={e =>
                      updatePolicy(policy.id, 'name', e.target.value)
                    }
                    className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  />
                </div>

                {/* Action */}
                <div>
                  <Label className='block mb-2 font-medium'>
                    Action <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={policy.action}
                    onValueChange={value =>
                      updatePolicy(policy.id, 'action', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select action' />
                    </SelectTrigger>
                    <SelectContent>
                      {actionOptions.map(action => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rules Section */}
      <div>
        <div className='space-y-4'>
          {rules.map((rule, index) => {
            const ruleInfo = getRuleTypeInfo(rule.ruleType);

            return (
              <div key={rule.id} className='relative'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-medium text-sm'>
                    Rule Configuration {index + 1}
                  </h4>
                  {rules.length > 1 && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeRule(rule.id)}
                      className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>

                <div className='grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20'>
                  {/* Rule Type */}
                  <div>
                    <Label className='block mb-2 font-medium'>
                      Rule Type <span className='text-destructive'>*</span>
                    </Label>
                    <Select
                      value={rule.ruleType}
                      onValueChange={value =>
                        updateRule(rule.id, 'ruleType', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select rule type' />
                      </SelectTrigger>
                      <SelectContent>
                        {ruleTypeOptions.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Comparator */}
                  <div>
                    <Label className='block mb-2 font-medium'>
                      Comparator <span className='text-destructive'>*</span>
                    </Label>
                    <Select
                      value={rule.comparator}
                      onValueChange={value =>
                        updateRule(rule.id, 'comparator', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select comparator' />
                      </SelectTrigger>
                      <SelectContent>
                        {comparatorOptions.map(comparator => (
                          <SelectItem
                            key={comparator.value}
                            value={comparator.value}
                          >
                            {comparator.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Key (if required) */}
                  {ruleInfo?.requiresKey && (
                    <div>
                      <Label className='block mb-2 font-medium'>
                        Key <span className='text-destructive'>*</span>
                      </Label>
                      <Input
                        placeholder='e.g., User-Agent, Accept-Language'
                        value={rule.key || ''}
                        onChange={e =>
                          updateRule(rule.id, 'key', e.target.value)
                        }
                        className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                      />
                    </div>
                  )}

                  {/* Value */}
                  <div className={ruleInfo?.requiresKey ? '' : 'md:col-span-2'}>
                    <Label className='block mb-2 font-medium'>
                      Value <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      placeholder='e.g., /api/*, *.example.com, 192.168.1.0/24'
                      value={rule.value}
                      onChange={e =>
                        updateRule(rule.id, 'value', e.target.value)
                      }
                      className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Rule Button */}
          <Button
            type='button'
            variant='outline'
            onClick={addRule}
            className='w-full border-dashed'
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Configuration Note */}
      <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <p className='text-sm text-yellow-700'>
          <strong>Note:</strong> Each listener has one policy configuration. A
          policy can have multiple rules within it. A policy evaluates to true
          and results in execution of action when all rules are satisfied by
          incoming request.
        </p>
      </div>
    </div>
  );
}
