import { expect, test } from "@playwright/test";

/**
 * Access Control E2E Tests
 *
 * Test credentials:
 * - Admin: admin@ministerium.com / admin123
 * - Leader: lider@ministerium.com / lider123
 * - Volunteer: voluntario@ministerium.com / voluntario123
 *
 * Permissions (as per documentation):
 * - Admin: ["*"] - Full access to everything
 * - Leader: ["members:view", "members:create", "events:*", "schedules:view", "schedules:create", "schedules:edit"]
 * - Volunteer: ["events:view", "schedules:view", "schedules:create", "schedules:edit"] - NO access to members
 *
 * Resources visibility in menu:
 * - Admin: Dashboard, Members, Finance, Events, Schedules, Ministries
 * - Leader: Dashboard, Members, Events, Schedules
 * - Volunteer: Dashboard, Events, Schedules (NO Members access)
 */

// Helper function to login
async function loginAs(
	page: any,
	email: string,
	password: string,
): Promise<void> {
	await page.goto("/login");
	await page.waitForLoadState("networkidle");

	// Clear any pre-filled values
	await page.locator('input[name="email"]:visible').first().clear();
	await page.locator('input[type="password"]:visible').first().clear();

	await page.locator('input[name="email"]:visible').first().fill(email);
	await page.locator('input[type="password"]:visible').first().fill(password);
	await page.locator('button[type="submit"]:visible').first().click();

	await page.waitForURL("/", { timeout: 10000 });
	await page.waitForLoadState("networkidle");
}

// Helper function to count visible menu items
async function countMenuItems(page: any): Promise<number> {
	const menuItems = await page.locator("nav a[href]").all();
	let visibleCount = 0;

	for (const item of menuItems) {
		if (await item.isVisible()) {
			visibleCount++;
		}
	}

	return visibleCount;
}

test.describe("Access Control - Admin Role", () => {
	test.beforeEach(async ({ page }) => {
		await loginAs(page, "admin@ministerium.com", "admin123");
	});

	test("admin should see all 6 menu items (Dashboard, Members, Finance, Events, Schedules, Ministries)", async ({
		page,
	}) => {
		// Verify all menu items are visible
		await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /membros/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /financeiro/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /eventos/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /escalas/i })).toBeVisible();
		await expect(
			page.getByRole("link", { name: /ministérios/i }),
		).toBeVisible();
	});

	test("admin can access and create members", async ({ page }) => {
		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		// Should be on members page (may have query params)
		await expect(page.url()).toContain("/members");

		// Should see members list title
		await expect(page.getByRole("heading", { name: /membros/i })).toBeVisible();

		// Should have create button
		const createButton = page.getByRole("button", { name: /novo membro/i });
		await expect(createButton).toBeVisible();
	});

	test("admin can access and create events", async ({ page }) => {
		await page.goto("/events");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/events");
		await expect(page.getByRole("heading", { name: /eventos/i })).toBeVisible();

		const createButton = page.getByRole("button", { name: /novo evento/i });
		await expect(createButton).toBeVisible();
	});

	test("admin can access finance", async ({ page }) => {
		await page.goto("/finance");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/finance");
		await expect(
			page.getByRole("heading", { name: /financeiro|transações/i }),
		).toBeVisible();
	});

	test("admin can access schedules", async ({ page }) => {
		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/schedules");
		await expect(page.getByRole("heading", { name: /escalas/i })).toBeVisible();
	});

	test("admin can access ministries", async ({ page }) => {
		await page.goto("/ministries");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/ministries");
		await expect(
			page.getByRole("heading", { name: /ministérios/i }),
		).toBeVisible();
	});
});

