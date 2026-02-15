import axios from 'axios'
import {RoleModel} from './_models'
const API_URL = process.env.REACT_APP_API_URL

export const REGISTER_URL = `${API_URL}/api/roles/create`
export const GET_ROLES_URL = `${API_URL}/api/roles/all`
export const EDIT_ROLE_URL = `${API_URL}/api/roles/update`
export const GET_ROLE_BY_ID = `${API_URL}/api/roles`
export const DELETE_ROLE_URL = `${API_URL}/api/roles/delete`

axios.defaults.withCredentials = true

// Server should return AuthModel
export function register(values: any) {
  return axios.post(REGISTER_URL, {
    name: values.name,
    description: values.description,
  })
}

export function updateRole(values: any) {
  return axios.put(`${EDIT_ROLE_URL}/${values.id}`, {
    name: values.name,
    description: `${values.description}`,
  })
}

export async function getRoles() {
  try {
    const response = await axios.get(GET_ROLES_URL, {
      withCredentials: true,
    })

    return response.data
  } catch (error: any) {
    console.error('Error fetching users:', error.response?.data || error.message)
    throw error
  }
}


export const getRoleById = async (roleId) => {
  try {
    const response = await axios.get(`${GET_ROLE_BY_ID}/${roleId}`, {
      withCredentials: true, // optional, if your API requires cookies
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching role by ID:', error)
    throw error
  }
}
export async function deleteRole(roleId) {
  try {
    const response = await axios.delete(`${DELETE_ROLE_URL}/${roleId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error deleting role:', error.response?.data || error.message);
    throw error;
  }
}

