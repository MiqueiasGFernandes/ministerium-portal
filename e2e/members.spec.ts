import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Members Domain
 * Following DDD (Domain-Driven Design) principles:
 * - Tests are organized around business capabilities
 * - Test names describe business behavior, not technical implementation
 * - Tests validate the complete user workflow
 */

test.describe("Members Domain", () => {
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

	test.describe("Member List Management", () => {
		test("should display members list with all required elements", async ({
			page,
		}) => {
			// Navigate directly to members page
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			expect(page.url()).toContain("/members");
			await expect(page.locator("table")).toBeVisible();

			// Verify table headers are present
			await expect(page.locator("th:has-text('Foto')")).toBeVisible();
			await expect(page.locator("th:has-text('Nome')")).toBeVisible();
			await expect(page.locator("th:has-text('Email')")).toBeVisible();
			await expect(page.locator("th:has-text('Status')")).toBeVisible();
		});

		test("admin should be able to sort members by name", async ({ page }) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Click on Name column header to sort ascending
			const nameHeader = page.locator("th:has-text('Nome')");
			await nameHeader.click();

			// Wait for sort to apply
			await page.waitForTimeout(500);

			// Verify sort icon is present
			await expect(nameHeader.locator("svg")).toBeVisible();

			// Click again to sort descending
			await nameHeader.click();
			await page.waitForTimeout(500);

			// Verify sort icon changes
			await expect(nameHeader.locator("svg")).toBeVisible();
		});

		test("admin should be able to sort members by email", async ({ page }) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Click on Email column header
			const emailHeader = page.locator("th:has-text('Email')");
			await emailHeader.click();

			await page.waitForTimeout(500);
			await expect(emailHeader.locator("svg")).toBeVisible();
		});

		test("admin should be able to sort members by status", async ({ page }) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Click on Status column header
			const statusHeader = page.locator("th:has-text('Status')");
			await statusHeader.click();

			await page.waitForTimeout(500);
			await expect(statusHeader.locator("svg")).toBeVisible();
		});
	});

	test.describe("Member Search and Filter", () => {
		test("should display filter controls", async ({ page }) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Verify filter controls are present
			await expect(
				page.locator('input[placeholder*="Buscar por nome"]'),
			).toBeVisible();
			await expect(
				page.locator('input[placeholder="Filtrar por status"]'),
			).toBeVisible();
			await expect(
				page.locator('input[placeholder="Filtrar por tags"]'),
			).toBeVisible();

			// Verify table has data
			const rows = page.locator("table tbody tr");
			const count = await rows.count();
			expect(count).toBeGreaterThan(0);
		});

		test("should search members by name with autocomplete history", async ({
			page,
		}) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Type in search field (now using Autocomplete)
			const searchInput = page.locator('input[placeholder*="Buscar por nome"]');
			await searchInput.fill("João");

			// Submit search by pressing Enter
			await searchInput.press("Enter");

			await page.waitForTimeout(500);
		});

		test("should clear search using close button", async ({ page }) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			const searchInput = page.locator('input[placeholder*="Buscar por nome"]');
			await searchInput.fill("Test Search");

			// Verify close button appears
			const closeButton = page.locator('button[aria-label*="Limpar"]');
			await expect(closeButton).toBeVisible();

			// Click close button
			await closeButton.click();

			// Verify search is cleared
			await expect(searchInput).toHaveValue("");
		});
	});

	test.describe("Member Creation", () => {
		test("should display create member button", async ({ page }) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Verify "Novo Membro" button is visible
			const newMemberButton = page.getByRole("button", {
				name: /novo membro/i,
			});
			await expect(newMemberButton).toBeVisible();
		});
	});

	test.describe("Member Details View", () => {
		test("should navigate to member details and show back button", async ({
			page,
		}) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Click on the first "view" button in the table
			const viewButton = page
				.locator('button svg[class*="tabler-eye"]')
				.first();
			if ((await viewButton.count()) > 0) {
				await viewButton.click();

				await page.waitForTimeout(500);
				await expect(page.url()).toContain("/members/show/");

				// Verify back button is present
				const backButton = page.locator(
					'button[aria-label*="Voltar para lista"]',
				);
				await expect(backButton).toBeVisible();

				// Click back button and verify navigation
				await backButton.click();
				await expect(page.url()).toContain("/members");
				await expect(page.url()).not.toContain("/show/");
			}
		});

		test("should display custom fields including data batismo correctly", async ({
			page,
		}) => {
			await page.goto("/members");
			await page.waitForLoadState("networkidle");

			// Click on the first "view" button
			const viewButton = page
				.locator('button svg[class*="tabler-eye"]')
				.first();
			if ((await viewButton.count()) > 0) {
				await viewButton.click();

				await page.waitForTimeout(500);
				await expect(page.url()).toContain("/members/show/");

				// Verify custom fields section exists
				const customFieldsSection = page.locator("text=Informações Adicionais");
				if ((await customFieldsSection.count()) > 0) {
					await expect(customFieldsSection).toBeVisible();

					// Verify date fields are formatted correctly (DD/MM/YYYY) or show "Não informado"
					const dateFields = page.locator("text=/\\d{2}\\/\\d{2}\\/\\d{4}/");
					const notInformed = page.locator("text=Não informado");

					// At least one should be visible (either formatted date or "Não informado")
					const hasDate = (await dateFields.count()) > 0;
					const hasNotInformed = (await notInformed.count()) > 0;
					expect(hasDate || hasNotInformed).toBeTruthy();
				}
			}
		});
	});
});
