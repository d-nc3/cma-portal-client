import {useListView} from  '../../core/ListViewProvider'
import {RolePermissionListToolbar} from './RolePermissionListToolbar'
import {RolePermissionListGrouping} from './RolePermissionListGrouping'
import {RolePermissionListSearchComponent} from './RolePermissionListSearchComponent'

const RolePermissionListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <RolePermissionListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <RolePermissionListGrouping /> : <RolePermissionListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {RolePermissionListHeader}
