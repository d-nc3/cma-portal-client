
export interface VehicleModel {
  id?: number
  unitName?: string
  brand?: string
  yearModel?: number
  plateNumber?: string
  chassisNumber?: string
  carNumber?: string
  engineNumber?: string
  mvFileNumber?: string
  ltfrbCaseNumber?: string
  fleetInclusion?: number
  codingDay?: string
  serviceDaySchedule?: string | Date
  boundaryClassification?: 'DAILY' | 'TWENTY_FOUR_HOURS' | string
  boundaryRate?: number
  dateRegistered?: string | Date
  registrationDueDate?: string | Date
  insuranceExpiration?: string | Date
  cpcValidityExpiration?: string | Date
  created_at?: string
  updated_at?: string
}
