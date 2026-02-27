import React, {useEffect, useState} from 'react'
import axios from 'axios'
import DriversDepositLedgerCard, { Transaction } from '../../accounts/components/settings/cards/LedgerCard'
import DriversApprehensionCard from '../../accounts/components/settings/cards/ApprehensionsCard'
import DriversContributionLedgerCard from '../../accounts/components/settings/cards/ContributionCard'

const sampleData = [
  {
    driverId: 1,
    driverName: 'Errow Mirandilla',
    violationType: 'Overspeeding',
    ticketExpiry: '2026-02-28',
    status: 'Active' as const,
  },
  {
    driverId: 2,
    driverName: 'Errow Mirandilla',
    violationType: 'Reckless Driving',
    ticketExpiry: '2026-01-25',
    status: 'Settled' as const,
  },
]

export function Overview() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchDriver()
  }, [])

  const fetchDriver = async () => {
    try {
      const res = await axios.get('/api/drivers/me')
      
      const driver = res.data
      const rawLedgers = driver.ddm_tbl_driverLedgers || []

      rawLedgers.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )

      let runningBalance = 0

      const formatted: Transaction[] = rawLedgers.map((ledger: any) => {
        const amount = Number(ledger.amount)

        if (ledger.type === 'CREDIT') {
          runningBalance += amount
        } else {
          runningBalance -= amount
        }

        return {
          date: new Date(ledger.createdAt).toLocaleDateString(),
          type: ledger.type,
          description: ledger.remarks || '-',
          amount,
          balance: runningBalance,
        }
      })

      setTransactions(formatted)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className='row'>
        <div className='col-xl-6'>
          <DriversDepositLedgerCard transactions={transactions} />        
        </div>
        <div className='col-xl-6'>
          <DriversApprehensionCard apprehensions={sampleData} />   
         </div>
      </div>

      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-14'>  
          <DriversContributionLedgerCard />
        </div>
      </div>
    </div>
  )
}
