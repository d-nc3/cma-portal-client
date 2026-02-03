import {useQuery} from 'react-query'
import {UserEditModalForm} from './UserEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'
import {getRoles} from '../../roles-list/core/_requests'

const UserEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()

  const enabledQuery = isNotEmpty(itemIdForUpdate)

  // 🔹 User Query
  const {
    isLoading: isUserLoading,
    data: user,
    error: userError,
  } = useQuery(
    [QUERIES.USERS_LIST, itemIdForUpdate],
    () => getUserById(itemIdForUpdate),
    {
      enabled: enabledQuery,
      cacheTime: 0,
      onError: (err) => {
        console.error(err)
        setItemIdForUpdate(undefined)
      },
    }
  )

const {
  isLoading: isRoleLoading,
  data: roles,
  error: roleError,
} = useQuery(
  QUERIES.ROLES_LIST,            
  () => getRoles(),              
  {
    enabled: true,
    staleTime: 5 * 60 * 1000,     
  }
)


  if (!itemIdForUpdate) {
    return (
      <UserEditModalForm
        isUserLoading={false}
        user={{id: undefined}}
        isRoleLoading={isRoleLoading}
<<<<<<< Updated upstream
        roles={Array.isArray(roles) ? roles : roles?.data || []}
=======
        roles={roles?.data || []}
>>>>>>> Stashed changes
      />
    )
  }

  if (userError || roleError) {
    return null
  }

  return (
    <UserEditModalForm
      isUserLoading={isUserLoading}
      user={user?.data[0] || []}
      isRoleLoading={isRoleLoading}
       roles={Array.isArray(roles) ? roles : roles?.data || []}
    />
  )
}

export {UserEditModalFormWrapper}
