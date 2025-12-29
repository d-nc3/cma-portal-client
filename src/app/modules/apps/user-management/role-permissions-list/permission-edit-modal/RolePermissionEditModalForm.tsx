import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {RolePermissionModel} from '../core/_models'
import clsx from 'clsx'
import {useListView} from  '../core/ListViewProvider'
import {RolePermissionListLoading} from '../components/loading/RolePermissionListLoading'
import {updatePermission, register} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'

type Props = {
  isRolePermissionLoading: boolean
  role_permission: RolePermissionModel
}

const editPermissionSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Name is required'),
  description: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .required('Description is required'),
})

const RolePermissionEditModalForm: FC<Props> = ({role_permission, isRolePermissionLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()




  const [permissionForEdit,setRoleForEdit] = useState<RolePermissionModel>({
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
    validationSchema: editPermissionSchema,
    enableReinitialize: true, // only if you want to update form with new data
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
          {/* begin::Input group - name Name */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Role Name</label>
            <input
              placeholder='Role Name'
              {...formik.getFieldProps('name')} // use name
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.role_id && formik.errors.role_id},
                {'is-valid': formik.touched.role_id && !formik.errors.role_id}
              )}
              type='text'
              name='name'
              autoComplete='off'
              disabled={formik.isSubmitting || isRolePermissionLoading}
            />
            {formik.touched.role_id && formik.errors.role_id && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.role_id}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Description */}
          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>Description</label>
            <textarea
              placeholder='name Description'
              {...formik.getFieldProps('description')} // use description
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.permission_id && formik.errors.permission_id},
                {'is-valid': formik.touched.permission_id && !formik.errors.permission_id}
              )}
              name='description'
              rows={3}
              disabled={formik.isSubmitting || isRolePermissionLoading}
            />
            {formik.touched.permission_id && formik.errors.permission_id && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.permission_id}</span>
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
              disabled={formik.isSubmitting || isRolePermissionLoading}
            >
              Discard
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={isRolePermissionLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
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
