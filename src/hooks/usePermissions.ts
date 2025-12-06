import {
	useGetIdentity,
	usePermissions as useRefinePermissions,
} from "@refinedev/core";
import { type User, UserRole } from "@/types";

/**
 * Custom hook for permission checking
 */
export const usePermissions = () => {
	const { data: permissions, isLoading: permissionsLoading } =
		useRefinePermissions<string[]>();
	const { data: identity, isLoading: identityLoading } = useGetIdentity<User>();

	const isLoading = permissionsLoading || identityLoading;

	const hasPermission = (permission: string): boolean => {
		if (!permissions) return false;

		// Admin has full access with "*"
		if (permissions.includes("*")) return true;

		// Check for exact permission match
		if (permissions.includes(permission)) return true;

		// Check for wildcard permission (e.g., "events:*" for "events:create")
		const [resource] = permission.split(":");
		if (permissions.includes(`${resource}:*`)) return true;

		return false;
	};

	const hasAnyPermission = (permissionList: string[]): boolean => {
		if (!permissions) return false;
		return permissionList.some((p) => permissions.includes(p));
	};

	const hasAllPermissions = (permissionList: string[]): boolean => {
		if (!permissions) return false;
		return permissionList.every((p) => permissions.includes(p));
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

	/**
	 * Check if user can view a resource
	 */
	const canView = (resource: string): boolean => {
		return hasPermission(`${resource}:view`);
	};

	/**
	 * Check if user can create a resource
	 */
	const canCreate = (resource: string): boolean => {
		return hasPermission(`${resource}:create`);
	};

	/**
	 * Check if user can edit a resource
	 */
	const canEdit = (resource: string): boolean => {
		return hasPermission(`${resource}:edit`);
	};

	/**
	 * Check if user can delete a resource
	 */
	const canDelete = (resource: string): boolean => {
		return hasPermission(`${resource}:delete`);
	};

	return {
		permissions,
		identity,
		isLoading,
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
		hasRole,
		hasAnyRole,
		isAdmin,
		isLeader,
		isVolunteer,
		canView,
		canCreate,
		canEdit,
		canDelete,
	};
};

export default usePermissions;
