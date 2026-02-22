import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KTIcon } from '../../../../_metronic/helpers'
import {getAuth} from '../../auth'
import DriversDepositLedgerCard, { Transaction } from './settings/cards/LedgerCard'
import DriversApprehensionCard from './settings/cards/ApprehensionsCard'
import DriversContributionLedgerCard from './settings/cards/ContributionCard'

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
    id: 1,
    driverName: 'Errow Mirandilla',
    violationType: 'Overspeeding',
    ticketNumber: 'OVR-10231',
    dateIssued: '2026-02-01',
    expirationDate: '2026-02-28',
    status: 'Active' as const,
  },
  {
    id: 2,
    driverName: 'Errow Mirandilla',
    violationType: 'Reckless Driving',
    ticketNumber: 'OVR-10255',
    dateIssued: '2026-01-10',
    expirationDate: '2026-01-25',
    status: 'Cleared' as const,
  },
]


interface Driver {
  fullname: string
  callSign: string
  address: string
  contactNumber: string
  carAssignment: string
  spouseName?: string
  spouseContact?: string
  sssNumber?: string
  philhealthNumber?: string
  pagibigNumber?: string
  licenseNumber: string
  licenseExpiry: string
  licenseImageUrl?: string
}

const Overview = () => {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentDriver = async (): Promise<Driver> => {
    const token = getAuth()?.api_token
    if (!token) throw new Error('No auth token found')

    // Fetch driver info from backend
    const response = await fetch("http://localhost:5000/api/drivers/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Unauthorized: Invalid or expired token");
      throw new Error("Failed to fetch driver data");
    }

    return response.json();
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);
        const driverData = await getCurrentDriver();
        setDriver(driverData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching driver data:", err);
        setError(err.message);
        setDriver(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  if (!driver) return <div className='p-5'>Loading driver profile...</div>

  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profile Details</h3>
          </div>
          <Link to='/crafted/account/settings' className='btn btn-primary align-self-center'>
            Edit Profile
          </Link>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Full Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{driver.fullname}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Call Sign</label>
            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{driver.callSign}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Contact Phone</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{driver.contactNumber}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Address</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{driver.address}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Spouse Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{driver.spouseName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Spouse Contact</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{driver.spouseContact}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Car Assignment</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{driver.carAssignment}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>SSS Number</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{driver.sssNumber}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Philhealth Number</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{driver.philhealthNumber}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Pagibig Number</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{driver.pagibigNumber}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>License Number</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{driver.licenseNumber}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>License Expiry</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6'>{new Date(driver.licenseExpiry).toISOString().split('T')[0]}</span>
            </div>
          </div>
        </div>
      </div>

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
    </>
  )
}

export default Overview;