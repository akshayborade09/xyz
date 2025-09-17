"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface StorageVolume {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface StorageSectionProps {
  bootVolumeName: string;
  bootVolumeSize: number;
  machineImage: string;
  storageVolumes: StorageVolume[];
  onUpdateBootVolumeName: (name: string) => void;
  onUpdateBootVolumeSize: (size: number) => void;
  onUpdateMachineImage: (image: string) => void;
  onAddStorageVolume: () => void;
  onUpdateStorageVolume: (id: string, field: 'name' | 'size', value: string | number) => void;
  onRemoveStorageVolume: (id: string) => void;
}

const machineImages = [
  { value: "ami-ubuntu-20.04", label: "Ubuntu 20.04 LTS" },
  { value: "ami-ubuntu-22.04", label: "Ubuntu 22.04 LTS" },
  { value: "ami-amazon-linux-2", label: "Amazon Linux 2" },
  { value: "ami-centos-7", label: "CentOS 7" },
  { value: "ami-rhel-8", label: "Red Hat Enterprise Linux 8" },
];

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
  onRemoveStorageVolume,
}: StorageSectionProps) {
  return (
    <>
      {/* Bootable Volume */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bootVolumeName">
              Bootable Volume Name <span className="text-red-500">*</span>
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
                <SelectValue placeholder="Select Machine Image" />
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
          {storageVolumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 18 18" className="text-gray-400">
                  <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" stroke="currentColor">
                    <path d="M9 6.5C12.452 6.5 15.25 5.493 15.25 4.25C15.25 3.007 12.452 2 9 2C5.548 2 2.75 3.007 2.75 4.25C2.75 5.493 5.548 6.5 9 6.5Z"></path>
                    <path d="M15.25 7.79889V4.25"></path>
                    <path d="M2.75 4.25V13.75C2.75 14.7344 4.507 15.5718 6.9536 15.8768"></path>
                    <path d="M2.75 9C2.75 10.1284 5.05569 11.0622 8.06329 11.2249"></path>
                    <path d="M14.5 10.75C13.2297 10.75 12.1711 11.616 11.8553 12.7864C11.7405 12.7627 11.6217 12.75 11.5 12.75C10.5335 12.75 9.75 13.5335 9.75 14.5C9.75 15.4665 10.5335 16.25 11.5 16.25H14.5C16.0188 16.25 17.25 15.0187 17.25 13.5C17.25 11.9813 16.0188 10.75 14.5 10.75Z"></path>
                  </g>
                </svg>
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
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveStorageVolume(volume.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
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
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Input
                          value={volume.type || "Standard"}
                          disabled
                          className="bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button size="sm" onClick={onAddStorageVolume} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Storage Volume
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
