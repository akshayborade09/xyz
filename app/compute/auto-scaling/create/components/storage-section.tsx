"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface StorageVolume {
  id: string
  name: string
  size: number
}

interface StorageSectionProps {
  bootVolumeName: string
  bootVolumeSize: number
  machineImage: string
  storageVolumes: StorageVolume[]
  onUpdateBootVolumeName: (name: string) => void
  onUpdateBootVolumeSize: (size: number) => void
  onUpdateMachineImage: (image: string) => void
  onAddStorageVolume: () => void
  onUpdateStorageVolume: (id: string, field: 'name' | 'size', value: string | number) => void
  onRemoveStorageVolume: (id: string) => void
}

const machineImages = [
  { value: "ami-ubuntu-20.04", label: "Ubuntu 20.04 LTS" },
  { value: "ami-ubuntu-22.04", label: "Ubuntu 22.04 LTS" },
  { value: "ami-amazon-linux-2", label: "Amazon Linux 2" },
  { value: "ami-centos-7", label: "CentOS 7" },
  { value: "ami-rhel-8", label: "Red Hat Enterprise Linux 8" }
]

export function StorageSection({
  bootVolumeName,
  bootVolumeSize,
  machineImage,
  storageVolumes,
  onUpdateBootVolumeName,
  onUpdateBootVolumeSize,
  onUpdateMachineImage,
  onAddStorageVolume,
  onUpdateStorageVolume,
  onRemoveStorageVolume
}: StorageSectionProps) {
  return (
    <>
      {/* Bootable Volume */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base font-medium">Create a new bootable volume</Label>
          <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bootVolumeName">
              Volume Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bootVolumeName"
              placeholder="Enter bootable volume name"
              value={bootVolumeName}
              onChange={(e) => onUpdateBootVolumeName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bootVolumeSize">Size (GB)</Label>
            <Input
              id="bootVolumeSize"
              type="number"
              min="10"
              max="1000"
              value={bootVolumeSize}
              onChange={(e) => onUpdateBootVolumeSize(parseInt(e.target.value) || 20)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="machineImage">
              Machine Image <span className="text-red-500">*</span>
            </Label>
            <Select value={machineImage} onValueChange={onUpdateMachineImage}>
              <SelectTrigger>
                <SelectValue placeholder="Select machine image" />
              </SelectTrigger>
              <SelectContent>
                {machineImages.map(image => (
                  <SelectItem key={image.value} value={image.value}>
                    {image.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Storage Volumes */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Storage Volumes</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Configure additional storage volumes for your instances.
          </p>
        </div>
        <div>
          {storageVolumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
                <div className="w-6 h-6 bg-gray-400 rounded -ml-2"></div>
              </div>
              <p className="text-sm text-muted-foreground text-center mb-4">
                No storage volumes configured yet. Add your first storage volume to provide additional storage.
              </p>
              <Button size="sm" onClick={onAddStorageVolume} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Storage Volume
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {storageVolumes.map((volume, index) => (
                <div key={volume.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium">Storage Volume {index + 1}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveStorageVolume(volume.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Volume Name</Label>
                      <Input
                        placeholder="Enter volume name"
                        value={volume.name}
                        onChange={(e) => onUpdateStorageVolume(volume.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Size (GB)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={volume.size}
                        onChange={(e) => onUpdateStorageVolume(volume.id, 'size', parseInt(e.target.value) || 50)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
