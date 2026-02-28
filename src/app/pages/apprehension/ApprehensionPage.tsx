import React, { useEffect, useMemo, useState } from 'react'
import { KTIcon } from '../../../_metronic/helpers'

export type ViolationStatus = 'valid' | 'expiring' | 'expired'

export interface Violation {
  id: number
  date: string
  type: string
  description: string
  ticketNumber: string
  issueDate: string
  expiryDate: string
  amount: number
  status: ViolationStatus
  settled: boolean
  receiptUrl?: string | null
  settledDate?: string
  settledAmount?: number
}

const sampleData: Violation[] = [
  {
    id: 1,
    date: '2024-01-15',
    type: 'OVR - Overloading',
    description: 'Exceeding maximum allowable load capacity',
    ticketNumber: 'OVR-2024-001234',
    issueDate: '2024-01-15',
    expiryDate: '2024-02-14',
    amount: 5000,
    status: 'expiring',
    settled: false,
  },
  {
    id: 2,
    date: '2023-12-20',
    type: 'Unauthorized Route',
    description: 'Deviation from approved delivery route',
    ticketNumber: 'OVR-2023-009876',
    issueDate: '2023-12-20',
    expiryDate: '2024-01-19',
    amount: 3000,
    status: 'expired',
    settled: true,
    settledDate: '2024-01-18',
    settledAmount: 3000,
    receiptUrl: 'receipt_001.pdf',
  },
]

const DriverApprehensionsPage: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>(sampleData)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null)

  const filteredData = useMemo(() => {
    return violations.filter((v) => {
      const matchesSearch =
        v.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.type.toLowerCase().includes(search.toLowerCase())

      if (statusFilter === 'all') return matchesSearch
      if (statusFilter === 'settled') return matchesSearch && v.settled
      return matchesSearch && v.status === statusFilter && !v.settled
    })
  }, [violations, search, statusFilter])

  const stats = useMemo(() => {
    return {
      total: violations.length,
      pending: violations.filter((v) => !v.settled).length,
      settled: violations.filter((v) => v.settled).length,
      expiring: violations.filter((v) => v.status === 'expiring' && !v.settled).length,
    }
  }, [violations])

  const markAsSettled = () => {
    if (!selectedViolation) return

    setViolations((prev) =>
      prev.map((v) =>
        v.id === selectedViolation.id
          ? {
              ...v,
              settled: true,
              settledDate: new Date().toISOString(),
              receiptUrl: 'uploaded_receipt.pdf',
            }
          : v
      )
    )

    setSelectedViolation(null)
  }

  return (
    <div className='container-fluid'>

      {/* Page Title */}
      <div className='d-flex justify-content-between align-items-center mb-8'>
        <div>
          <h1 className='fw-bold'>Driver Violations Center</h1>
          <div className='text-muted'>Apprehension & Settlement Management</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='row g-5 mb-8'>
        <StatCard title='Total Violations' value={stats.total} icon='alert-circle' color='primary' />
        <StatCard title='Pending Settlement' value={stats.pending} icon='time' color='warning' />
        <StatCard title='Expiring Soon' value={stats.expiring} icon='calendar' color='info' />
        <StatCard title='Settled' value={stats.settled} icon='check-circle' color='success' />
      </div>

      {/* Filters */}
      <div className='card mb-6'>
        <div className='card-body d-flex gap-4 flex-wrap'>
          <input
            type='text'
            className='form-control w-300px'
            placeholder='Search ticket number or type'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className='form-select w-200px'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value='all'>All Status</option>
            <option value='valid'>Valid</option>
            <option value='expiring'>Expiring</option>
            <option value='expired'>Expired</option>
            <option value='settled'>Settled</option>
          </select>

          <button className='btn btn-light-primary ms-auto'>
            <KTIcon iconName='file-down' className='fs-4 me-2' />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='card'>
        <div className='card-body py-4'>
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle table-fixe w-100'>
              <thead>
                <tr className='fw-bold text-black'>
                  <th>Violation</th>
                  <th>Ticket Information</th>
                  <th>Status</th>
                  <th>Settlement</th>
                  <th className='text-end'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div className='fw-bold'>{v.type}</div>
                      <div className='text-muted fs-7'>{v.description}</div>
                    </td>

                    <td>
                      <div className='badge badge-light-primary'>{v.ticketNumber}</div>
                      <div className='text-muted fs-7'>
                        ₱{v.amount.toLocaleString()}
                      </div>
                    </td>

                    <td>
                      <span className={`badge badge-light-${getStatusColor(v.status)}`}>
                        {v.status.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      {v.settled ? (
                        <span className='badge badge-light-success'>Settled</span>
                      ) : (
                        <span className='badge badge-light-warning'>Pending</span>
                      )}
                    </td>

                    <td className='text-end'>
                      {!v.settled ? (
                        <button
                          className='btn btn-sm btn-primary'
                          onClick={() => setSelectedViolation(v)}
                        >
                          Upload Receipt
                        </button>
                      ) : (
                        <button className='btn btn-sm btn-light'>
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className='text-center py-10 text-muted'>
                No violations found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedViolation && (
        <div className='modal fade show d-block' tabIndex={-1}>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>
                  Upload Settlement - {selectedViolation.ticketNumber}
                </h5>
                <button
                  className='btn btn-sm btn-icon'
                  onClick={() => setSelectedViolation(null)}
                >
                  ✕
                </button>
              </div>
              <div className='modal-body'>
                <input
                  type='number'
                  className='form-control mb-4'
                  placeholder='Settlement Amount'
                />
                <input type='date' className='form-control mb-4' />
                <input type='file' className='form-control' />
              </div>
              <div className='modal-footer'>
                <button
                  className='btn btn-light'
                  onClick={() => setSelectedViolation(null)}
                >
                  Cancel
                </button>
                <button className='btn btn-primary' onClick={markAsSettled}>
                  Confirm Settlement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: string
  color: string
}) => (
  <div className='col-md-3'>
    <div className='card card-flush'>
      <div className='card-body d-flex justify-content-between'>
        <div>
          <div className='text-muted fw-semibold'>{title}</div>
          <div className='fs-2 fw-bold'>{value}</div>
        </div>
        <div className={`symbol symbol-50px bg-light-${color}`}>
          <KTIcon iconName={icon} className={`fs-2 text-${color}`} />
        </div>
      </div>
    </div>
  </div>
)

const getStatusColor = (status: ViolationStatus) => {
  switch (status) {
    case 'valid':
      return 'success'
    case 'expiring':
      return 'warning'
    case 'expired':
      return 'danger'
    default:
      return 'primary'
  }
}

export default DriverApprehensionsPage