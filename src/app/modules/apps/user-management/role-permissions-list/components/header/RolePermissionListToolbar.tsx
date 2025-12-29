import {KTIcon} from '../../../../../../../_metronic/helpers'
import {useListView} from  '../../core/ListViewProvider'
import {RolePermissionListFilter} from './RolePermissionListFilter'

const RolePermissionListToolbar = () => {
  const {setItemIdForUpdate} = useListView()
  const openAddRolePermissionModal = () => {
    setItemIdForUpdate(null)
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <RolePermissionListFilter />

      {/* begin::Export */}
      <button type='button' className='btn btn-light-primary me-3'>
        <KTIcon iconName='exit-up' className='fs-2' />
        Export
      </button>
      {/* end::Export */}

      {/* begin::Add user */}
      <button type='button' className='btn btn-primary' onClick={openAddRolePermissionModal}>
        <KTIcon iconName='plus' className='fs-2' />
        Add Role Permission
      </button>
      {/* end::Add user */}
    </div>
  )
}

export {RolePermissionListToolbar}
