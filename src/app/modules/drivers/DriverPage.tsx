import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'
import {Projects} from './components/Projects'
import {Campaigns} from './components/Campaigns'
import {Documents} from './components/Documents'
import {Connections} from './components/Connections'
import {DriverHeader} from './DriverHeader'
import Apprehension from './components/Apprehension'

const driverBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/driver/overview',
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

const DriverPage = () => (
  <Routes>
    <Route
      element={
        <>
          <DriverHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>Overview</PageTitle>
            <Overview />
          </>
        }
      />
      <Route
        path='projects'
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>Projects</PageTitle>
            <Projects />
          </>
        }
      />
      <Route
        path='campaigns'
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>Campaigns</PageTitle>
            <Campaigns />
          </>
        }
      />
      <Route
        path='documents'
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>Documents</PageTitle>
            <Documents />
          </>
        }
      />
      <Route
        path='connections'
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>Connections</PageTitle>
            <Connections />
          </>
        }
      />
      <Route
        path='violation'
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>Connections</PageTitle>
            <Connections />
          </>
        }
      />
      <Route
        path='apprehension'
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>Connections</PageTitle>
            <Apprehension/>
          </>
        }
      />
      <Route index element={<Navigate to='/driver/overview' />} />
    </Route>
  </Routes>
)

export default DriverPage
