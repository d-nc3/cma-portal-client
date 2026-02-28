import React, {useEffect, useState} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {IProfileDetails, profileDetailsInitValues} from '../SettingsModel'
import {getAuth} from '../../../../auth'

const profileDetailsSchema = Yup.object().shape({
  fullname: Yup.string().required('Full name is required'),
  callSign: Yup.string().required('Call sign is required'),
  address: Yup.string().required('Address is required'),
  contactNumber: Yup.string().required('Contact number is required'),
  spouseName: Yup.string().required('Spouse name is required'),
  spouseContact: Yup.string().required('Spouse contact is required'),
  carAssignment: Yup.string().required('Car assignment is required'),
  sssNumber: Yup.string().required('SSS number is required'),
  philhealthNumber: Yup.string().required('Philhealth number is required'),
  pagibigNumber: Yup.string().required('Pagibig number is required'),
  licenseNumber: Yup.string().required('License number is required'),
  licenseExpiry: Yup.string().required('License expiry is required'),
})

const ProfileDetails: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IProfileDetails>(profileDetailsInitValues)

  const formik = useFormik<IProfileDetails>({
    initialValues: profileDetailsInitValues,
    validationSchema: profileDetailsSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const token = getAuth()?.api_token
        if (!token) {
          throw new Error('No auth token found')
        }

        const body = {
          ...values,
          licenseExpiry: new Date(values.licenseExpiry).toISOString()
        }

        await fetch('http://localhost:5000/api/drivers/me/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        })

        setData(values)
        alert('Profile updated successfully')
      } catch (err) {
        console.error(err)
        alert('Failed to update profile')
      } finally {
        setLoading(false)
      }
    },
  })

  // Load current driver profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuth()?.api_token
      if (!token) {
        throw new Error('No auth token found')
      }
      const res = await fetch('http://localhost:5000/api/drivers/me', {
        headers: {Authorization: `Bearer ${token}`},
      })
      const data = await res.json()
      setData(data)
      formik.setValues(data)
    };

    fetchProfile()
  }, [])

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-header'>
        <h3 className='card-title'>Profile Details</h3>
      </div>

      <form onSubmit={formik.handleSubmit} className='form'>
        <div className='card-body'>

          {/* Full Name */}
          <div className='mb-5'>
            <label className='form-label required'>Full Name</label>
            <input className='form-control' {...formik.getFieldProps('fullname')} />
          </div>

          {/* Call Sign */}
          <div className='mb-5'>
            <label className='form-label required'>Call Sign</label>
            <input className='form-control' {...formik.getFieldProps('callSign')} />
          </div>

          {/* Address */}
          <div className='mb-5'>
            <label className='form-label required'>Address</label>
            <input className='form-control' {...formik.getFieldProps('address')} />
          </div>

          {/* Contact Number */}
          <div className='mb-5'>
            <label className='form-label required'>Contact Number</label>
            <input className='form-control' {...formik.getFieldProps('contactNumber')} />
          </div>

          {/* Spouse Name */}
          <div className='mb-5'>
            <label className='form-label required'>Spouse Name</label>
            <input className='form-control' {...formik.getFieldProps('spouseName')} />
          </div>

          {/* Spouse Contact Number */}
          <div className='mb-5'>
            <label className='form-label required'>Spouse Contact Number</label>
            <input className='form-control' {...formik.getFieldProps('spouseContact')} />
          </div>

          {/* Car Assignment */}
          <div className='mb-5'>
            <label className='form-label required'>Car Assignment</label>
            <input className='form-control' {...formik.getFieldProps('carAssignment')} />
          </div>

          {/* SSS Number */}
          <div className='mb-5'>
            <label className='form-label required'>SSS Number</label>
            <input className='form-control' {...formik.getFieldProps('sssNumber')} />
          </div>

          {/* Philhealth Number */}
          <div className='mb-5'>
            <label className='form-label required'>Philhealth Number</label>
            <input className='form-control' {...formik.getFieldProps('philhealthNumber')} />
          </div>

          {/* Pagibig Number */}
          <div className='mb-5'>
            <label className='form-label required'>Pagibig Number</label>
            <input className='form-control' {...formik.getFieldProps('pagibigNumber')} />
          </div>

          {/* License Number */}
          <div className='mb-5'>
            <label className='form-label required'>License Number</label>
            <input className='form-control' {...formik.getFieldProps('licenseNumber')} />
          </div>

          {/* License Expiry */}
          <div className='mb-5'>
            <label className='form-label required'>License Expiry</label>
            <input type='date' className='form-control' {...formik.getFieldProps('licenseExpiry')} />
          </div>

          {/* Submit */}
          <div className='text-end'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export {ProfileDetails}
