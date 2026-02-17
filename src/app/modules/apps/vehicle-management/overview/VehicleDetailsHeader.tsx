import {FC} from 'react'
import {KTIcon} from '../../../../../_metronic/helpers'
import {Link, useLocation, useParams} from 'react-router-dom'

const VehicleDetailsHeader: FC = () => {
  const location = useLocation()
  const {id} = useParams()

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          {/* Vehicle Icon/Avatar */}
          <div className='me-7 mb-4'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              <div className='symbol-label fs-1 bg-light-primary text-primary fw-bold'>ABC-1234</div>
              <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                    Toyota Hiace (Unit 01)
                  </a>
                  <KTIcon iconName='verify' className='fs-1 text-primary' />
                </div>
                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <span className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'>
                    <KTIcon iconName='truck' className='fs-4 me-1' /> 2024 Model
                  </span>
                  <span className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'>
                    <KTIcon iconName='geolocation' className='fs-4 me-1' /> Manila South Fleet
                  </span>
                </div>
              </div>

              <div className='d-flex my-4'>
                <button className='btn btn-sm btn-primary me-3'>Hire Driver</button>
                <div className='me-0'>
                  <button className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'>
                    <i className='bi bi-three-dots-vertical fs-3'></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Block from image_12e4aa.png */}
            <div className='d-flex flex-wrap flex-stack'>
              <div className='d-flex flex-column flex-grow-1 pe-8'>
                <div className='d-flex flex-wrap'>
                  <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                    <div className='d-flex align-items-center'>
                      <KTIcon iconName='arrow-up' className='fs-3 text-success me-2' />
                      <div className='fs-2 fw-bolder'>₱1,500</div>
                    </div>
                    <div className='fw-bold fs-6 text-gray-400'>Daily Rate</div>
                  </div>
                  <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                    <div className='d-flex align-items-center'>
                      <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                      <div className='fs-2 fw-bolder'>75</div>
                    </div>
                    <div className='fw-bold fs-6 text-gray-400'>Service Days</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar Block */}
              <div className='d-flex align-items-center w-200px w-sm-300px flex-column mt-3'>
                <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                  <span className='fw-bold fs-6 text-gray-400'>Reg. Completion</span>
                  <span className='fw-bolder fs-6'>80%</span>
                </div>
                <div className='h-5px mx-3 w-100 bg-light mb-3'>
                  <div className='bg-success rounded h-5px' role='progressbar' style={{width: '80%'}}></div>
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
                className={`nav-link text-active-primary me-6 ${location.pathname.includes('maintenance') && 'active'}`}
                 to={`/apps/vehicle-management/view/${id}/maintenance`}
              >
                Maintenance
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link text-active-primary me-6' to='#'>Documents</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {VehicleDetailsHeader}