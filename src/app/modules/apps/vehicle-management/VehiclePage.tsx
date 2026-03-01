import {useEffect, useState} from 'react' // Added useState
import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageTitle, PageLink} from '../../../../_metronic/layout/core'
import {VehicleTable} from './vehicle-list/VehicleTable'
import {AddVehicleForm} from './vehicle-list/AddVehicleForm'
import {DamageHistoryTable} from './damage-history/DamageHistoryTable'
import {VehicleOverview} from './overview/VehicleOverview'
import {AddVehicleDamageForm} from './overview/AddVehicleDamageForm'
import {VehicleReports} from './reports/VehicleReports'
import {getDamageHistory} from './core/_requests' // Ensure this is imported

const vehicleBreadcrumbs: Array<PageLink> = [
  {
    title: 'Vehicle Management',
    path: '/apps/vehicle-management/vehicle-list',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const VehiclesPage = () => {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getDamageHistory()
        const result = response.data?.data || response.data
        setData(Array.isArray(result) ? result : result ? [result] : [])
      } catch (error) {
        console.error('Error fetching:', error)
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  return (
    <Routes>
      <Route element={<Outlet />}>
        {/* Main List */}
        <Route
          path='vehicle-list'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Vehicle Information</PageTitle>
              <VehicleTable />
            </>
          }
        />

        {/* Add New Vehicle */}
        <Route
          path='add'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Register New Vehicle</PageTitle>
              <AddVehicleForm />
            </>
          }
        />

        {/* Global Damage History */}
        <Route
          path='damage-history'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Damage History</PageTitle>
              <DamageHistoryTable data={data} />
            </>
          }
        />

        {/* Add Damage - Adjusted path to match your Table Link */}
        <Route
          path='overview/add'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Vehicle Damage Form</PageTitle>
              <AddVehicleDamageForm />
            </>
          }
        />

        {/* View Specific Vehicle - Fixed duplicate/conflicting route */}
        <Route
          path='view/:id/*'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Vehicle Overview</PageTitle>
              <VehicleOverview />
            </>
          }
        />

         <Route
          path='reports/*'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Analytics & Reports</PageTitle>
              <VehicleReports />
            </>
          }
        />

        {/* Default Redirects */}
        <Route index element={<Navigate to='/apps/vehicle-management/vehicle-list' />} />
        <Route path='*' element={<Navigate to='/apps/vehicle-management/vehicle-list' />} />
      </Route>
    </Routes>
  )
}

export default VehiclesPage