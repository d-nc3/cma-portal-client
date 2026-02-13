import {FC} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from '../../../../../../_metronic/helpers'
import {UserModel} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {updateUser, register} from '../core/_requests'
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
  name: Yup.string().min(3, 'Minimum 3 symbols').required('Full name is required'),
  password: Yup.string().test('required-if-new', 'Password is required', function (value) {
    const {id} = this.parent
    if (!id && !value) return false
    if (id && value && value.length < 3) return false
    return true
  }),
  roles: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one role is required')
    .required('Role is required'),
  status: Yup.boolean(), // Changed to boolean for the switch
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

  const formik = useFormik({
    initialValues: {
      id: user.id ?? '',
      email: user.email ?? '',
      name: user.fullname ?? '',
      password: '',
      roles: user.role ? [user.role.toString()] : [],
      status: user.status ?? '', 
    },
    enableReinitialize: true,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      setSubmitting(true)

      const payload = {
        id: values.id, // Explicitly include ID
        email: values.email,
        name: values.name, // This becomes 'fullname' in the next step
        fullname: values.name, // Ensure this matches backend expectation
        password: values.password,
        roleId: values.roles?.[0], // Prisma needs the string ID, not the array
        status: values.status, // Boolean: true/false
      }

      try {
        if (isNotEmpty(values.id)) {
          await updateUser(payload)
        } else {
          await register(payload)
        }
        cancel(true)
      } catch (error: any) {
        if (error.response?.status === 409) {
          setErrors({email: 'This email is already taken'})
        }
      } finally {
        setSubmitting(false)
      }
    },
  })
  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
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
          {/* Email */}
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
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Full Name */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Full Name</label>
            <input
              placeholder='Full Name'
              {...formik.getFieldProps('name')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.name && formik.errors.name},
                {'is-valid': formik.touched.name && !formik.errors.name}
              )}
              type='text'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Password */}
          <div className='fv-row mb-7'>
            <label className={clsx('fw-bold fs-6 mb-2', {required: !formik.values.id})}>
              Password{' '}
              {formik.values.id && (
                <span className='text-muted fs-7'>(Leave blank to keep current)</span>
              )}
            </label>
            <input
              placeholder='Password'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.password && formik.errors.password},
                {
                  'is-valid':
                    formik.touched.password && !formik.errors.password && formik.values.password,
                }
              )}
              type='password'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>

          {/* Role */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Role</label>
            <select
              className={clsx('form-select form-select-solid mb-3 mb-lg-0', {
                'is-invalid': formik.touched.roles && formik.errors.roles,
              })}
              onChange={(e) => formik.setFieldValue('roles', [e.target.value])}
              value={formik.values.roles?.[0] || ''}
              disabled={formik.isSubmitting || isRoleLoading}
            >
              <option value=''>Select a role</option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {formik.touched.roles && formik.errors.roles && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.roles}</span>
                </div>
              </div>
            )}
          </div>

          {/* Status Switch - Fixed for TypeScript */}
            <div className='fv-row mb-7'>
              <label className='required fw-bold fs-6 mb-2'>Status</label>
              <select
                className={clsx(
                  'form-select form-select-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.status && formik.errors.status},
                  {'is-valid': formik.touched.status && !formik.errors.status}
                )}
                {...formik.getFieldProps('status')}
                disabled={formik.isSubmitting || isUserLoading}
              >
                <option value=''>Select Status</option>
                <option value='ACTIVE'>Active</option>
                <option value='INACTIVE'>Inactive</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.status}</span>
                  </div>
                </div>
              )}
            </div>

          <div className='text-center pt-15'>
            <button
              type='reset'
              onClick={() => cancel()}
              className='btn btn-light me-3'
              disabled={formik.isSubmitting || isUserLoading}
            >
              Discard
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              disabled={isUserLoading || formik.isSubmitting || !formik.isValid}
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
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalForm}
