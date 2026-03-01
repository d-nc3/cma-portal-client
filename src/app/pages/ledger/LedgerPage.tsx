import { FC, useEffect, useState } from 'react'
import axios from 'axios'
import { KTIcon } from '../../../_metronic/helpers'
import { getAuth } from '../../modules/auth'

interface Ledger {
  id: string
  type: 'DEBIT' | 'CREDIT'
  amount: number
  remarks?: string
  created_at: string
  status: 'UNPAID' | 'PENDING' | 'APPROVED' | 'REJECTED'
  approved_at?: string
  approved_by?: string
}

interface Driver {
  id: string
  fullname: string
  carAssignment: string
  created_at: string
  balance: number
  totalDeposits: number
  totalCharges: number
  ddm_tbl_driverLedgers: Ledger[]
}

const DriverLedgerPage: FC = () => {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedLedger, setSelectedLedger] = useState<Ledger | null>(null)
  const [paymentRef, setPaymentRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  useEffect(() => {
    fetchDriver()
  }, [])

  const fetchDriver = async () => {
    try {
      setLoading(true)
      setError(null)

      let token = getAuth()?.api_token
      if (!token) token = localStorage.getItem('token') || undefined

      const res = await axios.get(
        'http://localhost:5000/api/drivers/me',
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      )

      setDriver(res.data)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch driver'
      )
      setDriver(null)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value)

  if (loading) return <div className="p-5">Loading driver ledger...</div>
  if (error) return <div className="p-5 text-danger">Error: {error}</div>
  if (!driver) return null

  const isOwing = driver.balance > 0
  const absoluteBalance = Math.abs(driver.balance)

  const sortedLedgers = [...(driver.ddm_tbl_driverLedgers || [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )

  return (
    <div className="container-xxl">

      {/* Driver Info */}
      <div className="card mb-6">
        <div className="card-body">
          <h2 className="fw-bold mb-1">{driver.fullname}</h2>
          <div className="text-muted">Unit: {driver.carAssignment}</div>
        </div>
      </div>

      {/* Balance Alert */}
      <div
        className={`alert d-flex align-items-center mb-6 ${
          isOwing ? 'alert-danger' : 'alert-success'
        }`}
      >
        <KTIcon iconName="wallet" className="fs-2 me-3" />
        <div>
          <h4 className="mb-1">
            {isOwing ? 'Outstanding Balance' : 'Available Deposit'}
          </h4>
        </div>
        <div className="ms-auto fw-bold fs-2">
          {formatCurrency(absoluteBalance)}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-6 mb-6">

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Total Charges (Debit)</div>
              <div className="fw-bold fs-2 text-danger">
                {formatCurrency(driver.totalCharges)}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Total Deposits (Credit)</div>
              <div className="fw-bold fs-2 text-success">
                {formatCurrency(driver.totalDeposits)}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Net Balance</div>
              <div className={`fw-bold fs-2 ${isOwing ? 'text-danger' : 'text-success'}`}>
                {formatCurrency(absoluteBalance)}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Ledger Table */}
      <div className="card card-flush">
        <div className="card-header">
          <h3 className="fw-bold m-0">Driver Ledger</h3>
        </div>

        <div className="card-body pt-0">
          <div className="table-responsive">
            <table className="table table-row-dashed align-middle">

              <thead>
                <tr className="fw-bold text-muted text-uppercase">
                  <th>Date</th>
                  <th>Particulars</th>
                  <th className="text-end">Charges</th>
                  <th className="text-end">Deposits</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {sortedLedgers.length ? (
                  sortedLedgers.map((ledger) => (
                    <tr key={ledger.id}>

                      <td>
                        {new Date(ledger.created_at).toLocaleDateString()}
                      </td>

                      <td>{ledger.remarks || '-'}</td>

                      <td className="text-end">
                        {ledger.type === 'DEBIT' ? (
                          <span className="text-danger fw-bold">
                            {formatCurrency(ledger.amount)}
                          </span>
                        ) : '-'}
                      </td>

                      <td className="text-end">
                        {ledger.type === 'CREDIT' ? (
                          <span className="text-success fw-bold">
                            {formatCurrency(ledger.amount)}
                          </span>
                        ) : '-'}
                      </td>

                      <td className="text-center">
                        {ledger.status === 'APPROVED' && ledger.type === 'DEBIT' &&(
                          <span className="badge badge-light-success">Approved</span>
                        )}
                        {ledger.status === 'REJECTED' && (
                          <span className="badge badge-light-dark">Rejected</span>
                        )}
                        {ledger.type === 'DEBIT' && ledger.status === 'PENDING' && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setSelectedLedger(ledger)}
                          >
                            Pay
                          </button>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

            {selectedLedger && (
            <>
              <div className="modal fade show d-block" tabIndex={-1}>
                <div className="modal-dialog">
                  <div className="modal-content">

                    <div className="modal-header">
                      <h5 className="modal-title">Pay Charge</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSelectedLedger(null)}
                      />
                    </div>

                    <div className="modal-body">

                      <div className="mb-4">
                        <label className="form-label fw-bold">Amount</label>
                        <div className="fs-3 text-danger">
                          {formatCurrency(selectedLedger.amount)}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Payment Reference</label>
                        <input
                          type="text"
                          className="form-control"
                          value={paymentRef}
                          onChange={(e) => setPaymentRef(e.target.value)}
                          placeholder="Enterreference number"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Upload Receipt</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setReceiptFile(e.target.files[0])
                            }
                          }}
                        />
                        {receiptFile && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(receiptFile)}
                              alt="Receipt Preview"
                              className="img-fluid rounded"
                              style={{ maxHeight: '200px' }}
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="modal-footer">
                      <button
                        className="btn btn-light"
                        onClick={() => setSelectedLedger(null)}
                      >
                        Cancel
                      </button>

                      <button
                        className="btn btn-danger"
                        disabled={submitting || !paymentRef || !receiptFile}
                        onClick={() => {}}
                      >
                        {submitting ? 'Processing...' : 'Submit Payment'}
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-backdrop fade show"></div>
            </>
          )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default DriverLedgerPage