import React, {useEffect, useState} from 'react'
import axios from 'axios'
import DriversDepositLedgerCard, { Transaction } from '../../accounts/components/settings/cards/LedgerCard'
import DriversApprehensionCard, { DriverApprehension } from '../../accounts/components/settings/cards/ApprehensionsCard'
import DriversContributionLedgerCard from '../../accounts/components/settings/cards/ContributionCard'
import { getAuth } from '../../auth'

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
  const [apprehensions, setApprehensions] = useState<DriverApprehension[]>([])

  useEffect(() => {
    fetchDriver()
  }, [])

  const fetchDriver = async () => {
    try {
      let token = getAuth()?.api_token || localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/drivers/me', {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const driver = res.data;
      const rawLedgers = driver.ddm_tbl_driverLedgers || [];

      rawLedgers.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      let runningBalance = 0;

      const formatted: Transaction[] = rawLedgers.map((ledger: any) => {
        const amount = Number(ledger.amount) || 0;

        // DEBIT = incoming, CREDIT = outgoing
        if (ledger.type === 'DEBIT') {
          runningBalance += amount;
        } else if (ledger.type === 'CREDIT') {
          runningBalance -= amount;
        }

        return {
          date: new Date(ledger.created_at).toLocaleDateString(),
          type: ledger.type,
          description: ledger.remarks || '-',
          amount,
          balance: runningBalance,
        };
      });

      const rawViolations = driver.ddm_tbl_driverApprehension || []

      const formattedApprehensions: DriverApprehension[] = rawViolations.map(
        (v: any) => ({
          driverId: driver.id,
          driverName: driver.fullname,
          violationType: v.violationType,
          ticketExpiry: new Date(v.ticketExpiry).toLocaleDateString(),
          status: v.settled ? 'Settled' : 'Active',
        })
      )

      setTransactions(formatted)
      setApprehensions(formattedApprehensions)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className='row'>
        <div className='col-xl-6'>
          <DriversDepositLedgerCard transactions={transactions} />        
        </div>
        <div className='col-xl-6'>
          <DriversApprehensionCard apprehensions={apprehensions} />   
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
