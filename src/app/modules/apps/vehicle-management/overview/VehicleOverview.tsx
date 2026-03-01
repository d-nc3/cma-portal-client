import {FC, useEffect, useState} from 'react'
import {Routes, Route, Navigate, Outlet, useParams} from 'react-router-dom'
import {VehicleDetailsHeader} from './VehicleDetailsHeader'
import {OverviewTab} from './tabs/OverviewTab'
import {DamageHistoryTab} from './tabs/DamageHistoryTab'
import {getVehicleById} from '../core/_requests'

const VehicleOverview: FC = () => {
  const {id} = useParams()
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return
      try {
        const response = await getVehicleById(id)
        setVehicle(response.data?.data || response.data)
      } catch (error) {
        console.error('Error fetching vehicle:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [id])

  if (loading) return <div className='p-10'>Loading Vehicle Profile...</div>
  if (!vehicle) return <div className='alert alert-danger'>Vehicle not found.</div>

  return (
    <Routes>
      <Route
        element={
          <>
            <VehicleDetailsHeader vehicle={vehicle} />
            <Outlet context={{vehicle}} />
          </>
        }
      >
        <Route path='details' element={<OverviewTab />} />
        <Route path='maintenance' element={<DamageHistoryTab />} />
        <Route path='documents' element={<div>Documents Content</div>} />
        
        {/* Redirect base /view/:id to /view/:id/details */}
        <Route index element={<Navigate to='details' />} />
      </Route>
    </Routes>
  )
}

export {VehicleOverview}