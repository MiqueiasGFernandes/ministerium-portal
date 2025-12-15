import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	commonValidations,
	useFormValidation,
	type ValidationRules,
} from "../useFormValidation.hook";

interface TestForm {
	name: string;
	email: string;
	age: number;
	phone?: string;
	cpf?: string;
}

describe("useFormValidation", () => {
	describe("validation rules", () => {
		it("should validate required fields", () => {
			const rules: ValidationRules<TestForm> = {
				name: commonValidations.required(),
			};

			const { result } = renderHook(() => useFormValidation(rules));

			act(() => {
				result.current.validateField("name", "");
			});

			expect(result.current.errors.name).toBe("Campo obrigatório");
			expect(result.current.isValid).toBe(false);

			act(() => {
				result.current.validateField("name", "John");
			});

			expect(result.current.errors.name).toBeUndefined();
			expect(result.current.isValid).toBe(true);
		});

		it("should validate multiple rules for a field", () => {
			const rules: ValidationRules<TestForm> = {
				name: [
					commonValidations.required(),
					commonValidations.minLength(3),
					commonValidations.maxLength(50),
				],
			};

			const { result } = renderHook(() => useFormValidation(rules));

			// Test required
			act(() => {
				result.current.validateField("name", "");
			});
			expect(result.current.errors.name).toBe("Campo obrigatório");

			// Test min length
			act(() => {
				result.current.validateField("name", "Jo");
			});
			expect(result.current.errors.name).toBe("Mínimo de 3 caracteres");

			// Test valid
			act(() => {
				result.current.validateField("name", "John");
			});
			expect(result.current.errors.name).toBeUndefined();

			// Test max length
			act(() => {
				result.current.validateField("name", "a".repeat(51));
			});
			expect(result.current.errors.name).toBe("Máximo de 50 caracteres");
		});
	});

	describe("commonValidations", () => {
		describe("email", () => {
			it("should validate email format", () => {
				const rules: ValidationRules<TestForm> = {
					email: commonValidations.email(),
				};

				const { result } = renderHook(() => useFormValidation(rules));

				act(() => {
					result.current.validateField("email", "invalid");
				});
				expect(result.current.errors.email).toBe("Email inválido");

				act(() => {
					result.current.validateField("email", "test@example.com");
				});
				expect(result.current.errors.email).toBeUndefined();
			});
		});

		describe("numeric", () => {
			it("should validate numeric values", () => {
				const rules: ValidationRules<TestForm> = {
					age: commonValidations.numeric(),
				};

				const { result } = renderHook(() => useFormValidation(rules));

				act(() => {
					result.current.validateField("age", "abc");
				});
				expect(result.current.errors.age).toBe("Deve ser um número");

				act(() => {
					result.current.validateField("age", 25);
				});
				expect(result.current.errors.age).toBeUndefined();
			});
		});

		describe("min/max", () => {
			it("should validate min value", () => {
				const rules: ValidationRules<TestForm> = {
					age: commonValidations.min(18),
				};

				const { result } = renderHook(() => useFormValidation(rules));

				act(() => {
					result.current.validateField("age", 17);
				});
				expect(result.current.errors.age).toBe("Valor mínimo: 18");

				act(() => {
					result.current.validateField("age", 18);
				});
				expect(result.current.errors.age).toBeUndefined();
			});

			it("should validate max value", () => {
				const rules: ValidationRules<TestForm> = {
					age: commonValidations.max(100),
				};

				const { result } = renderHook(() => useFormValidation(rules));

				act(() => {
					result.current.validateField("age", 101);
				});
				expect(result.current.errors.age).toBe("Valor máximo: 100");

				act(() => {
					result.current.validateField("age", 100);
				});
				expect(result.current.errors.age).toBeUndefined();
			});
		});

		describe("CPF", () => {
			it("should validate CPF format and algorithm", () => {
				const rules: ValidationRules<TestForm> = {
					cpf: commonValidations.cpf(),
				};

				const { result } = renderHook(() => useFormValidation(rules));

				// Invalid CPF
				act(() => {
					result.current.validateField("cpf", "12345678901");
				});
				expect(result.current.errors.cpf).toBe("CPF inválido");

				// Valid CPF (example)
				act(() => {
					result.current.validateField("cpf", "52998224725");
				});
				expect(result.current.errors.cpf).toBeUndefined();
			});
		});
	});

	describe("validateAll", () => {
		it("should validate all fields at once", () => {
			const rules: ValidationRules<TestForm> = {
				name: commonValidations.required(),
				email: [commonValidations.required(), commonValidations.email()],
				age: [commonValidations.required(), commonValidations.min(18)],
			};

			const { result } = renderHook(() => useFormValidation(rules));

			const values: TestForm = {
				name: "",
				email: "invalid",
				age: 15,
			};

			let isValid = false;
			act(() => {
				isValid = result.current.validateAll(values);
			});

			expect(isValid).toBe(false);
			expect(result.current.errors.name).toBeTruthy();
			expect(result.current.errors.email).toBeTruthy();
			expect(result.current.errors.age).toBeTruthy();
			expect(result.current.isValid).toBe(false);
		});

		it("should return true when all validations pass", () => {
			const rules: ValidationRules<TestForm> = {
				name: commonValidations.required(),
				email: [commonValidations.required(), commonValidations.email()],
				age: [commonValidations.required(), commonValidations.min(18)],
			};

			const { result } = renderHook(() => useFormValidation(rules));

			const values: TestForm = {
				name: "John Doe",
				email: "john@example.com",
				age: 25,
			};

			let isValid = false;
			act(() => {
				isValid = result.current.validateAll(values);
			});

			expect(isValid).toBe(true);
			expect(result.current.errors).toEqual({});
			expect(result.current.isValid).toBe(true);
		});
	});

	describe("error management", () => {
		it("should clear all errors", () => {
			const rules: ValidationRules<TestForm> = {
				name: commonValidations.required(),
				email: commonValidations.required(),
			};

			const { result } = renderHook(() => useFormValidation(rules));

			act(() => {
				result.current.validateField("name", "");
				result.current.validateField("email", "");
			});

			expect(Object.keys(result.current.errors).length).toBe(2);

			act(() => {
				result.current.clearErrors();
			});

			expect(result.current.errors).toEqual({});
			expect(result.current.isValid).toBe(true);
		});

		it("should clear error for specific field", () => {
			const rules: ValidationRules<TestForm> = {
				name: commonValidations.required(),
				email: commonValidations.required(),
			};

			const { result } = renderHook(() => useFormValidation(rules));

			act(() => {
				result.current.validateField("name", "");
				result.current.validateField("email", "");
			});

			act(() => {
				result.current.clearFieldError("name");
			});

			expect(result.current.errors.name).toBeUndefined();
			expect(result.current.errors.email).toBeTruthy();
		});

		it("should set custom error for field", () => {
			const rules: ValidationRules<TestForm> = {
				name: commonValidations.required(),
			};

			const { result } = renderHook(() => useFormValidation(rules));

			act(() => {
				result.current.setFieldError("name", "Custom error message");
			});

			expect(result.current.errors.name).toBe("Custom error message");
			expect(result.current.isValid).toBe(false);
		});
	});
});
