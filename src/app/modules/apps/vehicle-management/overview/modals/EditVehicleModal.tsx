import {FC, useEffect, useState, ChangeEvent} from 'react'
import {Modal, Button} from 'react-bootstrap'
import moment from 'moment'
import {updateVehicle} from '../../core/_requests'
import {KTIcon} from '../../../../../../_metronic/helpers'

interface Props {
  show: boolean
  handleClose: () => void
  vehicle: any
  onSuccess: () => void
}

const EditVehicleModal: FC<Props> = ({show, handleClose, vehicle, onSuccess}) => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState<any>({})

  const dateFields = ['dateRegistered', 'insuranceExpiration', 'cpcValidityExpiration', 'registrationDueDate']

  useEffect(() => {
    if (vehicle && show) {
      const formattedData = {...vehicle}
      dateFields.forEach((field) => {
        formattedData[field] = vehicle[field] ? moment(vehicle[field]).format('YYYY-MM-DD') : ''
      })
      setFormData(formattedData)
      setStatus('idle')
    }
  }, [vehicle, show])

  // 2. Generic Change Handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target
    setFormData((prev: any) => ({...prev, [name]: value}))
  }

  const handleUpdate = async () => {
    setLoading(true)
    setStatus('idle')
    try {
      await updateVehicle(formData)
      setStatus('success')
      onSuccess()
      // Timeout gives the user time to read the success message before closing
      setTimeout(() => handleClose(), 2000)
    } catch (error: any) {
      setStatus('error')
      setErrorMessage(error.message || 'Failed to update vehicle.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} size='lg' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title className='fw-bold'>Update Vehicle: {vehicle?.plateNumber}</Modal.Title>
      </Modal.Header>

      <Modal.Body className='scroll-y mx-5 mx-xl-15 my-7'>
        {/* 3. Status Alerts */}
        {status === 'success' && (
          <div className='alert alert-dismissible bg-light-success d-flex flex-column flex-center py-10 mb-10'>
            <KTIcon iconName='check-circle' className='fs-5x text-success mb-5' />
            <h2 className='fw-bolder'>Update Successful!</h2>
            <p className='text-muted'>Synchronizing data...</p>
          </div>
        )}

        {status === 'error' && (
          <div className='alert alert-danger d-flex align-items-center p-5 mb-10'>
            <KTIcon iconName='information-5' className='fs-2hx text-danger me-4' />
            <div className='d-flex flex-column'>
              <h4 className='mb-1 text-dark'>Update Failed</h4>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* 4. Optimized Form Rendering */}
        {status !== 'success' && (
          <form className='form' noValidate>
            <SectionTitle title='General Specifications' />
            <div className='row g-9 mb-8'>
              <FormGroup label='Unit Name' name='unitName' value={formData.unitName} onChange={handleInputChange} />
              <FormGroup label='Brand / Make' name='brand' value={formData.brand} onChange={handleInputChange} />
            </div>

            <div className='row g-9 mb-8'>
              <FormGroup label='Plate Number' name='plateNumber' value={formData.plateNumber} onChange={handleInputChange} col='4' />
              <FormGroup label='Year Model' name='yearModel' type='number' value={formData.yearModel} onChange={handleInputChange} col='4' />
              <FormGroup label='Car Number' name='carNumber' value={formData.carNumber} onChange={handleInputChange} col='4' />
            </div>

            <SectionTitle title='Technical Identifiers' />
            <div className='row g-9 mb-8'>
              <FormGroup label='Engine Number' name='engineNumber' value={formData.engineNumber} onChange={handleInputChange} />
              <FormGroup label='Chassis Number' name='chassisNumber' value={formData.chassisNumber} onChange={handleInputChange} />
            </div>

            <div className='row g-9 mb-8'>
              <FormGroup label='MV File Number' name='mvFileNumber' value={formData.mvFileNumber} onChange={handleInputChange} />
              <FormGroup label='LTFRB Case Number' name='ltfrbCaseNumber' value={formData.ltfrbCaseNumber} onChange={handleInputChange} />
            </div>

            <SectionTitle title='Operations & Compliance' />
            <div className='row g-9 mb-8'>
              <FormGroup label='Boundary Rate (₱)' name='boundaryRate' type='number' value={formData.boundaryRate} onChange={handleInputChange} />
              <div className='col-md-6 fv-row'>
                <label className='fs-6 fw-bold mb-2'>Coding Day</label>
                <select name='codingDay' className='form-select form-select-solid' value={formData.codingDay || ''} onChange={handleInputChange}>
                  <option value=''>Select Day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
            </div>

            <div className='row g-9 mb-8'>
              <FormGroup label='Registration Due' name='registrationDueDate' type='date' value={formData.registrationDueDate} onChange={handleInputChange} />
              <FormGroup label='CPC Expiration' name='cpcValidityExpiration' type='date' value={formData.cpcValidityExpiration} onChange={handleInputChange} />
            </div>
          </form>
        )}
      </Modal.Body>

      <Modal.Footer className='text-center'>
        {status !== 'success' && (
          <>
            <Button variant='light' className='me-3' onClick={handleClose} disabled={loading}>Discard</Button>
            <Button variant='primary' onClick={handleUpdate} disabled={loading}>
              {!loading ? 'Submit Changes' : <LoadingSpinner />}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  )
}

const SectionTitle = ({title}: {title: string}) => (
  <div className='d-flex flex-column mb-8 fv-row'>
    <h4 className='mb-3'>{title}</h4>
    <div className='separator separator-dashed mb-5'></div>
  </div>
)

const FormGroup = ({label, name, value, onChange, type = 'text', col = '6'}: any) => (
  <div className={`col-md-${col} fv-row`}>
    <label className='fs-6 fw-bold mb-2'>{label}</label>
    <input type={type} name={name} className='form-control form-control-solid' value={value || ''} onChange={onChange} />
  </div>
)

const LoadingSpinner = () => (
  <span className='indicator-progress' style={{display: 'block'}}>
    Wait... <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
  </span>
)

export {EditVehicleModal}