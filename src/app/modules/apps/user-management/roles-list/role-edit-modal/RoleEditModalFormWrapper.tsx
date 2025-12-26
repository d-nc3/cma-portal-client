import {useQuery} from 'react-query'
import {RoleEditModalForm} from './RoleEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'

const RoleEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getUserById(itemIdForUpdate)
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
    return <RoleEditModalForm isRoleLoading={isLoading} role={{id: undefined}} />
  }

  if (!isLoading && !error && user) {
    return <RoleEditModalForm isRoleLoading={isLoading} role={user} />
  }

  return null
}

export {RoleEditModalFormWrapper}
