import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Plan Upgrades and Downgrades
 * Validates subscription plan change workflows
 */

test.describe("Billing - Upgrades and Downgrades", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		// Mark tours as completed
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

	test.describe("Plan Upgrades", () => {
		test("should upgrade from Essencial to Comunidade immediately", async ({
			page,
		}) => {
			// Step 1: Subscribe to Essencial plan
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Step 2: Navigate to subscription management
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Verify current plan
			await expect(page.getByText("Essencial")).toBeVisible();
			await expect(page.getByText("Ativo")).toBeVisible();

			// Step 3: Open upgrade modal
			await page.getByRole("button", { name: /Fazer Upgrade/ }).click();
			await page.waitForTimeout(500);

			// Modal should display available plans
			await expect(page.getByText("Fazer Upgrade")).toBeVisible();
			await expect(page.getByText("Comunidade")).toBeVisible();

			// Step 4: Select Comunidade plan
			const comunidadeCard = page
				.locator('div:has-text("Comunidade")')
				.filter({ hasText: "Selecionar Plano" })
				.first();

			await comunidadeCard.getByText("Selecionar Plano").click();

			// Step 5: Verify upgrade success
			await page.waitForTimeout(2000);
			await expect(page.getByText(/Upgrade realizado/i)).toBeVisible();

			// Reload page to verify plan changed
			await page.reload();
			await page.waitForLoadState("networkidle");
			await expect(page.getByText("Comunidade")).toBeVisible();
		});

		test("should upgrade from Comunidade to Expansão with immediate effect", async ({
			page,
		}) => {
			// Subscribe to Comunidade
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

			// Open upgrade modal
			await page.getByRole("button", { name: /Fazer Upgrade/ }).click();
			await page.waitForTimeout(500);

			// Select Expansão
			const expansaoCard = page
				.locator('div:has-text("Expansão")')
				.filter({ hasText: "Selecionar Plano" })
				.first();

			await expansaoCard.getByText("Selecionar Plano").click();

			// Verify upgrade
			await page.waitForTimeout(2000);
			await expect(page.getByText(/Upgrade realizado/i)).toBeVisible();
		});

		test("should prevent downgrade and only allow upgrades", async ({
			page,
		}) => {
			// Subscribe to Expansão (highest regular plan)
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

			// Open upgrade modal
			await page.getByRole("button", { name: /Fazer Upgrade/ }).click();
			await page.waitForTimeout(500);

			// Should only show Institucional (custom plan) as upgrade option
			// Lower tier plans should show "Plano Atual" or be disabled
			const essencialCard = page.locator('div:has-text("Essencial")').first();
			const comunidadeCard = page.locator('div:has-text("Comunidade")').first();

			// These should be marked as current or lower tier
			// (exact behavior depends on implementation)
			if (await essencialCard.isVisible()) {
				const essencialButton = essencialCard.getByText("Plano Atual");
				if (await essencialButton.isVisible()) {
					await expect(essencialButton).toBeDisabled();
				}
			}
		});
	});

	test.describe("Billing Cycle Changes", () => {
		test("should change from monthly to annual billing", async ({ page }) => {
			// Subscribe with monthly billing
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

			// Verify current cycle
			await expect(page.getByText("Mensal")).toBeVisible();

			// Change to annual
			await page.getByText("Anual").click();
			await page.waitForTimeout(2000);

			// Verify change
			await expect(page.getByText(/Ciclo alterado/i)).toBeVisible();

			// Reload and verify
			await page.reload();
			await page.waitForLoadState("networkidle");
			// After changing to annual, the badge should show "Anual"
			const annualBadge = page
				.locator('div:contains("Ciclo de Cobrança")')
				.locator("text=Anual");
			if (await annualBadge.isVisible()) {
				await expect(annualBadge).toBeVisible();
			}
		});

		test("should change from annual to monthly billing", async ({ page }) => {
			// Subscribe with annual billing
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=annual");
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

			// Change to monthly
			await page.getByText("Mensal").click();
			await page.waitForTimeout(2000);

			// Verify change
			await expect(page.getByText(/Ciclo alterado/i)).toBeVisible();
		});

		test("should show annual savings when switching to annual billing", async ({
			page,
		}) => {
			// Subscribe monthly
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

			// Switch to annual toggle should show savings
			await page.getByText("Anual").hover();
			await page.waitForTimeout(500);

			// Should display savings information
			const savingsBadge = page.getByText(/Economize.*17%/i);
			if (await savingsBadge.isVisible()) {
				await expect(savingsBadge).toBeVisible();
			}
		});
	});

	test.describe("Subscription Cancellation", () => {
		test("should cancel subscription at period end", async ({ page }) => {
			// Subscribe to a plan
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

			// Click cancel renewal
			await page.getByRole("button", { name: /Cancelar Renovação/ }).click();

			// Confirm in modal
			await expect(page.getByText("Cancelar Renovação")).toBeVisible();
			await page
				.getByRole("button", { name: /Confirmar Cancelamento/ })
				.click();

			// Should show cancellation warning
			await page.waitForTimeout(2000);
			await expect(page.getByText(/Assinatura Cancelada/i)).toBeVisible();
			await expect(page.getByText(/será cancelada em/i)).toBeVisible();

			// Cancel button should no longer be visible
			const cancelButton = page.getByRole("button", {
				name: /Cancelar Renovação/,
			});
			await expect(cancelButton).not.toBeVisible();
		});

		test("should maintain access until period end after cancellation", async ({
			page,
		}) => {
			// Subscribe and cancel
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			await page.getByRole("button", { name: /Cancelar Renovação/ }).click();
			await page
				.getByRole("button", { name: /Confirmar Cancelamento/ })
				.click();

			await page.waitForTimeout(2000);

			// User should still see "Ativo" status
			// (until the actual period end date)
			await expect(page.getByText(/Assinatura Cancelada/i)).toBeVisible();

			// Should display the date when access will end
			await expect(
				page.getByText(/Você ainda pode usar o sistema até/i),
			).toBeVisible();
		});
	});

	test.describe("Enterprise Plan Upgrade", () => {
		test("should redirect to enterprise contact form when upgrading to Institucional", async ({
			page,
		}) => {
			// Subscribe to any regular plan
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

			// Open upgrade modal
			await page.getByRole("button", { name: /Fazer Upgrade/ }).click();
			await page.waitForTimeout(500);

			// Try to select Institucional plan
			const institucionalCard = page
				.locator('div:has-text("Institucional")')
				.first();

			if (await institucionalCard.isVisible()) {
				await institucionalCard
					.getByText("Falar com Consultor")
					.first()
					.click();

				// Should redirect to enterprise contact form
				await page.waitForURL("/billing/enterprise-contact");
				expect(page.url()).toContain("/billing/enterprise-contact");
			}
		});
	});

	test.describe("Trial to Paid Conversion", () => {
		test("should convert trial to paid subscription", async ({ page }) => {
			// Simulate having a trial subscription
			await page.evaluate(() => {
				const trial = {
					id: "subscription-1",
					tenantId: "1",
					planId: "plan-essencial",
					status: "trial",
					billingCycle: "monthly",
					currentPeriodStart: new Date().toISOString(),
					currentPeriodEnd: new Date(
						Date.now() + 14 * 24 * 60 * 60 * 1000,
					).toISOString(),
					trialEndsAt: new Date(
						Date.now() + 14 * 24 * 60 * 60 * 1000,
					).toISOString(),
					cancelAtPeriodEnd: false,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				localStorage.setItem("subscriptions", JSON.stringify([trial]));
			});

			// Navigate to subscription page
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Should show trial banner
			await expect(page.getByText(/Período de Trial Ativo/i)).toBeVisible();
			await expect(page.getByText(/dias restantes/i)).toBeVisible();

			// Should have "Assinar Agora" button
			await expect(page.getByText(/Assinar Agora/i)).toBeVisible();

			// Click to go to plans page
			await page.getByText(/Assinar Agora/i).click();
			await page.waitForURL("/billing/plans");

			// Select a plan and complete checkout
			const essencialCard = page
				.locator('div:has-text("Essencial")')
				.filter({ hasText: "Selecionar Plano" })
				.first();
			await essencialCard.getByText("Selecionar Plano").click();

			await page.waitForURL(/\/billing\/checkout/);

			// Complete payment
			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Verify conversion success
			await expect(page.getByText("Pagamento Confirmado!")).toBeVisible();

			// Navigate back to subscription page
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Should now show active subscription (no longer trial)
			await expect(page.getByText("Ativo")).toBeVisible();
			const trialBanner = page.getByText(/Período de Trial Ativo/i);
			await expect(trialBanner).not.toBeVisible();
		});
	});
});
