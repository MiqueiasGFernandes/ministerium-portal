import type { OnboardingData, OnboardingStep } from "@/types";

/**
 * Interface Segregation Principle (ISP)
 * Defines the contract for onboarding service operations
 */
export interface IOnboardingService {
	/**
	 * Initializes a new onboarding session
	 */
	initialize(): OnboardingData;

	/**
	 * Updates the onboarding data for a specific step
	 */
	updateStep(
		currentData: OnboardingData,
		stepData: Partial<OnboardingData>,
	): OnboardingData;

	/**
	 * Validates data for a specific step
	 */
	validateStep(
		step: OnboardingStep,
		data: Partial<OnboardingData>,
	): {
		isValid: boolean;
		errors: Record<string, string>;
	};

	/**
	 * Moves to the next step in the onboarding flow
	 */
	nextStep(currentStep: OnboardingStep): OnboardingStep | null;

	/**
	 * Moves to the previous step in the onboarding flow
	 */
	previousStep(currentStep: OnboardingStep): OnboardingStep | null;

	/**
	 * Completes the onboarding process
	 */
	complete(data: OnboardingData): Promise<{
		success: boolean;
		message?: string;
		tenantId?: string;
		userId?: string;
	}>;

	/**
	 * Calculates the progress percentage
	 */
	calculateProgress(currentStep: OnboardingStep): number;

	/**
	 * Checks if a step can be skipped
	 */
	canSkipStep(step: OnboardingStep): boolean;
}
