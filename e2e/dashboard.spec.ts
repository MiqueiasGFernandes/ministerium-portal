import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
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

	test("should display dashboard widgets", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible();
		await expect(page.locator("text=Total de Membros").first()).toBeVisible();
		await expect(page.locator("text=Entradas do Mês").first()).toBeVisible();
		await expect(page.locator("text=Saídas do Mês").first()).toBeVisible();
		await expect(page.locator("text=Saldo do Mês").first()).toBeVisible();
	});

	test("should display upcoming events", async ({ page }) => {
		await expect(page.locator("text=Próximos Eventos").first()).toBeVisible();
	});

	test("should display upcoming schedules", async ({ page }) => {
		await expect(page.locator("text=Escalas da Semana").first()).toBeVisible();
	});

	test("should be responsive on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible();
		await expect(page.locator("text=Total de Membros").first()).toBeVisible();
	});
});
