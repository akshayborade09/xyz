"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AutoScalingSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  asgName: string
  currentVMs: number
  minCapacity: number
  maxCapacity: number
  desiredCapacity: number
}

export function AutoScalingSettingsModal({
  isOpen,
  onClose,
  asgName,
  currentVMs,
  minCapacity,
  maxCapacity,
  desiredCapacity
}: AutoScalingSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"up" | "down">("up")
  const [desiredCount, setDesiredCount] = useState("")
  const { toast } = useToast()

  const handleUpscale = () => {
    const count = parseInt(desiredCount)
    if (!count || count <= currentVMs || count > maxCapacity) {
      toast({
        title: "Invalid Input",
        description: `Please enter a number greater than ${currentVMs} and not exceeding ${maxCapacity}.`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Upscaling Initiated",
      description: `${asgName} will scale up to ${count} VMs.`,
    })
    onClose()
  }

  const handleDownscale = () => {
    const count = parseInt(desiredCount)
    if (!count || count >= currentVMs || count < minCapacity) {
      toast({
        title: "Invalid Input",
        description: `Please enter a number less than ${currentVMs} and not below ${minCapacity}.`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Downscaling Initiated",
      description: `${asgName} will scale down to ${count} VMs.`,
    })
    onClose()
  }

  const handleClose = () => {
    setDesiredCount("")
    setActiveTab("up")
    onClose()
  }

  // Validation logic for button state
  const isUpscaleValid = () => {
    const count = parseInt(desiredCount)
    return count && count > currentVMs && count <= maxCapacity
  }

  const isDownscaleValid = () => {
    const count = parseInt(desiredCount)
    return count && count < currentVMs && count >= minCapacity
  }

  const isButtonDisabled = () => {
    if (activeTab === "up") {
      return !isUpscaleValid()
    } else {
      return !isDownscaleValid()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px]"
        style={{
          boxShadow:
            'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px',
        }}
      >
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Auto Scaling Settings - {asgName}
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Current Status and Capacity Range */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-foreground">Current Status</h3>
                <p className="text-sm text-muted-foreground">{currentVMs} VMs running</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-muted-foreground">Capacity Range</h3>
                <p className="text-lg font-semibold text-foreground">{minCapacity} - {maxCapacity} VMs</p>
              </div>
            </div>
          </div>

          {/* Scaling Tabs */}
          <div className="flex rounded-lg bg-muted p-1">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "up"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                setActiveTab("up")
                setDesiredCount("")
              }}
            >
              <TrendingUp className="h-4 w-4" />
              Up Scaling
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "down"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                setActiveTab("down")
                setDesiredCount("")
              }}
            >
              <TrendingDown className="h-4 w-4" />
              Down Scaling
            </button>
          </div>

          {/* Content based on active tab */}
          <div className="space-y-4">
            {activeTab === "up" ? (
              <>
                <p className="text-muted-foreground text-sm">
                  Scale up your auto scaling group to handle increased load. Enter a number greater than {currentVMs} VMs.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="upscale-count">Desired VM Count</Label>
                  <Input
                    id="upscale-count"
                    placeholder={`Enter number greater than ${currentVMs}`}
                    value={desiredCount}
                    onChange={(e) => setDesiredCount(e.target.value)}
                    type="number"
                    min={currentVMs + 1}
                    max={maxCapacity}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-sm">
                  Scale down your auto scaling group to reduce costs. Enter a number less than {currentVMs} VMs.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="downscale-count">Desired VM Count</Label>
                  <Input
                    id="downscale-count"
                    placeholder={`Enter number less than ${currentVMs}`}
                    value={desiredCount}
                    onChange={(e) => setDesiredCount(e.target.value)}
                    type="number"
                    min={minCapacity}
                    max={currentVMs - 1}
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={activeTab === "up" ? handleUpscale : handleDownscale}
              disabled={isButtonDisabled()}
              className="bg-black text-white hover:bg-black/90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {activeTab === "up" ? "Upscale VMs" : "Downscale VMs"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
