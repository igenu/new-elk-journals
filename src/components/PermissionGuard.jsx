import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole, getPermissions } from '../utils/secureStorage';

/**
 * PermissionGuard Component
 * Protects routes based on user role and permissions
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if access is granted
 * @param {Array<string>} props.allowedRoles - Array of roles that can access this route
 * @param {number|string} props.requiredPermission - Permission ID required for subadmins
 * @param {string} props.fallbackPath - Path to redirect if access is denied (default: /unauthorized)
 */
const PermissionGuard = ({
  children,
  allowedRoles = ['admin', 'super_admin', 'subadmin'],
  requiredPermission = null,
  fallbackPath = '/unauthorized'
}) => {
  const role = getRole();
  const userPermissions = getPermissions();

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Admin and super_admin have full access
  if (role === 'admin' || role === 'super_admin') {
    return children;
  }

  // For subadmin, check specific permissions if required
  if (role === 'subadmin' && requiredPermission !== null) {
    const hasPermission = userPermissions.includes(requiredPermission) ||
      userPermissions.some(perm => {
        if (typeof perm === 'object') {
          return perm.id === requiredPermission;
        }
        return perm === requiredPermission;
      });

    if (!hasPermission) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children;
};

/**
 * RoleGuard Component
 * Simple role-based access control (no permission check)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if access is granted
 * @param {Array<string>} props.allowedRoles - Array of roles that can access this route
 * @param {string} props.fallbackPath - Path to redirect if access is denied
 */
export const RoleGuard = ({
  children,
  allowedRoles = ['admin'],
  fallbackPath = '/unauthorized'
}) => {
  const role = getRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

/**
 * AdminOnlyGuard Component
 * Restricts access to admin and super_admin only (excludes subadmin)
 */
export const AdminOnlyGuard = ({ children, fallbackPath = '/unauthorized' }) => {
  const role = getRole();

  if (role !== 'admin' && role !== 'super_admin') {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

/**
 * Hook to check if user has a specific permission
 * @param {number|string} permissionId - The permission ID to check
 * @returns {boolean} - Whether the user has the permission
 */
export const useHasPermission = (permissionId) => {
  const role = getRole();
  const userPermissions = getPermissions();

  // Admin and super_admin always have permission
  if (role === 'admin' || role === 'super_admin') {
    return true;
  }

  // Check if permission ID exists in user's permissions
  return userPermissions.includes(permissionId) ||
    userPermissions.some(perm => {
      if (typeof perm === 'object') {
        return perm.id === permissionId;
      }
      return perm === permissionId;
    });
};

/**
 * Hook to check if user has any of the specified permissions
 * @param {Array<number|string>} permissionIds - Array of permission IDs to check
 * @returns {boolean} - Whether the user has any of the permissions
 */
export const useHasAnyPermission = (permissionIds) => {
  const role = getRole();
  const userPermissions = getPermissions();

  // Admin and super_admin always have permission
  if (role === 'admin' || role === 'super_admin') {
    return true;
  }

  // Check if any permission ID exists in user's permissions
  return permissionIds.some(permId =>
    userPermissions.includes(permId) ||
    userPermissions.some(perm => {
      if (typeof perm === 'object') {
        return perm.id === permId;
      }
      return perm === permId;
    })
  );
};

/**
 * Component to conditionally render content based on permissions
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if permission is granted
 * @param {number|string} props.permission - Permission ID required
 * @param {React.ReactNode} props.fallback - Optional fallback content if permission denied
 */
export const PermissionContent = ({ children, permission, fallback = null }) => {
  const hasPermission = useHasPermission(permission);
  return hasPermission ? children : fallback;
};

export default PermissionGuard;
