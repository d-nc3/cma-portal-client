import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {UserModel} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {updateUser, register, addRole} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {RoleModel} from '../../roles-list/core/_models'

type Props = {
  isUserLoading: boolean
  user: UserModel
  roles: RoleModel[]
  isRoleLoading: boolean
}

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),

  first_name: Yup.string().min(3, 'Minimum 3 symbols').required('First name is required'),
  last_name: Yup.string().min(3, 'Minimum 3 symbols').required('Last name is required'),
  password: Yup.string().min(3, 'Minimum 3 symbols').required('Password is required'),
  roles: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one role is required')
    .required('Role is required'),
})

const UserEditModalForm: FC<Props> = ({user, isUserLoading, roles, isRoleLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  const formik = useFormik({
    initialValues: {
      id: user.id ?? '',
      email: user.email ?? '',
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      password: user.password ?? '',
      roles: user.role ?? '',
    },
    enableReinitialize: true,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
          addRole(values)
        } else {
          await register(values)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group - Email */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {'is-valid': formik.touched.email && !formik.errors.email}
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - First Name */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>First Name</label>
            <input
              placeholder='First Name'
              {...formik.getFieldProps('first_name')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.first_name && formik.errors.first_name},
                {'is-valid': formik.touched.first_name && !formik.errors.first_name}
              )}
              type='text'
              name='first_name'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.first_name}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Last Name */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Last Name</label>
            <input
              placeholder='Last Name'
              {...formik.getFieldProps('last_name')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.last_name && formik.errors.last_name},
                {'is-valid': formik.touched.last_name && !formik.errors.last_name}
              )}
              type='text'
              name='last_name'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.last_name}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Password (generated or user input) */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Password</label>
            <input
              placeholder='Password'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.password && formik.errors.password},
                {'is-valid': formik.touched.password && !formik.errors.password}
              )}
              type='password'
              name='password'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Role */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Role</label>

            <select
              className={clsx(
                'form-select form-select-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.roles && formik.errors.roles},
                {'is-valid': formik.touched.roles && !formik.errors.roles}
              )}
              disabled={formik.isSubmitting || isRoleLoading}
              // Manually update Formik to store the value inside an array
              onChange={(e) => formik.setFieldValue('roles', [e.target.value])}
              value={formik.values.roles[0] || ''}
              onBlur={formik.handleBlur}
              name='roles'
            >
              <option value=''>Select a role</option>
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            {formik.touched.roles && formik.errors.roles && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.roles}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className='text-center pt-15'>
            <button
              type='reset'
              onClick={() => cancel()}
              className='btn btn-light me-3'
              data-kt-users-modal-action='cancel'
              disabled={formik.isSubmitting || isUserLoading}
            >
              Discard
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
            >
              <span className='indicator-label'>Submit</span>
              {(formik.isSubmitting || isUserLoading) && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
          {/* end::Actions */}
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalForm}
