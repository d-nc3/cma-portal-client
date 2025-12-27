import { Column } from 'react-table'
import { UserInfoCell } from './RoleInfoCell'
import { UserLastLoginCell } from './RoleLastLoginCell'
import { UserActionsCell } from './RoleActionCell'
import { UserSelectionCell } from './RoleSelectionCell'
import { UserCustomHeader } from './RoleCustomHeader'
import { UserSelectionHeader } from './RoleSelectionHeader'
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
