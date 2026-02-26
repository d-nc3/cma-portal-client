import { FC } from 'react'
import * as Yup from 'yup'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import clsx from 'clsx'
import { KTIcon, KTCard, KTCardBody } from '../../../../../_metronic/helpers'

// 1. Unified Validation Schema
const damageSchema = Yup.object().shape({
  unitId: Yup.string().required('Unit is required'),
  driverId: Yup.string().required('Driver is required'),
  incidentDate: Yup.date().required('Incident date is required'),
  slipNumber: Yup.string().required('Charge Slip No. is required'),
  issueRefNo: Yup.string(),
  damageType: Yup.string().required('Damage type is required'),
  description: Yup.string(),
  charges: Yup.array().of(
    Yup.object().shape({
      nature: Yup.string().required('Description is required'),
      amount: Yup.number().min(0, 'Must be positive').required('Amount is required'),
    })
  ).min(1, 'At least one charge item is required'),
  agreementAccepted: Yup.boolean().oneOf([true], 'Driver acknowledgement is required'),
})

// 2. Unified Initial Values
const initialValues = {
  unitId: '',
  driverId: '',
  incidentDate: new Date().toISOString().split('T')[0],
  slipNumber: '',
  issueRefNo: '',
  damageType: '',
  description: '',
  charges: [{ nature: '', amount: 0 }], // Starts with one empty row
  agreementAccepted: false,
}

