/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {RolePermissionModel} from '../../core/_models'

type Props = {
  permission: RolePermissionModel
}

const UserInfoCell: FC<Props> = ({permission}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {permission.role_id}
      </a>
      <span>{permission.permission_id}</span>
    </div>
  </div>
)

export {UserInfoCell}
