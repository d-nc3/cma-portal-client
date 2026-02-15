import { Column } from 'react-table'
import { UserInfoCell } from './RoleInfoCell'   
import { RoleActionCell } from './RoleActionCell'
import { UserSelectionCell } from './RoleSelectionCell'
import { UserCustomHeader } from './RoleCustomHeader'
import { UserSelectionHeader } from './RoleSelectionHeader'
import { PermissionModel } from '../../core/_models'

const usersColumns: ReadonlyArray<Column<PermissionModel>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ row }) => <UserSelectionCell id={row.original.id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Permission Name' className='min-w-125px' />,
    accessor: 'name', 
    Cell: ({ row }) => <UserInfoCell permission={row.original} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Description' className='min-w-125px' />,
    accessor: 'description',
  },

  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-50px' />,
    id: 'actions',
    Cell: ({ row }) => <RoleActionCell id={row.original.id} />,
  },
]

export { usersColumns }
