// columns/_columns.tsx
import {Column} from 'react-table'
import {KTIcon} from '../../../../../../_metronic/helpers'

export const vehicleColumns: ReadonlyArray<Column<any>> = [
  {
    Header: 'Vehicle Info',
    accessor: 'plate',
    Cell: ({row}) => {
      const plate = row.original.plate || ''
      return (
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
            <div className='symbol-label bg-light-primary text-primary fw-bold'>
              {plate.substring(0, 2)}
            </div>
          </div>
          <div className='d-flex flex-column'>
            <span className='text-gray-800 fw-bold'>{plate}</span>
            <span className='text-muted fs-7'>
              {row.original.make} {row.original.model}
            </span>
          </div>
        </div>
      )
    },
  },

  {
    Header: 'Year',
    accessor: 'year',
    Cell: ({value}) => <span className='fw-bold text-gray-700'>{value}</span>,
  },

  {
    Header: 'Registration No.',
    accessor: 'registration',
    Cell: ({value}) => <span className='text-muted fw-semibold'>{value}</span>,
  },

  {
    Header: 'Fuel Type',
    accessor: 'fuel',
    Cell: ({value}) => <span className='badge badge-light-info fw-bold'>{value}</span>,
  },

  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({value}) => {
      const color = value === 'Active' ? 'success' : value === 'Maintenance' ? 'warning' : 'danger'

      return <span className={`badge badge-light-${color} fw-bold px-4 py-2`}>{value}</span>
    },
  },

  {
    Header: 'Actions',
    id: 'actions',
    Cell: ({row}) => (
      <div className='text-end'>
        <button className='btn btn-icon btn-light-primary btn-sm me-2'>
          <KTIcon iconName='pencil' className='fs-3' />
        </button>
        <button className='btn btn-icon btn-light-danger btn-sm'>
          <KTIcon iconName='trash' className='fs-3' />
        </button>
      </div>
    ),
  },
]
