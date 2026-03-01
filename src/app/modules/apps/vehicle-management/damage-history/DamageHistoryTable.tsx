
import {vehicleColumns} from './columns/_columns'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {KTCard, KTCardBody, KTIcon} from '../../../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {useMemo, useState} from 'react'
import {
  useTable, 
  useGlobalFilter, 
  usePagination, 
  TableInstance, 
  UsePaginationInstanceProps, 
  UsePaginationState, 
  UseGlobalFiltersInstanceProps, 
  UseGlobalFiltersState
} from 'react-table'

// Create a combined type for the table instance
type TableInstanceWithHooks<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T> &
  UseGlobalFiltersInstanceProps<T> & {
    state: UsePaginationState<T> & UseGlobalFiltersState<T>
  }

const DamageHistoryTable = ({data}: {data: any[]}) => {
  const columns = useMemo(() => vehicleColumns, [])
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Cast the useTable result to our new combined type
  const instance = useTable(
    {
      columns,
      data,
      initialState: {pageSize: 10} as any, 
    },
    useGlobalFilter, 
    usePagination   
  ) as TableInstanceWithHooks<any>

  // Destructure from the casted instance
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    prepareRow,
    page, 
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setGlobalFilter,
    state: {pageIndex},
  } = instance

  const handleSearch = (val: string) => {
    setSearchTerm(val)
    setGlobalFilter(val)
  }

  // ... rest of your return JSX remains the same
  return (
    <KTCard>
      <div className='card-header border-0 pt-6'>
        <div className='card-title'>
          <div className='d-flex align-items-center position-relative my-1'>
            <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
            <input
              type='text'
              className='form-control form-control-solid w-250px ps-14'
              placeholder='Search vehicle or plate'
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className='card-toolbar'>
          <Link to='/apps/vehicle-management/overview/add' className='btn btn-light-danger'>
            <KTIcon iconName='plus' className='fs-2' />
            Report New Damage
          </Link>
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
              {page.length > 0 ? (
                page.map((row, i) => {
                  prepareRow(row)
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />
                })
              ) : (
                <tr>
                  <td colSpan={headers.length}>
                    <div className='d-flex text-center w-100 align-content-center justify-content-center p-20'>
                      <div className='text-gray-400 fw-bold fs-4'>No matching records found.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        <div className='d-flex justify-content-between align-items-center pt-5'>
          <div className='text-gray-600 fw-semibold fs-7'>
            Showing page {pageIndex + 1}
          </div>
          <div className='d-flex'>
            <button
              className='btn btn-sm btn-light-primary me-2'
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </button>
            <button
              className='btn btn-sm btn-light-primary'
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </KTCardBody>
    </KTCard>
  )
}

export {DamageHistoryTable}