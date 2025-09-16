"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"

import { CreateVPCModal } from "@/components/modals/vm-creation-modals"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { mockSubnets } from "@/lib/cluster-creation-data"
import { vpcs, autoScalingGroups } from "@/lib/data"
import { Plus, X } from "lucide-react"
import { ScalingPoliciesSection } from "../../../create/components/scaling-policies-section"
import { ScriptsTagsSection } from "../../../create/components/scripts-tags-section"
import { StorageSection } from "../../../create/components/storage-section"

interface ASGFormData {
  // Basic Information
  asgName: string
  creationMode: "scratch" | "template"
  selectedTemplate: string

  // Network Configuration (read-only in edit mode)
  region: string
  vpc: string
  subnets: string[]
  securityGroups: string[]

  // Instance Configuration
  instanceName: string
  instanceType: string

  // Instance Scaling
  minInstances: number
  desiredInstances: number
  maxInstances: number

  // Bootable Volume
  bootVolumeName: string
  bootVolumeSize: number
  machineImage: string

  // Additional Storage Volumes
  storageVolumes: Array<{
    id: string
    name: string
    size: number
  }>

  // SSH & Startup
  sshKey: string
  startupScript: string

  // Tags
  tags: Array<{ key: string; value: string }>

  // Auto Scaling Policies
  scalingPolicies: Array<{
    id: string
    type: "CPU" | "Memory" | "Scheduled"
    upScaleTarget: number
    downScaleTarget: number
    scaleOutCooldown: number
    scaleInCooldown: number
  }>
}

