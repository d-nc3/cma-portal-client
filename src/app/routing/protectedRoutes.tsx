// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth'
import { Role, Permission } from '../../types/RolePermissions';

type ProtectedRouteProps = {
  allowedRoles?: Role[];
  allowedPermissions?: Permission[];
  children: ReactNode;
};

const ProtectedRoute = ({ allowedRoles, allowedPermissions, children }: ProtectedRouteProps) => {
  const { currentUser,hasPermission,hasRole } = useAuth();

  
  if (!currentUser) return <Navigate to="/auth/login" replace />;


if (allowedRoles && !allowedRoles.some(role => hasRole(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  // Permission check
  if (allowedPermissions && !allowedPermissions.some(permission => hasPermission(permission))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
