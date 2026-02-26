import {FC} from 'react'
import {KTCard, KTCardBody, KTIcon} from '../../../../../../_metronic/helpers'
import {Link, useLocation, useParams} from 'react-router-dom'

const DamageHistoryTab: FC = () => {
  // This would eventually come from your API
  const incidents = [
    {
      id: 1,
      date: '2026-02-10',
      type: 'Body Scratch',
      location: 'Left Passenger Door',
      severity: 'Minor',
      status: 'Pending Repair',
      reportedBy: 'Driver: Juan Dela Cruz',
    },
    {
      id: 2,
      date: '2025-12-15',
      type: 'Collision',
      location: 'Front Bumper',
      severity: 'Major',
      status: 'Repaired',
      reportedBy: 'Inspector: Mike Ross',
    },
  ]

  return (
    <KTCard>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Incident & Damage Logs</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Historical record of unit physical condition</span>
        </h3>
        <div className='card-toolbar'>
       
           <Link to='/apps/vehicle-management/overview/add' className='btn btn-light-danger'>
                        <KTIcon iconName='plus' className='fs-2' />
                         Report New Damage
                      </Link>
        </div>
      </div>

      <KTCardBody className='py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-150px'>Date & Type</th>
                <th className='min-w-150px'>Location</th>
                <th className='min-w-120px'>Reporter</th>
                <th className='min-w-100px'>Severity</th>
                <th className='min-w-100px'>Status</th>
                <th className='min-w-50px text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id}>
                  <td>
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-45px me-5'>
                        <span className={`symbol-label bg-light-${incident.severity === 'Major' ? 'danger' : 'warning'}`}>
                          <KTIcon 
                            iconName='shield-cross' 
                            className={`fs-2x text-${incident.severity === 'Major' ? 'danger' : 'warning'}`} 
                          />
                        </span>
                      </div>
                      <div className='d-flex justify-content-start flex-column'>
                        <span className='text-dark fw-bold text-hover-primary fs-6'>{incident.type}</span>
                        <span className='text-muted fw-semibold d-block fs-7'>{incident.date}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className='text-gray-800 fw-bold d-block fs-6'>{incident.location}</span>
                  </td>
                  <td>
                    <span className='text-gray-800 fw-semibold d-block fs-7'>{incident.reportedBy}</span>
                  </td>
                  <td>
                    <span className={`badge badge-light-${incident.severity === 'Major' ? 'danger' : 'primary'} fw-bolder`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${incident.status === 'Repaired' ? 'success' : 'light-info'} fw-bolder`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className='text-end'>
                    <button className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                      <KTIcon iconName='eye' className='fs-3' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </KTCardBody>
    </KTCard>
  )
}

export {DamageHistoryTab}