import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

export const CREATE_PERMISSIONS_URL = `${API_URL}/api/role-permissions/create`
export const GET_ROLE_PERMISSIONS_URL = `${API_URL}/api/role-permissions/getAll`
export const DELETE_URL = `${API_URL}/api/role-permissions/deleteRolePermission`
export const EDIT_ROLE_URL = `${API_URL}/api/role-permissions/updateRolePermission`
export const GET_BY_ID = `${API_URL}/api/role-permissions/getById`


axios.defaults.withCredentials = true

// Server should return AuthModel
export function register(values: any) {
  const requests = values.permission_id.map((pid: string) =>
    axios.post(CREATE_PERMISSIONS_URL, {
      roleId: values.role_id,
      permissionId: pid, // single permission
    })
  );

  return Promise.all(requests); // wait for all requests
}

export function updatePermission(values: any) {
  return axios.put(`${EDIT_ROLE_URL}/${values.id}`, {
    name: values.name,
    description: `${values.description}`,
  })
}

export async function getRolePermissions(query?: string) {
  try {
    const response = await axios.get(GET_ROLE_PERMISSIONS_URL, {
      withCredentials: true, 
    })

    return response.data
  } catch (error: any) {
    console.error('Error fetching users:', error.response?.data || error.message)
    throw error
  }
}

export const getRolePermissionId = async (roleId) => {
  try {
    const response = await axios.get(`${GET_BY_ID}/${roleId}`, {
      withCredentials: true, // optional, if your API requires cookies
    })
    return response.data
  } catch (error) {
    console.error('Error fetching role by ID:', error)
    throw error
  }
}


export async function deleteRolePermission(RolepermissionId) {
  try {
    const response = await axios.delete(`${DELETE_URL}/${RolepermissionId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error deleting role:', error.response?.data || error.message);
    throw error;
  }
}

