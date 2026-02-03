import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {AdminLayout} from '../../_metronic/layout/AdminLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import {useAuth} from '../modules/auth'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'

const PrivateRoutes = () => {
  const {currentUser, hasRole} = useAuth()

  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

 return (
    <Routes>
      {/* 1. ADMIN SEGMENT */}
      {hasRole('Admin') && (
        <Route element={<AdminLayout />}>
          <Route path='dashboard' element={<DashboardWrapper />} />
          <Route path='builder' element={<BuilderPageWrapper />} />
          <Route path='menu-test' element={<MenuTestPage />} />
          <Route path='apps/user-management/*' element={<SuspensedView><UsersPage /></SuspensedView>} />
          
          <Route path='crafted/pages/profile/*' element={<SuspensedView><ProfilePage /></SuspensedView>} />
          <Route path='apps/chat/*' element={<SuspensedView><ChatPage /></SuspensedView>} />
        </Route>
      )}
    {
      hasRole('Driver2') && (
        <Route element={<AdminLayout />}>
          <Route path='dashboard' element={<DashboardWrapper />} />
          <Route path='builder' element={<BuilderPageWrapper />} />
          <Route path='menu-test' element={<MenuTestPage />} />
          <Route path='apps/user-management/*' element={<SuspensedView><UsersPage /></SuspensedView>} />
          
          <Route path='crafted/pages/profile/*' element={<SuspensedView><ProfilePage /></SuspensedView>} />
          <Route path='apps/chat/*' element={<SuspensedView><ChatPage /></SuspensedView>} />
        </Route>
      )
    }
<<<<<<< Updated upstream
      <Route element={<AdminLayout />}>
          <Route path='dashboard' element={<DashboardWrapper />} />
          <Route path='builder' element={<BuilderPageWrapper />} />
          <Route path='menu-test' element={<MenuTestPage />} />
          <Route path='apps/user-management/*' element={<SuspensedView><UsersPage /></SuspensedView>} />
          
          <Route path='crafted/pages/profile/*' element={<SuspensedView><ProfilePage /></SuspensedView>} />
          <Route path='apps/chat/*' element={<SuspensedView><ChatPage /></SuspensedView>} />
        </Route>
=======
    
>>>>>>> Stashed changes
      {/* 3. GLOBAL REDIRECTS & 404 */}
      <Route path='auth/*' element={<Navigate to='/dashboard' />} />
      <Route path='*' element={<Navigate to='/error/404' />} />
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
