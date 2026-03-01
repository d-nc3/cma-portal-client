import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import Dispatch from './page/Dispatch'
import DispatchReports from './page/DispatchReports'

const dispatchBreadcrumbs: Array<PageLink> = [
  {title: 'Dispatch', path: '/apps/dispatch', isSeparator: false, isActive: false},
  {title: '', path: '', isSeparator: true, isActive: false},
]

const DispatchPage = () => {
  return (
    <Routes>
      <Route index element={<Navigate to='dispatch' />} />

      <Route
        path='dispatch'
        element={
          <>
            <PageTitle breadcrumbs={dispatchBreadcrumbs}>Dispatch</PageTitle>
            <Dispatch />
          </>
        }
      />

      <Route
        path='reports'
        element={
          <>
            <PageTitle breadcrumbs={dispatchBreadcrumbs}>Dispatch Reports</PageTitle>
            <DispatchReports />
          </>
        }
      />
    </Routes>
  )
}

export default DispatchPage
