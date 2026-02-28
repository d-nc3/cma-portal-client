import React, { useMemo, useState } from 'react'
import { KTIcon } from '../../../../../../_metronic/helpers'

type LedgerStatus = 'posted' | 'remitted' | 'pending'
type LedgerType = 'sss' | 'philhealth' | 'pagibig'

interface LedgerEntry {
  date: string
  particulars: string
  remittance: number
  contribution: number
  balance: number
  status: LedgerStatus
}

type LedgerData = Record<LedgerType, LedgerEntry[]>

const ledgerData: LedgerData = {
  sss: [
    { date: '05/01/2024', particulars: 'A/P SSS', remittance: 0, contribution: 5, balance: -5, status: 'posted' },
    { date: '05/02/2024', particulars: 'A/P SSS', remittance: 0, contribution: 5, balance: -10, status: 'posted' },
    { date: '05/07/2024', particulars: 'A/P SSS', remittance: 30, contribution: 0, balance: 0, status: 'remitted' },
  ],
  philhealth: [
    { date: '05/01/2024', particulars: 'A/P PhilHealth', remittance: 0, contribution: 0, balance: 0, status: 'pending' },
  ],
  pagibig: [
    { date: '05/01/2024', particulars: 'A/P Pag-IBIG', remittance: 0, contribution: 0, balance: 0, status: 'pending' },
  ],
}

const DriversContributionLedgerCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LedgerType>('sss')
  const [loading, setLoading] = useState(false)

  const data = ledgerData[activeTab]

  const totalContribution = useMemo(
    () => data.reduce((sum, row) => sum + row.contribution, 0),
    [data]
  )

  const currentBalance = data[data.length - 1]?.balance ?? 0

  const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`

  const getBadge = (status: LedgerStatus) => {
    const map = {
      posted: 'badge-light-success',
      remitted: 'badge-light-primary',
      pending: 'badge-light-warning',
    }
    return <span className={`badge ${map[status]}`}>{status.toUpperCase()}</span>
  }

  const refreshData = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="card shadow-sm mt-5">
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          <h3 className="fw-bold m-0">Drivers Contribution Ledger</h3>
        </div>

        <div className="card-toolbar">
          <button className="btn btn-sm btn-light-primary me-2">
            <KTIcon iconName="file-text" className="fs-4 me-1" />
            Monthly Report
          </button>

          <button
            className="btn btn-sm btn-light"
            onClick={refreshData}
          >
            <KTIcon
              iconName="arrows-circle"
              className={`fs-4 ${loading ? 'spinner-border spinner-border-sm' : ''}`}
            />
          </button>
        </div>
      </div>

      <div className="card-body pt-0">
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
          {(['sss', 'philhealth', 'pagibig'] as LedgerType[]).map(tab => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${
                  activeTab === tab ? 'active fw-bold' : ''
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>

        <div className="table-responsive">
          {data.length === 0 ? (
            <div className="text-center py-10 text-muted">
              <KTIcon iconName="file-deleted" className="fs-2 mb-3" />
              <div>No transactions found</div>
            </div>
          ) : (
            <table className="table align-middle table-row-dashed fs-6 gy-5">
              <thead>
                <tr className="text-start text-muted fw-bold fs-7 text-uppercase">
                  <th>Date</th>
                  <th>Particulars</th>
                  <th className="text-end">Remittance</th>
                  <th className="text-end">Contribution</th>
                  <th className="text-end">Balance</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>

              <tbody className="fw-semibold text-gray-600">
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.particulars}</td>

                    <td className="text-end text-success">
                      {row.remittance > 0
                        ? formatCurrency(row.remittance)
                        : '-'}
                    </td>

                    <td className="text-end text-danger">
                      {row.contribution > 0
                        ? formatCurrency(row.contribution)
                        : '-'}
                    </td>

                    <td
                      className={`text-end fw-bold ${
                        row.balance < 0
                          ? 'text-danger'
                          : 'text-success'
                      }`}
                    >
                      {formatCurrency(row.balance)}
                    </td>

                    <td className="text-center">
                      {getBadge(row.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-5 border-top pt-4">
          <div className="text-muted fs-7">
            {data.length} transactions
          </div>

          <div className="fs-7">
            Balance:{' '}
            <span className="fw-bold text-primary">
              {formatCurrency(currentBalance)}
            </span>
            {' | '}
            Total Contribution:{' '}
            <span className="fw-bold text-danger">
              {formatCurrency(totalContribution)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriversContributionLedgerCard