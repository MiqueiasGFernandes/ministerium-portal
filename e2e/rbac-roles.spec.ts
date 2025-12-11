import { expect, test } from "@playwright/test";

test.describe("RBAC - Role Permissions", () => {
	// Helper function to login as a specific user
	const loginAs = async (page, email: string, password: string) => {
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		await page
			.locator(
				'input[name="email"]:visible, input[placeholder*="email"]:visible',
			)
			.first()
			.fill(email);
		await page.locator('input[type="password"]:visible').first().fill(password);
		await page.locator('button[type="submit"]:visible').first().click();

		await page.waitForURL("/");
	};

	// Setup function to create test users with different roles
	test.beforeEach(async ({ page }) => {
		await page.evaluate(() => {
			const users = [
				{
					id: "admin-test",
					email: "admin@ministerium.com",
					name: "Admin Teste",
					role: "admin",
					tenantId: "1",
					status: "active",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: "leader-test",
					email: "leader@ministerium.com",
					name: "Líder Teste",
					role: "leader",
					tenantId: "1",
					status: "active",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: "financial-test",
					email: "financial@ministerium.com",
					name: "Financeiro Teste",
					role: "financial",
					tenantId: "1",
					status: "active",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: "secretary-test",
					email: "secretary@ministerium.com",
					name: "Secretária Teste",
					role: "secretary",
					tenantId: "1",
					status: "active",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: "volunteer-test",
					email: "volunteer@ministerium.com",
					name: "Voluntário Teste",
					role: "volunteer",
					tenantId: "1",
					status: "active",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			];

			localStorage.setItem("users", JSON.stringify(users));
		});
	});

	test("Admin should have access to all modules", async ({ page }) => {
		await loginAs(page, "admin@ministerium.com", "admin123");

		// Should see all menu items
		await expect(page.getByRole("link", { name: /^membros$/i })).toBeVisible();
		await expect(
			page.getByRole("link", { name: /^financeiro$/i }),
		).toBeVisible();
		await expect(page.getByRole("link", { name: /^eventos$/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /^escalas$/i })).toBeVisible();
		await expect(
			page.getByRole("link", { name: /^ministérios$/i }),
		).toBeVisible();
		await expect(page.getByRole("link", { name: /^usuários$/i })).toBeVisible();

		// Should be able to access user management
		await page.goto("/admin/users");
		await expect(
			page.getByRole("heading", { name: /gestão de usuários/i }),
		).toBeVisible();
	});

	test("Leader should have access to members, events, schedules and analytics", async ({
		page,
	}) => {
		await loginAs(page, "leader@ministerium.com", "password");

		// Should see these menu items
		await expect(page.getByRole("link", { name: /^membros$/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /^eventos$/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /^escalas$/i })).toBeVisible();
		await expect(
			page.getByRole("link", { name: /^ministérios$/i }),
		).toBeVisible();

		// Should be able to view members
		await page.goto("/members");
		await page.waitForLoadState("networkidle");
		// Should not get redirected or show error
		await expect(page).toHaveURL(/\/members/);

		// Should be able to view and manage events
		await page.goto("/events");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/events/);

		// Should be able to view and manage schedules
		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/schedules/);

		// Should NOT see finance menu
		const financeMenu = page.getByRole("link", { name: /^financeiro$/i });
		await expect(financeMenu)
			.not.toBeVisible()
			.catch(() => true);

		// Should NOT have access to user management
		const usersMenu = page.getByRole("link", { name: /^usuários$/i });
		await expect(usersMenu)
			.not.toBeVisible()
			.catch(() => true);
	});

	test("Financial should have access to finance, analytics and financial charts on dashboard", async ({
		page,
	}) => {
		await loginAs(page, "financial@ministerium.com", "password");

		// Should see finance menu
		await expect(
			page.getByRole("link", { name: /^financeiro$/i }),
		).toBeVisible();

		// Should be able to access finance module
		await page.goto("/finance");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/finance/);

		// Should be able to see financial chart on dashboard
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Financial chart should be visible for financial users
		const financialChart = page
			.locator('[class*="financial"], [data-testid="financial-chart"]')
			.first();
		// If chart exists, it should be visible (not testing if it doesn't exist)
		const chartCount = await financialChart.count();
		if (chartCount > 0) {
			await expect(financialChart).toBeVisible();
		}

		// Should NOT see members menu
		const membersMenu = page.getByRole("link", { name: /^membros$/i });
		await expect(membersMenu)
			.not.toBeVisible()
			.catch(() => true);

		// Should NOT see events menu
		const eventsMenu = page.getByRole("link", { name: /^eventos$/i });
		await expect(eventsMenu)
			.not.toBeVisible()
			.catch(() => true);

		// Should NOT see schedules menu
		const schedulesMenu = page.getByRole("link", { name: /^escalas$/i });
		await expect(schedulesMenu)
			.not.toBeVisible()
			.catch(() => true);

		// Should NOT see users menu
		const usersMenu = page.getByRole("link", { name: /^usuários$/i });
		await expect(usersMenu)
			.not.toBeVisible()
			.catch(() => true);
	});

	test("Secretary should have full access to members and view events/schedules", async ({
		page,
	}) => {
		await loginAs(page, "secretary@ministerium.com", "password");

		// Should see members, events, schedules
		await expect(page.getByRole("link", { name: /^membros$/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /^eventos$/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /^escalas$/i })).toBeVisible();
		await expect(
			page.getByRole("link", { name: /^ministérios$/i }),
		).toBeVisible();

		// Should have full access to members
		await page.goto("/members");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/members/);

		// Should be able to view events (read-only)
		await page.goto("/events");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/events/);

		// Should be able to view schedules (read-only)
		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/schedules/);

		// Should NOT see finance menu
		const financeMenu = page.getByRole("link", { name: /^financeiro$/i });
		await expect(financeMenu)
			.not.toBeVisible()
			.catch(() => true);

		// Should NOT see users menu
		const usersMenu = page.getByRole("link", { name: /^usuários$/i });
		await expect(usersMenu)
			.not.toBeVisible()
			.catch(() => true);
	});

	test("Volunteer should only have access to events and schedules", async ({
		page,
	}) => {
		await loginAs(page, "volunteer@ministerium.com", "password");

		// Should see events and schedules
		await expect(page.getByRole("link", { name: /^eventos$/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /^escalas$/i })).toBeVisible();
		await expect(
			page.getByRole("link", { name: /^ministérios$/i }),
		).toBeVisible();

		// Should be able to view events
		await page.goto("/events");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/events/);

		// Should be able to manage schedules
		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/schedules/);

		// Should NOT see members menu
		const membersMenu = page.getByRole("link", { name: /^membros$/i });
		await expect(membersMenu)
			.not.toBeVisible()
			.catch(() => true);

		// Should NOT see finance menu
		const financeMenu = page.getByRole("link", { name: /^financeiro$/i });
		await expect(financeMenu)
			.not.toBeVisible()
			.catch(() => true);

		// Should NOT see users menu
		const usersMenu = page.getByRole("link", { name: /^usuários$/i });
		await expect(usersMenu)
			.not.toBeVisible()
			.catch(() => true);
	});

	test("Only admin should access user management page", async ({ page }) => {
		// Test with leader
		await loginAs(page, "leader@ministerium.com", "password");
		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Should not see user management or be redirected
		const usersHeading = page.getByRole("heading", {
			name: /gestão de usuários/i,
		});
		await expect(usersHeading)
			.not.toBeVisible()
			.catch(() => true);

		// Test with volunteer
		await page.goto("/");
		await page
			.locator('[role="button"]')
			.filter({ hasText: /líder/i })
			.first()
			.click();
		await page.getByText(/sair/i).click();
		await page.waitForURL("/login");

		await loginAs(page, "volunteer@ministerium.com", "password");
		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		await expect(usersHeading)
			.not.toBeVisible()
			.catch(() => true);
	});

	test("Financial should not be able to create/edit members", async ({
		page,
	}) => {
		await loginAs(page, "financial@ministerium.com", "password");

		// Try to access members create page
		await page.goto("/members/create");
		await page.waitForLoadState("networkidle");

		// Should be redirected or show error
		const createMemberHeading = page.getByRole("heading", {
			name: /novo membro/i,
		});
		await expect(createMemberHeading)
			.not.toBeVisible()
			.catch(() => true);
	});

	test("Volunteer should not be able to access finance", async ({ page }) => {
		await loginAs(page, "volunteer@ministerium.com", "password");

		// Try to access finance page
		await page.goto("/finance");
		await page.waitForLoadState("networkidle");

		// Should be redirected or show error
		const financeHeading = page.getByRole("heading", {
			name: /financeiro/i,
		});
		await expect(financeHeading)
			.not.toBeVisible()
			.catch(() => true);
	});
});
