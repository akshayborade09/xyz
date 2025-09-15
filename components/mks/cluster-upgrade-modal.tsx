"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, CheckCircle, XCircle, ArrowRight, ChevronDown } from "lucide-react"
import { MKSCluster, getNextK8sVersion, getNextAddonVersion } from "@/lib/mks-data"

interface ClusterUpgradeModalProps {
  cluster: MKSCluster | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (clusterId: string, newVersion: string) => void
}

export function ClusterUpgradeModal({ cluster, isOpen, onClose, onConfirm }: ClusterUpgradeModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const nextVersion = cluster ? getNextK8sVersion(cluster.k8sVersion) : null
  const canUpgrade = nextVersion !== null
  const isLatestVersion = cluster?.k8sVersion === '1.33.0'
  
  // Get enabled add-ons and their upgrade information
  const enabledAddons = cluster ? cluster.addOns.filter(addon => addon.isEnabled) : []
  const addonUpgrades = enabledAddons.map(addon => ({
    addon,
    nextVersion: getNextAddonVersion(addon.id, addon.version)
  })).filter(upgrade => upgrade.nextVersion !== null)
  
  const handleUpgrade = async () => {
    if (!nextVersion || !cluster) return
    
    setIsUpgrading(true)
    try {
      await onConfirm(cluster.id, nextVersion)
      onClose()
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    setShowScrollIndicator(!isAtBottom)
  }

  // Check if content is scrollable when modal opens
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current
      setShowScrollIndicator(scrollHeight > clientHeight)
    }
  }, [isOpen, cluster])

  if (!cluster) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            {canUpgrade ? 'Upgrade Kubernetes Cluster' : 'No Upgrade Available'}
          </DialogTitle>
          <hr className="border-border" />
          <DialogDescription>
            {canUpgrade 
              ? `Upgrade ${cluster.name} to a newer Kubernetes version`
              : `${cluster.name} is already on the latest supported version`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div ref={scrollRef} className="relative flex-1 overflow-y-auto space-y-6 px-1 pb-4" style={{ maxHeight: 'calc(85vh - 180px)' }} onScroll={handleScroll}>
          <div className="space-y-6">
          {/* Kubernetes Version Upgrade */}
          {canUpgrade ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Kubernetes Version Upgrade</h3>
              <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="font-mono hover:bg-secondary hover:text-secondary-foreground">
                    v{cluster.k8sVersion}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <Badge variant="default" className="font-mono bg-blue-600 text-white hover:bg-blue-600 hover:text-white">
                    v{nextVersion}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Kubernetes Version</h3>
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm font-medium text-red-900">No upgrade available</span>
                <Badge variant="destructive" className="font-mono hover:bg-destructive hover:text-destructive-foreground">
                  v{cluster.k8sVersion} (Latest)
                </Badge>
              </div>
            </div>
          )}

          {/* Add-on Version Upgrades */}
          {canUpgrade && addonUpgrades.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Add-on Version Upgrades</h3>
              <div className="space-y-3">
                {addonUpgrades.map(({ addon, nextVersion: addonNextVersion }) => (
                  <div key={addon.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{addon.displayName}</div>
                      <div className="text-xs text-gray-500 mt-1">{addon.description}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className="font-mono text-xs hover:bg-background hover:text-foreground hover:border-border">
                        {addon.version}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-green-600" />
                      <Badge variant="default" className="font-mono text-xs bg-green-600 text-white hover:bg-green-600 hover:text-white">
                        {addonNextVersion}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Specific Message for Latest Version */}
          {isLatestVersion && (
            <Alert className="mt-6">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to upgrade. Your cluster has the latest supported Kubernetes version on Krutrim.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Warning for Upgradable Clusters */}
          {canUpgrade && (
            <Alert className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Upgrading Kubernetes version may affect workloads due to API deprecations. 
                Ensure your applications are compatible before upgrading.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Info for Upgradable Clusters */}
          {canUpgrade && (
            <div className="flex items-start gap-3 p-4 bg-muted/50 border border-border rounded-lg mt-6">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-3">What happens during upgrade?</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Cluster will be temporarily unavailable</li>
                  <li>• Workloads will be rescheduled</li>
                  <li>• API server will be updated</li>
                </ul>
              </div>
            </div>
          )}
          </div>
          
          {/* Scroll Indicator */}
          {showScrollIndicator && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded-full border">
                <ChevronDown className="h-3 w-3" />
                <span>Scroll for more info</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-6 mt-4 border-t bg-white">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {canUpgrade && (
            <Button 
              onClick={handleUpgrade} 
              disabled={isUpgrading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isUpgrading ? 'Starting Upgrade...' : 'Start Upgrade'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
