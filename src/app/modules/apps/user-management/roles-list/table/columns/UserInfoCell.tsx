/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {RoleModel} from '../../core/_models'

type Props = {
  role: RoleModel
}

const UserInfoCell: FC<Props> = ({role}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {role.name}
      </a>
      <span>{role.description}</span>
    </div>
  </div>
)

export {UserInfoCell}
