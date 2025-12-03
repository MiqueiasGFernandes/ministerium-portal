import type { IOnboardingService } from "./IOnboardingService";
import { OnboardingValidator } from "./OnboardingValidator";
import {
	OnboardingStatus,
	OnboardingStep,
	type OnboardingData,
} from "@/types";

/**
 * Single Responsibility Principle (SRP)
 * This service handles the business logic for onboarding flow
 *
 * Dependency Inversion Principle (DIP)
 * Depends on IOnboardingService abstraction, not concrete implementations
 */
export class OnboardingService implements IOnboardingService {
	private validator: OnboardingValidator;

	// Step order definition
	private readonly stepOrder: OnboardingStep[] = [
		OnboardingStep.WELCOME,
		OnboardingStep.TENANT_INFO,
		OnboardingStep.ADMIN_INFO,
		OnboardingStep.ORGANIZATION_DETAILS,
		OnboardingStep.PREFERENCES,
		OnboardingStep.COMPLETE,
	];

	// Steps that can be skipped
	private readonly skippableSteps: OnboardingStep[] = [
		OnboardingStep.ORGANIZATION_DETAILS,
	];

	constructor() {
		this.validator = new OnboardingValidator();
	}

	/**
	 * Initializes a new onboarding session
	 */
	public initialize(): OnboardingData {
		const now = new Date().toISOString();

		return {
			currentStep: OnboardingStep.WELCOME,
			status: OnboardingStatus.NOT_STARTED,
			tenant: {},
			admin: {},
			organization: {},
			preferences: {
				features: {
					members: true,
					finance: true,
					events: true,
					schedules: true,
					ministries: true,
				},
				notifications: {
					email: true,
					push: false,
				},
				language: "pt-BR",
				timezone: "America/Sao_Paulo",
			},
			createdAt: now,
			updatedAt: now,
		};
	}

	/**
	 * Updates the onboarding data for a specific step
	 */
	public updateStep(
		currentData: OnboardingData,
		stepData: Partial<OnboardingData>,
	): OnboardingData {
		return {
			...currentData,
			...stepData,
			status:
				currentData.status === OnboardingStatus.NOT_STARTED
					? OnboardingStatus.IN_PROGRESS
					: currentData.status,
			updatedAt: new Date().toISOString(),
		};
	}

	/**
	 * Validates data for a specific step
	 */
	public validateStep(
		step: OnboardingStep,
		data: Partial<OnboardingData>,
	): {
		isValid: boolean;
		errors: Record<string, string>;
	} {
		return this.validator.validate(step, data);
	}

	/**
	 * Moves to the next step in the onboarding flow
	 */
	public nextStep(currentStep: OnboardingStep): OnboardingStep | null {
		const currentIndex = this.stepOrder.indexOf(currentStep);

		if (currentIndex === -1 || currentIndex === this.stepOrder.length - 1) {
			return null;
		}

		return this.stepOrder[currentIndex + 1];
	}

	/**
	 * Moves to the previous step in the onboarding flow
	 */
	public previousStep(currentStep: OnboardingStep): OnboardingStep | null {
		const currentIndex = this.stepOrder.indexOf(currentStep);

		if (currentIndex <= 0) {
			return null;
		}

		return this.stepOrder[currentIndex - 1];
	}

	/**
	 * Completes the onboarding process
	 * In a real application, this would call the backend API
	 */
	public async complete(data: OnboardingData): Promise<{
		success: boolean;
		message?: string;
		tenantId?: string;
		userId?: string;
	}> {
		try {
			// Validate all steps before completing
			const tenantValidation = this.validateStep(
				OnboardingStep.TENANT_INFO,
				data,
			);
			const adminValidation = this.validateStep(OnboardingStep.ADMIN_INFO, data);
			const preferencesValidation = this.validateStep(
				OnboardingStep.PREFERENCES,
				data,
			);

			if (
				!tenantValidation.isValid ||
				!adminValidation.isValid ||
				!preferencesValidation.isValid
			) {
				return {
					success: false,
					message: "Por favor, preencha todos os campos obrigatórios",
				};
			}

			// Simulate API call
			await this.simulateApiCall();

			// In production, this would create the tenant and admin user
			const tenantId = `tenant-${Date.now()}`;
			const userId = `user-${Date.now()}`;

			return {
				success: true,
				message: "Onboarding concluído com sucesso!",
				tenantId,
				userId,
			};
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Erro ao concluir onboarding",
			};
		}
	}

	/**
	 * Calculates the progress percentage based on current step
	 */
	public calculateProgress(currentStep: OnboardingStep): number {
		const currentIndex = this.stepOrder.indexOf(currentStep);

		if (currentIndex === -1) {
			return 0;
		}

		// Exclude welcome and complete steps from calculation
		const totalSteps = this.stepOrder.length - 2;
		const completedSteps = Math.max(0, currentIndex - 1);

		return Math.round((completedSteps / totalSteps) * 100);
	}

	/**
	 * Checks if a step can be skipped
	 */
	public canSkipStep(step: OnboardingStep): boolean {
		return this.skippableSteps.includes(step);
	}

	/**
	 * Simulates an API call delay
	 * In production, this would be removed
	 */
	private async simulateApiCall(): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, 1000);
		});
	}

	/**
	 * Gets the step number for display purposes
	 */
	public getStepNumber(step: OnboardingStep): number {
		return this.stepOrder.indexOf(step);
	}

	/**
	 * Gets the total number of steps
	 */
	public getTotalSteps(): number {
		// Exclude welcome and complete steps
		return this.stepOrder.length - 2;
	}
}

// Export singleton instance
export const onboardingService = new OnboardingService();
