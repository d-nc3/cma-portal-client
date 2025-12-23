import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserActionsCell } from './UserActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { RoleModel } from '../../core/_models'

const usersColumns: ReadonlyArray<Column<RoleModel>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ row }) => <UserSelectionCell id={row.original.id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Role Name' className='min-w-125px' />,
    accessor: 'name', 
    Cell: ({ row }) => <UserInfoCell role={row.original} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Description' className='min-w-125px' />,
    accessor: 'description',
  },

  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-50px' />,
    id: 'actions',
    Cell: ({ row }) => <UserActionsCell id={row.original.id} />,
  },
]

export { usersColumns }
