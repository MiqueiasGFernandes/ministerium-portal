import { useCallback, useState } from "react";

/**
 * Validation Rule Type
 */
export type ValidationRule<T = any> = (value: T) => string | undefined;

/**
 * Field Errors Type
 */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Form Validation Hook Return Type
 */
export interface UseFormValidationReturn<T> {
	/** Current validation errors */
	errors: FieldErrors<T>;
	/** Validate a specific field */
	validateField: (field: keyof T, value: any) => string | undefined;
	/** Validate all fields */
	validateAll: (values: T) => boolean;
	/** Clear all errors */
	clearErrors: () => void;
	/** Clear error for specific field */
	clearFieldError: (field: keyof T) => void;
	/** Set error for specific field */
	setFieldError: (field: keyof T, error: string) => void;
	/** Check if form is valid */
	isValid: boolean;
}

/**
 * Validation Rules Type
 */
export type ValidationRules<T> = Partial<
	Record<keyof T, ValidationRule | ValidationRule[]>
>;

/**
 * Common Validation Rules
 *
 * Reusable validation functions following DRY principle
 */
export const commonValidations = {
	required: (message = "Campo obrigatório"): ValidationRule => {
		return (value: any) => {
			if (value === undefined || value === null || value === "") {
				return message;
			}
			return undefined;
		};
	},

	minLength:
		(min: number, message?: string): ValidationRule =>
		(value: string) => {
			if (value && value.length < min) {
				return message || `Mínimo de ${min} caracteres`;
			}
			return undefined;
		},

	maxLength:
		(max: number, message?: string): ValidationRule =>
		(value: string) => {
			if (value && value.length > max) {
				return message || `Máximo de ${max} caracteres`;
			}
			return undefined;
		},

	email: (message = "Email inválido"): ValidationRule => {
		return (value: string) => {
			if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
				return message;
			}
			return undefined;
		};
	},

	phone: (message = "Telefone inválido"): ValidationRule => {
		return (value: string) => {
			if (value && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(value)) {
				return message;
			}
			return undefined;
		};
	},

	cpf: (message = "CPF inválido"): ValidationRule => {
		return (value: string) => {
			if (!value) return undefined;

			const cpf = value.replace(/\D/g, "");
			if (cpf.length !== 11) return message;

			// Validate CPF algorithm
			let sum = 0;
			for (let i = 0; i < 9; i++) {
				sum += Number.parseInt(cpf.charAt(i), 10) * (10 - i);
			}
			let digit = 11 - (sum % 11);
			if (digit >= 10) digit = 0;
			if (digit !== Number.parseInt(cpf.charAt(9), 10)) return message;

			sum = 0;
			for (let i = 0; i < 10; i++) {
				sum += Number.parseInt(cpf.charAt(i), 10) * (11 - i);
			}
			digit = 11 - (sum % 11);
			if (digit >= 10) digit = 0;
			if (digit !== Number.parseInt(cpf.charAt(10), 10)) return message;

			return undefined;
		};
	},

	numeric: (message = "Deve ser um número"): ValidationRule => {
		return (value: any) => {
			if (
				value !== undefined &&
				value !== null &&
				Number.isNaN(Number(value))
			) {
				return message;
			}
			return undefined;
		};
	},

	min:
		(min: number, message?: string): ValidationRule =>
		(value: number) => {
			if (value !== undefined && value < min) {
				return message || `Valor mínimo: ${min}`;
			}
			return undefined;
		},

	max:
		(max: number, message?: string): ValidationRule =>
		(value: number) => {
			if (value !== undefined && value > max) {
				return message || `Valor máximo: ${max}`;
			}
			return undefined;
		},
};

/**
 * Custom hook for form validation
 *
 * Provides flexible form validation with custom rules.
 * Follows Open/Closed Principle - extensible without modification.
 *
 * @param rules Validation rules for each field
 * @returns Validation state and functions
 *
 * @example
 * ```tsx
 * const { errors, validateField, validateAll } = useFormValidation({
 *   name: [commonValidations.required(), commonValidations.minLength(3)],
 *   email: [commonValidations.required(), commonValidations.email()],
 *   age: [commonValidations.required(), commonValidations.min(18)],
 * });
 *
 * // Validate on blur
 * <TextInput
 *   error={errors.name}
 *   onBlur={(e) => validateField('name', e.target.value)}
 * />
 *
 * // Validate all before submit
 * const handleSubmit = (values) => {
 *   if (validateAll(values)) {
 *     // Submit form
 *   }
 * };
 * ```
 */
export function useFormValidation<T extends Record<string, any>>(
	rules: ValidationRules<T>,
): UseFormValidationReturn<T> {
	const [errors, setErrors] = useState<FieldErrors<T>>({});

	const validateField = useCallback(
		(field: keyof T, value: any): string | undefined => {
			const fieldRules = rules[field];
			if (!fieldRules) return undefined;

			const rulesToApply = Array.isArray(fieldRules)
				? fieldRules
				: [fieldRules];

			for (const rule of rulesToApply) {
				const error = rule(value);
				if (error) {
					setErrors((prev) => ({ ...prev, [field]: error }));
					return error;
				}
			}

			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});

			return undefined;
		},
		[rules],
	);

	const validateAll = useCallback(
		(values: Partial<T>): boolean => {
			const newErrors: FieldErrors<T> = {};
			let isValid = true;

			for (const field of Object.keys(rules) as (keyof T)[]) {
				const error = validateField(field, values[field]);
				if (error) {
					newErrors[field] = error;
					isValid = false;
				}
			}

			setErrors(newErrors);
			return isValid;
		},
		[rules, validateField],
	);

	const clearErrors = useCallback(() => {
		setErrors({});
	}, []);

	const clearFieldError = useCallback((field: keyof T) => {
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[field];
			return newErrors;
		});
	}, []);

	const setFieldError = useCallback((field: keyof T, error: string) => {
		setErrors((prev) => ({ ...prev, [field]: error }));
	}, []);

	const isValid = Object.keys(errors).length === 0;

	return {
		errors,
		validateField,
		validateAll,
		clearErrors,
		clearFieldError,
		setFieldError,
		isValid,
	};
}
