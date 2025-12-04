import { faker } from "@faker-js/faker/locale/pt_BR";
import {
	OnboardingStatus,
	OnboardingStep,
	type OnboardingAdminData,
	type OnboardingData,
	type OnboardingOrganizationData,
	type OnboardingPreferences,
	type OnboardingTenantData,
} from "@/types";

// Seed for consistent fake data
faker.seed(456);

/**
 * Generates fake tenant data for onboarding testing
 * Following Single Responsibility Principle - only generates tenant data
 */
export const generateFakeTenantData = (): OnboardingTenantData => {
	const churchNames = [
		"Igreja Batista Esperança",
		"Igreja Presbiteriana da Paz",
		"Comunidade Cristã Vida Nova",
		"Igreja Metodista Central",
		"Igreja Assembléia de Deus",
		"Igreja Adventista do Sétimo Dia",
		"Comunidade Evangélica Renascer",
		"Igreja Quadrangular da Fé",
	];

	const name = faker.helpers.arrayElement(churchNames);

	return {
		name,
		logo: faker.image.url({ width: 200, height: 200 }),
	};
};

/**
 * Generates fake admin data for onboarding testing
 * Following Single Responsibility Principle - only generates admin data
 */
export const generateFakeAdminData = (): OnboardingAdminData => {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const email = faker.internet.email({
		firstName,
		lastName,
		provider: "ministerium.com",
	});

	return {
		name: `${firstName} ${lastName}`,
		email: email.toLowerCase(),
		password: "Admin@123",
		confirmPassword: "Admin@123",
		phone: faker.phone.number("(##) #####-####"),
		avatar: faker.image.avatar(),
	};
};

/**
 * Generates fake organization data for onboarding testing
 * Following Single Responsibility Principle - only generates organization data
 */
export const generateFakeOrganizationData = (): OnboardingOrganizationData => {
	return {
		address: {
			street: faker.location.street(),
			number: faker.location.buildingNumber(),
			complement: faker.helpers.maybe(() => `Sala ${faker.number.int({ min: 1, max: 20 })}`, { probability: 0.3 }),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			zipCode: faker.location.zipCode("#####-###"),
		},
		phone: faker.phone.number("(##) ####-####"),
		email: faker.internet.email({ provider: "igreja.com.br" }).toLowerCase(),
		website: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
		foundedDate: faker.date.past({ years: 50 }).toISOString().split("T")[0],
		description: faker.lorem.paragraph(),
	};
};

/**
 * Generates fake preferences data for onboarding testing
 * Following Single Responsibility Principle - only generates preferences
 */
export const generateFakePreferences = (): OnboardingPreferences => {
	return {
		features: {
			members: true,
			finance: faker.datatype.boolean(),
			events: faker.datatype.boolean(),
			schedules: faker.datatype.boolean(),
			ministries: faker.datatype.boolean(),
		},
		notifications: {
			email: faker.datatype.boolean(),
			push: faker.datatype.boolean(),
		},
		language: "pt-BR",
		timezone: "America/Sao_Paulo",
	};
};

/**
 * Generates complete fake onboarding data for testing
 * Following Single Responsibility Principle - orchestrates data generation
 */
export const generateFakeOnboardingData = (
	step: OnboardingStep = OnboardingStep.WELCOME,
	status: OnboardingStatus = OnboardingStatus.NOT_STARTED,
): OnboardingData => {
	const now = new Date().toISOString();

	return {
		currentStep: step,
		status,
		tenant: {},
		admin: {},
		organization: {},
		preferences: {},
		createdAt: now,
		updatedAt: now,
	};
};

/**
 * Generates complete onboarding data with all steps filled
 * Useful for testing the final state
 */
export const generateCompleteOnboardingData = (): OnboardingData => {
	const now = new Date().toISOString();

	return {
		currentStep: OnboardingStep.COMPLETE,
		status: OnboardingStatus.COMPLETED,
		tenant: generateFakeTenantData(),
		admin: generateFakeAdminData(),
		organization: generateFakeOrganizationData(),
		preferences: generateFakePreferences(),
		completedAt: now,
		createdAt: faker.date.recent({ days: 1 }).toISOString(),
		updatedAt: now,
	};
};

/**
 * Helper to auto-fill onboarding form fields in development/testing
 * Following Interface Segregation Principle - provides specific fill functions
 */
export const onboardingAutoFill = {
	tenant: generateFakeTenantData,
	admin: generateFakeAdminData,
	organization: generateFakeOrganizationData,
	preferences: generateFakePreferences,
	complete: generateCompleteOnboardingData,
};
