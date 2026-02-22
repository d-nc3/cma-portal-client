import React, { useState, useEffect } from 'react'
import { KTIcon } from '../../../../../../_metronic/helpers'

export interface Transaction {
  date: string
  type: 'Deposit' | 'Charge'
  description: string
  amount: number
  balance: number
}

interface DriversDepositLedgerCardProps {
  transactions?: Transaction[]
}

const DriversDepositLedgerCard: React.FC<DriversDepositLedgerCardProps> = ({
  transactions: initialTransactions = [],
}) => {
  const [flipped, setFlipped] = useState(false)
  const [transactions] = useState<Transaction[]>(initialTransactions)
  const [currentBalance, setCurrentBalance] = useState<number>(0)

  useEffect(() => {
    if (transactions.length > 0) {
      setCurrentBalance(transactions[transactions.length - 1].balance)
    } else {
      setCurrentBalance(0)
    }
  }, [transactions])

  const balanceClass =
    currentBalance > 0
      ? 'badge-light-success'
      : currentBalance < 0
      ? 'badge-light-danger'
      : 'badge-light-primary'

  return (
    <div
      className='card shadow-sm'
      style={{ perspective: '1000px', maxWidth: '900px', margin: '0 auto' }}
    >
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className='card-body'
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className='d-flex justify-content-between align-items-center mb-5'>
            <div>
              <h2 className='fw-bold mb-1'>Drivers Deposit Ledger</h2>
            </div>
            <KTIcon iconName='file-invoice-dollar' className='fs-1 text-primary' />
          </div>

          {/* Account Types */}
          <div className='mb-5'>
            <div className='d-flex align-items-center mb-3'>
            <KTIcon iconName='minus-circle' className='fs-2 text-danger me-3' />
              <div>
                <div className='fw-semibold'>Deposit (Credit)</div>
                <div className='text-muted fs-7'>Accounts Payable</div>
              </div>
            </div>

            <div className='d-flex align-items-center'>
            <KTIcon iconName='plus-circle' className='fs-2 text-success me-3' />
              <div>
                <div className='fw-semibold'>(Debit)</div>
                <div className='text-muted fs-7'>Accounts Receivable</div>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className='mb-5'>
            <h4 className='fw-bold mb-3'>Current Balance</h4>
            <div className='d-flex justify-content-between align-items-center p-4 border rounded'>
              <div className='d-flex align-items-center'>
                <KTIcon iconName='scale' className='fs-2 me-3 text-primary' />
                <div>
                  <div className='fw-semibold'>Balance</div>
                  <div className='text-muted fs-7'>
                    Automatically calculated
                  </div>
                </div>
              </div>
              <span className={`badge fs-6 ${balanceClass}`}>
                ₱ {currentBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className='d-flex justify-content-between'>
            <button
              className='btn btn-light-primary'
              onClick={() => setFlipped(true)}
            >
              <KTIcon iconName='arrows-left-right' className='me-2' />
              View Transactions
            </button>

            <div>
              <button className='btn btn-light-secondary me-2'>
                <KTIcon iconName='printer' className='me-2' />
                Print
              </button>
              <button className='btn btn-light-success'>
                <KTIcon iconName='download' className='me-2' />
                Export
              </button>
            </div>
          </div>
        </div>

        <div
          className='card-body position-absolute top-0 start-0 w-100 h-100 bg-white'
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className='d-flex justify-content-between align-items-center mb-5'>
            <h2 className='fw-bold'>Transaction History</h2>
            <button
              className='btn btn-light-secondary'
              onClick={() => setFlipped(false)}
            >
              <KTIcon iconName='arrow-left' className='me-2' />
              Back to Summary
            </button>
          </div>

          <div className='table-responsive'>
            <table className='table table-row-bordered table-row-gray-200 align-middle'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className='text-center text-muted py-10'>
                      No transactions available
                    </td>
                  </tr>
                )}

                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          tx.type === 'Deposit'
                            ? 'badge-light-success'
                            : 'badge-light-danger'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.description}</td>
                    <td
                      className={
                        tx.type === 'Deposit'
                          ? 'text-success fw-bold'
                          : 'text-danger fw-bold'
                      }
                    >
                      {tx.type === 'Deposit' ? '+' : '-'}₱
                      {Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td>₱ {tx.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriversDepositLedgerCard