import {FC, useMemo, useState, useEffect} from 'react'
import * as Yup from 'yup'
import {useFormik, FieldArray, FormikProvider} from 'formik'
import clsx from 'clsx'
import Select from 'react-select'
import {KTIcon, KTCard, KTCardBody} from '../../../../../_metronic/helpers'
import {registerVehicleDamage, getVehicles, getAllDrivers} from '../core/_requests'

const damageSchema = Yup.object().shape({
  unitId: Yup.string().required('Unit is required'),
  driverId: Yup.string().required('Driver is required'),
  incidentDate: Yup.date().required('Required'),
  slipNumber: Yup.string().required('Charge Slip No. is required'),
  damageType: Yup.string().required('Required'),
  charges: Yup.array()
    .of(
      Yup.object().shape({
        nature: Yup.string().required('Required'),
        amount: Yup.number().min(1, 'Amount must be greater than 0').required('Required'),
      })
    )
    .min(1, 'At least one charge is required'),
  agreementAccepted: Yup.boolean().oneOf([true], 'Required'),
})

const initialValues = {
  unitId: '',
  driverId: '',
  incidentDate: new Date().toISOString().split('T')[0],
  slipNumber: '',
  issueRefNo: '',
  damageType: '',
  description: '',
  charges: [{nature: '', amount: 0}],
  agreementAccepted: false,
}

