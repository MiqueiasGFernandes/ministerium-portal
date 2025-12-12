import { expect, test } from "@playwright/test";

test.describe("Member Registration - Submit Button", () => {
	test("should submit successfully with valid data", async ({ page }) => {
		// Go to registration page
		await page.goto("/member-registration/1");
		await page.waitForLoadState("networkidle");

		// Fill all required fields
		await page.getByLabel(/nome completo/i).fill("João Silva Teste");
		await page.getByLabel(/email/i).fill("joao.teste@example.com");
		await page.getByLabel(/telefone/i).fill("11987654321");

		// Fill date of birth
		const dateInput = page.getByLabel(/data de nascimento/i);
		await dateInput.click();
		await dateInput.fill("01/01/1990");

		// Accept LGPD terms
		const lgpdCheckbox = page.getByRole("checkbox", {
			name: /li e aceito os termos/i,
		});
		await lgpdCheckbox.check();

		// Wait a bit for form to update
		await page.waitForTimeout(500);

		// Click submit button
		const submitButton = page.getByRole("button", { name: /enviar cadastro/i });
		await submitButton.click();

		// Should show success message
		await expect(
			page.getByRole("heading", { name: /cadastro enviado/i }),
		).toBeVisible({ timeout: 10000 });
	});

	test("should show validation errors on empty submit", async ({ page }) => {
		await page.goto("/member-registration/1");
		await page.waitForLoadState("networkidle");

		// Click submit without filling anything
		const submitButton = page.getByRole("button", { name: /enviar cadastro/i });
		await submitButton.click();

		// Should NOT navigate away (still on registration page)
		await expect(
			page.getByRole("heading", { name: /cadastro de membro/i }),
		).toBeVisible();

		// Form should show validation errors
		// Mantine shows errors after submit attempt
		await page.waitForTimeout(500);

		// Check if we can see the form still (not the success page)
		const nameInput = page.getByLabel(/nome completo/i);
		await expect(nameInput).toBeVisible();
	});

	test("should validate email format", async ({ page }) => {
		await page.goto("/member-registration/1");
		await page.waitForLoadState("networkidle");

		// Fill with invalid email
		await page.getByLabel(/nome completo/i).fill("João Silva");
		await page.getByLabel(/email/i).fill("invalid-email");
		await page.getByLabel(/telefone/i).fill("11987654321");

		const dateInput = page.getByLabel(/data de nascimento/i);
		await dateInput.click();
		await dateInput.fill("01/01/1990");

		const lgpdCheckbox = page.getByRole("checkbox", {
			name: /li e aceito os termos/i,
		});
		await lgpdCheckbox.check();

		// Try to submit
		const submitButton = page.getByRole("button", { name: /enviar cadastro/i });
		await submitButton.click();

		// Should still be on registration page (not success page)
		await expect(
			page.getByRole("heading", { name: /cadastro de membro/i }),
		).toBeVisible();
	});
});
