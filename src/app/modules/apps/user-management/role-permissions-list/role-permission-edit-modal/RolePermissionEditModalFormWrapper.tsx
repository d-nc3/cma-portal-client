import {useQuery} from 'react-query'
import {useEffect, useState} from 'react'
import {RolePermissionModel} from '../core/_models'
import {RolePermissionEditModalForm} from './RolePermissionEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getRolePermissionId} from '../core/_requests'
import {getRoles} from '../../roles-list/core/_requests'
import {getPermissions} from '../../permissions-list/core/_requests'

const RolePermissionEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)

  const {
    isLoading,
    data: role_permission,
    error,
  } = useQuery(
    `${QUERIES.ROLE_PERMISSIONS_LIST}-role-permissions-${itemIdForUpdate}`,
    () => {
      return getRolePermissionId(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )

  const {
    isLoading: isRoleLoading,
    data: roles,
    error: roleError,
  } = useQuery(QUERIES.ROLES_LIST, () => getRoles(), {
    staleTime: 5 * 60 * 1000,
  })

  console.log(roles)
  const {
    isLoading: isPermissionLoading,
    data: permissions,
    error: permissionError,
  } = useQuery(QUERIES.PERMISSIONS_LIST, () => getPermissions(), {
 
    staleTime: 5 * 60 * 1000,
  })

  console.log(permissions)
  if (!itemIdForUpdate) {
    return (
      <RolePermissionEditModalForm
        isRolePermissionLoading={false}
        role_permission={{id: undefined }}
        isPermissionLoading={isPermissionLoading}
        isRoleLoading={isRoleLoading}
        roles={roles?.data ?? []}
        permissions={permissions?.data ?? []}
      />
    )
  }

  if (!isLoading && !error && role_permission) {
    return (
      <RolePermissionEditModalForm
        isRolePermissionLoading={isLoading}
        role_permission={role_permission?.data || ''}
        isPermissionLoading={isPermissionLoading}
        isRoleLoading={isRoleLoading}
        roles={roles?.data}
        permissions={permissions?.data}
      />
    )
  }

  return null
}

export {RolePermissionEditModalFormWrapper}
