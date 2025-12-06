import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/**
 * Test to verify edit forms load data correctly
 */

// Helper function to login
async function loginAs(
	page: Page,
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

test.describe("Edit Forms - Data Loading Verification", () => {
	test.beforeEach(async ({ page }) => {
		await loginAs(page, "admin@ministerium.com", "admin123");
	});

	test("Event edit form should load and display data", async ({ page }) => {
		// Navigate directly to edit page
		await page.goto("/events/edit/event-1");
		await page.waitForLoadState("networkidle");

		// Wait for form to load
		await page.waitForSelector('input[name="title"]', { timeout: 10000 });

		// Check if title input has value
		const titleInput = page.locator('input[name="title"]');
		const titleValue = await titleInput.inputValue();

		// Verify data is loaded
		expect(titleValue).toBeTruthy();
		expect(titleValue.length).toBeGreaterThan(0);
	});

	test("Member edit form should load and display data", async ({ page }) => {
		// Navigate directly to edit page
		await page.goto("/members/edit/member-1");
		await page.waitForLoadState("networkidle");

		// Wait for form to load
		await page.waitForSelector('input[name="name"]', { timeout: 10000 });

		// Check if name input has value
		const nameInput = page.locator('input[name="name"]');
		const nameValue = await nameInput.inputValue();

		// Verify data is loaded
		expect(nameValue).toBeTruthy();
		expect(nameValue.length).toBeGreaterThan(0);
	});

	test("Transaction edit form should load and display data", async ({
		page,
	}) => {
		// Navigate directly to edit page
		await page.goto("/finance/edit/transaction-1");
		await page.waitForLoadState("networkidle");

		// Wait for form to load
		await page.waitForSelector('textarea[name="description"]', {
			timeout: 10000,
		});

		// Check if description textarea has value
		const descriptionInput = page.locator('textarea[name="description"]');
		const descriptionValue = await descriptionInput.inputValue();

		// Verify data is loaded
		expect(descriptionValue).toBeTruthy();
		expect(descriptionValue.length).toBeGreaterThan(0);
	});

	test("Ministry edit form should load and display data", async ({ page }) => {
		// Navigate directly to edit page
		await page.goto("/ministries/edit/ministry-1");
		await page.waitForLoadState("networkidle");

		// Wait for form to load
		await page.waitForSelector('input[name="name"]', { timeout: 10000 });

		// Check if name input has value
		const nameInput = page.locator('input[name="name"]');
		const nameValue = await nameInput.inputValue();

		// Verify data is loaded
		expect(nameValue).toBeTruthy();
		expect(nameValue.length).toBeGreaterThan(0);
	});

	test("Schedule edit form should load and display data", async ({ page }) => {
		// Navigate directly to edit page
		await page.goto("/schedules/edit/schedule-1");
		await page.waitForLoadState("networkidle");

		// Wait for form to load
		await page.waitForSelector('input[name="title"]', { timeout: 10000 });

		// Check if title input has value
		const titleInput = page.locator('input[name="title"]');
		const titleValue = await titleInput.inputValue();

		// Verify data is loaded
		expect(titleValue).toBeTruthy();
		expect(titleValue.length).toBeGreaterThan(0);
	});
});
