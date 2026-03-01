export type DispatchStatus = 'dispatched' | 'nd' | 'shop' | 'hold' | 'cc'
export type CheckStatus    = 'ok' | 'issue' | 'skipped'

export interface ChecklistItem {
  label: string
  status: CheckStatus
  remarks: string
}

export interface ChecklistRow {
  status: CheckStatus | ''
  remarks: string
}

export interface OverrideEntry {
  id?: string
  scope: string
  target: string
  reason: string
  timestamp: string
  overriddenBy?: string
}

export interface Driver {
  id: string
  name: string
  license: string
  phone: string
  email?: string
  photo: string
  address?: string
  birthdate?: string
  age?: number
  gender?: string
  civilStatus?: string
  emergencyContact?: string
  emergencyPhone?: string
  // Assignment
  car: string
  boundaryRate: string
  odometer: string
  dispatchTime?: string
  dispatchStatus: DispatchStatus
  remarks: string
  // Nested
  checklist: ChecklistItem[]
  overrides: OverrideEntry[]
}

export interface Collection {
  collectionId: string
  drivers: Driver[]
}

export interface Division {
  division: string
  collections: Collection[]
}

export interface Fleet {
  fleetId: string
  fleetName: string
  divisions: Division[]
}


export interface ReportRow {
  id: string
  car: string
  driver: string
  odometer: string
  checklist: 'Complete' | 'Partial' | '—'
  remarks: string
  status: DispatchStatus
}

export type ModalTab = 'info' | 'checklist' | 'overrides'

export interface DriverModalProps {
  driver: Driver
  fleetName: string
  division: string
  collectionId: string
  onClose: () => void
}

export interface SelectedDriver {
  driver: Driver
  divisionName: string
  collectionId: string
  fleetName: string
}

export interface FleetGroup {
  fleetId: string        // e.g. "FL-001"
  fleetName: string      // e.g. "Fleet 1"
  drivers: Driver[]      // units/rows in this fleet table
}

export interface CollectionGroup {
  collectionId: string   // e.g. "COL-001"
  fleets: FleetGroup[]   // multiple fleets per collection
}

export interface DivisionGroup {
  divisionId: string     // e.g. "DIV-001"
  divisionName: string   // e.g. "Metro North"
  collections: CollectionGroup[]
}
