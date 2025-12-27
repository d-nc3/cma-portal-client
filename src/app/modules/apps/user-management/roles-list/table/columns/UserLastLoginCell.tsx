import {FC} from 'react'

type Props = {
  created_at?: string
}

const UserLastLoginCell: FC<Props> = ({created_at}) => (
  <div className='badge badge-light fw-bolder'>{created_at}</div>
)

export {UserLastLoginCell}
