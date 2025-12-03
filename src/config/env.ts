/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

interface FeatureToggles {
	members: boolean;
	finance: boolean;
	events: boolean;
	schedules: boolean;
	ministries: boolean;
	customFields: boolean;
}

interface AppConfig {
	nodeEnv: string;
	apiUrl: string;
	apiTimeout: number;
	useMockData: boolean;
	enableDevTools: boolean;
	tokenKey: string;
	refreshTokenKey: string;
	maxFileSize: number;
	allowedImageTypes: string[];
	tenantSubdomain: string;
	appName: string;
	features: FeatureToggles;
}

const getEnvVar = (key: string, defaultValue: string = ""): string => {
	return (import.meta.env[key] as string | undefined) || defaultValue;
};

const getEnvBool = (key: string, defaultValue: boolean = false): boolean => {
	const value = import.meta.env[key] as string | boolean | undefined;
	if (value === undefined) return defaultValue;
	return value === "true" || value === true;
};

const getEnvNumber = (key: string, defaultValue: number = 0): number => {
	const value = import.meta.env[key] as string | number | undefined;
	if (value === undefined) return defaultValue;
	return Number.parseInt(String(value), 10);
};

export const config: AppConfig = {
	nodeEnv: getEnvVar("VITE_NODE_ENV", "development"),
	apiUrl: getEnvVar("VITE_API_URL", "http://localhost:8000/api/v1"),
	apiTimeout: getEnvNumber("VITE_API_TIMEOUT", 30000),
	useMockData: getEnvBool("VITE_USE_MOCK_DATA", true),
	enableDevTools: getEnvBool("VITE_ENABLE_DEV_TOOLS", true),
	tokenKey: getEnvVar("VITE_TOKEN_KEY", "ministerium_token"),
	refreshTokenKey: getEnvVar(
		"VITE_REFRESH_TOKEN_KEY",
		"ministerium_refresh_token",
	),
	maxFileSize: getEnvNumber("VITE_MAX_FILE_SIZE", 5242880), // 5MB
	allowedImageTypes: getEnvVar(
		"VITE_ALLOWED_IMAGE_TYPES",
		"image/jpeg,image/png,image/jpg",
	).split(","),
	tenantSubdomain: getEnvVar("VITE_TENANT_SUBDOMAIN", "demo"),
	appName: getEnvVar("VITE_APP_NAME", "Ministerium"),
	features: {
		members: getEnvBool("VITE_FEATURE_MEMBERS", true),
		finance: getEnvBool("VITE_FEATURE_FINANCE", true),
		events: getEnvBool("VITE_FEATURE_EVENTS", true),
		schedules: getEnvBool("VITE_FEATURE_SCHEDULES", true),
		ministries: getEnvBool("VITE_FEATURE_MINISTRIES", true),
		customFields: getEnvBool("VITE_FEATURE_CUSTOM_FIELDS", true),
	},
};

export const isDevelopment = config.nodeEnv === "development";
export const isProduction = config.nodeEnv === "production";

export default config;
