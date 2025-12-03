/**
 * Application constants
 */

export const APP_CONSTANTS = {
	// Pagination
	DEFAULT_PAGE_SIZE: 10,
	PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

	// Date formats
	DATE_FORMAT: "DD/MM/YYYY",
	TIME_FORMAT: "HH:mm",
	DATETIME_FORMAT: "DD/MM/YYYY HH:mm",

	// File upload
	MAX_FILE_SIZE_MB: 5,
	ALLOWED_IMAGE_EXTENSIONS: [".jpg", ".jpeg", ".png"],

	// Custom fields
	MAX_CUSTOM_FIELDS: 10,

	// Colors
	DEFAULT_PRIMARY_COLOR: "#228BE6",

	// Permissions
	PERMISSIONS: {
		// Members
		MEMBERS_VIEW: "members:view",
		MEMBERS_CREATE: "members:create",
		MEMBERS_EDIT: "members:edit",
		MEMBERS_DELETE: "members:delete",

		// Finance
		FINANCE_VIEW: "finance:view",
		FINANCE_CREATE: "finance:create",
		FINANCE_EDIT: "finance:edit",
		FINANCE_DELETE: "finance:delete",

		// Events
		EVENTS_VIEW: "events:view",
		EVENTS_CREATE: "events:create",
		EVENTS_EDIT: "events:edit",
		EVENTS_DELETE: "events:delete",

		// Schedules
		SCHEDULES_VIEW: "schedules:view",
		SCHEDULES_CREATE: "schedules:create",
		SCHEDULES_EDIT: "schedules:edit",
		SCHEDULES_DELETE: "schedules:delete",

		// Settings
		SETTINGS_VIEW: "settings:view",
		SETTINGS_EDIT: "settings:edit",

		// Users
		USERS_MANAGE: "users:manage",
	},

	// Role permissions mapping
	ROLE_PERMISSIONS: {
		admin: [
			"members:view",
			"members:create",
			"members:edit",
			"members:delete",
			"finance:view",
			"finance:create",
			"finance:edit",
			"finance:delete",
			"events:view",
			"events:create",
			"events:edit",
			"events:delete",
			"schedules:view",
			"schedules:create",
			"schedules:edit",
			"schedules:delete",
			"settings:view",
			"settings:edit",
			"users:manage",
		],
		leader: [
			"members:view",
			"members:create",
			"members:edit",
			"events:view",
			"events:create",
			"events:edit",
			"schedules:view",
			"schedules:create",
			"schedules:edit",
		],
		volunteer: ["members:view", "events:view", "schedules:view"],
	},
} as const;

export const TRANSACTION_CATEGORIES = [
	{ value: "tithe", label: "Dízimo" },
	{ value: "offering", label: "Oferta" },
	{ value: "event", label: "Evento" },
	{ value: "purchase", label: "Compra" },
	{ value: "salary", label: "Salário" },
	{ value: "other", label: "Outro" },
];

export const MEMBER_STATUS_OPTIONS = [
	{ value: "active", label: "Ativo", color: "green" },
	{ value: "visitor", label: "Visitante", color: "blue" },
	{ value: "inactive", label: "Inativo", color: "gray" },
];

export const EVENT_STATUS_OPTIONS = [
	{ value: "draft", label: "Rascunho", color: "gray" },
	{ value: "published", label: "Publicado", color: "blue" },
	{ value: "completed", label: "Concluído", color: "green" },
	{ value: "cancelled", label: "Cancelado", color: "red" },
];

export const SCHEDULE_STATUS_OPTIONS = [
	{ value: "pending", label: "Pendente", color: "yellow" },
	{ value: "confirmed", label: "Confirmado", color: "green" },
	{ value: "declined", label: "Recusado", color: "red" },
];
