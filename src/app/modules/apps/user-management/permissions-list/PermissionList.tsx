import {ListViewProvider, useListView} from '../permissions-list/core/ListViewProvider'
import {QueryRequestProvider} from '../permissions-list/core/QueryRequestProvider'
import {QueryResponseProvider} from '../permissions-list/core/QueryResponseProvider'
import {UsersListHeader} from './components/header/RoleListHeader'
import {UsersTable} from '../permissions-list/table/RoleTable'
import {RoleEditModal} from './permission-edit-modal/RoleEditModal'
import {KTCard} from '../../../../../_metronic/helpers'

const PermissionsList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <RoleEditModal />}
    </>
  )
}

const PermissionListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <PermissionsList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {PermissionListWrapper}
