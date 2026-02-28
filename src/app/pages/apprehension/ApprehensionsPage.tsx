import React, { useMemo, useState } from 'react'
import { KTIcon } from '../../../_metronic/helpers'
import { Violation } from './utils/types'
import { useViolations } from './hooks/useViolations'
import StatCard from './cards/StatCard'
import ViolationModal from './modal/ViolationModal'

const DriverApprehensionsPage: React.FC = () => {
  const { violations, setViolations, loading, error } = useViolations()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null)

  const filteredData = useMemo(() => {
    return violations.filter((v) => {
      const matchesSearch =
        v.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.violationType.toLowerCase().includes(search.toLowerCase())

      if (statusFilter === 'all') return matchesSearch
      if (statusFilter === 'settled') return matchesSearch && v.settled
      return matchesSearch && v.status === statusFilter && !v.settled
    })
  }, [violations, search, statusFilter])

  const stats = useMemo(() => ({
    total: violations.length,
    pending: violations.filter((v) => !v.settled).length,
    settled: violations.filter((v) => v.settled).length,
    expiring: violations.filter((v) => v.status === 'expiring' && !v.settled).length,
  }), [violations])

  const markAsSettled = () => {
    if (!selectedViolation) return

    setViolations((prev) =>
      prev.map((v) =>
        v.id === selectedViolation.id
          ? { ...v, settled: true, settledDate: new Date().toISOString(), receiptUrl: 'uploaded_receipt.pdf' }
          : v
      )
    )
    
    setSelectedViolation(null)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className='text-danger'>{error}</div>

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
                      <div className='fw-bold fs-4'>{v.violationType}</div>
                    </td>

                    <td>
                      <div className='badge badge-light-primary'>
                        {v.ticketNumber}
                      </div>
                      <div className='text-muted fs-7'>
                        ₱{v.amount.toLocaleString()}
                      </div>
                    </td>

                    <td>
                      <div className='fw-bold fs-5'>
                        {new Date(v.ticketExpiry).toLocaleDateString('en-PH', {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                        })}
                      </div>
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
        <ViolationModal
          violation={selectedViolation}
          onClose={() => setSelectedViolation(null)}
          onConfirm={(amount, date, file) => {
            // update violation as settled
            if (!selectedViolation) return

            setViolations(prev =>
              prev.map(v =>
                v.id === selectedViolation.id
                  ? {
                      ...v,
                      settled: true,
                      settledDate: date || new Date().toISOString(),
                      receiptUrl: file?.name || 'uploaded_receipt.pdf',
                      amount,
                    }
                  : v
              )
            )
          setSelectedViolation(null)
          }}
        />
      )}
    </div>
  )
}

export default DriverApprehensionsPage