export default function EditAutoScalingGroupPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toast } = useToast()
  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false)
  const [formTouched, setFormTouched] = useState(false)
  const [vpcSelectorOpen, setVpcSelectorOpen] = useState(false)
  const [vpcSearchTerm, setVpcSearchTerm] = useState("")
  const vpcSelectorRef = useRef<HTMLDivElement>(null)

  // Find the ASG to edit
  const existingASG = autoScalingGroups.find(asg => asg.id === id)

  const [formData, setFormData] = useState<ASGFormData>({
    asgName: "",
    creationMode: "scratch",
    selectedTemplate: "",
    region: "",
    vpc: "",
    subnets: [],
    securityGroups: [],
    instanceName: "",
    instanceType: "",
    minInstances: 1,
    desiredInstances: 2,
    maxInstances: 5,
    bootVolumeName: "",
    bootVolumeSize: 20,
    machineImage: "",
    storageVolumes: [],
    sshKey: "",
    startupScript: "",
    tags: [{ key: "", value: "" }],
    scalingPolicies: [],
  })

  // Pre-populate form with existing ASG data
  useEffect(() => {
    if (existingASG) {
      // Convert tags object to array format
      const tagsArray = Object.entries(existingASG.tags || {}).map(([key, value]) => ({ key, value }))
      if (tagsArray.length === 0) {
        tagsArray.push({ key: "", value: "" })
      }

      setFormData({
        asgName: existingASG.name,
        creationMode: "scratch",
        selectedTemplate: "",
        region: existingASG.region || "",
        vpc: existingASG.vpc,
        subnets: existingASG.subnet ? [existingASG.subnet] : [],
        securityGroups: existingASG.securityGroups ? [existingASG.securityGroups] : [],
        instanceName: existingASG.name + "-instance",
        instanceType: existingASG.flavour,
        minInstances: existingASG.minCapacity,
        desiredInstances: existingASG.desiredCapacity,
        maxInstances: existingASG.maxCapacity,
        bootVolumeName: existingASG.name + "-boot",
        bootVolumeSize: parseInt(existingASG.bootableVolumeSize?.replace(" GB", "") || "20"),
        machineImage: existingASG.machineImage || "",
        storageVolumes: [],
        sshKey: existingASG.sshKey || "",
        startupScript: "",
        tags: tagsArray,
        scalingPolicies: [],
      })
    }
  }, [existingASG])

  // Handle clicking outside VPC selector to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (vpcSelectorRef.current && !vpcSelectorRef.current.contains(event.target as Node)) {
        setVpcSelectorOpen(false)
      }
    }

    if (vpcSelectorOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [vpcSelectorOpen])

  if (!existingASG) {
    return (
      <PageLayout title="Auto Scaling Group Not Found" description="The requested Auto Scaling Group could not be found.">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Auto Scaling Group not found</p>
          <Button 
            onClick={() => router.push("/compute/auto-scaling")}
            className="mt-4"
          >
            Back to Auto Scaling Groups
          </Button>
        </div>
      </PageLayout>
    )
  }

  const handleInputChange = (field: keyof ASGFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (!formTouched) setFormTouched(true)
  }

  const isFormValid = () => {
    return formData.asgName.trim().length > 0 &&
      formData.region.length > 0 &&
      formData.vpc.length > 0 &&
      formData.instanceName.trim().length > 0 &&
      formData.instanceType.length > 0 &&
      formData.bootVolumeName.trim().length > 0
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Auto Scaling Group Updated",
        description: `${formData.asgName} has been updated successfully.`,
      })

      router.push(`/compute/auto-scaling/groups/${id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Auto Scaling Group. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.push(`/compute/auto-scaling/groups/${id}`)
  }

  // Mock data for dropdowns
  const instanceTypes = [
    { id: "t3.micro", name: "t3.micro", vcpus: 2, memory: "1 GiB", storage: "EBS-Only", pricePerHour: 0.5 },
    { id: "t3.small", name: "t3.small", vcpus: 2, memory: "2 GiB", storage: "EBS-Only", pricePerHour: 1.0 },
    { id: "t3.medium", name: "t3.medium", vcpus: 2, memory: "4 GiB", storage: "EBS-Only", pricePerHour: 2.0 },
    { id: "t3.large", name: "t3.large", vcpus: 2, memory: "8 GiB", storage: "EBS-Only", pricePerHour: 3.5 },
    { id: "t3.xlarge", name: "t3.xlarge", vcpus: 4, memory: "16 GiB", storage: "EBS-Only", pricePerHour: 7.0 },
    { id: "t3.2xlarge", name: "t3.2xlarge", vcpus: 8, memory: "32 GiB", storage: "EBS-Only", pricePerHour: 14.0 },
    { id: "g4dn.xlarge", name: "g4dn.xlarge", vcpus: 4, memory: "16 GiB", storage: "1 x 125 NVMe SSD", pricePerHour: 25.0 },
  ]

  const machineImages = [
    { id: "ubuntu-22-04", name: "Ubuntu 22.04 LTS" },
    { id: "ubuntu-20-04", name: "Ubuntu 20.04 LTS" },
    { id: "ubuntu-20-04-gpu", name: "Ubuntu 20.04 LTS GPU" },
    { id: "amazon-linux-2", name: "Amazon Linux 2" },
    { id: "centos-8", name: "CentOS 8" },
  ]

  const sshKeys = [
    { id: "ssh-1", name: "production-key" },
    { id: "ssh-2", name: "staging-key" },
    { id: "ssh-3", name: "development-key" },
    { id: "ssh-media", name: "media-key" },
  ]

  const regions = [
    { id: "us-east-1", name: "US East N. Virginia" },
    { id: "us-west-2", name: "US West Oregon" },
    { id: "eu-west-1", name: "Europe Ireland" },
    { id: "ap-south-1", name: "Asia Pacific Mumbai" },
  ]

  // Filter VPCs and subnets based on selection
  const filteredVPCs = vpcs.filter(vpc =>
    vpc.name.toLowerCase().includes(vpcSearchTerm.toLowerCase())
  )

  const selectedVPC = vpcs.find(vpc => vpc.id === formData.vpc)
  const availableSubnets = selectedVPC ? mockSubnets.filter(subnet => 
    selectedVPC.subnets?.includes(subnet.id)
  ) : []

  const breadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/compute", title: "Compute" },
    { href: "/compute/auto-scaling", title: "Auto Scaling Groups" },
    { href: `/compute/auto-scaling/groups/${id}`, title: existingASG.name },
    { href: `/compute/auto-scaling/groups/${id}/edit`, title: "Edit" },
  ]

  return (
    <PageLayout
      title={`Edit Auto Scaling Group: ${existingASG.name}`}
      description="Update your Auto Scaling Group configuration"
      breadcrumbs={breadcrumbs}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
        <div className="flex gap-6">
          {/* Left Form */}
          <div className="flex-1">
            <Card>
              <CardContent className="space-y-6 pt-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Basic Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="asgName">
                        Auto Scaling Group Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="asgName"
                        placeholder="Enter ASG name"
                        value={formData.asgName}
                        onChange={(e) => handleInputChange("asgName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Network Configuration - Read-only fields */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Network Configuration</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="region">
                        Region <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="region"
                        value={formData.region}
                        disabled
                        className="bg-muted cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">Region cannot be changed after creation</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vpc">
                        VPC <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="vpc"
                        value={selectedVPC?.name || formData.vpc}
                        disabled
                        className="bg-muted cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">VPC cannot be changed after creation</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subnets">Subnets</Label>
                    <div className="space-y-2">
                      {availableSubnets
                        .filter(subnet => formData.subnets.includes(subnet.id))
                        .map((subnet) => (
                          <div key={subnet.id} className="flex items-center space-x-2 p-2 bg-muted rounded">
                            <span className="text-sm">{subnet.name} ({subnet.cidr})</span>
                          </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Subnets cannot be changed after creation</p>
                  </div>
                </div>

                <Separator />

                {/* Instance Configuration */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Instance Configuration</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="instanceName">
                        Instance Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="instanceName"
                        placeholder="Enter instance name"
                        value={formData.instanceName}
                        onChange={(e) => handleInputChange("instanceName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instanceType">
                        Instance Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.instanceType}
                        onValueChange={(value) => handleInputChange("instanceType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select instance type" />
                        </SelectTrigger>
                        <SelectContent>
                          {instanceTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{type.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {type.vcpus} vCPUs, {type.memory}, {type.storage}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Instance Scaling */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Instance Scaling</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minInstances">Minimum Instances</Label>
                      <Input
                        id="minInstances"
                        type="number"
                        min="0"
                        value={formData.minInstances}
                        onChange={(e) => handleInputChange("minInstances", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desiredInstances">Desired Instances</Label>
                      <Input
                        id="desiredInstances"
                        type="number"
                        min="0"
                        value={formData.desiredInstances}
                        onChange={(e) => handleInputChange("desiredInstances", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxInstances">Maximum Instances</Label>
                      <Input
                        id="maxInstances"
                        type="number"
                        min="0"
                        value={formData.maxInstances}
                        onChange={(e) => handleInputChange("maxInstances", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bootable Volume */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Bootable Volume</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bootVolumeName">
                        Boot Volume Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="bootVolumeName"
                        placeholder="Enter boot volume name"
                        value={formData.bootVolumeName}
                        onChange={(e) => handleInputChange("bootVolumeName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bootVolumeSize">Boot Volume Size (GB)</Label>
                      <Input
                        id="bootVolumeSize"
                        type="number"
                        min="1"
                        value={formData.bootVolumeSize}
                        onChange={(e) => handleInputChange("bootVolumeSize", parseInt(e.target.value) || 20)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineImage">Machine Image</Label>
                    <Select
                      value={formData.machineImage}
                      onValueChange={(value) => handleInputChange("machineImage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select machine image" />
                      </SelectTrigger>
                      <SelectContent>
                        {machineImages.map((image) => (
                          <SelectItem key={image.id} value={image.name}>
                            {image.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Storage Volumes */}
                <StorageSection
                  storageVolumes={formData.storageVolumes}
                  onAddVolume={() => {
                    const newVolume = {
                      id: `volume-${Date.now()}`,
                      name: "",
                      size: 10
                    }
                    handleInputChange("storageVolumes", [...formData.storageVolumes, newVolume])
                  }}
                  onRemoveVolume={(id) => {
                    handleInputChange("storageVolumes", formData.storageVolumes.filter(vol => vol.id !== id))
                  }}
                  onUpdateVolume={(id, field, value) => {
                    handleInputChange("storageVolumes", formData.storageVolumes.map(vol =>
                      vol.id === id ? { ...vol, [field]: value } : vol
                    ))
                  }}
                />

                <Separator />

                {/* SSH Key */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">SSH Key</Label>
                  <div className="space-y-2">
                    <Label htmlFor="sshKey">SSH Key</Label>
                    <Select
                      value={formData.sshKey}
                      onValueChange={(value) => handleInputChange("sshKey", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SSH key" />
                      </SelectTrigger>
                      <SelectContent>
                        {sshKeys.map((key) => (
                          <SelectItem key={key.id} value={key.id}>
                            {key.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Scripts & Tags */}
                <ScriptsTagsSection
                  startupScript={formData.startupScript}
                  tags={formData.tags}
                  onStartupScriptChange={(value) => handleInputChange("startupScript", value)}
                  onTagsChange={(tags) => handleInputChange("tags", tags)}
                />

                <Separator />

                {/* Scaling Policies */}
                <ScalingPoliciesSection
                  scalingPolicies={formData.scalingPolicies}
                  onAddPolicy={() => {
                    const newPolicy = {
                      id: `policy-${Date.now()}`,
                      type: "CPU" as const,
                      upScaleTarget: 80,
                      downScaleTarget: 20,
                      scaleOutCooldown: 300,
                      scaleInCooldown: 300,
                    }
                    handleInputChange("scalingPolicies", [...formData.scalingPolicies, newPolicy])
                  }}
                  onRemovePolicy={(id) => {
                    handleInputChange("scalingPolicies", formData.scalingPolicies.filter(policy => policy.id !== id))
                  }}
                  onUpdatePolicy={(id, field, value) => {
                    handleInputChange("scalingPolicies", formData.scalingPolicies.map(policy =>
                      policy.id === id ? { ...policy, [field]: value } : policy
                    ))
                  }}
                />

                {/* Submit Actions */}
                <div className="flex items-center justify-end px-6 pb-6">
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="hover:bg-secondary transition-colors"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!isFormValid()}
                      className={`transition-colors ${isFormValid()
                          ? 'bg-black text-white hover:bg-black/90'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      Update Auto Scaling Group
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-normal">Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use descriptive names that include environment and purpose (e.g., prod-web-servers-asg).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Distribute instances across multiple availability zones for high availability.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Set up both scale-out and scale-in policies based on CPU and memory metrics.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Configure health checks to automatically replace unhealthy instances.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use launch templates to standardize instance configurations and enable version control.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Sticky Price Summary */}
            <div
              className="sticky top-6"
              style={{
                borderRadius: '16px',
                border: '4px solid #FFF',
                background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                padding: '1.5rem'
              }}
            >
              <div className="pb-4">
                <h3 className="text-base font-semibold">Estimated Cost</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    ₹{((instanceTypes.find(t => t.id === formData.instanceType)?.pricePerHour || 2.5) * formData.desiredInstances * 72).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">per hour</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Auto Scaling Group with {formData.desiredInstances} {formData.instanceType || 'instance'} instances.
                </p>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• Compute: ₹{((instanceTypes.find(t => t.id === formData.instanceType)?.pricePerHour || 2.5) * formData.desiredInstances * 72).toFixed(2)}/hour</p>
                  <p>• Storage: ₹{((formData.bootVolumeSize + formData.storageVolumes.reduce((sum, vol) => sum + vol.size, 0)) * 0.1 * formData.desiredInstances).toFixed(2)}/month</p>
                  <p>• Estimated monthly: ₹{(
                    ((instanceTypes.find(t => t.id === formData.instanceType)?.pricePerHour || 2.5) * formData.desiredInstances * 72 * 24 * 30) +
                    ((formData.bootVolumeSize + formData.storageVolumes.reduce((sum, vol) => sum + vol.size, 0)) * 0.1 * formData.desiredInstances)
                  ).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <CreateVPCModal 
        isOpen={showCreateVPCModal} 
        onClose={() => setShowCreateVPCModal(false)} 
      />
    </PageLayout>
  )
}
