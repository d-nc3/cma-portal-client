import {FC, useState} from 'react'
import {useOutletContext} from 'react-router-dom' 
import {EditVehicleModal} from '../modals/EditVehicleModal'
import {KTCard, KTCardBody, KTIcon} from '../../../../../../_metronic/helpers' 
import moment from 'moment'

interface VehicleContext {
  vehicle: any
}

const renderExpiryBadge = (date: string | Date | undefined) => {
  if (!date) return <span className='badge badge-light-secondary fw-bolder px-4 py-3'>NOT SET</span>;

  const now = moment().startOf('day');
  const expiry = moment(date).startOf('day');
  const diffDays = expiry.diff(now, 'days');

  if (diffDays < 0) {
    return <span className='badge badge-light-danger fw-bolder px-4 py-3'>EXPIRED</span>;
  } else if (diffDays <= 30) {
    return <span className='badge badge-light-warning fw-bolder px-4 py-3'>EXPIRING SOON</span>;
  } else {
    return <span className='badge badge-light-success fw-bolder px-4 py-3'>VALID</span>;
  }
};

const ComplianceRow = ({label, dateValue}: {label: string; dateValue: any}) => (
  <div className='row mb-7'>
    <label className='col-lg-4 fw-bold text-muted'>{label}</label>
    <div className='col-lg-8 d-flex align-items-center'>
      <span className='fw-bold text-gray-800 fs-6 me-3'>
        {dateValue ? moment(dateValue).format('LL') : 'Not Set'}
      </span>
      {renderExpiryBadge(dateValue)}
    </div>
  </div>
);

const OverviewTab: FC = () => {
  const {vehicle} = useOutletContext<VehicleContext>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const refreshData = () => {

    console.log('Vehicle updated, refreshing view...')
  }

  if (!vehicle) {
    return (
      <div className='card p-10 text-center text-muted'>
        No vehicle details available.
      </div>
    )
  }

  return (
    <>
      <KTCard>
        <div className='card-header border-0'>
          <div className='card-title'>
            <h3>Vehicle Specifications & Compliance</h3>
          </div>
          <div className='card-toolbar'>
            {/* Simple button trigger - Link removed to avoid navigation conflict */}
            <button 
              className='btn btn-sm btn-light-primary fw-bolder' 
              onClick={() => setIsModalOpen(true)}
            >
              <KTIcon iconName='pencil' className='fs-3' /> Edit Details
            </button>
          </div>
        </div>

        <KTCardBody className='p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Unit Name / Brand</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-gray-800 text-uppercase'>
                {vehicle.unitName} {vehicle.brand ? `- ${vehicle.brand}` : ''}
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Plate / Year Model</label>
            <div className='col-lg-8'>
              <span className='fw-bold text-gray-800 fs-6'>
                {vehicle.plateNumber} ({vehicle.yearModel})
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Boundary Details</label>
            <div className='col-lg-8'>
              <span className='badge badge-light-primary fw-bolder me-2'>
                {vehicle.boundaryClassification}
              </span>
              <span className='fw-bold text-gray-800 fs-6'>
                ₱ {Number(vehicle.boundaryRate || 0).toLocaleString()} / day
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Coding Day</label>
            <div className='col-lg-8'>
               <span className='badge badge-light-info fw-bold'>{vehicle.codingDay}</span>
            </div>
          </div>

          <div className='separator separator-dashed my-10'></div>
          <h4 className='text-gray-800 mb-7'>Compliance & Expirations</h4>

          <ComplianceRow label="Registration Due Date" dateValue={vehicle.registrationDueDate} />
          <ComplianceRow label="CPC Validity" dateValue={vehicle.cpcValidityExpiration} />
          <ComplianceRow label="Insurance Expiration" dateValue={vehicle.insuranceExpiration} />

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Date Last Registered</label>
            <div className='col-lg-8'>
              <span className='fw-bold text-gray-600 fs-6'>
                {vehicle.dateRegistered ? moment(vehicle.dateRegistered).format('LL') : 'Not Set'}
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Fleet Inclusion</label>
            <div className='col-lg-8'>
              <span className='badge badge-dark fw-bolder fs-7'>
                FLEET {vehicle.fleetInclusion || 'N/A'}
              </span>
            </div>
          </div>
        </KTCardBody>
      </KTCard>

      {/* Modal Placement outside the card */}
      <EditVehicleModal 
        show={isModalOpen} 
        handleClose={() => setIsModalOpen(false)} 
        vehicle={vehicle}
        onSuccess={refreshData}
      />
    </>
  )
}

export {OverviewTab}