import {useQuery} from 'react-query'
import {useEffect, useState} from 'react'
import {PermissionModel} from '../core/_models'
import {RoleEditModalForm} from './RoleEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getPermissionById} from '../core/_requests'

const RoleEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)

  
  const {
    isLoading,
    data: permission,
    error,
  } = useQuery(
    `${QUERIES.PERMISSIONS_LIST}-permission-${itemIdForUpdate}`,
    () => {
      return getPermissionById(itemIdForUpdate)
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
    return <RoleEditModalForm isPermissionLoading={isLoading} permission={{id: undefined}} />
  }

  if (!isLoading && !error && permission) {
    return <RoleEditModalForm isPermissionLoading={isLoading} permission={permission?.data} />
  }

  return null
}

export {RoleEditModalFormWrapper}
