import {FC} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {KTIcon, KTCard, KTCardBody} from '../../../../../_metronic/helpers'
import {registerVehicle} from '../core/_requests'
import {VehicleModel} from '../core/_models'

const vehicleSchema = Yup.object().shape({
  unitName: Yup.string().required('Unit name is required'),
  plateNumber: Yup.string().required('Plate number is required'),
  brand: Yup.string().required('Brand is required'),
  yearModel: Yup.number().required('Year model is required'),
  boundaryRate: Yup.number().min(1, 'Rate must be greater than 0').required('Rate is required'),
  registrationDueDate: Yup.date().required('Registration due date is required'),
  codingDay: Yup.string().required('Coding day is required'),
  fleetInclusion: Yup.number().required('Fleet selection is required'),
})

const initialValues: VehicleModel = {
  unitName: '',
  brand: '',
  yearModel: 2026,
  plateNumber: '',
  chassisNumber: '',
  carNumber: '',
  engineNumber: '',
  mvFileNumber: '',
  ltfrbCaseNumber: '',
  fleetInclusion: 0,
  codingDay: '',
  serviceDaySchedule: '',
  boundaryClassification: 'DAILY',
  boundaryRate: 0,
  dateRegistered: '',
  registrationDueDate: '',
  insuranceExpiration: '',
  cpcValidityExpiration: '',
}

