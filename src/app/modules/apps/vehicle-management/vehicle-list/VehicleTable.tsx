import {useMemo} from 'react'
import {useTable} from 'react-table'
import {vehicleColumns} from './columns/_columns'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {KTCard, KTCardBody, KTIcon} from '../../../../../_metronic/helpers'
import {Link} from 'react-router-dom'

const VehicleTable = ({data}: {data: any[]}) => {
  const columns = useMemo(() => vehicleColumns, [])
  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data,
  })

  return (
    <KTCard>
      <div className='card-header border-0 pt-6'>
        <div className='card-title'>
          {/* begin::Search */}
          <div className='d-flex align-items-center position-relative my-1'>
            <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
            <input
              type='text'
              data-kt-user-table-filter='search'
              className='form-control form-control-solid w-250px ps-14'
              placeholder='Search vehicle or plate'
            />
          </div>
        </div>
        <div className='card-toolbar'>
          <div className='d-flex justify-content-end'>
            <button type='button' className='btn btn-light-primary me-3'>
              <KTIcon iconName='filter' className='fs-2' />
              Filter
            </button>
            <Link to='/apps/vehicle-management/add' className='btn btn-primary'>
              <KTIcon iconName='plus' className='fs-2' />
              Add Vehicle
            </Link>
          </div>
        </div>
      </div>

      <KTCardBody className='py-4'>
        <div className='table-responsive'>
          <table
            {...getTableProps()}
            className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          >
            <thead>
              <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                {headers.map((column) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody {...getTableBodyProps()} className='text-gray-600 fw-semibold'>
              {rows.length > 0 ? (
                rows.map((row, i) => {
                  prepareRow(row)
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className='d-flex text-center w-100 align-content-center justify-content-center p-20'>
                      <div className='text-gray-400 fw-bold fs-4'>No matching vehicles found.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </KTCardBody>
    </KTCard>
  )
}

export {VehicleTable}
