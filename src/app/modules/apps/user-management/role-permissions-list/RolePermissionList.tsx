import {ListViewProvider, useListView} from '../role-permissions-list/core/ListViewProvider'
import {QueryRequestProvider} from  '../role-permissions-list/core/QueryRequestProvider'
import { QueryResponseProvider } from '../role-permissions-list/core/QueryResponseProvider'
import { RolePermissionListHeader } from './components/header/RolePermissionListHeader'
import { RolePermissionsTable } from  './table/RolePermissionsTable'
import { RolePermissionEditModal } from './role-permission-edit-modal/RolePermissionEditModal'
import {KTCard} from '../../../../../_metronic/helpers'

const RolePermissionList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <RolePermissionListHeader />
        <RolePermissionsTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <RolePermissionEditModal />}
    </>
  )
}

const RolePermissionWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <RolePermissionList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {RolePermissionWrapper}
