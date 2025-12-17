// Enums
export enum UserRole {
	ADMIN = "admin",
	LEADER = "leader",
	FINANCIAL = "financial",
	SECRETARY = "secretary",
	VOLUNTEER = "volunteer",
}

export enum UserAccessStatus {
	PENDING = "pending",
	ACTIVE = "active",
	REVOKED = "revoked",
	DENIED = "denied",
}

export enum MemberRegistrationStatus {
	PENDING = "pending",
	APPROVED = "approved",
	DENIED = "denied",
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

export enum FormFieldType {
	TEXT = "text",
	EMAIL = "email",
	PHONE = "phone",
	NUMBER = "number",
	DATE = "date",
	SELECT = "select",
	MULTISELECT = "multiselect",
	TEXTAREA = "textarea",
	CHECKBOX = "checkbox",
	RADIO = "radio",
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
	status: UserAccessStatus;
	createdAt: string;
	updatedAt: string;
}

export interface AccessRequest {
	id: string;
	email: string;
	name: string;
	phone?: string;
	reason?: string;
	status: UserAccessStatus;
	tenantId: string;
	requestedAt: string;
	respondedAt?: string;
	respondedBy?: string;
	assignedRole?: UserRole;
}

export interface MemberRegistration {
	id: string;
	name: string;
	email: string;
	phone: string;
	birthDate: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	maritalStatus?: "single" | "married" | "divorced" | "widowed";
	gender?: "male" | "female" | "other";
	notes?: string;
	acceptedTerms: boolean;
	acceptedAt: string;
	status: MemberRegistrationStatus;
	tenantId: string;
	registeredAt: string;
	approvedAt?: string;
	approvedBy?: string;
	deniedAt?: string;
	deniedBy?: string;
	denialReason?: string;
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

// Event Registration Form Types
export interface EventFormField {
	id: string;
	label: string;
	type: FormFieldType;
	required: boolean;
	placeholder?: string;
	description?: string;
	options?: string[]; // For select, multiselect, radio
	validation?: {
		min?: number;
		max?: number;
		pattern?: string;
		message?: string;
	};
	order: number;
}

export interface EventRegistrationConfig {
	enabled: boolean;
	fields: EventFormField[];
	confirmationMessage?: string;
	capacity?: number;
	registrationDeadline?: string;
}

export interface EventRegistration {
	id: string;
	eventId: string;
	email: string;
	name: string;
	phone?: string;
	formData: Record<string, string | number | boolean | string[]>;
	status: "pending" | "approved" | "rejected" | "cancelled";
	registeredAt: string;
	approvedAt?: string;
	approvedBy?: string;
	rejectedAt?: string;
	rejectedBy?: string;
	rejectionReason?: string;
	checkedIn: boolean;
	checkedInAt?: string;
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
	registrationConfig?: EventRegistrationConfig;
	publicRegistrationUrl?: string;
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

// Billing & Subscription Types
export type PlanType =
	| "essencial"
	| "comunidade"
	| "expansao"
	| "institucional";

export type BillingCycle = "monthly" | "annual";

export type SubscriptionStatus =
	| "trial"
	| "active"
	| "pending"
	| "canceled"
	| "past_due";

export interface PlanFeatures {
	maxMembers: number | null; // null = unlimited
	maxAdminUsers: number | null; // null = unlimited
	maxUsers: number | null; // null = unlimited
	multipleRoles: boolean;
	ministryManagement: boolean;
	advancedReports: boolean;
	dataExport: boolean;
	activityHistory: boolean;
	prioritySupport: boolean;
	fastSupport: boolean;
	consolidatedDashboards: boolean;
	earlyAccess: boolean;
	customization: boolean;
	multipleCongregations: boolean;
	teamTraining: boolean;
	dedicatedSLA: boolean;
}

export interface Plan {
	id: string;
	type: PlanType;
	name: string;
	description: string;
	recommendedFor: string;
	monthlyPrice: number;
	annualPrice: number;
	features: PlanFeatures;
	isPopular?: boolean;
	isCustom?: boolean; // For Institucional plan
	createdAt: string;
	updatedAt: string;
}

export interface Subscription {
	id: string;
	tenantId: string;
	planId: string;
	plan?: Plan;
	status: SubscriptionStatus;
	billingCycle: BillingCycle;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	trialEndsAt?: string;
	canceledAt?: string;
	cancelAtPeriodEnd: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PaymentMethod {
	id: string;
	tenantId: string;
	type: "credit_card";
	cardBrand: string;
	cardLast4: string;
	cardExpMonth: number;
	cardExpYear: number;
	cardHolderName: string;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Invoice {
	id: string;
	tenantId: string;
	subscriptionId: string;
	amount: number;
	status: "pending" | "paid" | "failed" | "refunded";
	billingCycle: BillingCycle;
	periodStart: string;
	periodEnd: string;
	paidAt?: string;
	dueDate: string;
	createdAt: string;
	updatedAt: string;
}

export interface EnterpriseLead {
	id: string;
	churchName: string;
	responsibleName: string;
	email: string;
	phone: string;
	approximateMembers: number;
	notes?: string;
	status: "pending" | "contacted" | "converted" | "rejected";
	createdAt: string;
	updatedAt: string;
}

export interface CheckoutData {
	planId: string;
	billingCycle: BillingCycle;
	paymentMethod: {
		cardNumber: string;
		cardHolderName: string;
		cardExpMonth: number;
		cardExpYear: number;
		cardCvv: string;
	};
}

// Tour Types
export * from "./tour";
