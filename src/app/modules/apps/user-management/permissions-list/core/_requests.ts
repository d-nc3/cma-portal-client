import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

export const CREATE_PERMISSIONS_URL = `${API_URL}/api/permissions/createPermission`
export const GET_PERMISSIONS_URL = `${API_URL}/api/permissions/getAllPermissions`
export const DELETE_ROLE_URL = `${API_URL}/api/permissions/deletePermission`
export const EDIT_ROLE_URL = `${API_URL}/api/permissions/editPermission`
export const GET_PERMISSION_BY_ID_URL = `${API_URL}/api/permissions/permissionById`


axios.defaults.withCredentials = true

// Server should return AuthModel
export function register(values: any) {
  return axios.post(CREATE_PERMISSIONS_URL, {
    name: values.name,
    description: values.description,
  })
}

export function updatePermission(values: any) {
  return axios.put(`${EDIT_ROLE_URL}/${values.id}`, {
    name: values.name,
    description: `${values.description}`,
  })
}

export async function getPermissions() {
  try {
    const response = await axios.get(GET_PERMISSIONS_URL, {
      withCredentials: true, 
    })

    return response.data
  } catch (error: any) {
    console.error('Error fetching users:', error.response?.data || error.message)
    throw error
  }
}

export const getPermissionById = async (roleId) => {
  try {
    const response = await axios.get(`${GET_PERMISSION_BY_ID_URL}/${roleId}`, {
      withCredentials: true, // optional, if your API requires cookies
    })
    return response.data
  } catch (error) {
    console.error('Error fetching role by ID:', error)
    throw error
  }
}


export async function deletePermissions(permissionId) {
  try {
    const response = await axios.delete(`${DELETE_ROLE_URL}/${permissionId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error deleting role:', error.response?.data || error.message);
    throw error;
  }
}

