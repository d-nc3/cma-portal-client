import {Column} from 'react-table'
import {KTIcon} from '../../../../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {deleteVehicle} from '../../core/_requests' // Import your API call

const handleDeleteItem = async (id: string, plateNumber: string, refetch?: () => void) => {
  if (!window.confirm(`Are you sure you want to delete vehicle: ${plateNumber}?`)) return

  try {
    await deleteVehicle(id)
    alert('Vehicle deleted successfully')
    if (refetch) refetch() // Refresh the table if using React Query or a state setter
    else window.location.reload() // Fallback
  } catch (error) {
    console.error('Deletion failed', error)
    alert('Failed to delete vehicle. It may be linked to other records.')
  }
}


const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '---'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

const getStatusBadge = (expiryDate: string | undefined) => {
  if (!expiryDate) return <span className='badge badge-light-secondary mt-1'>No Data</span>

  const today = new Date()
  const expiration = new Date(expiryDate)
  const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return <span className='badge badge-light-danger fw-bold mt-1'>Expired</span>
  if (diffDays <= 30) return <span className='badge badge-light-warning fw-bold mt-1'>Expiring Soon</span>
  return <span className='badge badge-light-success fw-bold mt-1'>Valid</span>
}


export const vehicleColumns: ReadonlyArray<Column<any>> = [
  {
    Header: 'Vehicle Info',
    accessor: 'plateNumber', 
    Cell: ({row}) => {
      const plate = row.original.plateNumber || '??' 
      return (
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
            <div className='symbol-label bg-light-primary text-primary fw-bold'>
              {plate.substring(0, 2).toUpperCase()}
            </div>
          </div>
          <div className='d-flex flex-column'>
            <span className='text-gray-800 fw-bold'>{plate}</span>
            <span className='text-muted fs-7'>{row.original.unitName}</span>
          </div>
        </div>
      )
    },
  },
  {
    Header: 'Car No. / Year', 
    id: 'carAndYear',
    Cell: ({row}) => (
      <div className='d-flex flex-column'>
        <span className='fw-bold text-gray-800'>{row.original.carNumber || '---'}</span>
        <span className='text-muted fs-7'>{row.original.yearModel || '---'}</span>
      </div>
    ),
  },
  {
    Header: 'Classification',
    accessor: 'boundaryClassification', 
    Cell: ({value}) => <span className='badge badge-light-info fw-bold'>{value}</span>,
  },
  {
    Header: 'Coding Day',
    accessor: 'codingDay', 
    Cell: ({value}) => <span className='fw-bold text-gray-700'>{value}</span>,
  },
  {
    Header: 'Registration',
    accessor: 'registrationDueDate', 
    Cell: ({value}) => (
      <div className='d-flex flex-column align-items-start'>
        <span className='fs-7 fw-semibold text-gray-800'>{formatDate(value)}</span>
        {getStatusBadge(value)}
      </div>
    ),
  },
  {
    Header: 'Insurance',
    accessor: 'insuranceExpiration', 
    Cell: ({value}) => (
      <div className='d-flex flex-column align-items-start'>
        <span className='fs-7 fw-semibold text-gray-800'>{formatDate(value)}</span>
        {getStatusBadge(value)}
      </div>
    ),
  },
  {
    Header: 'CPC Validity',
    accessor: 'cpcValidityExpiration', 
    Cell: ({value}) => (
      <div className='d-flex flex-column align-items-start'>
        <span className='fs-7 fw-semibold text-gray-800'>{formatDate(value)}</span>
        {getStatusBadge(value)}
      </div>
    ),
  },
  {
    Header: 'Actions',
    id: 'actions',
    Cell: ({row, data}: any) => (
      <div className='d-flex justify-content-end flex-shrink-0'>
        <Link
          to={`/apps/vehicle-management/view/${row.original.id}`}
          className='btn btn-icon btn-light-primary btn-sm me-2'
        >
          <KTIcon iconName='pencil' className='fs-3' />
        </Link>
        <button
          className='btn btn-icon btn-light-danger btn-sm'
          onClick={() => handleDeleteItem(row.original.id, row.original.plateNumber, (data as any).refetch)}
        >
          <KTIcon iconName='trash' className='fs-3' />
        </button>
      </div>
    ),
  },
]