import {FC} from 'react'
import {KTIcon} from '../../../../../_metronic/helpers'
import {Link, useLocation, useParams} from 'react-router-dom'

interface Props {
  vehicle: any // Received from VehicleOverview
}

const VehicleDetailsHeader: FC<Props> = ({vehicle}) => {
  const location = useLocation()
  const {id} = useParams()

  if (!vehicle) return null

  const avatarLetters = vehicle.plateNumber ? vehicle.plateNumber.substring(0, 2).toUpperCase() : '??'

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              <div className='symbol-label fs-1 bg-light-primary text-primary fw-bold'>
                {avatarLetters}
              </div>
              {/* Status dot: Green if valid, could be red if expired */}
              <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <span className='text-gray-800 fs-2 fw-bolder me-1'>
                    {vehicle.brand} {vehicle.unitName}
                  </span>
                  <KTIcon iconName='verify' className='fs-1 text-primary' />
                </div>
                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <span className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'>
                    <KTIcon iconName='truck' className='fs-4 me-1' /> {vehicle.yearModel} Model
                  </span>
                  <span className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'>
                    <KTIcon iconName='barcode' className='fs-4 me-1' /> {vehicle.plateNumber}
                  </span>
                  <span className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'>
                    <KTIcon iconName='geolocation' className='fs-4 me-1' /> {vehicle.boundaryClassification}
                  </span>
                </div>
              </div>
            </div>

            <div className='d-flex flex-wrap flex-stack'>
              <div className='d-flex flex-column flex-grow-1 pe-8'>
                <div className='d-flex flex-wrap'>
                  <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                    <div className='d-flex align-items-center'>
                      <KTIcon iconName='arrow-up' className='fs-3 text-success me-2' />
                      <div className='fs-2 fw-bolder'>₱{Number(vehicle.boundaryRate).toLocaleString()}</div>
                    </div>
                    <div className='fw-bold fs-6 text-gray-400'>Daily Rate</div>
                  </div>
                  
                  <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                    <div className='d-flex align-items-center'>
                      <KTIcon iconName='calendar' className='fs-3 text-info me-2' />
                      <div className='fs-2 fw-bolder'>{vehicle.codingDay}</div>
                    </div>
                    <div className='fw-bold fs-6 text-gray-400'>Coding Day</div>
                  </div>
                </div>
              </div>

              <div className='d-flex align-items-center w-200px w-sm-300px flex-column mt-3'>
                <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                  <span className='fw-bold fs-6 text-gray-400'>Profile Status</span>
                  <span className='fw-bolder fs-6'>Complete</span>
                </div>
                <div className='h-5px mx-3 w-100 bg-light mb-3'>
                  <div className='bg-success rounded h-5px' style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='d-flex overflow-auto h-55px'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            <li className='nav-item'>
              <Link
                className={`nav-link text-active-primary me-6 ${location.pathname.includes('details') && 'active'}`}
                to={`/apps/vehicle-management/view/${id}/details`}
              >
                Overview
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={`nav-link text-active-primary me-6 ${location.pathname.includes('Unit Damage Logs') && 'active'}`}
                to={`/apps/vehicle-management/view/${id}/maintenance`}
              >
                Maintenance
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {VehicleDetailsHeader}