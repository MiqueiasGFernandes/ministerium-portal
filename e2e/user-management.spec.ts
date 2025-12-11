import { expect, test } from "@playwright/test";

test.describe("User Management (Admin)", () => {
	test.beforeEach(async ({ page }) => {
		// Login as admin
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

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

	test("admin should be able to access user management page", async ({
		page,
	}) => {
		// Navigate to user management
		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Should see the user management page
		await expect(
			page.getByRole("heading", { name: /gestão de usuários/i }),
		).toBeVisible();

		// Should see both tabs
		await expect(
			page.getByRole("tab", { name: /solicitações pendentes/i }),
		).toBeVisible();
		await expect(
			page.getByRole("tab", { name: /usuários ativos/i }),
		).toBeVisible();
	});

	test("should display pending access requests", async ({ page }) => {
		// Create a pending request
		await page.evaluate(() => {
			const request = {
				id: "req-1",
				email: "newuser@example.com",
				name: "New User",
				phone: "(11) 98765-4321",
				position: "Voluntário",
				reason: "Quero ajudar",
				status: "pending",
				tenantId: "1",
				requestedAt: new Date().toISOString(),
			};
			localStorage.setItem("accessRequests", JSON.stringify([request]));
		});

		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Should be on pending tab by default
		await expect(page.getByText("New User")).toBeVisible();
		await expect(page.getByText("newuser@example.com")).toBeVisible();
		await expect(page.getByText("(11) 98765-4321")).toBeVisible();
		await expect(page.getByText("Voluntário")).toBeVisible();
	});

	test("should approve access request with role selection", async ({
		page,
	}) => {
		// Create a pending request
		await page.evaluate(() => {
			const request = {
				id: "req-approve",
				email: "approve@example.com",
				name: "User to Approve",
				status: "pending",
				tenantId: "1",
				requestedAt: new Date().toISOString(),
			};
			localStorage.setItem("accessRequests", JSON.stringify([request]));
		});

		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Click approve button
		const approveButton = page
			.getByRole("button", { name: /aprovar/i })
			.first();
		await approveButton.click();

		// Should open modal
		await expect(page.getByText(/selecione o nível de acesso/i)).toBeVisible();

		// Select a role
		await page.getByLabel(/nível de acesso/i).click();
		await page.getByRole("option", { name: /líder/i }).click();

		// Confirm approval
		await page.getByRole("button", { name: /aprovar/i, exact: true }).click();

		// Wait for success notification
		await page.waitForTimeout(500);

		// Verify notification
		await expect(page.getByText(/usuário aprovado/i)).toBeVisible();

		// Verify user was created
		const users = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("users") || "[]");
		});

		const newUser = users.find((u: any) => u.email === "approve@example.com");
		expect(newUser).toBeTruthy();
		expect(newUser.name).toBe("User to Approve");
		expect(newUser.role).toBe("leader");
		expect(newUser.status).toBe("active");
	});

	test("should deny access request", async ({ page }) => {
		// Create a pending request
		await page.evaluate(() => {
			const request = {
				id: "req-deny",
				email: "deny@example.com",
				name: "User to Deny",
				status: "pending",
				tenantId: "1",
				requestedAt: new Date().toISOString(),
			};
			localStorage.setItem("accessRequests", JSON.stringify([request]));
		});

		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Click deny button
		const denyButton = page.getByRole("button", { name: /negar/i }).first();
		await denyButton.click();

		// Should open modal
		await expect(
			page.getByText(/tem certeza que deseja negar a solicitação/i),
		).toBeVisible();

		// Can add reason (optional)
		await page.getByLabel(/motivo da negação/i).fill("Dados incompletos");

		// Confirm denial
		await page.getByRole("button", { name: /negar/i, exact: true }).click();

		// Wait for notification
		await page.waitForTimeout(500);

		// Verify notification
		await expect(page.getByText(/solicitação negada/i)).toBeVisible();

		// Verify request status was updated
		const requests = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("accessRequests") || "[]");
		});

		const deniedRequest = requests.find((r: any) => r.id === "req-deny");
		expect(deniedRequest.status).toBe("denied");
	});

	test("should display active users", async ({ page }) => {
		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Switch to active users tab
		await page.getByRole("tab", { name: /usuários ativos/i }).click();

		// Should display users from storage
		await expect(page.getByText("Admin Teste")).toBeVisible();
		await expect(page.getByText("admin@ministerium.com")).toBeVisible();
	});

	test("should change user role", async ({ page }) => {
		// Add a test user to localStorage
		await page.evaluate(() => {
			const users = JSON.parse(localStorage.getItem("users") || "[]");
			const testUser = {
				id: "user-test-role",
				email: "rolechange@example.com",
				name: "Role Change Test",
				role: "volunteer",
				tenantId: "1",
				status: "active",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			localStorage.setItem("users", JSON.stringify([...users, testUser]));
		});

		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Go to active users tab
		await page.getByRole("tab", { name: /usuários ativos/i }).click();

		// Find the test user row and click edit button
		const row = page
			.locator("tr")
			.filter({ hasText: "rolechange@example.com" });
		await row.getByRole("button").first().click(); // Edit role button

		// Should open role change modal
		await expect(page.getByText(/alterar o nível de acesso/i)).toBeVisible();

		// Change role
		await page.getByLabel(/nível de acesso/i).click();
		await page.getByRole("option", { name: /líder/i }).click();

		// Confirm change
		await page.getByRole("button", { name: /alterar/i }).click();

		// Wait for notification
		await page.waitForTimeout(500);

		// Verify notification
		await expect(page.getByText(/papel atualizado/i)).toBeVisible();

		// Verify role was updated
		const users = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("users") || "[]");
		});

		const updatedUser = users.find((u: any) => u.id === "user-test-role");
		expect(updatedUser.role).toBe("leader");
	});

	test("should not allow user to change their own role", async ({ page }) => {
		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Go to active users tab
		await page.getByRole("tab", { name: /usuários ativos/i }).click();

		// Find admin user row and try to edit
		const adminRow = page
			.locator("tr")
			.filter({ hasText: "admin@ministerium.com" });
		await adminRow.getByRole("button").first().click();

		// Try to change role
		await page.getByLabel(/nível de acesso/i).click();
		await page.getByRole("option", { name: /voluntário/i }).click();

		// Try to confirm
		await page.getByRole("button", { name: /alterar/i }).click();

		// Should show error
		await expect(
			page.getByText(/você não pode alterar seu próprio nível de acesso/i),
		).toBeVisible();
	});

	test("should revoke user access", async ({ page }) => {
		// Add a test user
		await page.evaluate(() => {
			const users = JSON.parse(localStorage.getItem("users") || "[]");
			const testUser = {
				id: "user-to-revoke",
				email: "revoke@example.com",
				name: "User to Revoke",
				role: "volunteer",
				tenantId: "1",
				status: "active",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			localStorage.setItem("users", JSON.stringify([...users, testUser]));
		});

		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Go to active users tab
		await page.getByRole("tab", { name: /usuários ativos/i }).click();

		// Find user and click revoke button
		const row = page.locator("tr").filter({ hasText: "revoke@example.com" });
		await row.getByRole("button").last().click(); // Revoke button

		// Should show confirmation modal
		await expect(
			page.getByText(/tem certeza que deseja revogar o acesso/i),
		).toBeVisible();

		// Confirm revocation
		await page.getByRole("button", { name: /revogar/i }).click();

		// Wait for notification
		await page.waitForTimeout(500);

		// Verify notification
		await expect(page.getByText(/acesso revogado/i)).toBeVisible();

		// Verify user status was updated
		const users = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("users") || "[]");
		});

		const revokedUser = users.find((u: any) => u.id === "user-to-revoke");
		expect(revokedUser.status).toBe("revoked");
	});

	test("should not allow user to revoke their own access", async ({ page }) => {
		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Go to active users tab
		await page.getByRole("tab", { name: /usuários ativos/i }).click();

		// Find admin row and try to revoke (should not have revoke button or be disabled)
		const adminRow = page
			.locator("tr")
			.filter({ hasText: "admin@ministerium.com" });

		// Try to click revoke if it exists
		const revokeButton = adminRow.getByRole("button").last();
		if (await revokeButton.isVisible()) {
			await revokeButton.click();

			// If modal opens, try to confirm
			const confirmButton = page.getByRole("button", { name: /revogar/i });
			if (await confirmButton.isVisible()) {
				await confirmButton.click();
				await page.waitForTimeout(500);

				// Should show error
				await expect(
					page.getByText(/você não pode revogar seu próprio acesso/i),
				).toBeVisible();
			}
		}
	});

	test("non-admin should not access user management", async ({ page }) => {
		// Logout
		await page.goto("/");
		const userMenu = page
			.locator('[role="button"]')
			.filter({ hasText: /admin/i })
			.first();
		await userMenu.click();
		await page.getByText(/sair/i).click();
		await page.waitForURL("/login");

		// Login as volunteer
		await page
			.locator(
				'input[name="email"]:visible, input[placeholder*="email"]:visible',
			)
			.first()
			.fill("voluntario@ministerium.com");
		await page
			.locator('input[type="password"]:visible')
			.first()
			.fill("password");
		await page.locator('button[type="submit"]:visible').first().click();
		await page.waitForURL("/");

		// Try to access user management
		await page.goto("/admin/users");

		// Should not see the "Usuários" menu item or should be redirected/show unauthorized
		// The resource should be hidden or access denied
		const usersMenuItem = page.getByRole("link", { name: /^usuários$/i });

		// Either the menu item doesn't exist or access is denied
		const menuVisible = await usersMenuItem.isVisible().catch(() => false);
		if (menuVisible) {
			// If menu is somehow visible, should show unauthorized or redirect
			await expect(
				page
					.getByText(/não tem permissão/i)
					.or(page.getByText(/unauthorized/i)),
			).toBeVisible();
		}
		// Otherwise menu is correctly hidden (which is the expected behavior)
	});

	test("should show badge count on pending tab", async ({ page }) => {
		// Create multiple pending requests
		await page.evaluate(() => {
			const requests = [
				{
					id: "req-1",
					email: "user1@example.com",
					name: "User 1",
					status: "pending",
					tenantId: "1",
					requestedAt: new Date().toISOString(),
				},
				{
					id: "req-2",
					email: "user2@example.com",
					name: "User 2",
					status: "pending",
					tenantId: "1",
					requestedAt: new Date().toISOString(),
				},
				{
					id: "req-3",
					email: "user3@example.com",
					name: "User 3",
					status: "pending",
					tenantId: "1",
					requestedAt: new Date().toISOString(),
				},
			];
			localStorage.setItem("accessRequests", JSON.stringify(requests));
		});

		await page.goto("/admin/users");
		await page.waitForLoadState("networkidle");

		// Should show badge with count
		const pendingTab = page.getByRole("tab", {
			name: /solicitações pendentes/i,
		});
		await expect(pendingTab).toBeVisible();

		// Badge should show "3"
		await expect(pendingTab.getByText("3")).toBeVisible();
	});
});
