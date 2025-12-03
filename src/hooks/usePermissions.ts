import { useGetIdentity, usePermissions as useRefinePermissions } from '@refinedev/core';
import { User, UserRole } from '@/types';

/**
 * Custom hook for permission checking
 */
export const usePermissions = () => {
  const { data: permissions } = useRefinePermissions<string[]>();
  const { data: identity } = useGetIdentity<User>();

  const hasPermission = (permission: string): boolean => {
    if (!permissions) return false;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    if (!permissions) return false;
    return permissionList.some(p => permissions.includes(p));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    if (!permissions) return false;
    return permissionList.every(p => permissions.includes(p));
  };

  const hasRole = (role: UserRole): boolean => {
    return identity?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!identity) return false;
    return roles.includes(identity.role);
  };

  const isAdmin = (): boolean => {
    return identity?.role === UserRole.ADMIN;
  };

  const isLeader = (): boolean => {
    return identity?.role === UserRole.LEADER;
  };

  const isVolunteer = (): boolean => {
    return identity?.role === UserRole.VOLUNTEER;
  };

  return {
    permissions,
    identity,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin,
    isLeader,
    isVolunteer,
  };
};

export default usePermissions;