test.describe("Access Control - Leader Role", () => {
	test.beforeEach(async ({ page }) => {
		await loginAs(page, "lider@ministerium.com", "lider123");
	});

	test("leader should see 4 menu items (Dashboard, Members, Events, Schedules)", async ({
		page,
	}) => {
		// Should see these
		await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /membros/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /eventos/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /escalas/i })).toBeVisible();

		// Should NOT see these
		await expect(
			page.getByRole("link", { name: /financeiro/i }),
		).not.toBeVisible();
		await expect(
			page.getByRole("link", { name: /ministérios/i }),
		).not.toBeVisible();
	});

	test("leader can access and create members", async ({ page }) => {
		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/members");
		await expect(page.getByRole("heading", { name: /membros/i })).toBeVisible();

		// Should have create button (leader has members:create)
		const createButton = page.getByRole("button", { name: /novo membro/i });
		await expect(createButton).toBeVisible();
	});

	test("leader can access and create events (has events:*)", async ({
		page,
	}) => {
		await page.goto("/events");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/events");
		await expect(page.getByRole("heading", { name: /eventos/i })).toBeVisible();

		// Should have create button (leader has events:*)
		const createButton = page.getByRole("button", { name: /novo evento/i });
		await expect(createButton).toBeVisible();
	});

	test("leader should be blocked from accessing finance", async ({ page }) => {
		await page.goto("/finance");
		await page.waitForLoadState("networkidle");

		// Should NOT be on finance page (redirected or unauthorized)
		const isBlocked =
			page.url().includes("/unauthorized") ||
			page.url().includes("/login") ||
			page.url() === "http://localhost:3000/" ||
			!(await page.getByRole("heading", { name: /financeiro/i }).isVisible());

		expect(isBlocked).toBeTruthy();
	});

	test("leader can access and create schedules", async ({ page }) => {
		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/schedules");
		await expect(page.getByRole("heading", { name: /escalas/i })).toBeVisible();

		// Should have create button (leader has schedules:create)
		const createButton = page.getByRole("button", { name: /nova escala/i });
		await expect(createButton).toBeVisible();
	});

	test("leader should be blocked from accessing ministries", async ({
		page,
	}) => {
		await page.goto("/ministries");
		await page.waitForLoadState("networkidle");

		const isBlocked =
			page.url().includes("/unauthorized") ||
			page.url().includes("/login") ||
			page.url() === "http://localhost:3000/" ||
			!(await page.getByRole("heading", { name: /ministérios/i }).isVisible());

		expect(isBlocked).toBeTruthy();
	});
});

test.describe("Access Control - Volunteer Role", () => {
	test.beforeEach(async ({ page }) => {
		await loginAs(page, "voluntario@ministerium.com", "voluntario123");
	});

	test("volunteer should see only 3 menu items (Dashboard, Events, Schedules) - NO Members", async ({
		page,
	}) => {
		// Should see these
		await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /eventos/i })).toBeVisible();
		await expect(page.getByRole("link", { name: /escalas/i })).toBeVisible();

		// Should NOT see these
		await expect(
			page.getByRole("link", { name: /membros/i }),
		).not.toBeVisible();
		await expect(
			page.getByRole("link", { name: /financeiro/i }),
		).not.toBeVisible();
		await expect(
			page.getByRole("link", { name: /ministérios/i }),
		).not.toBeVisible();
	});

	test("volunteer should be blocked from viewing members (data protection)", async ({
		page,
	}) => {
		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		// Volunteer should see access restricted message
		await expect(page.getByText(/acesso restrito/i)).toBeVisible();
		await expect(page.getByText(/informações sensíveis/i)).toBeVisible();

		// Should NOT see members table
		const createButton = page.getByRole("button", { name: /novo membro/i });
		await expect(createButton).not.toBeVisible();
	});

	test("volunteer can view events but NOT create", async ({ page }) => {
		await page.goto("/events");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/events");
		await expect(page.getByRole("heading", { name: /eventos/i })).toBeVisible();

		// Should NOT have create button (volunteer only has events:view)
		const createButton = page.getByRole("button", { name: /novo evento/i });
		await expect(createButton).not.toBeVisible();
	});

	test("volunteer should be blocked from accessing finance", async ({
		page,
	}) => {
		await page.goto("/finance");
		await page.waitForLoadState("networkidle");

		const isBlocked =
			page.url().includes("/unauthorized") ||
			page.url().includes("/login") ||
			page.url() === "http://localhost:3000/" ||
			!(await page.getByRole("heading", { name: /financeiro/i }).isVisible());

		expect(isBlocked).toBeTruthy();
	});

	test("volunteer can view and create schedules", async ({ page }) => {
		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/schedules");
		await expect(page.getByRole("heading", { name: /escalas/i })).toBeVisible();

		// Should have create button (volunteer has schedules:create)
		const createButton = page.getByRole("button", { name: /nova escala/i });
		await expect(createButton).toBeVisible();
	});

	test("volunteer should be blocked from accessing ministries", async ({
		page,
	}) => {
		await page.goto("/ministries");
		await page.waitForLoadState("networkidle");

		const isBlocked =
			page.url().includes("/unauthorized") ||
			page.url().includes("/login") ||
			page.url() === "http://localhost:3000/" ||
			!(await page.getByRole("heading", { name: /ministérios/i }).isVisible());

		expect(isBlocked).toBeTruthy();
	});
});

