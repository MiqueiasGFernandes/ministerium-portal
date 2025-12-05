import { expect, test } from "@playwright/test";

test.describe("Members Module", () => {
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

	test("should display members list", async ({ page }) => {
		await page.click("text=Membros");
		await expect(page.url()).toContain("/members");
		await expect(page.locator("text=Membros").first()).toBeVisible();
		await expect(page.locator("table")).toBeVisible();
	});

	test("should create new member", async ({ page }) => {
		await page.goto("/members");
		await page.click("text=Novo Membro");

		await expect(page.url()).toContain("/members/create");

		await page.fill('input[name="name"]', "Teste E2E Member");
		await page.fill('input[name="email"]', "teste@e2e.com");
		await page.fill('input[name="phone"]', "(11) 99999-9999");

		await page.click('button:has-text("Salvar")');

		await expect(page.url()).toContain("/members");
	});

	test("should filter members by status", async ({ page }) => {
		await page.goto("/members");

		await page.click('input[placeholder="Filtrar por status"]');
		await page.click("text=Ativo");

		await page.waitForTimeout(500);
		await expect(page.locator("table tbody tr")).not.toHaveCount(0);
	});
});
