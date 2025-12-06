import type { AccessControlProvider } from "@refinedev/core";
import { APP_CONSTANTS } from "@/config/constants";
import type { User } from "@/types";

/**
 * Get current user from localStorage
 */
const getCurrentUser = (): User | null => {
	const userStr = localStorage.getItem("user");
	return userStr ? JSON.parse(userStr) : null;
};

/**
 * Access Control Provider
 * Controls what users can see and do based on their role
 */
export const accessControlProvider: AccessControlProvider = {
	can: async ({ resource, action }) => {
		// Get user from localStorage
		const user = getCurrentUser();

		if (!user) {
			return { can: false };
		}

		// Dashboard is always accessible
		if (resource === "dashboard") {
			return { can: true };
		}

		// If no resource is specified, deny access
		if (!resource) {
			return { can: false };
		}

		const userPermissions = APP_CONSTANTS.ROLE_PERMISSIONS[user.role] || [];

		// Admin has full access
		if (userPermissions.includes("*")) {
			return { can: true };
		}

		// Map resource names to permission names
		const resourceMap: Record<string, string> = {
			transactions: "finance",
			schedules: "schedules",
			ministries: "ministries",
		};

		const permissionResource = resourceMap[resource] || resource;

		// Map Refine actions to our permission format
		const actionMap: Record<string, string> = {
			list: "view",
			show: "view",
			create: "create",
			edit: "edit",
			delete: "delete",
			clone: "create",
		};

		const permissionAction = actionMap[action] || action;
		const permission = `${permissionResource}:${permissionAction}`;

		// Check for exact permission
		if (userPermissions.includes(permission)) {
			return { can: true };
		}

		// Check for wildcard permission (e.g., "events:*")
		if (userPermissions.includes(`${permissionResource}:*`)) {
			return { can: true };
		}

		return {
			can: false,
			reason: "Você não tem permissão para acessar este recurso",
		};
	},

	options: {
		buttons: {
			enableAccessControl: true,
			hideIfUnauthorized: true,
		},
		queryOptions: {
			retry: false,
		},
	},
};
