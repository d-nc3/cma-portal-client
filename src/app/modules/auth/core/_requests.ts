import axios from 'axios'
import {AuthModel, UserModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/users/refresh-token`
export const LOGIN_URL = `${API_URL}/api/users/login`
export const REGISTER_URL = `${API_URL}/api/users/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`
export const GET_USER_BY_ID_URL = `${API_URL}/api/users`
export const LOGOUT_URL = `${API_URL}/api/users/logout`;

axios.defaults.withCredentials = true
// Server should return AuthModel
export function login(email: string, password: string) {
  
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  })
  
}


export async function logoutUser() {
  try {
    const response = await axios.post(LOGOUT_URL, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    fullname: `${firstname} ${lastname}`,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export async function getUserByToken() {
  try {
    const response = await axios.post<{
      msg: string
      token: string
      data: UserModel
    }>(
        GET_USER_BY_ACCESSTOKEN_URL,
        {},
        { withCredentials: true }
    );

    return {
      data: response.data.data,
      token: response.data.token
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  } 
}
