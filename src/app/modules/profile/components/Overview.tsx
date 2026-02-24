import React from 'react'
import DriversDepositLedgerCard, { Transaction } from '../../accounts/components/settings/cards/LedgerCard'
import DriversApprehensionCard from '../../accounts/components/settings/cards/ApprehensionsCard'
import DriversContributionLedgerCard from '../../accounts/components/settings/cards/ContributionCard'

// Sample transactions
const transactions: Transaction[] = [
  { date: '2023-06-15', type: 'Deposit', description: 'Initial deposit', amount: 500, balance: 500 },
  { date: '2023-06-20', type: 'Charge', description: 'Car cleaning', amount: -50, balance: 450 },
  { date: '2023-06-25', type: 'Charge', description: 'Late return', amount: -75, balance: 375 },
  { date: '2023-07-01', type: 'Deposit', description: 'Additional deposit', amount: 200, balance: 575 },
  { date: '2023-07-10', type: 'Charge', description: 'Damage repair', amount: -800, balance: -225 }
]

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
  return (
    <div>
      <div className='row gy-10 gx-xl-10'>
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
