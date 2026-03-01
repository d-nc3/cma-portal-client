import axios from 'axios'
import {VehicleModel} from './_models'
const API_URL = process.env.REACT_APP_API_URL

export const REGISTER_URL = `${API_URL}/api/vehicles/create`
export const GET_VEHICLES_URL = `${API_URL}/api/vehicles/all`
export const EDIT_VEHICLE_URL = `${API_URL}/api/vehicles`
export const GET_VEHICLE_BY_ID = `${API_URL}/api/vehicles`
export const DELETE_VEHICLE_URL = `${API_URL}/api/vehicles`
export const GET_DRIVERS_URL = `${API_URL}/api/drivers/getDrivers`
export const REGISTER_DAMAGE_URL = `${API_URL}/api/damages/create`
export const GET_VEHICLE_DAMAGE_HISTORY_URL = `${API_URL}/api/damages/all`
export const DELETE_DAMAGE_URL = `${API_URL}/api/damages`
export const GET_DAMAGE_BY_ID_URL = `${API_URL}/api/damages`

axios.defaults.withCredentials = true


export const registerVehicle = async (values: VehicleModel) => {  
  try {
  const response = await axios.post(REGISTER_URL, values, {
      withCredentials: true,
    }); 
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Internal Server Error";
    throw new Error(errorMessage);
  }
}

export const getVehicles = async () => {
  try {
    const response = await axios.get(GET_VEHICLES_URL)
    return response
  } catch (error: any) {
    console.error('Error fetching vehicles:', error.response?.data || error.message)
    throw error
  }
}

export const getAllDrivers = async () => {
  try {
    const response = await axios.get(GET_DRIVERS_URL, {withCredentials: true})
    return response.data
  } catch (error: any) {
    console.error('Error fetching drivers:', error.response?.data || error.message)
    throw error
  }
}

export const getVehicleById = async (vehicleId: string) => {
  try {
    const response = await axios.get(`${GET_VEHICLE_BY_ID}/${vehicleId}`, { withCredentials: true });
    return response.data; 
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    throw error;
  }
}
export const updateVehicle = async (values: VehicleModel) => {
  try {
    const response = await axios.put(`${EDIT_VEHICLE_URL}/${values.id}`, values, {
      withCredentials: true,
    })
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Internal Server Error";
    throw new Error(errorMessage);
  }
}

export const deleteVehicle = async (vehicleId) => {
  try {
    const response = await axios.delete(`${DELETE_VEHICLE_URL}/${vehicleId}`, {withCredentials: true})
    return response.data
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    throw error
  }
}     


export const registerVehicleDamage = async (damageData: any) => {
  try {
    const response = await axios.post(REGISTER_DAMAGE_URL, damageData, {
      withCredentials: true,
    })
    return response.data
  } catch (error: any) {
    // This will tell you exactly what the server said
    console.error("Server Error Response:", error.response?.data);
    throw error;
  }
}


export const getDamageHistory = async () => {
  try {
    const response = await axios.get(GET_VEHICLE_DAMAGE_HISTORY_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching damage history:', error);
    throw error;
  }
}

export const deleteDamageRecord = async (damageId) => {
  try {
    const response = await axios.delete(`${DELETE_DAMAGE_URL}/${damageId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting damage record:', error);
    throw error;
  }
} 

export const getDamageRecordById = async (damageId) => {
  try {
    const response = await axios.get(`${GET_DAMAGE_BY_ID_URL}/${damageId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching damage record by ID:', error);
    throw error;
  }
} 
