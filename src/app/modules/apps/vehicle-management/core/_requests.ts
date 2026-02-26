import axios from 'axios'
import {VehicleModel} from './_models'
import {getAuth} from '../../../auth'
const API_URL = process.env.REACT_APP_API_URL

export const REGISTER_URL = `${API_URL}/api/vehicles/create`
export const GET_ROLES_URL = `${API_URL}/api/vehicles/all`
export const EDIT_ROLE_URL = `${API_URL}/api/vehicles/update`
export const GET_ROLE_BY_ID = `${API_URL}/api/vehicles`
export const DELETE_ROLE_URL = `${API_URL}/api/vehicles/delete`
export const GET_DRIVERS_URL = `${API_URL}/api/drivers/getDrivers`

axios.defaults.withCredentials = true

export function registerVehicle(values: VehicleModel) {
  return axios.post(REGISTER_URL, values, {
    withCredentials: true
  })
}


export async function getDrivers() {
  try {
    const response = await axios.get(GET_DRIVERS_URL, {
      withCredentials: true,
    })
    console.log('Drivers response:', response.data)

    return response.data
  } catch (error: any) {
    console.error('Error fetching drivers:', error.response?.data || error)
    throw error
  }
}
