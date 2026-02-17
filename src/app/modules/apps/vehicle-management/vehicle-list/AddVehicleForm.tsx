import {FC} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {KTIcon, KTCard, KTCardBody} from '../../../../../_metronic/helpers'

// (Validation Schema and Initial Values remain the same as previous)
const vehicleSchema = Yup.object().shape({
  unit_name: Yup.string().required('Unit name is required'),
  plate_number: Yup.string().required('Plate number is required'),
  brand: Yup.string().required('Brand is required'),
  boundary_rate: Yup.number().min(1, 'Rate must be greater than 0').required('Rate is required'),
  registration_due_date: Yup.date().required('Registration due date is required'),
  coding_day: Yup.string().required('Coding day is required'),
})

const initialValues = {
  unit_name: '', brand: '', year_model: 2026, plate_number: '',
  chassis_number: '', body_number: '', engine_number: '', mv_file_number: '',
  ltfrb_case_number: '', fleet_inclusion: '', coding_day: '', service_day_schedule: '',
  boundary_classification: 'Daily', boundary_rate: 0, date_registered: '',
  registration_due_date: '', insurance_expiration: '', cpc_validity_expiration: '',
}

const AddVehicleForm: FC = () => {
  const formik = useFormik({
    initialValues,
    validationSchema: vehicleSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setTimeout(() => { setSubmitting(false) }, 1000)
    },
  })

  return (
    <KTCard>
      {/* begin::Header */}
      <div className='card-header border-0 pt-6'>
        <div className='card-title'>
          <div className='d-flex align-items-center'>
            <div className='symbol symbol-45px me-5'>
              <span className='symbol-label bg-light-primary'>
                <KTIcon iconName='truck' className='fs-2x text-primary' />
              </span>
            </div>
            <div className='d-flex flex-column'>
              <h2 className='fw-bolder'>Vehicle Enrollment</h2>
              <span className='text-muted fw-bold fs-7'>Register a new vehicle to the fleet management system</span>
            </div>
          </div>
        </div>
      </div>
      {/* end::Header */}

      <KTCardBody className='py-4'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div 
            className='d-flex flex-column scroll-y me-n7 pe-7' 
            data-kt-scroll='true' 
            data-kt-scroll-max-height='auto'
            style={{maxHeight: '65vh'}}
          >
            {/* --- SECTION 1: Identity --- */}
            <div className='mb-10 mt-5'>
              <div className='d-flex align-items-center mb-5'>
                <span className='bullet bullet-vertical h-40px bg-primary me-5'></span>
                <h3 className='fw-bolder m-0 text-gray-800'>Vehicle Identity</h3>
              </div>
              <div className='row g-6'>
                <div className='col-md-6 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Unit Name</label>
                  <input {...formik.getFieldProps('unit_name')} className={clsx('form-control form-control-solid', {'is-invalid': formik.touched.unit_name && formik.errors.unit_name})} />
                </div>
                <div className='col-md-6 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Plate Number</label>
                  <input {...formik.getFieldProps('plate_number')} className={clsx('form-control form-control-solid', {'is-invalid': formik.touched.plate_number && formik.errors.plate_number})} />
                </div>
              </div>
            </div>

            {/* --- SECTION 2: Technical (Highlighted Box) --- */}
            <div className='mb-10 bg-light-info rounded p-8 border border-info border-dashed'>
              <h3 className='fw-bolder mb-5 text-info'>Technical Specifications</h3>
              <div className='row g-4'>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bolder text-uppercase text-muted'>Chassis No.</label>
                  <input {...formik.getFieldProps('chassis_number')} className='form-control form-control-sm form-control-solid bg-white' />
                </div>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bolder text-uppercase text-muted'>Body No.</label>
                  <input {...formik.getFieldProps('body_number')} className='form-control form-control-sm form-control-solid bg-white' />
                </div>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bolder text-uppercase text-muted'>Engine No.</label>
                  <input {...formik.getFieldProps('engine_number')} className='form-control form-control-sm form-control-solid bg-white' />
                </div>
              </div>
            </div>

            {/* --- SECTION 3: Financials & Boundary --- */}
            <div className='mb-10'>
              <h3 className='fw-bolder mb-5'>Boundary & Rate</h3>
              <div className='row g-9 align-items-end'>
                <div className='col-md-6'>
                   <label className='required fs-7 fw-bold mb-3'>Classification</label>
                   <div className='nav-group nav-group-outline d-inline-flex'>
                      <button 
                        type="button"
                        onClick={() => formik.setFieldValue('boundary_classification', 'Daily')}
                        className={clsx('btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 fw-bold', {active: formik.values.boundary_classification === 'Daily'})}
                      >Daily</button>
                      <button 
                        type="button"
                        onClick={() => formik.setFieldValue('boundary_classification', '24 Hours')}
                        className={clsx('btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 fw-bold', {active: formik.values.boundary_classification === '24 Hours'})}
                      >24 Hours</button>
                   </div>
                </div>
                <div className='col-md-6'>
                  <label className='required fs-7 fw-bold mb-2'>Daily Rate (₱)</label>
                  <input type='number' {...formik.getFieldProps('boundary_rate')} className='form-control form-control-lg form-control-solid' />
                </div>
              </div>
            </div>

            {/* --- SECTION 4: Compliance Dates --- */}
            <div className='mb-10'>
              <h3 className='fw-bolder mb-5 text-gray-800'>Compliance Deadlines</h3>
              <div className='row g-6'>
                <div className='col-md-3'>
                  <label className='fs-8 fw-bold text-muted'>Registration Due</label>
                  <input type='date' {...formik.getFieldProps('registration_due_date')} className='form-control form-control-solid border-danger border-dashed' />
                </div>
                <div className='col-md-3'>
                  <label className='fs-8 fw-bold text-muted'>CPC Expiration</label>
                  <input type='date' {...formik.getFieldProps('cpc_validity_expiration')} className='form-control form-control-solid' />
                </div>
                <div className='col-md-3'>
                  <label className='fs-8 fw-bold text-muted'>Insurance Exp.</label>
                  <input type='date' {...formik.getFieldProps('insurance_expiration')} className='form-control form-control-solid' />
                </div>
                <div className='col-md-3'>
                  <label className='fs-8 fw-bold text-muted'>Fleet Inclusion</label>
                  <input type='date' {...formik.getFieldProps('fleet_inclusion')} className='form-control form-control-solid' />
                </div>
              </div>
            </div>
          </div>

          {/* --- ACTIONS --- */}
          <div className='card-footer d-flex justify-content-end py-6 px-0 bg-transparent border-top-1'>
            <button type='reset' className='btn btn-light me-3' onClick={() => formik.resetForm()}>Discard</button>
            <button type='submit' className='btn btn-primary' disabled={formik.isSubmitting || !formik.isValid}>
              {!formik.isSubmitting ? (
                <span><KTIcon iconName='cloud-change' className='fs-3 me-1' /> Save Changes</span>
              ) : (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Saving... <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </KTCardBody>
    </KTCard>
  )
}

export {AddVehicleForm}