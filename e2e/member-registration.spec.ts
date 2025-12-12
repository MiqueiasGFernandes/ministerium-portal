import { expect, test } from "@playwright/test";

test.describe("Member Self-Registration", () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage before each test
		await page.goto("/");
		await page.evaluate(() => {
			localStorage.clear();
		});
	});

	test("should display member registration page with all fields", async ({
		page,
	}) => {
		await page.goto("/member-registration/1");
		await page.waitForLoadState("networkidle");

		// Should show title
		await expect(
			page.getByRole("heading", { name: /cadastro de membro/i }),
		).toBeVisible();

		// Should show all required fields
		await expect(page.getByLabel(/nome completo/i)).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/telefone/i)).toBeVisible();
		await expect(page.getByLabel(/data de nascimento/i)).toBeVisible();

		// Should show optional fields
		await expect(page.getByLabel(/estado civil/i)).toBeVisible();
		await expect(page.getByLabel(/gênero/i)).toBeVisible();

		// Should show LGPD consent
		await expect(
			page.getByText(/lei geral de proteção de dados/i),
		).toBeVisible();
		await expect(page.getByText(/li e aceito os termos de uso/i)).toBeVisible();

		// Should show submit button
		await expect(
			page.getByRole("button", { name: /enviar cadastro/i }),
		).toBeVisible();
	});

	test("should validate required fields", async ({ page }) => {
		await page.goto("/member-registration/1");
		await page.waitForLoadState("networkidle");

		// Try to submit without filling anything
		await page.getByRole("button", { name: /enviar cadastro/i }).click();

		// Should show validation errors
		await expect(page.getByText(/nome completo é obrigatório/i)).toBeVisible();
		await expect(page.getByText(/email é obrigatório/i)).toBeVisible();
		await expect(page.getByText(/telefone é obrigatório/i)).toBeVisible();
	});

	test("should submit member registration successfully", async ({ page }) => {
		await page.goto("/member-registration/1");
		await page.waitForLoadState("networkidle");

		// Fill all required fields
		await page.getByLabel(/nome completo/i).fill("Maria Silva");
		await page.getByLabel(/email/i).fill("maria@example.com");
		await page.getByLabel(/telefone/i).fill("11987654321");

		// Fill birth date
		await page.getByLabel(/data de nascimento/i).fill("01/01/1990");

		// Accept LGPD terms
		await page.getByText(/li e aceito os termos/i).click();

		// Submit form
		await page.getByRole("button", { name: /enviar cadastro/i }).click();

		// Should show success message
		await expect(
			page.getByRole("heading", { name: /cadastro enviado/i }),
		).toBeVisible();
	});

	test("should display LGPD information correctly", async ({ page }) => {
		await page.goto("/member-registration/1");
		await page.waitForLoadState("networkidle");

		// Should show LGPD title
		await expect(page.getByText(/proteção de dados pessoais/i)).toBeVisible();

		// Should show LGPD information points
		await expect(
			page.getByText(/utilizados exclusivamente para fins de cadastro/i),
		).toBeVisible();
		await expect(page.getByText(/armazenadas de forma segura/i)).toBeVisible();
	});

	test("should require LGPD acceptance before submission", async ({ page }) => {
		await page.goto("/member-registration/1");
		await page.waitForLoadState("networkidle");

		// Fill all fields except LGPD acceptance
		await page.getByLabel(/nome completo/i).fill("Ana Costa");
		await page.getByLabel(/email/i).fill("ana@example.com");
		await page.getByLabel(/telefone/i).fill("31988887777");
		await page.getByLabel(/data de nascimento/i).fill("20/03/1992");

		// Try to submit without accepting terms
		await page.getByRole("button", { name: /enviar cadastro/i }).click();

		// Should show validation error
		await expect(page.getByText(/você deve aceitar os termos/i)).toBeVisible();
	});
});
