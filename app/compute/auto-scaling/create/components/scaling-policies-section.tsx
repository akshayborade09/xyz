"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface ScalingPolicy {
  id: string
  type: "CPU" | "Memory" | "Scheduled"
  upScaleTarget: number
  downScaleTarget: number
  scaleOutCooldown: number
  scaleInCooldown: number
}

interface ScalingPoliciesSectionProps {
  scalingPolicies: ScalingPolicy[]
  onAddScalingPolicy: () => void
  onUpdateScalingPolicy: (id: string, field: keyof Omit<ScalingPolicy, 'id'>, value: any) => void
  onRemoveScalingPolicy: (id: string) => void
}

export function ScalingPoliciesSection({
  scalingPolicies,
  onAddScalingPolicy,
  onUpdateScalingPolicy,
  onRemoveScalingPolicy
}: ScalingPoliciesSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Auto Scaling Policies</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Configure auto-scaling policies for CPU, memory, and scheduled actions. You can have one policy of each type (CPU, Memory, Scheduled).
        </p>
      </div>
      <div>
        {scalingPolicies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <div className="w-4 h-4 bg-gray-500 rounded -ml-1 mt-1"></div>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              No auto-scaling policies configured yet. Add your first policy to enable automatic scaling.
            </p>
            <Button size="sm" onClick={onAddScalingPolicy} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {scalingPolicies.map((policy, index) => (
              <div key={policy.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium">Scaling Policy {index + 1}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveScalingPolicy(policy.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Policy Type</Label>
                    <Select
                      value={policy.type}
                      onValueChange={(value: "CPU" | "Memory" | "Scheduled") => 
                        onUpdateScalingPolicy(policy.id, 'type', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPU">CPU</SelectItem>
                        <SelectItem value="Memory">Memory</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">Scaling Configuration</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Up Scale Target Value (%)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={policy.upScaleTarget}
                          onChange={(e) => 
                            onUpdateScalingPolicy(policy.id, 'upScaleTarget', parseInt(e.target.value) || 80)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Down Scale Target Value (%)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={policy.downScaleTarget}
                          onChange={(e) => 
                            onUpdateScalingPolicy(policy.id, 'downScaleTarget', parseInt(e.target.value) || 20)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Scale Out Cooldown (seconds)</Label>
                        <Input
                          type="number"
                          min="60"
                          value={policy.scaleOutCooldown}
                          onChange={(e) => 
                            onUpdateScalingPolicy(policy.id, 'scaleOutCooldown', parseInt(e.target.value) || 300)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Scale In Cooldown (seconds)</Label>
                        <Input
                          type="number"
                          min="60"
                          value={policy.scaleInCooldown}
                          onChange={(e) => 
                            onUpdateScalingPolicy(policy.id, 'scaleInCooldown', parseInt(e.target.value) || 300)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
