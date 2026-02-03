import { Route, Routes, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { UsersListWrapper } from './users-list/UsersList'
import { RoleListWrapper } from './roles-list/RoleList'
import { PermissionListWrapper } from './permissions-list/PermissionList'
import { RolePermissionWrapper } from   './role-permissions-list/RolePermissionList'

const usersBreadcrumbs: Array<PageLink> = [
  { title: 'User Management', path: '/apps/user-management/users', isSeparator: false, isActive: false },
  { title: '', path: '', isSeparator: true, isActive: false },
]

const rolesBreadcrumbs: Array<PageLink> = [
  { title: 'Role Management', path: '/apps/user-management/roles', isSeparator: false, isActive: false },
  { title: '', path: '', isSeparator: true, isActive: false },
]


const PermissionsBreadcrumbs: Array<PageLink> = [
  { title: 'Role Management', path: '/apps/user-management/permissions', isSeparator: false, isActive: false },
  { title: '', path: '', isSeparator: true, isActive: false },
]


const RolePermissionsBreadcrumbs: Array<PageLink> = [
  { title: 'Role Management', path: '/apps/user-management/role-permissions', isSeparator: false, isActive: false },
  { title: '', path: '', isSeparator: true, isActive: false },
]


const UsersPage = () => {
  return (
    <Routes>
      {/* Redirect root /apps/user-management to /users */}
      <Route index element={<Navigate to="users" />} />

      {/* Users List */}
      <Route
        path="users"
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Users list</PageTitle>
            <UsersListWrapper />
          </>
        }
      />

      {/* Roles Page */}
        <Route index element={<Navigate to="roles" />} />

      <Route
        path="roles"
        element={
          <>
            <PageTitle breadcrumbs={rolesBreadcrumbs}>Role List</PageTitle>
              <RoleListWrapper />
          </>
        }
      />

      {/* Permissions Page */}
      <Route
        path="permissions"
        element={
          <>
            <PageTitle breadcrumbs={PermissionsBreadcrumbs}>Permission list</PageTitle>
            <PermissionListWrapper/>
          </>
        }
      />

      {/* Catch-all for unknown paths */}
      <Route path="role-permissions" element={<Navigate to="role-permissions" />} />
         <Route
        path="RolePermissions"
        element={
          <>
            <PageTitle breadcrumbs={RolePermissionsBreadcrumbs}>Role Permission list</PageTitle>
            <RolePermissionWrapper/>
          </>
        }
      />

    </Routes>
   
    
    
  )
}

export default UsersPage
