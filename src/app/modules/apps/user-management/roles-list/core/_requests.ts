import axios from 'axios'
import {RoleModel} from './_models'
const API_URL = process.env.REACT_APP_API_URL

export const REGISTER_URL = `${API_URL}/api/roles/createRole`
export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/users/refresh-token`
export const GET_ROLES_URL = `${API_URL}/api/roles/getAllRoles`
export const EDIT_USERS_URL = `${API_URL}/api/users/updateUser`
export const GET_USER_BY_ID = `${API_URL}/api/users/getUserById`
export const DELETE_ROLE_URL = `${API_URL}/api/roles/deleteRole`

axios.defaults.withCredentials = true

// Server should return AuthModel
export function register(values: any) {
  return axios.post(REGISTER_URL, {
    name: values.name,
    description: values.description,
  })
}

export function updateUser(values: any) {
  return axios.put(`${EDIT_USERS_URL}/${values.id}`, {
    email: values.email,
    fullname: `${values.firstname} ${values.lastname}`,
  })
}

export async function getRoles(query?: string) {
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

export function getUserById(userId) {
  return axios.get<RoleModel>(`${GET_USER_BY_ID}/${userId}`).then((res) => res.data)
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

