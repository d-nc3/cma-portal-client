import { Column } from 'react-table'
import { UserInfoCell } from './RoleInfoCell'   
import { RoleActionCell } from './RoleActionCell'
import { UserSelectionCell } from './RolePermissionSelectionCell'
import { UserCustomHeader } from './RoleCustomHeader'
import { UserSelectionHeader } from './RolePermissionSelectionHeader'
import { RolePermissionModel } from '../../core/_models'

const usersColumns: ReadonlyArray<Column<RolePermissionModel>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ row }) => <UserSelectionCell id={row.original.id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Role Name' className='min-w-125px' />,
    accessor: 'role_id', 
    Cell: ({ row }) => <UserInfoCell permission={row.original} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Permission' className='min-w-125px' />,
    accessor: 'permission_id',
  },

  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-50px' />,
    id: 'actions',
    Cell: ({ row }) => <RoleActionCell id={row.original.id} />,
  },
]

export { usersColumns }
