import type { AuthProvider as RefineAuthProvider } from "@refinedev/core";
import { APP_CONSTANTS } from "@/config/constants";
import { config } from "@/config/env";
import type { LoginCredentials, User, UserRole } from "@/types";
import { findOrCreateUser } from "@/utils/fakeData";

/**
 * Authentication Provider with JWT and RBAC support
 * For development, uses local storage and fake data
 */

// Mock JWT token generation
const generateMockToken = (user: User): string => {
	const payload = {
		sub: user.id,
		email: user.email,
		role: user.role,
		tenantId: user.tenantId,
		iat: Date.now(),
		exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
	};
	return btoa(JSON.stringify(payload));
};

const generateMockRefreshToken = (user: User): string => {
	const payload = {
		sub: user.id,
		type: "refresh",
		iat: Date.now(),
		exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
	};
	return btoa(JSON.stringify(payload));
};

// Storage helpers
const setToken = (token: string) => {
	localStorage.setItem(config.tokenKey, token);
};

const getToken = (): string | null => {
	return localStorage.getItem(config.tokenKey);
};

const removeToken = () => {
	localStorage.removeItem(config.tokenKey);
};

const setRefreshToken = (token: string) => {
	localStorage.setItem(config.refreshTokenKey, token);
};

const getRefreshToken = (): string | null => {
	return localStorage.getItem(config.refreshTokenKey);
};

const removeRefreshToken = () => {
	localStorage.removeItem(config.refreshTokenKey);
};

const setUser = (user: User) => {
	localStorage.setItem("user", JSON.stringify(user));
};

const getUser = (): User | null => {
	const userStr = localStorage.getItem("user");
	return userStr ? JSON.parse(userStr) : null;
};

const removeUser = () => {
	localStorage.removeItem("user");
};

// Decode mock JWT
const decodeToken = (token: string): any => {
	try {
		return JSON.parse(atob(token));
	} catch {
		return null;
	}
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
	const decoded = decodeToken(token);
	if (!decoded || !decoded.exp) return true;
	return Date.now() >= decoded.exp;
};

// Simulate API delay
const simulateDelay = (ms: number = 500) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const authProvider: RefineAuthProvider = {
	login: async ({ email, password }: LoginCredentials) => {
		console.log("AuthProvider: login called with", { email, password });
		await simulateDelay();

		// In mock mode, accept any password (for demo purposes)
		// In production, this would verify the password hash
		if (password.length < 3) {
			console.log("AuthProvider: password too short");
			return {
				success: false,
				error: {
					name: "LoginError",
					message: "Email ou senha inválidos",
				},
			};
		}

		// In mock mode, find or create user by email
		// This allows authentication with ANY email for development
		const user = findOrCreateUser(email);
		console.log("AuthProvider: user found/created", user);

		const token = generateMockToken(user);
		const refreshToken = generateMockRefreshToken(user);

		setToken(token);
		setRefreshToken(refreshToken);
		setUser(user);

		console.log("AuthProvider: login successful, redirecting to /");
		return {
			success: true,
			redirectTo: "/",
		};
	},

	logout: async () => {
		await simulateDelay(200);

		removeToken();
		removeRefreshToken();
		removeUser();

		return {
			success: true,
			redirectTo: "/login",
		};
	},

	check: async () => {
		const token = getToken();

		if (!token) {
			return {
				authenticated: false,
				redirectTo: "/login",
				logout: true,
			};
		}

		if (isTokenExpired(token)) {
			// Try to refresh token
			const refreshToken = getRefreshToken();

			if (!refreshToken || isTokenExpired(refreshToken)) {
				removeToken();
				removeRefreshToken();
				removeUser();

				return {
					authenticated: false,
					redirectTo: "/login",
					logout: true,
				};
			}

			// In a real app, this would call the refresh token endpoint
			// For now, we'll just generate a new token
			const user = getUser();
			if (user) {
				const newToken = generateMockToken(user);
				setToken(newToken);
			}
		}

		return {
			authenticated: true,
		};
	},

	getPermissions: async () => {
		const user = getUser();

		if (!user) {
			return null;
		}

		// Return permissions based on role
		return APP_CONSTANTS.ROLE_PERMISSIONS[user.role] || [];
	},

	getIdentity: async () => {
		const user = getUser();

		if (!user) {
			return null;
		}

		return user;
	},

	onError: async (error) => {
		if (error.statusCode === 401 || error.statusCode === 403) {
			removeToken();
			removeRefreshToken();
			removeUser();

			return {
				logout: true,
				redirectTo: "/login",
				error,
			};
		}

		return { error };
	},
};

// Helper hook for permission checking
export const hasPermission = (
	userPermissions: string[] | null,
	requiredPermission: string,
): boolean => {
	if (!userPermissions) return false;
	return userPermissions.includes(requiredPermission);
};

// Helper hook for role checking
export const hasRole = (
	user: User | null,
	allowedRoles: UserRole[],
): boolean => {
	if (!user) return false;
	return allowedRoles.includes(user.role);
};

export default authProvider;
