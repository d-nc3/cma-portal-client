import {useQuery} from 'react-query'
import {useEffect, useState} from 'react'
import {RolePermissionModel} from '../core/_models'
import {RolePermissionEditModalForm} from './RolePermissionEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getRolePermissionId} from '../core/_requests'

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
  

  if (!itemIdForUpdate) {
    return <RolePermissionEditModalForm isRolePermissionLoading={isLoading} role_permission={{id: undefined}} />
  }

  if (!isLoading && !error && role_permission) {
    return <RolePermissionEditModalForm isRolePermissionLoading={isLoading} role_permission={role_permission?.data || ''} />
  }

  return null
}

export {RolePermissionEditModalFormWrapper}
