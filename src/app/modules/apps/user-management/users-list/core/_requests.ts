import axios from 'axios'
import {UserModel} from './_models'
const API_URL = process.env.REACT_APP_API_URL

export const REGISTER_URL = `${API_URL}/api/users/register`
export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/users/refresh-token`
export const GET_USER_URL = `${API_URL}/api/users/AllUsers  `
export const EDIT_USERS_URL = `${API_URL}/api/users/updateUser`
export const GET_USER_BY_ID = `${API_URL}/api/users/getUserById`

axios.defaults.withCredentials = true

// Server should return AuthModel
export function register(values: any) {
  return axios.post(REGISTER_URL, {
    email: values.email,
    fullname: `${values.firstname} ${values.lastname}`,
    password: values.password,
  })
}

export function updateUser(values: any) {
  return axios.put(`${EDIT_USERS_URL}/${values.id}`, {
    email: values.email,
    fullname: `${values.firstname} ${values.lastname}`,
  })
}

export async function getUsers(token, query?: string) {
  try {
 
    const header_config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.get(GET_USER_URL, header_config)

    return response.data
  } catch (error: any) {
    console.error('Error fetching users:', error.response?.data || error.message)
    throw error
  }
}

export function getUserById(userId) {
  return axios.get<UserModel>(`${GET_USER_BY_ID}/${userId}`).then((res) => res.data)
}
