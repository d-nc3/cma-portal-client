import {useListView} from  '../../core/ListViewProvider'
import {UsersListToolbar} from './RoleListToolbar'
import {UsersListGrouping} from './RoleListGrouping'
import {UsersListSearchComponent} from './RoleListSearchComponent'

const UsersListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <UsersListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <UsersListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {UsersListHeader}
