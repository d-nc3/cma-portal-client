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

axios.defaults.withCredentials = true

export const registerVehicle = async (values: VehicleModel) => {
  try {
    const response = await axios.post(REGISTER_URL, values);
    return response.data;
  } catch (error: any) {
    // Extract backend error message accurately
    const errorMessage = error.response?.data?.message || "Internal Server Error";
    throw new Error(errorMessage);
  }
}

