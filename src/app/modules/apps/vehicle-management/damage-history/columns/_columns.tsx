import {Column} from 'react-table'
import {Link} from 'react-router-dom' // Ensure this is imported
import {KTIcon} from '../../../../../../_metronic/helpers'
import {deleteDamageRecord} from '../../core/_requests'

export const vehicleColumns: ReadonlyArray<Column<any>> = [
  {
    Header: 'Vehicle & Plate',
    accessor: 'vehicle',
    Cell: ({row}) => {
      const vehicle = row.original.vehicle
      return (
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
            <div className='symbol-label bg-light-danger text-danger fw-bold'>
              {vehicle?.unitName?.substring(0, 2) || '??'}
            </div>
          </div>
          <div className='d-flex flex-column'>
            <span className='text-gray-800 fw-bold'>{vehicle?.unitName}</span>
            {/* Show plateNumber instead of repeating unitName */}
            <span className='text-muted fs-7'>{vehicle?.plateNumber}</span>
          </div>
        </div>
      )
    },
  },
  {
    Header: 'Slip No.',
    accessor: 'slipNumber',
    Cell: ({value}) => <span className='fw-bold text-gray-700'>{value || 'N/A'}</span>,
  },
  {
    Header: 'Incident Date',
    accessor: 'incidentDate',
    Cell: ({value}) => (
      <span className='text-muted fw-semibold'>
        {value ? new Date(value).toLocaleDateString() : 'N/A'}
      </span>
    ),
  },
  {
    Header: 'Damage Type',
    accessor: 'damageType',
    Cell: ({value}) => (
      <span className='badge badge-light-warning fw-bold text-uppercase'>{value}</span>
    ),
  },
  {
    // Right-align both Header and Cell for numbers
    Header: 'Total Cost',
    accessor: 'amount',
    Cell: ({value}) => (
      <div className=''>
        <span className='text-gray-800 fw-bold'>
          ₱{Number(value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    ),
  },
  {
    // Right-align Header and align buttons to the right
    Header: 'Actions',
    id: 'actions',
    Cell: ({row}) => {
      const id = row.original.vehicleId;
      return (
        <div className='d-flex d pe-10 border-0'>
          <Link
            to={`/apps/vehicle-management/view/${id}`}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2'
          >
            <KTIcon iconName='eye' className='fs-3' />
          </Link>

          <button 
            className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
            onClick={() => {
              if(window.confirm('Delete this record?')) {
                deleteDamageRecord(id)
                  .then(() => {
                    window.location.reload(); // Reload the page to reflect changes
                  })
                  .catch(error => {
                    console.error('Error deleting damage record:', error);
                  });
              }
            }}
          >
            <KTIcon iconName='trash' className='fs-3' />
          </button>
        </div>
      )
    },
  },
]