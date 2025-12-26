import {ListViewProvider, useListView} from '../users-list/core/ListViewProvider'
import {QueryRequestProvider} from '../users-list/core/QueryRequestProvider'
import {QueryResponseProvider} from '../users-list/core/QueryResponseProvider'
import {UsersListHeader} from '../users-list/components/header/UsersListHeader'
import {UsersTable} from '../users-list/table/UsersTable'
import {UserEditModal} from '../users-list/user-edit-modal/UserEditModal'
import {KTCard} from '../../../../../_metronic/helpers'

const PermissionList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const PermissionListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <PermissionList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {PermissionListWrapper}
