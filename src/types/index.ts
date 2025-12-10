// Enums
export enum UserRole {
	ADMIN = "admin",
	LEADER = "leader",
	VOLUNTEER = "volunteer",
}

export enum MemberStatus {
	ACTIVE = "active",
	VISITOR = "visitor",
	INACTIVE = "inactive",
}

export enum TransactionType {
	INCOME = "income",
	EXPENSE = "expense",
}

export enum TransactionCategory {
	TITHE = "tithe",
	OFFERING = "offering",
	EVENT = "event",
	PURCHASE = "purchase",
	SALARY = "salary",
	OTHER = "other",
}

export enum EventStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}

export enum ScheduleStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
	DECLINED = "declined",
}

// Custom Field Types
export interface CustomField {
	id: string;
	name: string;
	type: "text" | "number" | "date" | "select" | "boolean";
	options?: string[];
	required: boolean;
	order: number;
}

// User & Auth Types
export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	tenantId: string;
	avatar?: string;
	createdAt: string;
	updatedAt: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	refreshToken: string;
	user: User;
}

// Tenant Types
export interface Tenant {
	id: string;
	name: string;
	subdomain: string;
	logo?: string;
	primaryColor: string;
	createdAt: string;
	updatedAt: string;
}

// Member Types
export interface Member {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	birthDate?: string;
	address?: {
		street: string;
		number: string;
		complement?: string;
		city: string;
		state: string;
		zipCode: string;
	};
	photo?: string;
	status: MemberStatus;
	tags: string[];
	customFields: Record<string, any>;
	tenantId: string;
	createdAt: string;
	updatedAt: string;
}

// Financial Types
export interface Transaction {
	id: string;
	type: TransactionType;
	amount: number;
	category: TransactionCategory;
	description: string;
	date: string;
	tenantId: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface FinancialSummary {
	totalIncome: number;
	totalExpense: number;
	balance: number;
	period: {
		start: string;
		end: string;
	};
}

// Event Types
export interface Event {
	id: string;
	title: string;
	description: string;
	date: string;
	time: string;
	location: string;
	responsibleId: string;
	responsible?: User;
	attendees: EventAttendee[];
	maxAttendees?: number;
	status: EventStatus;
	qrCode?: string;
	tenantId: string;
	createdAt: string;
	updatedAt: string;
}

export interface EventAttendee {
	id: string;
	eventId: string;
	memberId: string;
	member?: Member;
	checkedIn: boolean;
	checkedInAt?: string;
	createdAt: string;
}

// Schedule Types
export interface Schedule {
	id: string;
	title: string;
	description: string;
	date: string;
	ministryId: string;
	ministry?: Ministry;
	volunteers: ScheduleVolunteer[];
	tenantId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ScheduleVolunteer {
	id: string;
	scheduleId: string;
	memberId: string;
	member?: Member;
	status: ScheduleStatus;
	notifiedAt?: string;
	respondedAt?: string;
}

export interface Ministry {
	id: string;
	name: string;
	description: string;
	leaderId: string;
	leader?: User;
	members: string[];
	tenantId: string;
	createdAt: string;
	updatedAt: string;
}

// Dashboard Types
export interface DashboardStats {
	totalMembers: number;
	activeMembers: number;
	visitors: number;
	financialSummary: FinancialSummary;
	upcomingEvents: Event[];
	upcomingSchedules: Schedule[];
	historicalFinancialData?: MonthlyFinancialData[];
	historicalMembersData?: MonthlyMembersData[];
}

// Pagination Types
export interface PaginationParams {
	page: number;
	perPage: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
}

// Filter Types
export interface MemberFilters {
	status?: MemberStatus;
	tags?: string[];
	search?: string;
}

export interface TransactionFilters {
	type?: TransactionType;
	category?: TransactionCategory;
	startDate?: string;
	endDate?: string;
}

export interface EventFilters {
	status?: EventStatus;
	startDate?: string;
	endDate?: string;
}

// Onboarding Types
export enum OnboardingStep {
	WELCOME = "welcome",
	TENANT_INFO = "tenant_info",
	ADMIN_INFO = "admin_info",
	ORGANIZATION_DETAILS = "organization_details",
	COMPLETE = "complete",
}

export enum OnboardingStatus {
	NOT_STARTED = "not_started",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
}

export interface OnboardingTenantData {
	name: string;
	logo?: string;
}

export interface OnboardingAdminData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	phone?: string;
	avatar?: string;
}

export interface OnboardingOrganizationData {
	address: {
		street: string;
		number: string;
		complement?: string;
		city: string;
		state: string;
		zipCode: string;
	};
	phone: string;
	email: string;
	website?: string;
	foundedDate?: string;
	description?: string;
}

export interface OnboardingPreferences {
	features: {
		members: boolean;
		finance: boolean;
		events: boolean;
		schedules: boolean;
		ministries: boolean;
	};
	notifications: {
		email: boolean;
		push: boolean;
	};
	language: string;
	timezone: string;
}

export interface OnboardingData {
	currentStep: OnboardingStep;
	status: OnboardingStatus;
	tenant: Partial<OnboardingTenantData>;
	admin: Partial<OnboardingAdminData>;
	organization: Partial<OnboardingOrganizationData>;
	preferences: Partial<OnboardingPreferences>;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface OnboardingStepProps {
	data: OnboardingData;
	onNext: (stepData: Partial<OnboardingData>) => void;
	onBack?: () => void;
	onSkip?: () => void;
}

export interface SignupCredentials {
	email: string;
	password: string;
	name: string;
	tenantName: string;
	subdomain: string;
}

// Analytics Types
export interface MonthlyFinancialData {
	month: string; // YYYY-MM format
	monthLabel: string; // MMM/YYYY display format
	income: number;
	expense: number;
	balance: number;
}

export interface MonthlyMembersData {
	month: string; // YYYY-MM format
	monthLabel: string; // MMM/YYYY display format
	active: number;
	inactive: number;
	visitors: number;
	total: number;
}

export type PeriodFilter = "3months" | "6months" | "12months";

export interface AnalyticsData {
	financialData: MonthlyFinancialData[];
	membersData: MonthlyMembersData[];
	period: {
		start: string;
		end: string;
	};
}

// Tour Types
export * from "./tour";