const AddVehicleDamageForm: FC = () => {
  const formik = useFormik({
    initialValues,
    validationSchema: damageSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true)
      try {
        // Here you call your API to save the Damage Record & Post to Ledger
        console.log('Submitting Full SDC Data:', values)
        resetForm()
      } catch (error) {
        console.error('Submission error:', error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Auto-calculate total from line items
  const totalAmount = formik.values.charges.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

  return (
    <FormikProvider value={formik}>
      <KTCard shadow={true}>
        {/* --- Header --- */}
        <div className='card-header border-0 pt-7'>
          <div className='card-title align-items-start flex-column'>
            <div className='d-flex align-items-center mb-1'>
              <span className='symbol-label bg-light-danger me-3 rounded p-2'>
                <KTIcon iconName='wrench' className='fs-2x text-danger' />
              </span>
              <span className='card-label fw-bolder fs-3 m-0'>Statement of Damage/s and/or Charge/s (SDC)</span>
            </div>
            <span className='text-muted mt-1 fw-bold fs-7'>CMAIII FREIGHT SERVICES INC.</span>
          </div>
        </div>

        <KTCardBody className='py-8'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='d-flex flex-column scroll-y me-n7 pe-7' style={{ maxHeight: '75vh' }}>
              
              {/* --- SECTION 1: Incident Assignment & Details --- */}
              <div className='mb-10'>
                <h4 className='fw-bolder text-gray-800 mb-5'>Incident Details</h4>
                <div className='row g-6'>
                  <div className='col-md-4 fv-row'>
                    <label className='required fs-7 fw-bold mb-2'>Charge Slip No.</label>
                    <input 
                      {...formik.getFieldProps('slipNumber')} 
                      className={clsx('form-control form-control-solid border-primary', {'is-invalid': formik.touched.slipNumber && formik.errors.slipNumber})} 
                      placeholder='CS-XXXXX' 
                    />
                  </div>
                  <div className='col-md-4 fv-row'>
                    <label className='fs-7 fw-bold mb-2'>Issue Ref. No.</label>
                    <input {...formik.getFieldProps('issueRefNo')} className='form-control form-control-solid' placeholder='REF-XXXXX' />
                  </div>
                  <div className='col-md-4 fv-row'>
                    <label className='required fs-7 fw-bold mb-2'>Incident Date</label>
                    <input type='date' {...formik.getFieldProps('incidentDate')} className={clsx('form-control form-control-solid', {'is-invalid': formik.touched.incidentDate && formik.errors.incidentDate})} />
                  </div>
                  <div className='col-md-6 fv-row'>
                    <label className='required fs-7 fw-bold mb-2'>Unit / Plate No.</label>
                    <select {...formik.getFieldProps('unitId')} className={clsx('form-select form-select-solid', {'is-invalid': formik.touched.unitId && formik.errors.unitId})}>
                      <option value=''>Select Unit</option>
                      <option value='1'>TX-9901</option>
                    </select>
                  </div>
                  <div className='col-md-6 fv-row'>
                    <label className='required fs-7 fw-bold mb-2'>Responsible Driver</label>
                    <select {...formik.getFieldProps('driverId')} className={clsx('form-select form-select-solid', {'is-invalid': formik.touched.driverId && formik.errors.driverId})}>
                      <option value=''>Select Driver</option>
                      <option value='1'>John Doe</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* --- SECTION 2: Damage Assessment --- */}
              <div className='mb-10 bg-light-danger rounded p-8 border border-danger border-dashed'>
                <h4 className='fw-bolder mb-5 text-danger'>Damage Assessment</h4>
                <div className='row g-4'>
                  <div className='col-md-4 fv-row'>
                    <label className='required fs-8 fw-bolder text-uppercase text-muted'>Damage Type</label>
                    <select {...formik.getFieldProps('damageType')} className={clsx('form-select form-select-solid bg-white', {'is-invalid': formik.touched.damageType && formik.errors.damageType})}>
                      <option value=''>Select Type</option>
                      <option value='BODY'>Body / Paint</option>
                      <option value='GLASS'>Glass / Windshield</option>
                      <option value='MECHANICAL'>Mechanical</option>
                      <option value='TIRES'>Tires / Rims</option>
                    </select>
                  </div>
                  <div className='col-md-8 fv-row'>
                    <label className='fs-8 fw-bolder text-uppercase text-muted'>Incident Description</label>
                    <input {...formik.getFieldProps('description')} placeholder='Briefly describe how the damage occurred...' className='form-control form-control-solid bg-white' />
                  </div>
                </div>
              </div>

              {/* --- SECTION 3: Itemized Charges Table (FieldArray) --- */}
              <div className='mb-10'>
                <h4 className='fw-bolder text-gray-800 mb-5'>Itemized Charges</h4>
                <div className='table-responsive'>
                  <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                    <thead>
                      <tr className='fw-bolder text-muted bg-light'>
                        <th className='ps-4 min-w-300px rounded-start'>Nature of Damage/s and/or Charge/s</th>
                        <th className='min-w-150px text-end pe-4 rounded-end'>Amount (₱)</th>
                        <th className='w-50px'></th>
                      </tr>
                    </thead>
                    <tbody>
                      <FieldArray
                        name='charges'
                        render={(arrayHelpers) => (
                          <>
                            {formik.values.charges.map((_, index) => (
                              <tr key={index}>
                                <td>
                                  <input
                                    {...formik.getFieldProps(`charges.${index}.nature`)}
                                    className='form-control form-control-solid'
                                    placeholder='Enter nature of damage...'
                                  />
                                </td>
                                <td>
                                  <input
                                    type='number'
                                    {...formik.getFieldProps(`charges.${index}.amount`)}
                                    className='form-control form-control-solid text-end'
                                  />
                                </td>
                                <td>
                                  <button
                                    type='button'
                                    className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    <KTIcon iconName='trash' className='fs-3' />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={3}>
                                <button
                                  type='button'
                                  className='btn btn-link btn-color-primary fw-bold p-0'
                                  onClick={() => arrayHelpers.push({ nature: '', amount: 0 })}
                                >
                                  <KTIcon iconName='plus' className='fs-3 me-1' /> Add Line Item
                                </button>
                              </td>
                            </tr>
                          </>
                        )}
                      />
                    </tbody>
                    <tfoot>
                      <tr className='bg-light-success rounded'>
                        <td className='text-end fw-bolder fs-4 ps-4 rounded-start'>TOTAL CHARGES:</td>
                        <td className='text-end fw-bolder fs-4 pe-4 text-success'>
                          ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className='rounded-end'></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* --- SECTION 4: Legal Acknowledgement --- */}
              <div className='bg-light-info rounded border-info border border-dashed p-8 mb-5'>
                <div className='d-flex mb-5'>
                  <KTIcon iconName='information-5' className='fs-1 text-info me-3' />
                  <div className='fs-7 text-gray-700 italic fw-semibold' style={{ lineHeight: '1.5' }}>
                    I hereby acknowledge this statement and agree to the charges stated herein to be true and correct...
                    I hereby authorize <strong>CMAIII FREIGHT SERVICES INC.</strong> to deduct from my deposit / salary
                    or pay / and benefits the total amount either in full or partially...
                  </div>
                </div>
                <div className='form-check form-check-custom form-check-solid form-check-success'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    {...formik.getFieldProps('agreementAccepted')}
                    id='agreementCheck'
                  />
                  <label className='form-check-label fw-bolder text-gray-800' htmlFor='agreementCheck'>
                    Driver has signed and authorized this deduction.
                  </label>
                </div>
                {formik.touched.agreementAccepted && formik.errors.agreementAccepted && (
                  <div className='text-danger fs-8 mt-2'>{formik.errors.agreementAccepted}</div>
                )}
              </div>
            </div>

            {/* --- Footer Actions --- */}
            <div className='card-footer d-flex justify-content-end py-6 px-0 bg-transparent border-top-1 mt-5'>
              <button
                type='reset'
                className='btn btn-light me-3'
                onClick={() => formik.resetForm()}
                disabled={formik.isSubmitting}
              >
                Discard
              </button>
              <button
                type='submit'
                className='btn btn-danger px-10'
                disabled={formik.isSubmitting || !formik.isValid || !formik.values.agreementAccepted}
              >
                {!formik.isSubmitting ? (
                  <span>
                    <KTIcon iconName='cloud-change' className='fs-3 me-2' /> Confirm & Post to Ledger
                  </span>
                ) : (
                  <span className='indicator-progress' style={{ display: 'block' }}>
                    Processing... <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </KTCardBody>
      </KTCard>
    </FormikProvider>
  )
}

export { AddVehicleDamageForm }