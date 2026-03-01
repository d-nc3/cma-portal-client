import {useMemo, useEffect, useState} from 'react'
import {useTable, useGlobalFilter} from 'react-table'
import {vehicleColumns} from './columns/_columns'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {KTCard, KTCardBody, KTIcon} from '../../../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {getVehicles} from '../core/_requests'

const VehicleTable = () => {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getVehicles()
        const result = response.data?.data || response.data
        setData(Array.isArray(result) ? result : result ? [result] : [])
      } catch (error) {
        console.error('Error fetching:', error)
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchVehicles()
  }, [])
  const memoData = useMemo(() => data, [data])
  const columns = useMemo(() => vehicleColumns, [])

  const {getTableProps, getTableBodyProps, headers, rows, prepareRow, setGlobalFilter, state} =
    useTable(
      {
        columns,
        data: memoData,
      },
      useGlobalFilter
    ) as any

  const {globalFilter} = state

  return (
    <>
      {/* 1. Statistics Widgets - Moved outside the card for better UI flow */}
      <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
        <div className='col-md-4'>
          <div className='card bg-light-primary border-0'>
            <div className='card-body'>
              <KTIcon iconName='truck' className='text-primary fs-3x ms-n1' />
              <div className='text-gray-900 fw-bold fs-2 mb-2 mt-5'>{data.length} Units</div>
              <div className='fw-semibold text-gray-500'>Total Fleet Size</div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card bg-light-danger border-0'>
            <div className='card-body'>
              <KTIcon iconName='calendar-tick' className='text-danger fs-3x ms-n1' />
              <div className='text-gray-900 fw-bold fs-2 mb-2 mt-5'>12 Units</div>
              <div className='fw-semibold text-gray-500'>Due for Registration</div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card bg-light-warning border-0'>
            <div className='card-body'>
              <KTIcon iconName='wrench' className='text-warning fs-3x ms-n1' />
              <div className='text-gray-900 fw-bold fs-2 mb-2 mt-5'>₱45,200.00</div>
              <div className='fw-semibold text-gray-500'>Damage Costs (YTD)</div>
            </div>
          </div>
        </div>
      </div>

      <KTCard>
        {/* 2. Card Header with Search and Export Actions */}
        <div className='card-header border-0 pt-6'>
          <div className='card-title'>
            <div className='d-flex align-items-center position-relative my-1'>
              <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
              <input
                type='text'
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className='form-control form-control-solid w-250px ps-14'
                placeholder='Search vehicle or plate'
              />
            </div>
          </div>
          
          <div className='card-toolbar'>
            <div className='d-flex justify-content-end gap-3'>
              {/* Export Dropdown / Button (Non-functional placeholder) */}
              <button type='button' className='btn btn-light-primary'>
                <KTIcon iconName='exit-up' className='fs-2' />
                Export
              </button>

              <Link to='/apps/vehicle-management/add' className='btn btn-primary'>
                <KTIcon iconName='plus' className='fs-2' />
                Add Vehicle
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Table Content */}
        <KTCardBody className='py-4'>
          <div className='table-responsive'>
            <table
              {...getTableProps()}
              className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
            >
              <thead>
                <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                  {headers.map((column: any) => (
                    <CustomHeaderColumn key={column.id} column={column} />
                  ))}
                </tr>
              </thead>
              <tbody {...getTableBodyProps()} className='text-gray-600 fw-semibold'>
                {isLoading ? (
                  <tr>
                    <td colSpan={10}>
                      <div className='d-flex justify-content-center my-10'>
                        <div className='spinner-border text-primary' role='status' />
                      </div>
                    </td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows.map((row: any, i: number) => {
                    prepareRow(row)
                    return <CustomRow row={row} key={`row-${i}-${row.id}`} />
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className='text-center p-20 text-gray-400 fw-bold fs-4'>
                      No matching vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </KTCardBody>
      </KTCard>
    </>
  )
}

export {VehicleTable}