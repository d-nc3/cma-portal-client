import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export interface DispatchRecord {
  id: number
  driver_id: string
  vehicle_id: string
  collection_id: string
  fleet_id: number | null
  d_status: string
  dispatch_time: string
  created_at: string
  updated_at: string
  // Relations
  ddm_tbl_driverInfo?: DriverInfo
  ddm_tbl_driverApprehension?: DriverApprehension
  vdm_tbl_vehicleDamage?: VehicleDamage
}

export interface DriverInfo {
  id: string
  firstName?: string
  lastName?: string
  fullName?: string
  licenseNo?: string
  phone?: string
  email?: string
  address?: string
  birthdate?: string
  age?: number
  gender?: string
  civilStatus?: string
  emergencyContact?: string
  emergencyPhone?: string
  photo?: string
  status?: string
}

export interface DriverApprehension {
  driverId: string
  count?: number
  status?: string
  description?: string
  apprehensionDate?: string
  [key: string]: any
}

export interface VehicleDamage {
  driverId: string
  severity?: string
  description?: string
  reportedAt?: string
  [key: string]: any
}

/** POST /api/dispatch/create */
export async function createDispatch(driver_id: string): Promise<DispatchRecord> {
  const res = await axios.post(
    `${API_URL}/api/dispatch/create`,
    { driver_id },
    { withCredentials: true }
  )
  return res.data.data
}

/** GET /api/dispatch/:driver_id */
export async function getDispatchByDriverId(driver_id: string): Promise<DispatchRecord | null> {
  const res = await axios.get(
    `${API_URL}/api/dispatch/${driver_id}`,
    { withCredentials: true }
  )
  return res.data.data ?? null
}
