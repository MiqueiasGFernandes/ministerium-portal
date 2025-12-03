/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_NODE_ENV: string;
	readonly VITE_API_URL: string;
	readonly VITE_API_TIMEOUT: string;
	readonly VITE_USE_MOCK_DATA: string;
	readonly VITE_ENABLE_DEV_TOOLS: string;
	readonly VITE_TOKEN_KEY: string;
	readonly VITE_REFRESH_TOKEN_KEY: string;
	readonly VITE_MAX_FILE_SIZE: string;
	readonly VITE_ALLOWED_IMAGE_TYPES: string;
	readonly VITE_TENANT_SUBDOMAIN: string;
	readonly VITE_APP_NAME: string;
	readonly VITE_FEATURE_MEMBERS: string;
	readonly VITE_FEATURE_FINANCE: string;
	readonly VITE_FEATURE_EVENTS: string;
	readonly VITE_FEATURE_SCHEDULES: string;
	readonly VITE_FEATURE_CUSTOM_FIELDS: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
