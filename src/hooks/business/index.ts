/**
 * Business Logic Hooks Module
 *
 * Central export point for all business logic hooks.
 * These hooks encapsulate business rules and application logic,
 * keeping components focused on presentation.
 */

// Form Validation
export {
	commonValidations,
	type FieldErrors,
	type UseFormValidationReturn,
	useFormValidation,
	type ValidationRule,
	type ValidationRules,
} from "./useFormValidation.hook";
// Table Management
export {
	type UseTableStateOptions,
	type UseTableStateReturn,
	useTableState,
} from "./useTableState.hook";
