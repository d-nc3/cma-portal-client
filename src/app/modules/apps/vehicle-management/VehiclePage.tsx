import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageTitle, PageLink} from '../../../../_metronic/layout/core'
import {VehicleTable} from './vehicle-list/VehicleTable'
import {AddVehicleForm} from './vehicle-list/AddVehicleForm' // Import your form
import { DamageHistoryTable } from './damage-history/DamageHistoryTable'
import { VehicleOverview } from './overview/VehicleOverview'

// Base breadcrumb for the module
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
  // Mock data - eventually this will come from an API via useQuery
  const vehicleData = [
    {id: 1, plate: 'ABC-1234', year: '2021', registration: 'ABC-1234', model: 'Toyota Hiace', driver: 'John Doe', fuel: '75%', status: 'Active'},
    {id: 2, plate: 'XYZ-5678', year: '2021', registration: 'XYZ-5678', model: 'Ford Ranger', driver: 'N/A', fuel: '40%', status: 'Maintenance'},
  ]

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='vehicle-list'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Vehicle Information</PageTitle>
              <VehicleTable data={vehicleData} />
            </>
          }
        />
        <Route
          path='add'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Register New Vehicle</PageTitle>
              <AddVehicleForm />
            </>
          }
        />
        <Route
          path='damage-history'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Damage History</PageTitle>
              <DamageHistoryTable data={vehicleData} />
            </>
          }
        />
         <Route
          path='view'
          element={
            <>
              <PageTitle breadcrumbs={vehicleBreadcrumbs}>Vehicle Information</PageTitle>
              <VehicleOverview />
            </>
          }
        />
        <Route index element={<Navigate to='/apps/vehicle-management/vehicle-list' />} />
        <Route path='*' element={<Navigate to='/apps/vehicle-management/vehicle-list' />} />
        <Route path='view/:id/*' element={<VehicleOverview />} />
        
        <Route index element={<Navigate to='/apps/vehicle-management/vehicle-list' />} />
      </Route>
    </Routes>
  )
}

export default VehiclesPage