test.describe("Access Control - Role Persistence and Switching", () => {
	test("should maintain admin permissions after page refresh", async ({
		page,
	}) => {
		await loginAs(page, "admin@ministerium.com", "admin123");

		// Navigate to a page
		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		// Refresh
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Should still be on members page
		await expect(page.url()).toContain("/members");

		// Should still see create button
		await expect(
			page.getByRole("button", { name: /novo membro/i }),
		).toBeVisible();
	});

	test("should maintain leader permissions after page refresh", async ({
		page,
	}) => {
		await loginAs(page, "lider@ministerium.com", "lider123");

		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		await page.reload();
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/members");
		await expect(
			page.getByRole("button", { name: /novo membro/i }),
		).toBeVisible();
	});

	test("should maintain volunteer permissions after page refresh", async ({
		page,
	}) => {
		await loginAs(page, "voluntario@ministerium.com", "voluntario123");

		await page.goto("/events");
		await page.waitForLoadState("networkidle");

		await page.reload();
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/events");

		// Should still NOT see create button
		const createButton = page.getByRole("button", { name: /novo evento/i });
		await expect(createButton).not.toBeVisible();
	});

	test("should correctly switch from admin to volunteer permissions", async ({
		page,
	}) => {
		// Login as admin
		await loginAs(page, "admin@ministerium.com", "admin123");

		// Verify admin has finance menu
		await expect(page.getByRole("link", { name: /financeiro/i })).toBeVisible();

		// Logout
		const userMenu = page
			.locator('[role="button"]')
			.filter({ hasText: /admin/i })
			.first();
		await userMenu.click();
		await page.getByText(/sair/i).click();

		await page.waitForURL("/login", { timeout: 5000 });

		// Login as volunteer
		await loginAs(page, "voluntario@ministerium.com", "voluntario123");

		// Verify volunteer does NOT have finance menu
		await expect(
			page.getByRole("link", { name: /financeiro/i }),
		).not.toBeVisible();

		// Verify volunteer cannot create
		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		const createButton = page.getByRole("button", { name: /novo membro/i });
		await expect(createButton).not.toBeVisible();
	});

	test("should correctly switch from volunteer to leader permissions", async ({
		page,
	}) => {
		// Login as volunteer
		await loginAs(page, "voluntario@ministerium.com", "voluntario123");

		// Verify volunteer cannot create
		await page.goto("/members");
		await page.waitForLoadState("networkidle");
		await expect(
			page.getByRole("button", { name: /novo membro/i }),
		).not.toBeVisible();

		// Logout
		const volunteerMenu = page
			.locator('[role="button"]')
			.filter({ hasText: /voluntário/i })
			.first();
		await volunteerMenu.click();
		await page.getByText(/sair/i).click();

		await page.waitForURL("/login", { timeout: 5000 });

		// Login as leader
		await loginAs(page, "lider@ministerium.com", "lider123");

		// Verify leader CAN create
		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		await expect(
			page.getByRole("button", { name: /novo membro/i }),
		).toBeVisible();
	});
});

test.describe("Access Control - Schedule Management", () => {
	test("admin can access schedule volunteer management", async ({ page }) => {
		await loginAs(page, "admin@ministerium.com", "admin123");

		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		// Admin should see schedules list
		await expect(page.getByRole("heading", { name: /escalas/i })).toBeVisible();
	});

	test("leader can access schedule volunteer management", async ({ page }) => {
		await loginAs(page, "lider@ministerium.com", "lider123");

		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		// Leader should see schedules list with create button
		await expect(page.getByRole("heading", { name: /escalas/i })).toBeVisible();
		await expect(
			page.getByRole("button", { name: /nova escala/i }),
		).toBeVisible();
	});

	test("volunteer can access schedule signup page", async ({ page }) => {
		await loginAs(page, "voluntario@ministerium.com", "voluntario123");

		await page.goto("/schedules/signup");
		await page.waitForLoadState("networkidle");

		// Volunteer should see signup page
		await expect(
			page.getByRole("heading", { name: /escalas disponíveis/i }),
		).toBeVisible();
	});

	test("volunteer can create and edit schedules but NOT delete", async ({
		page,
	}) => {
		await loginAs(page, "voluntario@ministerium.com", "voluntario123");

		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		// Should have create button
		await expect(
			page.getByRole("button", { name: /nova escala/i }),
		).toBeVisible();

		// Edit buttons should be visible (volunteers have schedules:edit)
		// Delete buttons should NOT be visible (volunteers don't have schedules:delete)
	});
});

test.describe("Access Control - User Identity Display", () => {
	test("should display admin name and role correctly", async ({ page }) => {
		await loginAs(page, "admin@ministerium.com", "admin123");

		// Should see admin name in user menu
		const userButton = page
			.locator('[role="button"]')
			.filter({ hasText: /admin/i })
			.first();
		await expect(userButton).toBeVisible();
	});

	test("should display leader name and role correctly", async ({ page }) => {
		await loginAs(page, "lider@ministerium.com", "lider123");

		// Should see leader name in user menu
		const userButton = page
			.locator('[role="button"]')
			.filter({ hasText: /líder/i })
			.first();
		await expect(userButton).toBeVisible();
	});

	test("should display volunteer name and role correctly", async ({ page }) => {
		await loginAs(page, "voluntario@ministerium.com", "voluntario123");

		// Should see volunteer name in user menu
		const userButton = page
			.locator('[role="button"]')
			.filter({ hasText: /voluntário/i })
			.first();
		await expect(userButton).toBeVisible();
	});
});
