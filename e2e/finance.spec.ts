import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Finance Domain
 * Following DDD (Domain-Driven Design) principles:
 * - Tests are organized around financial business capabilities
 * - Test names describe business behavior, not technical implementation
 * - Tests validate the complete financial workflow
 */

test.describe("Finance Domain", () => {
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

	test.describe("Transaction List Management", () => {
		test("should display transactions list with all required elements", async ({
			page,
		}) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			expect(page.url()).toContain("/finance");
			await expect(page.locator("table")).toBeVisible();

			// Verify table headers are present
			await expect(page.locator("th:has-text('Data')")).toBeVisible();
			await expect(page.locator("th:has-text('Tipo')")).toBeVisible();
			await expect(page.locator("th:has-text('Categoria')")).toBeVisible();
			await expect(page.locator("th:has-text('Descrição')")).toBeVisible();
			await expect(page.locator("th:has-text('Valor')")).toBeVisible();
		});

		test("admin should be able to sort transactions by date", async ({
			page,
		}) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			// Click on Data column header to sort ascending
			const dateHeader = page.locator("th:has-text('Data')");
			await dateHeader.click();

			// Wait for sort to apply
			await page.waitForTimeout(500);

			// Verify sort icon is present
			await expect(dateHeader.locator("svg")).toBeVisible();

			// Click again to sort descending
			await dateHeader.click();
			await page.waitForTimeout(500);

			// Verify sort icon changes
			await expect(dateHeader.locator("svg")).toBeVisible();
		});

		test("admin should be able to sort transactions by type", async ({
			page,
		}) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			// Click on Tipo column header
			const typeHeader = page.locator("th:has-text('Tipo')");
			await typeHeader.click();

			await page.waitForTimeout(500);
			await expect(typeHeader.locator("svg")).toBeVisible();
		});

		test("admin should be able to sort transactions by category", async ({
			page,
		}) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			// Click on Categoria column header
			const categoryHeader = page.locator("th:has-text('Categoria')");
			await categoryHeader.click();

			await page.waitForTimeout(500);
			await expect(categoryHeader.locator("svg")).toBeVisible();
		});

		test("admin should be able to sort transactions by description", async ({
			page,
		}) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			// Click on Descrição column header
			const descriptionHeader = page.locator("th:has-text('Descrição')");
			await descriptionHeader.click();

			await page.waitForTimeout(500);
			await expect(descriptionHeader.locator("svg")).toBeVisible();
		});

		test("admin should be able to sort transactions by amount", async ({
			page,
		}) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			// Click on Valor column header
			const amountHeader = page.locator("th:has-text('Valor')");
			await amountHeader.click();

			await page.waitForTimeout(500);
			await expect(amountHeader.locator("svg")).toBeVisible();
		});

		test("actions column should not be sortable", async ({ page }) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			// Verify Ações column doesn't have sort icon
			const actionsHeader = page.locator("th:has-text('Ações')");
			await expect(actionsHeader).toBeVisible();

			// Click should not add sort icon
			await actionsHeader.click();
			await page.waitForTimeout(200);

			const sortIcon = actionsHeader.locator("svg");
			expect(await sortIcon.count()).toBe(0);
		});
	});

	test.describe("Transaction Filters", () => {
		test("should filter transactions by type", async ({ page }) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			await page.click('input[placeholder="Tipo"]');
			await page.click("text=Entrada");

			await page.waitForTimeout(500);
			await expect(page.locator("table tbody tr")).not.toHaveCount(0);
		});

		test("should filter transactions by category", async ({ page }) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			await page.click('input[placeholder="Categoria"]');

			// Wait for dropdown to open
			await page.waitForTimeout(200);
		});
	});

	test.describe("Transaction Creation", () => {
		test("should display create transaction button", async ({ page }) => {
			await page.goto("/finance");
			await page.waitForLoadState("networkidle");

			// Verify "Nova Transação" button is visible
			const newTransactionButton = page.getByRole("button", {
				name: /nova transação/i,
			});
			await expect(newTransactionButton).toBeVisible();
		});
	});
});
