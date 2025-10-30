## DNS UI Updates Summary

Date: 2025-10-30
Branch: aistudio

### Overview
- Design-mode only changes: UI/UX updates using shadcn/ui, Tailwind, and mock data. No backend/API integrations.
- Scope: Create Hosted Zone, Hosted Zones List, and Manage Hosted Zone (including Edit DNS Record experience).

---

## Hosted Zones List (`/networking/dns`)

### Changes
- Force Type to always display as Private for all rows.
- Remove the Type filter dropdown beside search (status filter disabled).
- Keep search, sorting, and pagination behaviors intact.

### Implementation
- File: `app/networking/dns/page.tsx`
- Data presentation mapped to `type: 'Private'` for all records.
- `enableStatusFilter` set to `false` to remove the dropdown.

---

## Create Hosted Zone (`/networking/dns/create`)

### Changes
- Remove Description field from the form.
- Hosted Zone Type: Public is disabled with a “Coming soon” badge; default selection is Private.
- Network Configuration (Private only):
  - VPC selection is now multi-select using checkboxes.
  - Subnet selection removed.
  - Validation requires at least one VPC for Private zones.
- Fixed UI issues:
  - Resolved nested button hydration error in the VPC selector list.
  - Ensured VPC toggle handler is defined in component scope.

### Implementation
- File: `app/networking/dns/create/page.tsx`
- State updated to `vpcs: string[]` and related validation.
- Checkbox-based multi-select popover for VPCs; button label shows count and a short list of selected names.

---

## Manage Hosted Zone (`/networking/dns/[id]/manage`)

### Summary Panel
- Force Type to Private.
- Remove hosted zone Description from the summary.

### VPCs Section (new)
- Location: Below summary, above DNS Records.
- Table: Uses `ShadcnDataTable`.
- Columns (equally distributed): Name, Region, Status, Actions.
- Search disabled for this table.
- Actions:
  - Row menu (three dots) includes “Detach” with Trash icon; updates table state and shows a toast.
  - Header button “Attach VPC” opens modal:
    - Modal uses existing Dialog pattern.
    - Select VPC from dropdown (excludes already-attached VPCs).
    - Attaches to the list and shows toast.

### Edit DNS Record (A and AAAA)
- Update the Edit modal to mirror the Add New DNS Record form based on Routing Protocol:
  - Simple: Multi-value list with add/remove controls.
  - Weighted: Value + Weight rows with add/remove controls.
  - GeoIP: Country Code selector + value rows with add/remove controls.
  - HealthPort: Port, Primary IPs, Secondary IPs fields.
  - HealthURL: URL + IPv4 Addresses fields.
- Shows contextual description under the selected protocol (Info panel), matching Add flow.
- On Save, computes the record value from the active protocol’s fields and updates the table.

### Implementation
- File: `app/networking/dns/[id]/manage/page.tsx`
- Added VPCs section block (table + header description + attach flow + detach in actions).
- Added Edit modal dynamic state for A/AAAA and protocol-driven UI (and value computation on Save).

---

## Files Touched
- `app/networking/dns/page.tsx`
- `app/networking/dns/create/page.tsx`
- `app/networking/dns/[id]/manage/page.tsx`

---

## Commit References
- feat(dns): Hosted Zone UI updates — create/list/manage changes, VPCs table, detach icon
  - SHA: d56626a (on `aistudio`)
- feat(dns/manage): align Edit DNS Record UI with Add flow for A/AAAA — dynamic fields and computed values
  - SHA: a580653 (on `aistudio`)

---

## Notes
- All changes use mock data and client-side state for interactions.
- No API calls or backend persistence; interactions simulate realistic UX with toasts and optimistic updates.

