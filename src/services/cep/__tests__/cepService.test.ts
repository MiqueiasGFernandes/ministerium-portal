import { beforeEach, describe, expect, it, vi } from "vitest";
import { cepService } from "../cepService";

describe("CepService", () => {
	beforeEach(() => {
		// Clear all mocks before each test
		vi.clearAllMocks();
	});

	describe("isValidCep", () => {
		it("should validate correct CEP format", () => {
			expect(cepService.isValidCep("12345-678")).toBe(true);
			expect(cepService.isValidCep("12345678")).toBe(true);
		});

		it("should reject invalid CEP format", () => {
			expect(cepService.isValidCep("123")).toBe(false);
			expect(cepService.isValidCep("12345-67")).toBe(false);
			expect(cepService.isValidCep("")).toBe(false);
		});
	});

	describe("fetchAddress", () => {
		it("should fetch and transform address data", async () => {
			// Mock fetch
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					cep: "01310-100",
					logradouro: "Avenida Paulista",
					complemento: "",
					bairro: "Bela Vista",
					localidade: "São Paulo",
					uf: "SP",
				}),
			});

			const result = await cepService.fetchAddress("01310100");

			expect(result).toEqual({
				street: "Avenida Paulista",
				city: "São Paulo",
				state: "SP",
				zipCode: "01310-100",
			});
		});

		it("should return null for CEP not found", async () => {
			// Mock fetch with erro flag
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					erro: true,
				}),
			});

			const result = await cepService.fetchAddress("00000000");

			expect(result).toBeNull();
		});

		it("should throw error for invalid CEP", async () => {
			await expect(cepService.fetchAddress("123")).rejects.toThrow(
				"CEP deve conter 8 dígitos",
			);
		});

		it("should handle network errors", async () => {
			// Mock fetch to fail
			global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

			await expect(cepService.fetchAddress("01310100")).rejects.toThrow(
				"Network error",
			);
		});
	});
});
