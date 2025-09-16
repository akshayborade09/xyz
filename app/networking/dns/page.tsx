"use client"

import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { hostedZones } from "../../../lib/data"
import { ActionMenu } from "../../../components/action-menu"
import { TooltipWrapper } from "../../../components/ui/tooltip-wrapper"
import { Button } from "../../../components/ui/button"
import { MoreVertical } from "lucide-react"
import { ShadcnDataTable } from "../../../components/ui/shadcn-data-table"
import { filterDataForUser, shouldShowEmptyState, getEmptyStateMessage } from "../../../lib/demo-data-filter"
import { EmptyState } from "../../../components/ui/empty-state"
import { Card, CardContent } from "../../../components/ui/card"
import { DeleteHostedZoneModal } from "../../../components/modals/delete-hosted-zone-modal"

export default function HostedZonesPage() {
  const [selectedZone, setSelectedZone] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Filter data based on user type for demo
  const filteredHostedZones = filterDataForUser(hostedZones)
  const showEmptyState = shouldShowEmptyState() && filteredHostedZones.length === 0

  const handleDeleteClick = (zone: any) => {
    setSelectedZone(zone)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedZone) {
      // Simulate delete API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Hosted zone deleted:", selectedZone.domainName)
      
      // Close modal and reset state
      setIsDeleteModalOpen(false)
      setSelectedZone(null)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setSelectedZone(null)
  }



  const renderRecordBreakdown = (recordBreakdown: any) => {
    const breakdown = []
    if (recordBreakdown.A > 0) breakdown.push(`${recordBreakdown.A} A`)
    if (recordBreakdown.AAAA > 0) breakdown.push(`${recordBreakdown.AAAA} AAAA`)
    if (recordBreakdown.CNAME > 0) breakdown.push(`${recordBreakdown.CNAME} CNAME`)
    if (recordBreakdown.NS > 0) breakdown.push(`${recordBreakdown.NS} NS`)
    return breakdown.join(', ')
  }

  const columns = [
    {
      key: "domainName",
      label: "Domain Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/networking/dns/${row.id}/manage`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {row.domainName}
        </a>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "Public" 
            ? "bg-green-100 text-green-800" 
            : "bg-blue-100 text-blue-800"
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "recordCount",
      label: "Records",
      sortable: true,
      render: (value: number, row: any) => {
        if (value > 0) {
          return (
            <TooltipWrapper content={renderRecordBreakdown(row.recordBreakdown)}>
              <div className="text-muted-foreground leading-5 cursor-help">
                {value} records
              </div>
            </TooltipWrapper>
          )
        }
        return (
          <div className="text-muted-foreground leading-5">
            {value} records
          </div>
        )
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string, row: any) => {
        return <StatusBadge status={value} />
      },
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-muted-foreground leading-5">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (value: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/networking/dns/${row.id}/manage`}
            viewLabel="View and Manage"
            onCustomDelete={() => handleDeleteClick(row)}
            deleteLabel="Delete Hosted Zone"
            resourceName={row.domainName}
            resourceType="Hosted Zone"
          />
        </div>
      ),
    },
  ]

  const handleRefresh = () => {
    // Add your refresh logic here
    console.log("🔄 Refreshing hosted zones data at:", new Date().toLocaleTimeString())
    // In a real app, this would typically:
    // - Refetch data from API
    // - Update state
    // - Show loading indicator
    // For demo purposes, we'll just log instead of reloading
    // window.location.reload()
  }

  // Custom DNS/Hosted Zone illustration
  const hostedZoneIcon = (
    <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64">
      {/* Main DNS Server */}
      <rect x="130" y="60" width="60" height="80" rx="8" fill="#E5F3FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="160" cy="80" r="6" fill="#2563EB"/>
      <text x="160" y="105" textAnchor="middle" fontSize="10" fill="#1E40AF" fontWeight="600">DNS</text>
      <text x="160" y="118" textAnchor="middle" fontSize="10" fill="#1E40AF" fontWeight="600">Server</text>
      
      {/* Hosted Zones */}
      <rect x="40" y="40" width="70" height="30" rx="4" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1"/>
      <text x="75" y="58" textAnchor="middle" fontSize="9" fill="#15803D" fontWeight="500">example.com</text>
      
      <rect x="40" y="80" width="70" height="30" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1"/>
      <text x="75" y="98" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="500">api.company.com</text>
      
      <rect x="210" y="40" width="70" height="30" rx="4" fill="#FDF2F8" stroke="#EC4899" strokeWidth="1"/>
      <text x="245" y="58" textAnchor="middle" fontSize="9" fill="#BE185D" fontWeight="500">blog.example.com</text>
      
      <rect x="210" y="80" width="70" height="30" rx="4" fill="#EDF2FF" stroke="#6366F1" strokeWidth="1"/>
      <text x="245" y="98" textAnchor="middle" fontSize="9" fill="#4F46E5" fontWeight="500">internal.company</text>
      
      {/* Connection lines */}
      <path d="M110 55 L130 85" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2"/>
      <path d="M110 95 L130 90" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2"/>
      <path d="M190 85 L210 55" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2"/>
      <path d="M190 90 L210 95" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2"/>
      
      {/* Records indicators */}
      <circle cx="65" cy="35" r="3" fill="#10B981"/>
      <text x="65" y="28" textAnchor="middle" fontSize="7" fill="#059669">8</text>
      
      <circle cx="65" cy="75" r="3" fill="#F59E0B"/>
      <text x="65" y="68" textAnchor="middle" fontSize="7" fill="#D97706">5</text>
      
      <circle cx="255" cy="35" r="3" fill="#EC4899"/>
      <text x="255" y="28" textAnchor="middle" fontSize="7" fill="#BE185D">3</text>
      
      <circle cx="255" cy="75" r="3" fill="#6366F1"/>
      <text x="255" y="68" textAnchor="middle" fontSize="7" fill="#4F46E5">12</text>
    </svg>
  );

  return (
    <PageShell
      title="Hosted Zones"
      description="Create and manage hosted zones and DNS records for your domains."
      headerActions={
        <CreateButton href="/networking/dns/create" label="Create Hosted Zone" />
      }
    >
      {showEmptyState ? (
        <Card className="mt-8">
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('hosted-zones')}
              onAction={() => window.location.href = '/networking/dns/create'}
              icon={hostedZoneIcon}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable 
          columns={columns} 
          data={filteredHostedZones}
          searchableColumns={["domainName", "type"]}
          pageSize={10}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableAutoRefresh={true}
          enableVpcFilter={false}
          enableStatusFilter={true}
          statusOptions={[
            { value: "all", label: "All Types" },
            { value: "Public", label: "Public" },
            { value: "Private", label: "Private" },
          ]}
          statusFilterColumn="type"
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedZone && (
        <DeleteHostedZoneModal
          open={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          hostedZone={{
            id: selectedZone.id,
            domainName: selectedZone.domainName,
            type: selectedZone.type,
            recordCount: selectedZone.recordCount
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </PageShell>
  )
}