import { FC, useEffect, useState } from 'react'
import axios from 'axios'
import { KTIcon } from '../../../_metronic/helpers'
import { getAuth } from '../../modules/auth'

interface Ledger {
  id: string
  type: 'CREDIT' | 'DEBIT'
  amount: number
  remarks?: string
  createdAt: string
}

interface Driver {
  id: string
  fullname: string
  carAssignment: string
  createdAt: string
  ddm_tbl_driverLedgers: Ledger[]
}

const DriverLedgerPage: FC = () => {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [balance, setBalance] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [totalCharges, setTotalCharges] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDriver()
  }, [])

  const fetchDriver = async () => {
    try {
      setLoading(true)
      setError(null)
  
      // 1️⃣ Try getting token from cookie auth
      let token = getAuth()?.api_token
  
      // 2️⃣ Fallback to localStorage (for office laptop case)
      if (!token) {
        token = localStorage.getItem('token') || undefined
      }
  
      console.log('Using token:', token)
  
      const res = await axios.get(
        'http://localhost:5000/api/drivers/me',
        {
          withCredentials: true, // ✅ sends cookies automatically
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      )
  
      const data = res.data
  
      setDriver(data)
      computeTotals(data?.ddm_tbl_driverLedgers || [])
  
    } catch (err: any) {
      console.error('Driver fetch error:', err)
  
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch driver'
      )
  
      setDriver(null)
      setBalance(0)
      setTotalDeposits(0)
      setTotalCharges(0)
  
    } finally {
      setLoading(false)
    }
  }

  const computeTotals = (ledgers: Ledger[]) => {
    let deposits = 0
    let charges = 0
    let runningBalance = 0

    ledgers.forEach((l) => {
      const amount = Number(l.amount) || 0
      if (l.type === 'CREDIT') {
        deposits += amount
        runningBalance += amount
      } else {
        charges += amount
        runningBalance -= amount
      }
    })

    setTotalDeposits(deposits)
    setTotalCharges(charges)
    setBalance(runningBalance)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value)

  if (loading) return <div className="p-5">Loading driver ledger...</div>
  if (error) return <div className="p-5 text-danger">Error: {error}</div>

  return (
    <div className="container-xxl">

      {/* Driver Info */}
      <div className="card mb-6">
        <div className="card-body">
          <h2 className="fw-bold mb-1">{driver?.fullname}</h2>
          <div className="text-muted">Unit: {driver?.carAssignment}</div>
        </div>
      </div>

      {/* Balance Alert */}
      <div
        className={`alert d-flex align-items-center mb-6 ${balance >= 0 ? 'alert-success' : 'alert-danger'}`}
      >
        <KTIcon iconName="wallet" className="fs-2 me-3" />
        <div>
          <h4 className="mb-1">{balance >= 0 ? 'Available Deposit' : 'Outstanding Balance'}</h4>
        </div>
        <div className="ms-auto fw-bold fs-2">{formatCurrency(balance)}</div>
      </div>

      {/* Summary Cards */}
      <div className="row g-6 mb-6">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Total Deposits</div>
              <div className="fw-bold fs-2 text-success">{formatCurrency(totalDeposits)}</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Total Charges</div>
              <div className="fw-bold fs-2 text-danger">{formatCurrency(totalCharges)}</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Net Balance</div>
              <div className={`fw-bold fs-2 ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(balance)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-row-bordered align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Particulars</th>
                  <th className="text-end">Debit</th>
                  <th className="text-end">Credit</th>
                </tr>
              </thead>
              <tbody>
                {driver?.ddm_tbl_driverLedgers?.length ? (
                  driver.ddm_tbl_driverLedgers.map((ledger) => (
                    <tr key={ledger.id}>
                      <td>{new Date(ledger.createdAt).toLocaleDateString()}</td>
                      <td>{ledger.remarks || '-'}</td>
                      <td className="text-end text-danger">
                        {ledger.type === 'DEBIT' ? formatCurrency(ledger.amount) : '-'}
                      </td>
                      <td className="text-end text-success">
                        {ledger.type === 'CREDIT' ? formatCurrency(ledger.amount) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverLedgerPage