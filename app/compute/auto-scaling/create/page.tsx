"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, ChevronDown, HelpCircle, Check, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { CreateVPCModal } from "@/components/modals/vm-creation-modals"
import { vpcs } from "@/lib/data"
import { mockSubnets } from "@/lib/cluster-creation-data"
import { StorageSection } from "./components/storage-section"
import { ScriptsTagsSection } from "./components/scripts-tags-section"
import { ScalingPoliciesSection } from "./components/scaling-policies-section"

interface ASGFormData {
  // Basic Information
  asgName: string
  creationMode: "scratch" | "template"
  selectedTemplate: string
  
  // Network Configuration
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
  
  // Template Option
  saveAsTemplate: boolean
}

export default function CreateAutoScalingGroupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false)
  const [formTouched, setFormTouched] = useState(false)
  const [vpcSelectorOpen, setVpcSelectorOpen] = useState(false)
  const [vpcSearchTerm, setVpcSearchTerm] = useState("")
  const vpcSelectorRef = useRef<HTMLDivElement>(null)
  
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
    saveAsTemplate: false
  })

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
        variant: "destructive"
      })
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Auto Scaling Group Created",
        description: `${formData.asgName} has been created successfully.`
      })
      
      // Create template if option is selected
      if (formData.saveAsTemplate) {
        toast({
          title: "Template Created",
          description: `${formData.asgName} template has been created successfully.`
        })
      }
      
      router.push("/compute/auto-scaling")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Auto Scaling Group. Please try again.",
        variant: "destructive"
      })
    }
  }

  const addStorageVolume = () => {
    const newVolume = {
      id: `volume-${Date.now()}`,
      name: "",
      size: 50
    }
    setFormData(prev => ({
      ...prev,
      storageVolumes: [...prev.storageVolumes, newVolume]
    }))
  }

  const removeStorageVolume = (id: string) => {
    setFormData(prev => ({
      ...prev,
      storageVolumes: prev.storageVolumes.filter(vol => vol.id !== id)
    }))
  }

  const addScalingPolicy = () => {
    const newPolicy = {
      id: `policy-${Date.now()}`,
      type: "CPU" as const,
      upScaleTarget: 80,
      downScaleTarget: 20,
      scaleOutCooldown: 300,
      scaleInCooldown: 300
    }
    setFormData(prev => ({
      ...prev,
      scalingPolicies: [...prev.scalingPolicies, newPolicy]
    }))
  }

  const removeScalingPolicy = (id: string) => {
    setFormData(prev => ({
      ...prev,
      scalingPolicies: prev.scalingPolicies.filter(policy => policy.id !== id)
    }))
  }

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { key: "", value: "" }]
    }))
  }

  const updateTag = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const newTags = [...prev.tags]
      newTags[index][field] = value
      return { ...prev, tags: newTags }
    })
  }

  const removeTag = (index: number) => {
    setFormData(prev => {
      const newTags = prev.tags.filter((_, i) => i !== index)
      return { ...prev, tags: newTags.length > 0 ? newTags : [{ key: "", value: "" }] }
    })
  }

  // Mock data
  const regions = [
    { value: "us-east-1", label: "US East (N. Virginia)" },
    { value: "us-west-2", label: "US West (Oregon)" },
    { value: "eu-west-1", label: "EU (Ireland)" },
    { value: "ap-south-1", label: "Asia Pacific (Mumbai)" }
  ]

  const vpcOptions = [
    { value: "vpc-main-prod", label: "vpc-main-prod", subnets: ["hyderabad-1a-public", "hyderabad-1b-private"] },
    { value: "vpc-staging", label: "vpc-staging", subnets: ["hyderabad-staging-public", "hyderabad-staging-private"] },
    { value: "vpc-dev", label: "vpc-dev", subnets: ["hyderabad-dev-public", "hyderabad-dev-private"] }
  ]
  
  const filteredVPCs = vpcs.filter(vpc =>
    vpc.name.toLowerCase().includes(vpcSearchTerm.toLowerCase()) ||
    vpc.id.toLowerCase().includes(vpcSearchTerm.toLowerCase())
  )

  // Mock region availability data (same as cluster page)
  const regionAvailability = {
    "us-east-1": {
      name: "US East (N. Virginia)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "high" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    },
    "us-west-2": {
      name: "US West (Oregon)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "medium" },
        { type: "GPU RTX A5000", availability: "low" },
        { type: "GPU RTX A6000", availability: "low" },
        { type: "Storage", availability: "high" },
      ]
    },
    "eu-west-1": {
      name: "EU (Ireland)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "high" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    },
    "ap-south-1": {
      name: "Asia Pacific (Mumbai)",
      resources: [
        { type: "CPU Instances", availability: "medium" },
        { type: "GPU A40", availability: "medium" },
        { type: "GPU RTX A5000", availability: "high" },
        { type: "GPU RTX A6000", availability: "high" },
        { type: "Storage", availability: "medium" },
      ]
    },
    "ap-southeast-1": {
      name: "Asia Pacific (Singapore)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "low" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-gray-400"
      default: return "bg-gray-300"
    }
  }

  const getAvailabilityBars = (availability: string) => {
    const totalBars = 3
    const activeBars = availability === "high" ? 3 : availability === "medium" ? 2 : 1
    
    return Array.from({ length: totalBars }, (_, index) => (
      <div
        key={index}
        className={`h-1.5 w-6 rounded-sm ${
          index < activeBars ? getAvailabilityColor(availability) : "bg-gray-300"
        }`}
      />
    ))
  }

  const instanceTypes = [
    { id: "cpu-1x-4gb", name: "CPU-1x-4GB", vcpus: 1, ram: 4, pricePerHour: 3 },
    { id: "cpu-2x-8gb", name: "CPU-2x-8GB", vcpus: 2, ram: 8, pricePerHour: 6 },
    { id: "cpu-4x-16gb", name: "CPU-4x-16GB", vcpus: 4, ram: 16, pricePerHour: 13 },
    { id: "cpu-8x-32gb", name: "CPU-8x-32GB", vcpus: 8, ram: 32, pricePerHour: 25 },
    { id: "cpu-16x-64gb", name: "CPU-16x-64GB", vcpus: 16, ram: 64, pricePerHour: 49 },
    { id: "cpu-32x-128gb", name: "CPU-32x-128GB", vcpus: 32, ram: 128, pricePerHour: 97 }
  ]

  const machineImages = [
    { value: "ami-ubuntu-20.04", label: "Ubuntu 20.04 LTS" },
    { value: "ami-ubuntu-22.04", label: "Ubuntu 22.04 LTS" },
    { value: "ami-amazon-linux-2", label: "Amazon Linux 2" },
    { value: "ami-centos-7", label: "CentOS 7" },
    { value: "ami-rhel-8", label: "Red Hat Enterprise Linux 8" }
  ]

  const sshKeys = [
    { value: "key-production", label: "production-keypair" },
    { value: "key-development", label: "development-keypair" },
    { value: "key-staging", label: "staging-keypair" }
  ]

  const templates = [
    { value: "web-server-template", label: "Web Server Template" },
    { value: "worker-node-template", label: "Worker Node Template" },
    { value: "analytics-template", label: "Analytics Template" }
  ]

  // Mock security groups data
  const mockSecurityGroups = [
    { id: "sg-default", name: "default", description: "Default security group" },
    { id: "sg-web", name: "web-servers", description: "Security group for web servers" },
    { id: "sg-db", name: "database", description: "Security group for database servers" },
    { id: "sg-app", name: "application", description: "Security group for application servers" },
    { id: "sg-cache", name: "cache-servers", description: "Security group for cache servers" }
  ]

  const selectedVPC = vpcs.find(vpc => vpc.id === formData.vpc)
  const selectedVPCOption = vpcOptions.find(vpc => vpc.value === formData.vpc)
  
  // Create mock subnets for the selected VPC
  const availableSubnets = selectedVPC ? [
    {
      id: `${selectedVPC.id}-subnet-1a-public`,
      name: `${selectedVPC.name}-1a-public`,
      vpcId: selectedVPC.id,
      type: 'Public' as const,
      status: 'Active' as const,
      cidr: '10.0.1.0/24',
      availabilityZone: `${selectedVPC.region}a`,
      description: `Public subnet in ${selectedVPC.region}a`
    },
    {
      id: `${selectedVPC.id}-subnet-1b-private`,
      name: `${selectedVPC.name}-1b-private`,
      vpcId: selectedVPC.id,
      type: 'Private' as const,
      status: 'Active' as const,
      cidr: '10.0.2.0/24',
      availabilityZone: `${selectedVPC.region}b`,
      description: `Private subnet in ${selectedVPC.region}b`
    },
    {
      id: `${selectedVPC.id}-subnet-1c-public`,
      name: `${selectedVPC.name}-1c-public`,
      vpcId: selectedVPC.id,
      type: 'Public' as const,
      status: 'Active' as const,
      cidr: '10.0.3.0/24',
      availabilityZone: `${selectedVPC.region}c`,
      description: `Public subnet in ${selectedVPC.region}c`
    }
  ] : []

  return (
    <PageLayout 
      title="Create Auto Scaling Group" 
      description="Create and configure a new Auto Scaling Group for your compute resources."
    >
      <div className="flex gap-6">
        {/* Left Form */}
        <div className="flex-1">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* ASG Configuration */}
              <div className="space-y-4">
                <Label className="text-base font-medium">ASG Configuration</Label>
                <div className="space-y-2">
                  <Label htmlFor="asgName">
                    ASG Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="asgName"
                    placeholder="Enter ASG name"
                    value={formData.asgName}
                    onChange={(e) => handleInputChange("asgName", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Creation Mode</Label>
                  <RadioGroup
                    value={formData.creationMode}
                    onValueChange={(value: "scratch" | "template") => handleInputChange("creationMode", value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scratch" id="scratch" />
                      <Label htmlFor="scratch">From scratch</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="template" id="template" />
                      <Label htmlFor="template">Use template</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.creationMode === "template" && (
                  <div className="space-y-2">
                    <Label htmlFor="selectedTemplate">Select Template</Label>
                    <Select value={formData.selectedTemplate} onValueChange={(value) => handleInputChange("selectedTemplate", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.value} value={template.value}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />

              {/* Network Configuration */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Network Configuration</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">
                      Region <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vpc">
                      VPC <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative" ref={vpcSelectorRef}>
                      <button
                        type="button"
                        onClick={() => setVpcSelectorOpen(!vpcSelectorOpen)}
                        className={`w-full flex items-center justify-between px-3 py-2 border border-input rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          formTouched && !formData.vpc ? 'border-red-300 bg-red-50' : 'bg-background'
                        }`}
                      >
                        <span className={selectedVPC ? "text-foreground" : "!text-[#64748b]"}>
                          {selectedVPC ? `${selectedVPC.name} (${selectedVPC.region})` : "Select region first"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>
                      {vpcSelectorOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search VPCs..."
                                value={vpcSearchTerm}
                                onChange={(e) => setVpcSearchTerm(e.target.value)}
                                className="pl-8"
                              />
                            </div>
                          </div>
                          <div className="p-1">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCreateVPCModal(true)
                                setVpcSelectorOpen(false)
                              }}
                              className="w-full flex items-center px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-primary font-medium"
                            >
                              Create new VPC
                            </button>
                            {filteredVPCs.map((vpc) => (
                              <button
                                key={vpc.id}
                                type="button"
                                onClick={() => {
                                  handleInputChange("vpc", vpc.id)
                                  handleInputChange("subnets", []) // Reset subnets when VPC changes
                                  handleInputChange("securityGroups", []) // Reset security groups when VPC changes
                                  setVpcSelectorOpen(false)
                                  setVpcSearchTerm("")
                                }}
                                className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                              >
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">{vpc.name}</span>
                                  <span className="text-xs text-muted-foreground">{vpc.id} • {vpc.region}</span>
                                </div>
                                {formData.vpc === vpc.id && <Check className="h-4 w-4" />}
                              </button>
                            ))}
                            {filteredVPCs.length === 0 && vpcSearchTerm && (
                              <div className="px-2 py-2 text-sm text-muted-foreground">
                                No VPCs found matching "{vpcSearchTerm}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subnet">
                    Subnet <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.subnets[0] || ""} 
                    onValueChange={(value) => handleInputChange("subnets", [value])}
                    disabled={!formData.vpc}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.vpc ? "Select VPC first" : "Select VPC first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubnets.map(subnet => (
                        <SelectItem key={subnet.id} value={subnet.id}>
                          {subnet.name} ({subnet.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Security Groups</Label>
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-sm text-muted-foreground">No security groups selected</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Instance Configuration */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Instance Configuration</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instanceName">
                      Instance Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="instanceName"
                      placeholder="Enter instance name"
                      value={formData.instanceName}
                      onChange={(e) => handleInputChange("instanceName", e.target.value)}
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select instance type" />
                      </SelectTrigger>
                      <SelectContent>
                        {instanceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="font-medium">{type.name}</div>
                                <div className="text-muted-foreground text-sm">
                                  {type.vcpus} vCPU • {type.ram} GB RAM
                                </div>
                              </div>
                              <div className="ml-auto text-right">
                                <span className="text-primary font-semibold text-sm">
                                  ₹{type.pricePerHour}/hr
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>



              {/* Instance Scaling */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Instance Scaling</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure the minimum, desired, and maximum number of instances for your Auto Scaling Group.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minInstances">
                      Minimum Instances <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="minInstances"
                      type="number"
                      min="0"
                      value={formData.minInstances}
                      onChange={(e) => handleInputChange("minInstances", parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">Minimum number of instances to maintain</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desiredInstances">
                      Desired Instances <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="desiredInstances"
                      type="number"
                      min="0"
                      value={formData.desiredInstances}
                      onChange={(e) => handleInputChange("desiredInstances", parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">Initial number of instances to launch</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxInstances">
                      Maximum Instances <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="maxInstances"
                      type="number"
                      min="0"
                      value={formData.maxInstances}
                      onChange={(e) => handleInputChange("maxInstances", parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">Maximum number of instances allowed</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Storage Sections */}
              <StorageSection
                bootVolumeName={formData.bootVolumeName}
                bootVolumeSize={formData.bootVolumeSize}
                machineImage={formData.machineImage}
                storageVolumes={formData.storageVolumes}
                onUpdateBootVolumeName={(name) => handleInputChange("bootVolumeName", name)}
                onUpdateBootVolumeSize={(size) => handleInputChange("bootVolumeSize", size)}
                onUpdateMachineImage={(image) => handleInputChange("machineImage", image)}
                onAddStorageVolume={addStorageVolume}
                onUpdateStorageVolume={(id, field, value) => {
                  const updatedVolumes = formData.storageVolumes.map(v =>
                    v.id === id ? { ...v, [field]: value } : v
                  )
                  handleInputChange("storageVolumes", updatedVolumes)
                }}
                onRemoveStorageVolume={removeStorageVolume}
              />

              <Separator />

              {/* Scripts & Tags Sections */}
              <ScriptsTagsSection
                sshKey={formData.sshKey}
                startupScript={formData.startupScript}
                tags={formData.tags}
                onUpdateSshKey={(key) => handleInputChange("sshKey", key)}
                onUpdateStartupScript={(script) => handleInputChange("startupScript", script)}
                onAddTag={addTag}
                onUpdateTag={updateTag}
                onRemoveTag={removeTag}
              />

              <Separator />

              {/* Scaling Policies Section */}
              <ScalingPoliciesSection
                scalingPolicies={formData.scalingPolicies}
                onAddScalingPolicy={addScalingPolicy}
                onUpdateScalingPolicy={(id, field, value) => {
                  const updatedPolicies = formData.scalingPolicies.map(p =>
                    p.id === id ? { ...p, [field]: value } : p
                  )
                  handleInputChange("scalingPolicies", updatedPolicies)
                }}
                onRemoveScalingPolicy={removeScalingPolicy}
              />

            </CardContent>

            {/* Submit Actions */}
            <div className="flex items-center justify-between px-6 pb-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveAsTemplate"
                  checked={formData.saveAsTemplate}
                  onCheckedChange={(checked) => handleInputChange("saveAsTemplate", checked)}
                />
                <Label htmlFor="saveAsTemplate" className="text-sm">
                  Save as Template
                </Label>
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-secondary transition-colors"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  className={`transition-colors ${
                    isFormValid() 
                      ? 'bg-black text-white hover:bg-black/90' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Create ASG
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
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
                  ₹{((instanceTypes.find(t => t.id === formData.instanceType)?.pricePerHour || 0) * formData.desiredInstances * 72).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">per hour</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Auto Scaling Group with {formData.desiredInstances} {formData.instanceType || 'instance'} instances.
              </p>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>• Compute: ₹{((instanceTypes.find(t => t.id === formData.instanceType)?.pricePerHour || 0) * formData.desiredInstances * 72).toFixed(2)}/hour</p>
                <p>• Storage: ₹{((formData.bootVolumeSize + formData.storageVolumes.reduce((sum, vol) => sum + vol.size, 0)) * 0.1 * formData.desiredInstances).toFixed(2)}/month</p>
                <p>• Estimated monthly: ₹{(
                  ((instanceTypes.find(t => t.id === formData.instanceType)?.pricePerHour || 0) * formData.desiredInstances * 72 * 24 * 30) +
                  ((formData.bootVolumeSize + formData.storageVolumes.reduce((sum, vol) => sum + vol.size, 0)) * 0.1 * formData.desiredInstances)
                ).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateVPCModal
        open={showCreateVPCModal}
        onClose={() => setShowCreateVPCModal(false)}
        onSuccess={(vpcId: string) => {
          handleInputChange("vpc", vpcId)
          handleInputChange("subnets", []) // Reset subnets when VPC changes
          handleInputChange("securityGroups", []) // Reset security groups when VPC changes
          setShowCreateVPCModal(false)
        }}
        preselectedRegion={formData.region || undefined}
      />
    </PageLayout>
  )
}