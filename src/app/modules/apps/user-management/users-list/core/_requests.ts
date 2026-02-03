import axios from 'axios'
import {UserModel} from './_models'
import { getAuth } from '../../../../auth'
const API_URL = process.env.REACT_APP_API_URL

export const REGISTER_URL = `${API_URL}/api/users/register`
export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/users/refresh-token`
export const GET_USER_URL = `${API_URL}/api/users/AllUsers  `
export const EDIT_USERS_URL = `${API_URL}/api/users/updateUser`
export const GET_USER_BY_ID = `${API_URL}/api/users/userById`
export const DELETE_USER_URL = `${API_URL}/api/users/deleteUser`
export const ADD_ROLE_TO_USER_URL = `${API_URL}/api/user-roles/create`


axios.defaults.withCredentials = true
axios.interceptors.request.use(
  (config) => {
    const auth = getAuth();
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Server should return AuthModel
export function register(values: any) {
  return axios.post(REGISTER_URL, {
    email: values.email,
    fullname: `${values.first_name} ${values.last_name}`,
    password: values.password,
  })
}

export function updateUser(values: any) {
  return axios.put(`${EDIT_USERS_URL}/${values.id}`, {
    email: values.email,
    password: values.password,
    fullname: `${values.first_name} ${values.last_name}`,
  })
}

export async function getUsers() {
  try {

    const response = await axios.get(GET_USER_URL)

    return response.data
  } catch (error: any) {
    console.error('Error fetching users:', error.response?.data || error.message)
    throw error
  }
}

export async function getUserById(roleId) {
  try {
    const response = await axios.get(
      `${GET_USER_BY_ID}/${roleId}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    throw error;
  }
}


export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`${DELETE_USER_URL}/${userId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error deleting role:', error.response?.data || error.message);
    throw error;
  }
}

export function addRole(values: any) {
  return axios.post(ADD_ROLE_TO_USER_URL, {
    userId: values.id,
    roleId: values.role,
  })
}