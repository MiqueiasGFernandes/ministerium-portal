import { expect, test } from "@playwright/test";

test.describe("Member List - Pending Badge", () => {
	test.beforeEach(async ({ page }) => {
		// Login as admin
		await page.goto("/login");
		await page
			.getByPlaceholder("seu@email.com")
			.first()
			.fill("admin@example.com");
		await page.getByPlaceholder("sua senha").first().fill("password");
		await page.getByRole("button", { name: /entrar/i }).click();
		await page.waitForURL("/");
	});

	test("should show badge with count when there are pending registrations", async ({
		page,
	}) => {
		// Create a pending registration
		const registration = {
			id: "test-badge-1",
			name: "João Silva Badge Test",
			email: "joao.badge@example.com",
			phone: "11987654321",
			birthDate: new Date("1990-01-01").toISOString(),
			acceptedTerms: true,
			acceptedAt: new Date().toISOString(),
			status: "pending",
			tenantId: "1",
			registeredAt: new Date().toISOString(),
		};

		await page.evaluate((reg) => {
			localStorage.setItem("memberRegistrations", JSON.stringify([reg]));
		}, registration);

		// Refresh to load the count
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Navigate to members
		await page.getByRole("link", { name: /membros/i }).click();
		await page.waitForLoadState("networkidle");

		// Should show badge with count 1
		const button = page.getByRole("button", { name: /cadastros pendentes/i });
		await expect(button).toBeVisible();

		// Badge should be visible
		const badge = button.locator(".mantine-Badge");
		await expect(badge).toBeVisible();
		await expect(badge).toHaveText("1");
	});

	test("should NOT show badge when there are no pending registrations", async ({
		page,
	}) => {
		// Clear all registrations
		await page.evaluate(() => {
			localStorage.setItem("memberRegistrations", JSON.stringify([]));
		});

		// Refresh to load the count
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Navigate to members
		await page.getByRole("link", { name: /membros/i }).click();
		await page.waitForLoadState("networkidle");

		// Button should be visible
		const button = page.getByRole("button", { name: /cadastros pendentes/i });
		await expect(button).toBeVisible();

		// Badge should NOT be visible
		const badge = button.locator(".mantine-Badge");
		await expect(badge).not.toBeVisible();
	});

	test("should show correct count with multiple pending registrations", async ({
		page,
	}) => {
		// Create 3 pending registrations
		const registrations = [
			{
				id: "test-badge-1",
				name: "João 1",
				email: "joao1@example.com",
				phone: "11987654321",
				birthDate: new Date("1990-01-01").toISOString(),
				acceptedTerms: true,
				acceptedAt: new Date().toISOString(),
				status: "pending",
				tenantId: "1",
				registeredAt: new Date().toISOString(),
			},
			{
				id: "test-badge-2",
				name: "João 2",
				email: "joao2@example.com",
				phone: "11987654322",
				birthDate: new Date("1991-01-01").toISOString(),
				acceptedTerms: true,
				acceptedAt: new Date().toISOString(),
				status: "pending",
				tenantId: "1",
				registeredAt: new Date().toISOString(),
			},
			{
				id: "test-badge-3",
				name: "João 3",
				email: "joao3@example.com",
				phone: "11987654323",
				birthDate: new Date("1992-01-01").toISOString(),
				acceptedTerms: true,
				acceptedAt: new Date().toISOString(),
				status: "approved",
				tenantId: "1",
				registeredAt: new Date().toISOString(),
			},
		];

		await page.evaluate((regs) => {
			localStorage.setItem("memberRegistrations", JSON.stringify(regs));
		}, registrations);

		// Refresh to load the count
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Navigate to members
		await page.getByRole("link", { name: /membros/i }).click();
		await page.waitForLoadState("networkidle");

		// Should show badge with count 2 (only pending ones)
		const button = page.getByRole("button", { name: /cadastros pendentes/i });
		const badge = button.locator(".mantine-Badge");
		await expect(badge).toBeVisible();
		await expect(badge).toHaveText("2");
	});
});
