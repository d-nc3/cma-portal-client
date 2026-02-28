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
// 1. Externalize Lazy Imports
const ProfilePage = lazy(() =>
  import('../modules/profile/ProfilePage').then(module => ({ default: module.default }))
);
const WizardsPage = lazy(() =>
  import('../modules/wizards/WizardsPage').then(module => ({ default: module.default }))
);
const AccountPage = lazy(() =>
  import('../modules/accounts/AccountPage').then(module => ({ default: module.default }))
);
const WidgetsPage = lazy(() =>
  import('../modules/widgets/WidgetsPage').then(module => ({ default: module.default }))
);
const ChatPage = lazy(() =>
  import('../modules/apps/chat/ChatPage').then(module => ({ default: module.default }))
);
const UsersPage = lazy(() =>
  import('../modules/apps/user-management/UsersPage').then(module => ({ default: module.default }))
);
const Overview = lazy(() =>
  import('../modules/profile/components/Overview').then(module => ({ default: module.Overview }))
);
const LedgerPage = lazy(() =>
  import('../pages/ledger/LedgerPage').then(module => ({ default: module.default }))
);
const ApprehensionPage = lazy(() =>
  import('../pages/apprehension/ApprehensionsPage').then(module => ({ default: module.default }))
);

interface AppRoute {
  path: string
  element: React.ReactNode
  roles?: string[]     
  isSuspensed?: boolean 
}

const routesConfig: AppRoute[] = [
  { path: 'dashboard', element: <DashboardWrapper /> },
  { path: 'builder', element: <BuilderPageWrapper />, roles: ['admin'] },
  { path: 'menu-test', element: <MenuTestPage />, roles: ['admin'] },
  { path: 'apps/user-management/*', element: <UsersPage />, roles: ['admin'], isSuspensed: true },
  { path: 'crafted/pages/profile/*', element: <ProfilePage />, roles: ['admin', 'dispatcher'], isSuspensed: true },
  { path: 'apps/drivers/overview', element: <Overview />, roles: ['driver'], isSuspensed: true },
  { path: 'apps/chat/*', element: <ChatPage />, roles: ['admin', 'driver'], isSuspensed: true },
  { path: 'crafted/widgets/*', element: <WidgetsPage />, roles: ['admin', 'inventory'], isSuspensed: true },
  { path: 'crafted/account/*', element: <AccountPage />, isSuspensed: true },
  { path: 'crafted/pages/wizards/*', element: <WizardsPage />, isSuspensed: true },
  { 
    path: 'apps/drivers/my-ledger', 
    element: <LedgerPage />, 
    roles: ['driver'],   // only drivers can access
    isSuspensed: true 
  },
  { 
    path: 'apps/drivers/my-apprehensions', 
    element: <ApprehensionPage />, 
    roles: ['driver'],   // only drivers can access
    isSuspensed: true 
  },

]

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {routesConfig
          .filter((route) => !route.roles || hasRole(route.roles))
          .map(({path, element, isSuspensed}, index) => (
            <Route key={`${path}-${index}`}
              path={path}
              element={
                isSuspensed ? (
                  <SuspensedView>{element}</SuspensedView>
                ) : (
                  element
                )
              }
            />
          ))}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
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
