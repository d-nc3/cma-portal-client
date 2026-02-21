import {Column} from 'react-table'
import {RoleActionCell} from './RoleActionCell'
import {UserSelectionCell} from './RolePermissionSelectionCell'
import {UserCustomHeader} from './RoleCustomHeader'
import {UserSelectionHeader} from './RolePermissionSelectionHeader'
import {RolePermissionModel} from '../../core/_models'

const usersColumns: ReadonlyArray<Column<RolePermissionModel>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({row}) => <UserSelectionCell id={row.original.id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Role Name' className='min-w-125px' />
    ),
    accessor: 'roleName', // now using roleName instead of role_id
    Cell: ({value}) => <span>{value}</span>, // display role name
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Permissions' className='min-w-125px' />
    ),
    accessor: 'permissionName', // this should be string[] from backend
    Cell: ({value}: {value?: string[]}) => {
      if (!value || value.length === 0) return <span className='text-muted'>No permissions</span>

      return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
          {value.map((name) => (
            <span
              key={name}
              className='badge badge-light-primary'
              style={{fontSize: '0.75rem', padding: '2px 6px'}}
            >
              {name}
            </span>
          ))}
        </div>
      )
    },
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-50px' />
    ),
    id: 'actions',
    Cell: ({row}) => <RoleActionCell id={row.original.id} />, // action by role
  },
]

export {usersColumns}
