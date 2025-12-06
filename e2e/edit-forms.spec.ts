import { expect, test } from "@playwright/test";

/**
 * Edit Forms E2E Tests
 *
 * Tests to verify that edit forms load data correctly
 */

// Helper function to login
async function loginAs(
	page: any,
	email: string,
	password: string,
): Promise<void> {
	await page.goto("/login");
	await page.waitForLoadState("networkidle");

	await page.locator('input[name="email"]:visible').first().clear();
	await page.locator('input[type="password"]:visible').first().clear();

	await page.locator('input[name="email"]:visible').first().fill(email);
	await page.locator('input[type="password"]:visible').first().fill(password);
	await page.locator('button[type="submit"]:visible').first().click();

	await page.waitForURL("/", { timeout: 10000 });
	await page.waitForLoadState("networkidle");
}

test.describe("Edit Forms - Data Loading", () => {
	test.beforeEach(async ({ page }) => {
		await loginAs(page, "admin@ministerium.com", "admin123");
	});

	test("Event edit form should load existing data", async ({ page }) => {
		// Go to events list
		await page.goto("/events");
		await page.waitForLoadState("networkidle");

		// Click on first edit button
		const firstEditButton = page
			.locator('[title="Editar"], button:has-text("Editar")')
			.first();

		// Store the event title from the list
		const eventRow = page.locator("table tbody tr").first();
		const eventTitle = await eventRow.locator("td").nth(1).textContent();

		await firstEditButton.click();
		await page.waitForLoadState("networkidle");

		// Wait for form to load
		await page.waitForSelector('input[name="title"]', { timeout: 5000 });

		// Check if title input has value
		const titleInput = page.locator('input[name="title"]');
		const titleValue = await titleInput.inputValue();

		expect(titleValue).toBeTruthy();
		expect(titleValue.length).toBeGreaterThan(0);

		// Verify the title matches what we saw in the list (if available)
		if (eventTitle) {
			expect(titleValue).toBe(eventTitle.trim());
		}
	});

	test("Schedule edit form should load existing data", async ({ page }) => {
		// Go to schedules list
		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		// Click on first edit button
		const firstEditButton = page.locator('[title="Editar"]').first();

		await firstEditButton.click();
		await page.waitForLoadState("networkidle");

		// Wait for form to load
		await page.waitForSelector('input[name="title"]', { timeout: 5000 });

		// Check if title input has value
		const titleInput = page.locator('input[name="title"]');
		const titleValue = await titleInput.inputValue();

		expect(titleValue).toBeTruthy();
		expect(titleValue.length).toBeGreaterThan(0);
	});

	test("Member edit form should load existing data", async ({ page }) => {
		// Go to members list
		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		// Click on first edit button
		const firstEditButton = page
			.locator('[title="Editar"], button:has-text("Editar")')
			.first();

		await firstEditButton.click();
		await page.waitForLoadState("networkidle");

		// Wait for form to load
		await page.waitForSelector('input[name="name"]', { timeout: 5000 });

		// Check if name input has value
		const nameInput = page.locator('input[name="name"]');
		const nameValue = await nameInput.inputValue();

		expect(nameValue).toBeTruthy();
		expect(nameValue.length).toBeGreaterThan(0);
	});
});

test.describe("Edit Forms - Cancel Button", () => {
	test.beforeEach(async ({ page }) => {
		await loginAs(page, "admin@ministerium.com", "admin123");
	});

	test("Event edit form cancel button should navigate back to list", async ({
		page,
	}) => {
		await page.goto("/events");
		await page.waitForLoadState("networkidle");

		// Click on first edit button
		const firstEditButton = page.locator('[title="Editar"]').first();
		await firstEditButton.click();
		await page.waitForLoadState("networkidle");

		// Click cancel button
		const cancelButton = page.getByRole("button", { name: /cancelar/i });
		await cancelButton.click();
		await page.waitForLoadState("networkidle");

		// Should be back at events list
		await expect(page.url()).toContain("/events");
		await expect(page.getByRole("heading", { name: /eventos/i })).toBeVisible();
	});

	test("Schedule edit form cancel button should navigate back to list", async ({
		page,
	}) => {
		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		// Click on first edit button
		const firstEditButton = page.locator('[title="Editar"]').first();
		await firstEditButton.click();
		await page.waitForLoadState("networkidle");

		// Click cancel button
		const cancelButton = page.getByRole("button", { name: /cancelar/i });
		await cancelButton.click();
		await page.waitForLoadState("networkidle");

		// Should be back at schedules list
		await expect(page.url()).toContain("/schedules");
		await expect(page.getByRole("heading", { name: /escalas/i })).toBeVisible();
	});
});

test.describe("Schedule Features - Navigation", () => {
	test("Volunteer should see auto-signup button in schedules list", async ({
		page,
	}) => {
		await loginAs(page, "voluntario@ministerium.com", "voluntario123");

		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		// Should see auto-signup button
		const autoSignupButton = page.getByRole("button", {
			name: /auto-inscrição/i,
		});
		await expect(autoSignupButton).toBeVisible();

		// Click it and verify navigation
		await autoSignupButton.click();
		await page.waitForLoadState("networkidle");

		await expect(page.url()).toContain("/schedules/signup");
		await expect(
			page.getByRole("heading", { name: /escalas disponíveis/i }),
		).toBeVisible();
	});

	test("Admin should see manage volunteers button in schedules list", async ({
		page,
	}) => {
		await loginAs(page, "admin@ministerium.com", "admin123");

		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		// Should see manage volunteers button (icon button with title)
		const manageButton = page
			.locator('[title="Gerenciar Voluntários"]')
			.first();
		await expect(manageButton).toBeVisible();
	});

	test("Leader should see manage volunteers button in schedules list", async ({
		page,
	}) => {
		await loginAs(page, "lider@ministerium.com", "lider123");

		await page.goto("/schedules");
		await page.waitForLoadState("networkidle");

		// Should see manage volunteers button (icon button with title)
		const manageButton = page
			.locator('[title="Gerenciar Voluntários"]')
			.first();
		await expect(manageButton).toBeVisible();
	});
});
