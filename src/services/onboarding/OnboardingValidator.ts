import type { OnboardingData, OnboardingStep } from "@/types";
import { OnboardingStep as Step } from "@/types";

/**
 * Single Responsibility Principle (SRP)
 * This class is responsible only for validation logic
 */
export class OnboardingValidator {
	/**
	 * Validates tenant information step
	 */
	private validateTenantInfo(
		data: Partial<OnboardingData>,
	): Record<string, string> {
		const errors: Record<string, string> = {};
		const { tenant } = data;

		if (!tenant?.name || tenant.name.trim().length < 3) {
			errors.name = "Nome da organização deve ter pelo menos 3 caracteres";
		}

		return errors;
	}

	/**
	 * Validates admin information step
	 */
	private validateAdminInfo(
		data: Partial<OnboardingData>,
	): Record<string, string> {
		const errors: Record<string, string> = {};
		const { admin } = data;

		if (!admin?.name || admin.name.trim().length < 3) {
			errors.name = "Nome deve ter pelo menos 3 caracteres";
		}

		if (!admin?.email || !/^\S+@\S+\.\S+$/.test(admin.email)) {
			errors.email = "Email inválido";
		}

		if (!admin?.password || admin.password.length < 8) {
			errors.password = "Senha deve ter pelo menos 8 caracteres";
		}

		if (admin?.password && admin.password !== admin.confirmPassword) {
			errors.confirmPassword = "Senhas não coincidem";
		}

		// Password strength validation
		if (admin?.password) {
			const hasUpperCase = /[A-Z]/.test(admin.password);
			const hasLowerCase = /[a-z]/.test(admin.password);
			const hasNumber = /[0-9]/.test(admin.password);
			const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(admin.password);

			if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
				errors.password =
					"Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais";
			}
		}

		if (admin?.phone && admin.phone.length > 0) {
			const phoneDigits = admin.phone.replace(/\D/g, "");
			if (phoneDigits.length < 10 || phoneDigits.length > 11) {
				errors.phone = "Telefone inválido";
			}
		}

		return errors;
	}

	/**
	 * Validates organization details step
	 */
	private validateOrganizationDetails(
		data: Partial<OnboardingData>,
	): Record<string, string> {
		const errors: Record<string, string> = {};
		const { organization } = data;

		if (
			!organization?.address?.street ||
			organization.address.street.trim().length < 3
		) {
			errors["address.street"] = "Rua deve ter pelo menos 3 caracteres";
		}

		if (
			!organization?.address?.number ||
			organization.address.number.trim().length < 1
		) {
			errors["address.number"] = "Número é obrigatório";
		}

		if (
			!organization?.address?.city ||
			organization.address.city.trim().length < 2
		) {
			errors["address.city"] = "Cidade deve ter pelo menos 2 caracteres";
		}

		if (
			!organization?.address?.state ||
			organization.address.state.trim().length !== 2
		) {
			errors["address.state"] = "Estado deve ter 2 caracteres (ex: SP)";
		}

		if (
			!organization?.address?.zipCode ||
			!/^\d{5}-?\d{3}$/.test(organization.address.zipCode)
		) {
			errors["address.zipCode"] = "CEP inválido (ex: 12345-678)";
		}

		if (!organization?.phone || organization.phone.length < 10) {
			errors.phone = "Telefone é obrigatório";
		}

		if (!organization?.email || !/^\S+@\S+\.\S+$/.test(organization.email)) {
			errors.email = "Email inválido";
		}

		if (organization?.website && organization.website.length > 0) {
			try {
				new URL(organization.website);
			} catch {
				errors.website = "URL inválida (ex: https://exemplo.com)";
			}
		}

		return errors;
	}

	/**
	 * Main validation method - delegates to specific validators
	 * Open/Closed Principle - open for extension, closed for modification
	 */
	public validate(
		step: OnboardingStep,
		data: Partial<OnboardingData>,
	): { isValid: boolean; errors: Record<string, string> } {
		let errors: Record<string, string> = {};

		switch (step) {
			case Step.WELCOME:
				// Welcome step has no validation
				break;

			case Step.TENANT_INFO:
				errors = this.validateTenantInfo(data);
				break;

			case Step.ADMIN_INFO:
				errors = this.validateAdminInfo(data);
				break;

			case Step.ORGANIZATION_DETAILS:
				errors = this.validateOrganizationDetails(data);
				break;

			case Step.COMPLETE:
				// Complete step has no validation
				break;

			default:
				break;
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
		};
	}
}
