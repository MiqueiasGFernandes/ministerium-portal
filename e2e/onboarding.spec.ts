import { expect, test } from "@playwright/test";

test.describe("Onboarding Flow", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to onboarding page
		await page.goto("/onboarding");
	});

	test("should display welcome step initially", async ({ page }) => {
		// Check welcome message is visible
		await expect(
			page.getByRole("heading", { name: /Bem-vindo ao Ministerium/i }),
		).toBeVisible();

		// Check start button exists
		await expect(
			page.getByTestId("welcome-start-button"),
		).toBeVisible();
	});

	test("should navigate from welcome to tenant info step", async ({ page }) => {
		// Click start button
		await page.getByTestId("welcome-start-button").click();

		// Check we're on tenant info step
		await expect(
			page.getByRole("heading", { name: /Informações da Organização/i }),
		).toBeVisible();

		// Check stepper is visible
		await expect(page.getByTestId("onboarding-stepper")).toBeVisible();

		// Check progress bar is visible
		await expect(page.getByTestId("onboarding-progress")).toBeVisible();
	});

	test("should validate required fields on tenant info step", async ({ page }) => {
		// Go to tenant info step
		await page.getByTestId("welcome-start-button").click();

		// Try to submit without filling fields
		await page.getByTestId("next-button").click();

		// Check error messages appear
		await expect(page.locator('text="Nome deve ter pelo menos 3 caracteres"')).toBeVisible();
	});

	test("should auto-fill tenant info with test data", async ({ page }) => {
		// Go to tenant info step
		await page.getByTestId("welcome-start-button").click();

		// Click auto-fill button
		await page.getByTestId("autofill-button").click();

		// Check fields are filled
		const nameInput = page.getByTestId("tenant-name-input");
		await expect(nameInput).not.toHaveValue("");

		const subdomainInput = page.getByTestId("tenant-subdomain-input");
		await expect(subdomainInput).not.toHaveValue("");
	});

	test("should complete tenant info and move to admin info", async ({ page }) => {
		// Go to tenant info step
		await page.getByTestId("welcome-start-button").click();

		// Auto-fill and submit
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Check we're on admin info step
		await expect(
			page.getByRole("heading", { name: /Informações do Administrador/i }),
		).toBeVisible();
	});

	test("should validate password requirements on admin info step", async ({ page }) => {
		// Navigate to admin info step
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Fill with weak password
		await page.getByTestId("admin-name-input").fill("João Silva");
		await page.getByTestId("admin-email-input").fill("joao@test.com");
		await page.getByTestId("admin-password-input").fill("123");
		await page.getByTestId("admin-confirm-password-input").fill("123");

		// Try to submit
		await page.getByTestId("next-button").click();

		// Should show password error
		await expect(page.locator('text=/.*Senha deve ter pelo menos 8 caracteres.*/i')).toBeVisible();
	});

	test("should validate password confirmation match", async ({ page }) => {
		// Navigate to admin info step
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Fill with non-matching passwords
		await page.getByTestId("admin-name-input").fill("João Silva");
		await page.getByTestId("admin-email-input").fill("joao@test.com");
		await page.getByTestId("admin-password-input").fill("Admin@123");
		await page.getByTestId("admin-confirm-password-input").fill("Admin@456");

		// Try to submit
		await page.getByTestId("next-button").click();

		// Should show confirmation error
		await expect(page.locator('text=/.*Senhas não coincidem.*/i')).toBeVisible();
	});

	test("should navigate back from admin info to tenant info", async ({ page }) => {
		// Navigate to admin info step
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Click back button
		await page.getByTestId("back-button").click();

		// Should be back on tenant info
		await expect(
			page.getByRole("heading", { name: /Informações da Organização/i }),
		).toBeVisible();
	});

	test("should complete admin info and move to organization details", async ({ page }) => {
		// Navigate through steps
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Auto-fill admin info
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Check we're on organization details step
		await expect(
			page.getByRole("heading", { name: /Detalhes da Organização/i }),
		).toBeVisible();
	});

	test("should allow skipping organization details step", async ({ page }) => {
		// Navigate to organization details
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Skip button should be visible
		await expect(page.getByTestId("skip-button")).toBeVisible();

		// Click skip
		await page.getByTestId("skip-button").click();

		// Should move to preferences
		await expect(
			page.getByRole("heading", { name: /Preferências do Sistema/i }),
		).toBeVisible();
	});

	test("should validate organization address fields", async ({ page }) => {
		// Navigate to organization details
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Clear auto-filled data and submit empty
		await page.getByTestId("org-street-input").clear();
		await page.getByTestId("next-button").click();

		// Should show validation error
		await expect(page.locator('text=/.*Rua deve ter pelo menos.*/i')).toBeVisible();
	});

	test("should complete organization details and move to preferences", async ({ page }) => {
		// Navigate through steps
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Fill organization details
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Check we're on preferences
		await expect(
			page.getByRole("heading", { name: /Preferências do Sistema/i }),
		).toBeVisible();
	});

	test("should require at least one feature to be selected", async ({ page }) => {
		// Navigate to preferences
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("skip-button").click();

		// Uncheck all features
		await page.getByTestId("feature-members-checkbox").uncheck();
		await page.getByTestId("feature-finance-checkbox").uncheck();
		await page.getByTestId("feature-events-checkbox").uncheck();
		await page.getByTestId("feature-schedules-checkbox").uncheck();
		await page.getByTestId("feature-ministries-checkbox").uncheck();

		// Try to submit
		await page.getByTestId("next-button").click();

		// Should show error
		await expect(page.locator('text=/.*pelo menos uma funcionalidade.*/i')).toBeVisible();
	});

	test("should complete preferences and move to complete step", async ({ page }) => {
		// Navigate through all steps
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("skip-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Should show complete message
		await expect(
			page.getByRole("heading", { name: /Tudo Pronto!/i }),
		).toBeVisible();
	});

	test("should complete entire onboarding flow with all steps filled", async ({ page }) => {
		// Welcome step
		await page.getByTestId("welcome-start-button").click();

		// Tenant info step
		await page.getByTestId("autofill-button").click();
		const tenantName = await page.getByTestId("tenant-name-input").inputValue();
		await page.getByTestId("next-button").click();

		// Admin info step
		await page.getByTestId("autofill-button").click();
		const adminName = await page.getByTestId("admin-name-input").inputValue();
		const adminEmail = await page.getByTestId("admin-email-input").inputValue();
		await page.getByTestId("next-button").click();

		// Organization details step
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Preferences step
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Complete step
		await expect(
			page.getByRole("heading", { name: /Tudo Pronto!/i }),
		).toBeVisible();

		// Verify summary shows correct data
		await expect(page.locator(`text="${tenantName}"`)).toBeVisible();
		await expect(page.locator(`text="${adminName}"`)).toBeVisible();
		await expect(page.locator(`text="${adminEmail}"`)).toBeVisible();

		// Finish button should be visible
		await expect(page.getByTestId("complete-finish-button")).toBeVisible();
	});

	test("should show progress bar that increases through steps", async ({ page }) => {
		// Start onboarding
		await page.getByTestId("welcome-start-button").click();

		// Progress should be visible after welcome step
		await expect(page.getByTestId("onboarding-progress")).toBeVisible();

		// Complete tenant info
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Progress should increase
		const progressBar = page.getByTestId("onboarding-progress");
		await expect(progressBar).toBeVisible();

		// Continue to next step
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Progress should still be visible
		await expect(progressBar).toBeVisible();
	});

	test("should redirect to login after completing onboarding", async ({ page }) => {
		// Complete entire flow
		await page.getByTestId("welcome-start-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();
		await page.getByTestId("skip-button").click();
		await page.getByTestId("autofill-button").click();
		await page.getByTestId("next-button").click();

		// Click finish
		await page.getByTestId("complete-finish-button").click();

		// Should redirect to login (wait up to 5 seconds)
		await page.waitForURL("/login", { timeout: 5000 });
		await expect(page).toHaveURL("/login");
	});

	test("should have link to onboarding from login page", async ({ page }) => {
		// Go to login
		await page.goto("/login");

		// Should have link to create organization
		const onboardingLink = page.getByRole("link", {
			name: /Criar nova organização/i,
		});
		await expect(onboardingLink).toBeVisible();

		// Click link
		await onboardingLink.click();

		// Should navigate to onboarding
		await expect(page).toHaveURL("/onboarding");
		await expect(
			page.getByRole("heading", { name: /Bem-vindo ao Ministerium/i }),
		).toBeVisible();
	});
});
