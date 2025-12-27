import {ListViewProvider, useListView} from '../roles-list/core/ListViewProvider'
import {QueryRequestProvider} from '../roles-list/core/QueryRequestProvider'
import {QueryResponseProvider} from '../roles-list/core/QueryResponseProvider'
import {UsersListHeader} from './components/header/RoleListHeader'
import {UsersTable} from '../roles-list/table/RoleTable'
import {UserEditModal} from './role-edit-modal/RoleEditModal'
import {KTCard} from '../../../../../_metronic/helpers'

const RoleList = () => {
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

const RoleListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <RoleList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {RoleListWrapper}
