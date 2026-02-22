import React, { useMemo } from 'react'
import { KTIcon } from '../../../../../../_metronic/helpers'

export interface DriverApprehension {
  id: number
  driverName: string
  violationType: string
  ticketNumber: string
  dateIssued: string
  expirationDate: string
  status: 'Active' | 'Expired' | 'Cleared'
}

interface DriversApprehensionCardProps {
  apprehensions: DriverApprehension[]
}

const DriversApprehensionCard: React.FC<DriversApprehensionCardProps> = ({
  apprehensions,
}) => {
  const total = apprehensions.length

  const activeCount = useMemo(
    () => apprehensions.filter(a => a.status === 'Active').length,
    [apprehensions]
  )

  const expiredCount = useMemo(
    () => apprehensions.filter(a => a.status === 'Cleared').length,
    [apprehensions]
  )

  return (
    <div className='card shadow-sm'>
      <div className='card-header bg-primary border-0'>
        <div className='d-flex justify-content-between align-items-center w-100'>
          <div className='d-flex align-items-center'>
            <KTIcon iconName='database' className='fs-2 text-white me-3' />
            <h3 className='fw-bold text-white mb-0'>
              Drivers Apprehensions
            </h3>
          </div>

          <span className='badge badge-light-warning fs-7'>
            {total} Total Records
          </span>
        </div>
      </div>

      <div className='card-body'>

        <div className='row mb-5'>
          <div className='col'>
            <div className='border rounded p-3 text-center'>
              <div className='fs-4 fw-bold text-primary'>{total}</div>
              <div className='text-muted fs-7'>Total Cases</div>
            </div>
          </div>

          <div className='col'>
            <div className='border rounded p-3 text-center'>
              <div className='fs-4 fw-bold text-success'>{activeCount}</div>
              <div className='text-muted fs-7'>Active</div>
            </div>
          </div>

          <div className='col'>
            <div className='border rounded p-3 text-center'>
              <div className='fs-4 fw-bold text-danger'>{expiredCount}</div>
              <div className='text-muted fs-7'>Expired</div>
            </div>
          </div>
        </div>

        <div className='table-responsive'>
          <table className='table table-row-bordered align-middle'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th>Driver</th>
                <th>Violation</th>
                <th>Ticket #</th>
                <th>Issued</th>
                <th>Expiration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {apprehensions.length === 0 && (
                <tr>
                  <td colSpan={6} className='text-center text-muted py-10'>
                    No apprehension records found
                  </td>
                </tr>
              )}

              {apprehensions.map(item => (
                <tr key={item.id}>
                  <td className='fw-semibold'>{item.driverName}</td>
                  <td>{item.violationType}</td>
                  <td>{item.ticketNumber}</td>
                  <td>{item.dateIssued}</td>
                  <td>{item.expirationDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === 'Active'
                          ? 'badge-light-success'
                          : item.status === 'Expired'
                          ? 'badge-light-danger'
                          : 'badge-light-primary'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DriversApprehensionCard