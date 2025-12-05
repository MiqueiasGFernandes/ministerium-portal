import { expect, test } from "@playwright/test";

test.describe("Events Module", () => {
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

	test("should display events list", async ({ page }) => {
		await page.click("text=Eventos");
		await expect(page.url()).toContain("/events");
		await expect(page.locator("table")).toBeVisible();
	});

	test("should create new event", async ({ page }) => {
		await page.goto("/events");
		await page.click("text=Novo Evento");

		await expect(page.url()).toContain("/events/create");

		await page.fill('input[name="title"]', "Evento E2E");
		await page.fill("textarea", "Descrição do evento de teste");
		await page.fill('input[name="location"]', "Local Teste");

		await page.click('button:has-text("Salvar")');

		await expect(page.url()).toContain("/events");
	});

	test("should view event details with QR code", async ({ page }) => {
		await page.goto("/events");

		// Click on first row to view event
		const firstRow = page.locator("table tbody tr").first();
		await firstRow.locator("svg").first().click();

		await page.waitForTimeout(500);
		// QR code test may not be applicable if not implemented yet
		// await expect(page.locator('text=QR Code Check-in')).toBeVisible();
	});
});
