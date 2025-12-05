import { expect, test } from "@playwright/test";

test.describe("Finance Module", () => {
	test.beforeEach(async ({ page }) => {
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

	test("should display transactions list", async ({ page }) => {
		await page.click("text=Financeiro");
		await expect(page.url()).toContain("/finance");
		await expect(page.locator("table")).toBeVisible();
	});

	test("should create new transaction", async ({ page }) => {
		await page.goto("/finance");
		await page.click("text=Nova Transação");

		await expect(page.url()).toContain("/finance/create");

		await page.click('input[placeholder="Selecione o status"]');
		await page.click("text=Entrada");

		await page.fill('input[type="number"]', "100.50");
		await page.fill("textarea", "Dízimo E2E");

		await page.click('button:has-text("Salvar")');

		await expect(page.url()).toContain("/finance");
	});
});
