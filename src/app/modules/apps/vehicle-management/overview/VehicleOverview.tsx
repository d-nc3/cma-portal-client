import {FC} from 'react'
import {Routes, Route, Navigate, Outlet} from 'react-router-dom'
import {VehicleDetailsHeader} from './VehicleDetailsHeader'
import {OverviewTab} from './tabs/OverviewTab'
import { useParams } from 'react-router-dom'
import { DamageHistoryTab } from './tabs/DamageHistoryTab'

const VehicleOverview: FC = () => {
    const { id } = useParams();
  return (
    <Routes>
      <Route
        element={
          <>
            <VehicleDetailsHeader />
            <Outlet />
          </>
        }
      >
        <Route path='details' element={<OverviewTab />} />
        <Route path='maintenance' element={<DamageHistoryTab />} />
        <Route path='documents' element={<div>Documents Content</div>} />
        {/* Default tab */}
        <Route index element={<Navigate to='details' />} />
        <Route index element={<Navigate to='maintenance' />} />
      </Route>
    </Routes>
  )
}

export {VehicleOverview}