const AddVehicleDamageForm: FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [alert, setAlert] = useState<{type: 'success' | 'danger'; message: string} | null>(null)

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [vRes, dRes] = await Promise.all([getVehicles(), getAllDrivers()])
        const vData = vRes?.data || vRes
        const dData = dRes?.data || dRes

        if (Array.isArray(vData)) setVehicles(vData)
        if (Array.isArray(dData)) setDrivers(dData)
      } catch (error) {
        console.error('Error fetching dropdown options:', error)
      }
    }
    fetchDropdownData()
  }, [])

  const vehicleOptions = useMemo(
    () =>
      vehicles.map((v) => ({
        value: v.id,
        label: `${v.plateNumber} ${v.unitName ? `- ${v.unitName}` : ''}`,
      })),
    [vehicles]
  )

  const driverOptions = useMemo(
    () =>
      drivers.map((d) => ({
        value: d.id,
        label: d.fullname || `${d.firstName} ${d.lastName}`,
      })),
    [drivers]
  )

  const formik = useFormik({
    initialValues,
    validationSchema: damageSchema,
    onSubmit: async (values, {setSubmitting, resetForm, setStatus}) => {
      setStatus(null) // Clear status before new attempt
      try {
        await registerVehicleDamage(values)
        setStatus({type: 'success', message: 'Vehicle damage recorded successfully!'})
        setAlert({type: 'success', message: 'Vehicle damage recorded successfully!'})
        resetForm()
        setTimeout(() => setAlert(null), 5000)
      } catch (error: any) {
        setStatus({
          type: 'danger',
          message: error.message || 'An unexpected error occurred.',
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  const totalAmount = useMemo(
    () => formik.values.charges.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    [formik.values.charges]
  )

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#f5f8fa',
      borderColor: 'transparent',
      borderRadius: '0.475rem',
      padding: '2px',
      boxShadow: 'none',
      '&:hover': {borderColor: 'transparent'},
    }),
    menuPortal: (base: any) => ({...base, zIndex: 9999}),
  }

  return (
    <FormikProvider value={formik}>
      <KTCard>
        <div className='card-header border-0 pt-7'>
          <div className='card-title align-items-start flex-column'>
            <div className='d-flex align-items-center mb-1'>
              <span className='symbol-label bg-light-danger me-3 rounded p-2'>
                <KTIcon iconName='wrench' className='fs-2x text-danger' />
              </span>
              <span className='card-label fw-bolder fs-3 m-0'>Statement of Damage/s (SDC)</span>
            </div>
            <span className='text-muted mt-1 fw-bold fs-7'>CMAIII FREIGHT SERVICES INC.</span>
          </div>
        </div>

        <KTCardBody className='py-8'>
          <form onSubmit={formik.handleSubmit} noValidate>
            {/* Status Alert Display */}
            {formik.status && (
              <div className={`alert alert-${formik.status.type} d-flex align-items-center p-5 mb-10`}>
                <KTIcon
                  iconName={formik.status.type === 'success' ? 'check-circle' : 'information-5'}
                  className={`fs-2hx text-${formik.status.type} me-4`}
                />
                <div className='d-flex flex-column'>
                  <h4 className='mb-1 text-dark'>
                    {formik.status.type === 'success' ? 'Success' : 'Submission Error'}
                  </h4>
                  <span>{formik.status.message}</span>
                </div>
              </div>
            )}

            <div className='scroll-y me-n7 pe-7' style={{maxHeight: '75vh'}}>
              <div className='mb-10'>
                <h4 className='fw-bolder text-gray-800 mb-5'>Incident Details</h4>
                <div className='row g-6'>
                  {/* Charge Slip No. */}
                  <div className='col-md-4'>
                    <label className='required fs-7 fw-bold mb-2'>Charge Slip No.</label>
                    <input
                      {...formik.getFieldProps('slipNumber')}
                      className={clsx(
                        'form-control form-control-solid',
                        formik.touched.slipNumber && formik.errors.slipNumber && 'is-invalid'
                      )}
                    />
                    {formik.touched.slipNumber && formik.errors.slipNumber && (
                      <div className='invalid-feedback'>{formik.errors.slipNumber as string}</div>
                    )}
                  </div>

                  {/* Issue Ref. No. */}
                  <div className='col-md-4'>
                    <label className='fs-7 fw-bold mb-2'>Issue Ref. No.</label>
                    <input
                      {...formik.getFieldProps('issueRefNo')}
                      className='form-control form-control-solid'
                    />
                  </div>

                  {/* Incident Date */}
                  <div className='col-md-4'>
                    <label className='required fs-7 fw-bold mb-2'>Incident Date</label>
                    <input
                      type='date'
                      {...formik.getFieldProps('incidentDate')}
                      className='form-control form-control-solid'
                    />
                  </div>

                  {/* Unit Dropdown */}
                  <div className='col-md-12'>
                    <label className='required fs-7 fw-bold mb-2'>Unit / Plate No.</label>
                    <Select
                      placeholder='Search Plate or Unit Name...'
                      options={vehicleOptions}
                      styles={selectStyles}
                      className={clsx(formik.touched.unitId && formik.errors.unitId && 'is-invalid')}
                      onChange={(option: any) =>
                        formik.setFieldValue('unitId', option?.value || '')
                      }
                      onBlur={() => formik.setFieldTouched('unitId', true)}
                      value={vehicleOptions.find((opt) => opt.value === formik.values.unitId)}
                      menuPortalTarget={document.body}
                    />
                    {formik.touched.unitId && formik.errors.unitId && (
                      <div className='text-danger mt-2 fs-7'>{formik.errors.unitId as string}</div>
                    )}
                  </div>

                  {/* Driver Dropdown */}
                  <div className='col-md-12'>
                    <label className='required fs-7 fw-bold mb-2'>Responsible Driver</label>
                    <Select
                      placeholder='Search Driver Name...'
                      options={driverOptions}
                      styles={selectStyles}
                      className={clsx(
                        formik.touched.driverId && formik.errors.driverId && 'is-invalid'
                      )}
                      onChange={(option: any) =>
                        formik.setFieldValue('driverId', option?.value || '')
                      }
                      onBlur={() => formik.setFieldTouched('driverId', true)}
                      value={driverOptions.find((opt) => opt.value === formik.values.driverId)}
                      menuPortalTarget={document.body}
                    />
                    {formik.touched.driverId && formik.errors.driverId && (
                      <div className='text-danger mt-2 fs-7'>{formik.errors.driverId as string}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Damage Classification Section */}
              <div className='mb-10 bg-light-danger rounded p-6 border border-danger border-dashed'>
                <div className='row g-4'>
                  <div className='col-md-4'>
                    <label className='required fs-8 fw-bolder text-uppercase text-danger'>
                      Damage Type
                    </label>
                    <select
                      {...formik.getFieldProps('damageType')}
                      className={clsx(
                        'form-select form-select-solid bg-white border-danger',
                        formik.touched.damageType && formik.errors.damageType && 'is-invalid'
                      )}
                    >
                      <option value=''>Select Type</option>
                      <option value='BODY'>Body / Paint</option>
                      <option value='GLASS'>Glass / Windshield</option>
                      <option value='ENGINE'>Engine / Mechanical</option>
                      <option value='TIRES'>Tires / Wheels</option>
                    </select>
                  </div>
                  <div className='col-md-8'>
                    <label className='fs-8 fw-bolder text-uppercase text-danger'>Description</label>
                    <input
                      {...formik.getFieldProps('description')}
                      className='form-control form-control-solid bg-white'
                      placeholder='Briefly explain how it happened...'
                    />
                  </div>
                </div>
              </div>

              {/* Itemized Charges Table */}
              <div className='mb-10'>
                <h4 className='fw-bolder text-gray-800 mb-5'>Itemized Charges</h4>
                <div className='table-responsive'>
                  <table className='table table-row-dashed align-middle gs-0 gy-4'>
                    <thead>
                      <tr className='fw-bolder text-muted bg-light'>
                        <th className='ps-4 min-w-300px rounded-start'>Nature of Charge</th>
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
                                    className={clsx(
                                      'form-control form-control-solid',
                                      formik.errors.charges?.[index] && 'is-invalid'
                                    )}
                                    placeholder='Spare part name or labor...'
                                  />
                                </td>
                                <td>
                                  <input
                                    type='number'
                                    {...formik.getFieldProps(`charges.${index}.amount`)}
                                    className='form-control form-control-solid text-end'
                                  />
                                </td>
                                <td className='text-end'>
                                  <button
                                    type='button'
                                    className='btn btn-icon btn-active-light-danger btn-sm'
                                    onClick={() => arrayHelpers.remove(index)}
                                    disabled={formik.values.charges.length <= 1}
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
                                  onClick={() => arrayHelpers.push({nature: '', amount: 0})}
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
                      <tr className='bg-light-success'>
                        <td className='text-end fw-bolder fs-4 ps-4 rounded-start'>TOTAL:</td>
                        <td className='text-end fw-bolder fs-4 pe-4 text-success'>
                          ₱{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </td>
                        <td className='rounded-end'></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className='bg-light-info rounded border-info border border-dashed p-6 mb-5'>
                <div className='form-check form-check-custom form-check-solid form-check-success'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    {...formik.getFieldProps('agreementAccepted')}
                    id='agreementCheck'
                  />
                  <label
                    className='form-check-label fw-bolder text-gray-800'
                    htmlFor='agreementCheck'
                  >
                    Driver has signed and authorized this deduction.
                  </label>
                </div>
                {formik.touched.agreementAccepted && formik.errors.agreementAccepted && (
                  <div className='text-danger mt-2 fs-7'>{formik.errors.agreementAccepted as string}</div>
                )}
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-0'>
              <button
                type='button'
                className='btn btn-light me-3'
                onClick={() => {
                  formik.resetForm()
                  formik.setStatus(null)
                }}
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
                  'Confirm & Post to Ledger'
                ) : (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
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

export {AddVehicleDamageForm}