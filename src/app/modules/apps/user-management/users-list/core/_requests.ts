import axios from 'axios'
import {UserModel} from './_models'
import {getAuth} from '../../../../auth'
const API_URL = process.env.REACT_APP_API_URL

export const REGISTER_URL = `${API_URL}/api/users/register`
export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/users/refresh-token`
export const GET_USER_URL = `${API_URL}/api/users/all  `
export const EDIT_USERS_URL = `${API_URL}/api/users/update`
export const GET_USER_BY_ID = `${API_URL}/api/users`
export const DELETE_USER_URL = `${API_URL}/api/users/delete`

axios.defaults.withCredentials = true


export function register(values: any) {
  return axios.post(REGISTER_URL, {
    email: values.email,
    fullname: values.name,
    password: values.password,
    roleId: values.roleId,
    status: values.status
  })
}

export function updateUser(values: any) {
  return axios.put(`${EDIT_USERS_URL}/${values.id}`, {
    email: values.email,
    fullname: values.name,
    ...(values.password && {password: values.password}),
    roleId: values.roleId,
    status: values.status,
  })
}

export async function getUsers() {
  try {
    const response = await axios.get(GET_USER_URL, {withCredentials: true})

    return response.data
  } catch (error: any) {
    console.error('Error fetching users:', error.response?.data || error.message)
    throw error
  }
}

export async function getUserById(roleId) {
  try {
    const response = await axios.get(`${GET_USER_BY_ID}/${roleId}`, {withCredentials: true})

    return response.data
  } catch (error) {
    console.error('Error fetching role by ID:', error)
    throw error
  }
}

export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`${DELETE_USER_URL}/${userId}`, {
      withCredentials: true,
    })

    return response.data
  } catch (error: any) {
    console.error('Error deleting role:', error.response?.data || error.message)
    throw error
  }
}