const AddVehicleForm: FC = () => {
  const formik = useFormik({
    initialValues,
    validationSchema: vehicleSchema,
    onSubmit: async (values, {setSubmitting, resetForm, setStatus}) => {
      setSubmitting(true)
      setStatus(null)

      try {
        const response = await registerVehicle(values) // Capture the response

        resetForm()
        setStatus({
          type: 'success',
          message: response?.message || 'Vehicle registered successfully',
        })
      } catch (error: any) {
        console.error(error)
        const message = error.response?.data?.message || 'Something went wrong. Please try again.'

        setStatus({
          type: 'danger',
          message: message,
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <KTCard>
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
              <span className='text-muted fw-bold fs-7'>Register a new vehicle to the fleet</span>
            </div>
          </div>
        </div>
      </div>

      <KTCardBody className='py-4'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='d-flex flex-column scroll-y me-n7 pe-7' style={{maxHeight: '65vh'}}>
            {/* --- Section 1: Identity --- */}
            <div className='mb-10 mt-5'>
              <div className='d-flex align-items-center mb-5'>
                <span className='bullet bullet-vertical h-40px bg-primary me-5'></span>
                <h3 className='fw-bolder m-0 text-gray-800'>Vehicle Identity</h3>
              </div>
              <div className='row g-6'>
                <div className='col-md-3 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Unit Name</label>
                  <input
                    {...formik.getFieldProps('unitName')}
                    className={clsx('form-control form-control-solid', {
                      'is-invalid': formik.touched.unitName && formik.errors.unitName,
                    })}
                  />
                </div>
                <div className='col-md-3 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Plate Number</label>
                  <input
                    {...formik.getFieldProps('plateNumber')}
                    className={clsx('form-control form-control-solid', {
                      'is-invalid': formik.touched.plateNumber && formik.errors.plateNumber,
                    })}
                  />
                </div>
                <div className='col-md-3 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Brand</label>
                  <input
                    {...formik.getFieldProps('brand')}
                    className={clsx('form-control form-control-solid', {
                      'is-invalid': formik.touched.brand && formik.errors.brand,
                    })}
                  />
                </div>
                <div className='col-md-3 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Year Model</label>
                  <input
                    type='number'
                    {...formik.getFieldProps('yearModel')}
                    className={clsx('form-control form-control-solid', {
                      'is-invalid': formik.touched.yearModel && formik.errors.yearModel,
                    })}
                  />
                </div>
              </div>
            </div>

            {/* --- Section 2: Technical & LTFRB --- */}
            <div className='mb-10 bg-light-info rounded p-8 border border-info border-dashed'>
              <h3 className='fw-bolder mb-5 text-info'>Technical & Franchise Specs</h3>
              <div className='row g-4'>
                <div className='col-md-3'>
                  <label className='fs-8 fw-bolder text-uppercase text-muted'>Chassis No.</label>
                  <input
                    {...formik.getFieldProps('chassisNumber')}
                    className='form-control form-control-sm form-control-solid bg-white'
                  />
                </div>
                <div className='col-md-3'>
                  <label className='fs-8 fw-bolder text-uppercase text-muted'>Car No.</label>
                  <input
                    {...formik.getFieldProps('carNumber')}
                    className='form-control form-control-sm form-control-solid bg-white'
                  />
                </div>
                <div className='col-md-3'>
                  <label className='fs-8 fw-bolder text-uppercase text-muted'>Engine No.</label>
                  <input
                    {...formik.getFieldProps('engineNumber')}
                    className='form-control form-control-sm form-control-solid bg-white'
                  />
                </div>
                <div className='col-md-3'>
                  <label className='fs-8 fw-bolder text-uppercase text-muted'>MV File No.</label>
                  <input
                    {...formik.getFieldProps('mvFileNumber')}
                    className='form-control form-control-sm form-control-solid bg-white'
                  />
                </div>
                <div className='col-md-12 mt-4'>
                  <label className='fs-8 fw-bolder text-uppercase text-muted'>
                    LTFRB Case Number
                  </label>
                  <input
                    {...formik.getFieldProps('ltfrbCaseNumber')}
                    className='form-control form-control-sm form-control-solid bg-white'
                    placeholder='Enter LTFRB Case #'
                  />
                </div>
              </div>
            </div>

            {/* --- Section 3: Fleet & Boundary Strategy --- */}
            <div className='mb-10'>
              <div className='d-flex align-items-center mb-5'>
                <span className='bullet bullet-vertical h-40px bg-success me-5'></span>
                <h3 className='fw-bolder m-0 text-gray-800'>Fleet & Boundary</h3>
              </div>
              <div className='row g-6'>
                <div className='col-md-4 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Fleet Category</label>
                  <select
                    {...formik.getFieldProps('fleetInclusion')}
                    onChange={(e) => {
                      const val = e.target.value
                      formik.setFieldValue('fleetInclusion', val === '' ? '' : Number(val))
                    }}
                    className={clsx('form-select form-select-solid', {
                      'is-invalid': formik.touched.fleetInclusion && formik.errors.fleetInclusion,
                    })}
                  >
                    <option value=''>Select Fleet...</option> {/* Placeholder */}
                    <option value='1'>Fleet 1</option>
                    <option value='2'>Fleet 2</option>
                    <option value='3'>Fleet 3</option>
                    <option value='4'>Fleet 4</option>
                  </select>
                  {formik.touched.fleetInclusion && formik.errors.fleetInclusion && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.fleetInclusion}</div>
                    </div>
                  )}
                </div>

                <div className='col-md-4 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Classification</label>
                  <select
                    {...formik.getFieldProps('boundaryClassification')}
                    className='form-select form-select-solid'
                  >
                    <option value='DAILY'>Daily</option>
                    <option value='TWENTY_FOUR_HOURS'>24 Hours</option>
                  </select>
                </div>

                <div className='col-md-4 fv-row'>
                  <label className='required fs-7 fw-bold mb-2'>Daily Rate (₱)</label>
                  <input
                    type='number'
                    {...formik.getFieldProps('boundaryRate')}
                    className='form-control form-control-solid'
                  />
                </div>
              </div>
            </div>

            {/* --- Section 4: Compliance --- */}
            <div className='mb-10'>
              <h3 className='fw-bolder mb-5 text-gray-800'>Compliance Deadlines</h3>
              <div className='row g-6'>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bold text-muted'>Registration Due</label>
                  <input
                    type='date'
                    {...formik.getFieldProps('registrationDueDate')}
                    className='form-control form-control-solid border-danger border-dashed'
                  />
                </div>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bold text-muted'>CPC Expiration</label>
                  <input
                    type='date'
                    {...formik.getFieldProps('cpcValidityExpiration')}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bold text-muted'>Coding Day</label>
                  <select
                    {...formik.getFieldProps('codingDay')}
                    className='form-select form-select-solid'
                  >
                    <option value=''>Select Day</option>
                    <option value='Monday'>Monday</option>
                    <option value='Tuesday'>Tuesday</option>
                    <option value='Wednesday'>Wednesday</option>
                    <option value='Thursday'>Thursday</option>
                    <option value='Friday'>Friday</option>
                  </select>
                </div>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bold text-muted'>Service Day</label>
                  <input
                    type='date'
                    {...formik.getFieldProps('serviceDaySchedule')}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bold text-muted'>Insurance Expiry</label>
                  <input
                    type='date'
                    {...formik.getFieldProps('insuranceExpiration')}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-md-4'>
                  <label className='fs-8 fw-bold text-muted'>Date Registered</label>
                  <input
                    type='date'
                    {...formik.getFieldProps('dateRegistered')}
                    className='form-control form-control-solid'
                  />
                </div>
              </div>
            </div>
          </div>
          {formik.status && (
            <div
              className={`alert alert-${
                formik.status.type || 'danger'
              } d-flex align-items-center p-5 mb-10`}
            >
              <KTIcon
                iconName={formik.status.type === 'success' ? 'check-circle' : 'shield-tick'}
                className={`fs-2hx text-${formik.status.type || 'danger'} me-4`}
              />
              <div className='d-flex flex-column'>
                <h4 className={`mb-1 text-${formik.status.type || 'danger'}`}>
                  {formik.status.type === 'success' ? 'Success' : 'Submission Error'}
                </h4>
                <span>{formik.status.message}</span>
              </div>
            </div>
          )}
          {/* 2. Your existing Footer Code */}
          <div className='card-footer d-flex justify-content-end py-6 px-0 bg-transparent border-top-1'>
            <button
              type='reset'
              className='btn btn-light me-3'
              onClick={() => {
                formik.resetForm()
                formik.setStatus(null) // Clear errors on reset
              }}
              disabled={formik.isSubmitting}
            >
              Discard
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              // formik.isValid is good, but check status to ensure
              // it doesn't stay disabled forever if server fails
              disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
            >
              {!formik.isSubmitting ? (
                <span>
                  <KTIcon iconName='cloud-change' className='fs-3 me-1' /> Save Vehicle
                </span>
              ) : (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Saving...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
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
