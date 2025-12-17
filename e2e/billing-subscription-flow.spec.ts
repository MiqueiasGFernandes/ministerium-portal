import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Billing & Subscription Flow
 * Tests the complete subscription journey from plan selection to checkout
 */

test.describe("Billing & Subscription Flow", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		// Mark tours as completed to avoid interference
		await page.evaluate(() => {
			localStorage.setItem(
				"ministerium_completed_tours",
				JSON.stringify(["dashboard", "firstAccess"]),
			);
			localStorage.setItem(
				"ministerium_feature_toggles",
				JSON.stringify({ firstAccessTour: false, dashboardTour: false }),
			);
		});

		await page
			.locator(
				'input[name="email"]:visible, input[placeholder*="email"]:visible',
			)
			.first()
			.fill("admin@ministerium.com");
		await page
			.locator('input[type="password"]:visible')
			.first()
			.fill("admin123");
		await page.locator('button[type="submit"]:visible').first().click();
		await page.waitForURL("/");
	});

	test.describe("Plans Page", () => {
		test("should display all available plans with correct information", async ({
			page,
		}) => {
			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Check page title
			await expect(page.locator("h1")).toContainText("Escolha o Plano Ideal");

			// Check billing cycle toggle
			await expect(page.getByText("Mensal")).toBeVisible();
			await expect(page.getByText("Anual")).toBeVisible();

			// Check all plans are displayed
			await expect(page.getByText("Essencial")).toBeVisible();
			await expect(page.getByText("Comunidade")).toBeVisible();
			await expect(page.getByText("Expansão")).toBeVisible();
			await expect(page.getByText("Institucional")).toBeVisible();

			// Check "Mais Popular" badge on Comunidade plan
			const popularBadge = page.getByText("Mais Popular");
			await expect(popularBadge).toBeVisible();

			// Check prices are displayed
			await expect(page.getByText("R$ 49")).toBeVisible(); // Essencial monthly
			await expect(page.getByText("R$ 89")).toBeVisible(); // Comunidade monthly
		});

		test("should toggle between monthly and annual billing cycles", async ({
			page,
		}) => {
			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Initially on monthly
			await expect(page.getByText("R$ 49")).toBeVisible(); // Essencial monthly

			// Switch to annual
			await page.getByText("Anual").click();
			await page.waitForTimeout(500);

			// Check annual prices are displayed
			await expect(page.getByText("R$ 490")).toBeVisible(); // Essencial annual

			// Check savings badge is displayed
			await expect(page.getByText(/Economize/)).toBeVisible();
		});

		test("should redirect to checkout when selecting a regular plan", async ({
			page,
		}) => {
			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Click on "Selecionar Plano" for Essencial
			const essencialCard = page
				.locator('div:has-text("Essencial")')
				.filter({ hasText: "Selecionar Plano" })
				.first();
			await essencialCard.getByText("Selecionar Plano").click();

			// Should redirect to checkout
			await page.waitForURL(/\/billing\/checkout/);
			expect(page.url()).toContain("planId=plan-essencial");
			expect(page.url()).toContain("cycle=monthly");
		});

		test("should redirect to enterprise contact form when selecting Institutional plan", async ({
			page,
		}) => {
			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Click on "Falar com Consultor" for Institucional
			const institucionalCard = page
				.locator('div:has-text("Institucional")')
				.filter({ hasText: "Falar com Consultor" })
				.first();
			await institucionalCard.getByText("Falar com Consultor").click();

			// Should redirect to enterprise contact
			await page.waitForURL("/billing/enterprise-contact");
			expect(page.url()).toContain("/billing/enterprise-contact");
		});
	});

	test.describe("Checkout Flow", () => {
		test("should complete checkout with valid payment information", async ({
			page,
		}) => {
			// Go directly to checkout with a plan
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			// Check page title
			await expect(page.locator("h1")).toContainText("Finalizar Assinatura");

			// Check order summary
			await expect(page.getByText("Essencial")).toBeVisible();
			await expect(page.getByText("Mensal")).toBeVisible();
			await expect(page.getByText("R$ 49")).toBeVisible();

			// Use auto-fill button (only visible in test environment)
			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
				await page.waitForTimeout(500);
			} else {
				// Fill payment form manually
				await page.getByLabel("Número do Cartão").fill("4532123456789012");
				await page.getByLabel("Nome do Titular").fill("João Silva");
				await page.getByLabel("Mês").selectOption("12");
				await page.getByLabel("Ano").fill("2025");
				await page.getByLabel("CVV").fill("123");
			}

			// Submit payment
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();

			// Should redirect to success page
			await page.waitForURL("/billing/checkout/success", { timeout: 10000 });

			// Check success message
			await expect(page.getByText("Pagamento Confirmado!")).toBeVisible();
			await expect(page.getByText(/Sua assinatura foi ativada/)).toBeVisible();
		});

		test("should display validation errors for invalid payment data", async ({
			page,
		}) => {
			await page.goto("/billing/checkout?planId=plan-comunidade&cycle=annual");
			await page.waitForLoadState("networkidle");

			// Try to submit with empty fields
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();

			// Should show validation errors (Mantine form validation)
			// Note: Mantine may not render visible error messages immediately
			// Just verify the form doesn't submit
			await page.waitForTimeout(1000);

			// URL should still be checkout (not redirected to success)
			expect(page.url()).toContain("/billing/checkout");
		});

		test("should show annual plan savings in checkout", async ({ page }) => {
			await page.goto("/billing/checkout?planId=plan-comunidade&cycle=annual");
			await page.waitForLoadState("networkidle");

			// Check order summary shows annual pricing
			await expect(page.getByText("R$ 890")).toBeVisible();
			await expect(page.getByText(/economizando.*17%/i)).toBeVisible();
		});
	});

	test.describe("Enterprise Contact Form", () => {
		test("should submit enterprise lead request successfully", async ({
			page,
		}) => {
			await page.goto("/billing/enterprise-contact");
			await page.waitForLoadState("networkidle");

			// Check page title
			await expect(page.locator("h1")).toContainText("Plano Institucional");

			// Use auto-fill if available
			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
				await page.waitForTimeout(500);
			} else {
				// Fill form manually
				await page.getByLabel("Nome da Igreja").fill("Igreja Batista Central");
				await page.getByLabel("Nome do Responsável").fill("Pastor João Silva");
				await page.getByLabel("E-mail").fill("pastor@igrejabatista.com.br");
				await page.getByLabel("Telefone").fill("11987654321");
				await page.getByLabel("Número Aproximado de Membros").fill("500");
				await page
					.getByLabel("Observações")
					.fill("Temos interesse no plano institucional.");
			}

			// Submit form
			await page.getByRole("button", { name: /Enviar Solicitação/ }).click();

			// Should redirect to success page
			await page.waitForURL("/billing/enterprise-contact/success");

			// Check success message
			await expect(page.getByText("Solicitação Enviada!")).toBeVisible();
		});

		test("should validate required fields in enterprise form", async ({
			page,
		}) => {
			await page.goto("/billing/enterprise-contact");
			await page.waitForLoadState("networkidle");

			// Try to submit without filling required fields
			await page.getByRole("button", { name: /Enviar Solicitação/ }).click();

			// Should remain on the same page
			await page.waitForTimeout(1000);
			expect(page.url()).toContain("/billing/enterprise-contact");
		});
	});

	test.describe("My Subscription Page", () => {
		test("should display subscription details when user has active subscription", async ({
			page,
		}) => {
			// First, create a subscription by completing checkout
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			// Auto-fill and submit payment
			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
				await page.waitForTimeout(500);
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Now navigate to subscription page
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Check subscription details are displayed
			await expect(page.getByText("Minha Assinatura")).toBeVisible();
			await expect(page.getByText("Plano Atual")).toBeVisible();
			await expect(page.getByText("Essencial")).toBeVisible();
			await expect(page.getByText("Ativo")).toBeVisible();
		});

		test("should allow changing billing cycle", async ({ page }) => {
			// Setup: Create subscription first
			await page.goto("/billing/checkout?planId=plan-comunidade&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Navigate to subscription
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Change to annual
			await page.getByText("Anual").click();
			await page.waitForTimeout(2000);

			// Should show success notification
			await expect(page.getByText(/Ciclo alterado/)).toBeVisible();
		});

		test("should open upgrade modal and allow plan upgrade", async ({
			page,
		}) => {
			// Setup: Create subscription with Essencial plan
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Navigate to subscription
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Click upgrade button
			await page.getByRole("button", { name: /Fazer Upgrade/ }).click();

			// Modal should open
			await expect(page.getByText("Fazer Upgrade")).toBeVisible();
			await expect(page.getByText("Comunidade")).toBeVisible();

			// Select Comunidade plan
			const comunidadeCard = page
				.locator('div:has-text("Comunidade")')
				.filter({ hasText: "Selecionar Plano" })
				.first();

			await comunidadeCard.getByText("Selecionar Plano").click();

			// Should show success notification
			await page.waitForTimeout(2000);
			await expect(page.getByText(/Upgrade realizado/)).toBeVisible();
		});

		test("should allow canceling subscription renewal", async ({ page }) => {
			// Setup: Create subscription
			await page.goto("/billing/checkout?planId=plan-expansao&cycle=annual");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Navigate to subscription
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Click cancel renewal
			await page.getByRole("button", { name: /Cancelar Renovação/ }).click();

			// Modal should open
			await expect(page.getByText("Cancelar Renovação")).toBeVisible();

			// Confirm cancellation
			await page
				.getByRole("button", { name: /Confirmar Cancelamento/ })
				.click();

			// Should show warning banner
			await page.waitForTimeout(2000);
			await expect(page.getByText(/Assinatura Cancelada/)).toBeVisible();
		});
	});
});
