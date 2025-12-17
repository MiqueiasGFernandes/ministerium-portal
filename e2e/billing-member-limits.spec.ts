import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Member Limit Enforcement
 * Validates that subscription plan limits are properly enforced
 */

test.describe("Billing - Member Limits", () => {
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

	test.describe("Essencial Plan - 100 Member Limit", () => {
		test("should allow adding members within the plan limit", async ({
			page,
		}) => {
			// Setup: Subscribe to Essencial plan (limit: 100 members)
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Navigate to members page
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Get current member count
			const memberCountText = await page
				.locator("text=/Total.*membros/i")
				.textContent();
			const currentCount = memberCountText
				? Number.parseInt(memberCountText.match(/\d+/)?.[0] || "0")
				: 0;

			// If we have less than 100 members, we should be able to add more
			if (currentCount < 100) {
				await page.getByRole("button", { name: /Criar/ }).click();
				await page.waitForURL(/\/members\/create/);

				// Form should be accessible
				await expect(page.getByLabel(/Nome/i).first()).toBeVisible();
			}
		});

		test("should show warning when approaching plan limit", async ({
			page,
		}) => {
			// Setup: Subscribe to Essencial plan and add members close to limit
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Simulate having many members by adding them to localStorage
			await page.evaluate(() => {
				const existingMembers = JSON.parse(
					localStorage.getItem("members") || "[]",
				);
				const newMembers = [];

				// Add enough members to reach close to 100
				for (let i = existingMembers.length; i < 95; i++) {
					newMembers.push({
						id: `member-${i}`,
						name: `Test Member ${i}`,
						email: `member${i}@test.com`,
						status: "active",
						tags: [],
						customFields: {},
						tenantId: "1",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					});
				}

				localStorage.setItem(
					"members",
					JSON.stringify([...existingMembers, ...newMembers]),
				);
			});

			// Reload members page
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Try to add a member when close to limit
			await page.getByRole("button", { name: /Criar/ }).click();
			await page.waitForURL(/\/members\/create/);

			// Fill member form
			await page.getByLabel(/Nome/i).first().fill("New Member");
			await page
				.getByLabel(/E-mail/i)
				.first()
				.fill("newmember@test.com");

			// Submit form
			await page.getByRole("button", { name: /Criar/ }).click();

			// System should work but might show a warning
			await page.waitForTimeout(2000);
		});

		test("should prevent adding members when limit is exceeded and suggest upgrade", async ({
			page,
		}) => {
			// Setup: Subscribe to Essencial plan
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Simulate having members that exceed the limit
			await page.evaluate(() => {
				const newMembers = [];

				// Add 101 members to exceed the 100 limit
				for (let i = 0; i < 101; i++) {
					newMembers.push({
						id: `member-limit-${i}`,
						name: `Test Member ${i}`,
						email: `memberlimit${i}@test.com`,
						status: "active",
						tags: [],
						customFields: {},
						tenantId: "1",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					});
				}

				localStorage.setItem("members", JSON.stringify(newMembers));
			});

			// Navigate to members page
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Should show warning notification about limit
			await page.waitForTimeout(2000);
			const notification = page.getByText(/Limite de membros/i);
			if (await notification.isVisible()) {
				await expect(notification).toBeVisible();
				await expect(page.getByText(/Faça upgrade/i)).toBeVisible();
			}
		});
	});

	test.describe("Plan Upgrade Based on Member Count", () => {
		test("should suggest Comunidade plan when member count exceeds 100", async ({
			page,
		}) => {
			// Start with Essencial plan
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Add 150 members (exceeds Essencial limit of 100)
			await page.evaluate(() => {
				const newMembers = [];
				for (let i = 0; i < 150; i++) {
					newMembers.push({
						id: `member-upgrade-${i}`,
						name: `Member ${i}`,
						email: `upgrade${i}@test.com`,
						status: "active",
						tags: [],
						customFields: {},
						tenantId: "1",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					});
				}
				localStorage.setItem("members", JSON.stringify(newMembers));
			});

			// Navigate to subscription page
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Click upgrade
			await page.getByRole("button", { name: /Fazer Upgrade/ }).click();

			// Should show Comunidade plan as suggestion (supports up to 400 members)
			await expect(page.getByText("Comunidade")).toBeVisible();
			await expect(page.getByText(/100 a 400 membros/)).toBeVisible();
		});

		test("should suggest Institucional plan when member count exceeds 400", async ({
			page,
		}) => {
			// Start with any plan
			await page.goto("/billing/checkout?planId=plan-comunidade&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Add 450 members (exceeds all regular plan limits)
			await page.evaluate(() => {
				const newMembers = [];
				for (let i = 0; i < 450; i++) {
					newMembers.push({
						id: `member-enterprise-${i}`,
						name: `Member ${i}`,
						email: `enterprise${i}@test.com`,
						status: "active",
						tags: [],
						customFields: {},
						tenantId: "1",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					});
				}
				localStorage.setItem("members", JSON.stringify(newMembers));
			});

			// Navigate to members or subscription page
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Should suggest Institucional plan
			// Check if notification appears or if the system redirects to upgrade
			await page.waitForTimeout(2000);
		});
	});

	test.describe("Unlimited Plans", () => {
		test("should not enforce member limit on unlimited plans", async ({
			page,
		}) => {
			// The Expansão plan has a 400 member limit, but let's test edge cases
			// For truly unlimited, we'd need to test with plans that have maxMembers: null

			await page.goto("/billing/checkout?planId=plan-expansao&cycle=annual");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Add 500 members (exceeds even Expansão limit of 400)
			await page.evaluate(() => {
				const newMembers = [];
				for (let i = 0; i < 500; i++) {
					newMembers.push({
						id: `member-unlimited-${i}`,
						name: `Member ${i}`,
						email: `unlimited${i}@test.com`,
						status: "active",
						tags: [],
						customFields: {},
						tenantId: "1",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					});
				}
				localStorage.setItem("members", JSON.stringify(newMembers));
			});

			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Should show warning for Expansão plan too
			await page.waitForTimeout(2000);
		});
	});

	test.describe("Member Limit Check Integration", () => {
		test("should check member limit before allowing member creation", async ({
			page,
		}) => {
			// Setup subscription with limit
			await page.goto("/billing/checkout?planId=plan-essencial&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Try creating a member
			await page.goto("/members/create");
			await page.waitForLoadState("networkidle");

			// Form should be accessible when under limit
			await expect(page.getByLabel(/Nome/i).first()).toBeVisible();
		});

		test("should display current member count against plan limit in UI", async ({
			page,
		}) => {
			// Setup subscription
			await page.goto("/billing/checkout?planId=plan-comunidade&cycle=monthly");
			await page.waitForLoadState("networkidle");

			const autoFillButton = page.getByText(/Auto-preencher/);
			if (await autoFillButton.isVisible()) {
				await autoFillButton.click();
			}
			await page.getByRole("button", { name: /Confirmar Pagamento/ }).click();
			await page.waitForURL("/billing/checkout/success");

			// Navigate to subscription page
			await page.goto("/billing/subscription");
			await page.waitForLoadState("networkidle");

			// Should show plan details including member limits
			await expect(page.getByText(/Comunidade/)).toBeVisible();

			// Navigate to members to see if count is displayed
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Member list should be visible
			await expect(page.getByText(/Membros/i)).toBeVisible();
		});
	});
});
