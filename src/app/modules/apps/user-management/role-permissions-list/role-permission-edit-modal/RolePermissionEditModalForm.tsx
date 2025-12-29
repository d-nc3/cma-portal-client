import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {RolePermissionModel} from '../core/_models'
import Select from 'react-select'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {RolePermissionListLoading} from '../components/loading/RolePermissionListLoading'
import {updatePermission, register} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {RoleModel} from '../../roles-list/core/_models'
import {PermissionModel} from '../../permissions-list/core/_models'

type Props = {
  isRolePermissionLoading: boolean
  role_permission: RolePermissionModel
  roles: RoleModel[]
  isRoleLoading: boolean
  permissions: PermissionModel[]
  isPermissionLoading: boolean
}

const rolePermissionSchema = Yup.object().shape({
  role_id: Yup.string()
    .required('Role is required'), // Must select a role

  permission_id: Yup.array()
    .of(Yup.string()) // Each selected permission must be a string (ID)
    .min(1, 'At least one permission must be selected') // Require at least one permission
    .required('Permissions are required'),
})

const RolePermissionEditModalForm: FC<Props> = ({
  role_permission,
  isRolePermissionLoading,
  roles = [],
  permissions = [],
}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [permissionForEdit, setRoleForEdit] = useState<RolePermissionModel>({
    ...role_permission,
    role_id: role_permission.role_id,
    permission_id: role_permission.permission_id,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  const formik = useFormik({
    initialValues: permissionForEdit,
    validationSchema: rolePermissionSchema,
    enableReinitialize: true, // << add this!
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updatePermission(values)
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
          {/* begin::Input group - Role */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Role</label>

            <select
              {...formik.getFieldProps('role_id')}
              className={clsx(
                'form-select form-select-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.role_id && formik.errors.role_id},
                {'is-valid': formik.touched.role_id && !formik.errors.role_id}
              )}
              disabled={formik.isSubmitting || isRolePermissionLoading}
            >
              <option value=''>Select a role</option>

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            {formik.touched.role_id && formik.errors.role_id && (
               <div className='invalid-feedback d-block'>{formik.errors.role_id}</div>
            )}
          </div>
          {/* end::Input group */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Permissions</label>
            <Select
              isMulti
              name='permissions'  
              options={permissions.map((permission) => ({
                value: permission.id!,
                label: permission.name,
              }))}
              className={clsx(
                'basic-multi-select',
                {'is-invalid': formik.touched.permission_id && formik.errors.permission_id},
                {'is-valid': formik.touched.permission_id && !formik.errors.permission_id}
              )}
              classNamePrefix='select'
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
                formik.setFieldValue('permission_id', selectedValues)
              }}
              value={permissions
                .filter((permission) =>
                  formik.values.permission_id?.includes(permission.id!)
                )
                .map((permission) => ({
                  value: permission.id!,  
                  label: permission.name,
                }))}
              isDisabled={formik.isSubmitting || isRolePermissionLoading}
            />
            {formik.touched.permission_id && formik.errors.permission_id && (
              <div className='invalid-feedback d-block'>{formik.errors.permission_id}</div>
            )}
          </div>

          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className='text-center pt-15'>
            <button
              type='reset'
              onClick={() => cancel()}
              className='btn btn-light me-3'
              data-kt-users-modal-action='cancel'
              disabled={formik.isSubmitting || isRolePermissionLoading}
            >
              Discard
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={
                isRolePermissionLoading || formik.isSubmitting || !formik.isValid || !formik.touched
              }
            >
              <span className='indicator-label'>Submit</span>
              {(formik.isSubmitting || isRolePermissionLoading) && (
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
      {(formik.isSubmitting || isRolePermissionLoading) && <RolePermissionListLoading />}
    </>
  )
}

export {RolePermissionEditModalForm}
