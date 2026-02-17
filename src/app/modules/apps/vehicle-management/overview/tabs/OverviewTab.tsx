import {FC} from 'react'
import {KTCard, KTCardBody} from '../../../../../../_metronic/helpers'

const OverviewTab: FC = () => {
  return (
    <KTCard>
      <div className='card-header'>
        <div className='card-title'>
          <h3>Vehicle Specifications</h3>
        </div>
      </div>
      <KTCardBody className='p-9'>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Unit Name / Brand</label>
          <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-gray-800'>Unit 01 - Toyota Hiace</span>
          </div>
        </div>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Plate Number</label>
          <div className='col-lg-8'>
            <span className='fw-bold text-gray-800 fs-6'>ABC-1234</span>
          </div>
        </div>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>LTFRB Case Number</label>
          <div className='col-lg-8'>
            <span className='fw-bold text-gray-800 fs-6'>CASE-9922-881</span>
          </div>
        </div>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Boundary Details</label>
          <div className='col-lg-8'>
            <span className='badge badge-light-success fw-bolder me-2'>24 Hours</span>
            <span className='fw-bold text-gray-800 fs-6'>₱ 1,500.00 / day</span>
          </div>
        </div>
        {/* ... add other rows for all 18 fields ... */}
      </KTCardBody>
    </KTCard>
  )
}

export {OverviewTab}