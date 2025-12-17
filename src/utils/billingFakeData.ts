import type {
	BillingCycle,
	Plan,
	PlanType,
	Subscription,
	SubscriptionStatus,
} from "@/types";

/**
 * Fake data for billing system
 * Follows the PRD requirements exactly
 */

export const plans: Plan[] = [
	{
		id: "plan-gratuito",
		type: "gratuito" as PlanType,
		name: "Gratuito",
		description: "Comece gratuitamente e explore os recursos básicos",
		recommendedFor: "Até 50 membros",
		monthlyPrice: 0,
		annualPrice: 0,
		features: {
			maxMembers: 50,
			maxAdminUsers: 1,
			maxUsers: 1,
			multipleRoles: false,
			ministryManagement: true,
			advancedReports: false,
			dataExport: false,
			activityHistory: false,
			prioritySupport: false,
			fastSupport: false,
			consolidatedDashboards: false,
			earlyAccess: false,
			customization: false,
			multipleCongregations: false,
			teamTraining: false,
			dedicatedSLA: false,
		},
		isPopular: false,
		isCustom: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "plan-essencial",
		type: "essencial" as PlanType,
		name: "Essencial",
		description: "Simplicidade extrema para igrejas pequenas",
		recommendedFor: "Até 100 membros",
		monthlyPrice: 49,
		annualPrice: 490, // ~17% discount
		features: {
			maxMembers: 100,
			maxAdminUsers: 1,
			maxUsers: 1,
			multipleRoles: false,
			ministryManagement: true,
			advancedReports: false,
			dataExport: false,
			activityHistory: false,
			prioritySupport: false,
			fastSupport: false,
			consolidatedDashboards: false,
			earlyAccess: false,
			customization: false,
			multipleCongregations: false,
			teamTraining: false,
			dedicatedSLA: false,
		},
		isPopular: false,
		isCustom: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "plan-comunidade",
		type: "comunidade" as PlanType,
		name: "Comunidade",
		description: "Plano principal para igrejas médias",
		recommendedFor: "100 a 400 membros",
		monthlyPrice: 89,
		annualPrice: 890, // ~17% discount
		features: {
			maxMembers: 400,
			maxAdminUsers: null, // unlimited
			maxUsers: null, // unlimited
			multipleRoles: true,
			ministryManagement: true,
			advancedReports: true,
			dataExport: true,
			activityHistory: true,
			prioritySupport: true,
			fastSupport: false,
			consolidatedDashboards: false,
			earlyAccess: false,
			customization: false,
			multipleCongregations: false,
			teamTraining: false,
			dedicatedSLA: false,
		},
		isPopular: true,
		isCustom: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "plan-expansao",
		type: "expansao" as PlanType,
		name: "Expansão",
		description: "Para igrejas estruturadas",
		recommendedFor: "Até 400 membros",
		monthlyPrice: 149,
		annualPrice: 1490, // ~17% discount
		features: {
			maxMembers: 400,
			maxAdminUsers: null, // unlimited
			maxUsers: null, // unlimited
			multipleRoles: true,
			ministryManagement: true,
			advancedReports: true,
			dataExport: true,
			activityHistory: true,
			prioritySupport: true,
			fastSupport: true,
			consolidatedDashboards: true,
			earlyAccess: true,
			customization: false,
			multipleCongregations: false,
			teamTraining: false,
			dedicatedSLA: false,
		},
		isPopular: false,
		isCustom: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "plan-institucional",
		type: "institucional" as PlanType,
		name: "Institucional",
		description: "Customização total para organizações religiosas complexas",
		recommendedFor: "Acima de 400 membros",
		monthlyPrice: 0, // Custom pricing
		annualPrice: 0, // Custom pricing
		features: {
			maxMembers: null, // unlimited
			maxAdminUsers: null, // unlimited
			maxUsers: null, // unlimited
			multipleRoles: true,
			ministryManagement: true,
			advancedReports: true,
			dataExport: true,
			activityHistory: true,
			prioritySupport: true,
			fastSupport: true,
			consolidatedDashboards: true,
			earlyAccess: true,
			customization: true,
			multipleCongregations: true,
			teamTraining: true,
			dedicatedSLA: true,
		},
		isPopular: false,
		isCustom: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

/**
 * Create a trial subscription for a tenant
 */
export const createTrialSubscription = (tenantId: string): Subscription => {
	const now = new Date();
	const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

	return {
		id: `subscription-${tenantId}`,
		tenantId,
		planId: "plan-essencial", // Start with Essencial during trial
		status: "trial" as SubscriptionStatus,
		billingCycle: "monthly" as BillingCycle,
		currentPeriodStart: now.toISOString(),
		currentPeriodEnd: trialEnd.toISOString(),
		trialEndsAt: trialEnd.toISOString(),
		cancelAtPeriodEnd: false,
		createdAt: now.toISOString(),
		updatedAt: now.toISOString(),
	};
};

/**
 * Get plan by ID
 */
export const getPlanById = (planId: string): Plan | undefined => {
	return plans.find((p) => p.id === planId);
};

/**
 * Get plan by type
 */
export const getPlanByType = (type: PlanType): Plan | undefined => {
	return plans.find((p) => p.type === type);
};

/**
 * Calculate savings percentage for annual billing
 */
export const calculateAnnualSavings = (plan: Plan): number => {
	const monthlyTotal = plan.monthlyPrice * 12;
	const savings = monthlyTotal - plan.annualPrice;
	return Math.round((savings / monthlyTotal) * 100);
};

/**
 * Check if member count exceeds plan limit
 */
export const exceedsPlanLimit = (memberCount: number, plan: Plan): boolean => {
	if (plan.features.maxMembers === null) return false;
	return memberCount > plan.features.maxMembers;
};

/**
 * Suggest upgrade plan based on member count
 */
export const suggestPlanForMemberCount = (memberCount: number): Plan | null => {
	if (memberCount > 400) {
		return getPlanByType("institucional" as PlanType) || null;
	}
	if (memberCount > 100) {
		return getPlanByType("comunidade" as PlanType) || null;
	}
	return getPlanByType("essencial" as PlanType) || null;
};
