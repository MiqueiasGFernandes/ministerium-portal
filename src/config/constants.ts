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

		// Ministries
		MINISTRIES_VIEW: "ministries:view",
		MINISTRIES_CREATE: "ministries:create",
		MINISTRIES_EDIT: "ministries:edit",
		MINISTRIES_DELETE: "ministries:delete",

		// Settings
		SETTINGS_VIEW: "settings:view",
		SETTINGS_EDIT: "settings:edit",

		// Users
		USERS_MANAGE: "users:manage",
		USERS_VIEW: "users:view",
		USERS_APPROVE: "users:approve",
		USERS_REVOKE: "users:revoke",
		USERS_EDIT_ROLE: "users:edit_role",

		// Member Registrations
		MEMBER_REGISTRATIONS_VIEW: "member-registrations:view",
		MEMBER_REGISTRATIONS_APPROVE: "member-registrations:approve",
		MEMBER_REGISTRATIONS_DENY: "member-registrations:deny",

		// Analytics
		ANALYTICS_VIEW: "analytics:view",
	},

	// Role permissions mapping
	ROLE_PERMISSIONS: {
		admin: ["*"], // Admin has access to everything
		leader: [
			"members:view",
			"members:create",
			"member-registrations:*", // Full access to member registrations
			"events:*", // Full access to events
			"schedules:*", // Full access to schedules
			"analytics:view", // Leaders can view analytics
		],
		financial: [
			"finance:*", // Full access to finance
			"analytics:view",
		],
		secretary: [
			"members:*", // Full access to members
			"member-registrations:*", // Full access to member registrations
			"events:view",
			"schedules:view",
		],
		volunteer: [
			"events:view",
			"schedules:view",
			"schedules:create",
			"schedules:edit",
			"schedules:delete",
		],
	} as Record<string, string[]>,
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

export const USER_ROLE_OPTIONS = [
	{
		value: "admin",
		label: "Administrador",
		description: "Acesso total ao sistema",
	},
	{
		value: "leader",
		label: "Líder",
		description: "Gerencia membros, eventos e escalas",
	},
	{
		value: "financial",
		label: "Financeiro",
		description: "Acesso total ao módulo financeiro",
	},
	{
		value: "secretary",
		label: "Secretaria",
		description: "Gerencia membros e visualiza eventos",
	},
	{
		value: "volunteer",
		label: "Voluntário",
		description: "Visualiza e gerencia escalas",
	},
];

export const USER_ACCESS_STATUS_OPTIONS = [
	{ value: "pending", label: "Pendente", color: "yellow" },
	{ value: "active", label: "Ativo", color: "green" },
	{ value: "revoked", label: "Revogado", color: "red" },
	{ value: "denied", label: "Negado", color: "gray" },
];

export const MEMBER_REGISTRATION_STATUS_OPTIONS = [
	{ value: "pending", label: "Pendente", color: "yellow" },
	{ value: "approved", label: "Aprovado", color: "green" },
	{ value: "denied", label: "Negado", color: "red" },
];

export const MARITAL_STATUS_OPTIONS = [
	{ value: "single", label: "Solteiro(a)" },
	{ value: "married", label: "Casado(a)" },
	{ value: "divorced", label: "Divorciado(a)" },
	{ value: "widowed", label: "Viúvo(a)" },
];

export const GENDER_OPTIONS = [
	{ value: "male", label: "Masculino" },
	{ value: "female", label: "Feminino" },
	{ value: "other", label: "Outro" },
];
