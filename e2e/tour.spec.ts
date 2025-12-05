import { expect, test } from "@playwright/test";

test.describe("Guided Tour", () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage to ensure tour shows
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		// Clear tour state
		await page.evaluate(() => {
			localStorage.removeItem("ministerium_completed_tours");
			localStorage.setItem(
				"ministerium_feature_toggles",
				JSON.stringify({ firstAccessTour: true, dashboardTour: true }),
			);
		});

		// Login
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

	test("should display tour on first dashboard access", async ({ page }) => {
		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Check if tour tooltip is visible
		await expect(page.locator("[data-tour-tooltip]")).toBeVisible();

		// Check if backdrop is visible
		await expect(page.locator("[data-tour-backdrop]")).toBeVisible();

		// Check welcome step
		await expect(
			page.locator("[data-tour-tooltip] >> text=/bem-vindo/i"),
		).toBeVisible();
	});

	test("should navigate through tour steps", async ({ page }) => {
		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Step 1: Welcome
		await expect(
			page.locator("[data-tour-tooltip] >> text=/bem-vindo/i"),
		).toBeVisible();
		await expect(page.locator("text=1 de 5")).toBeVisible();

		// Click next
		await page.locator("[data-tour-next]").click();

		// Step 2: Navigation
		await page.waitForTimeout(300); // Animation delay
		await expect(
			page.locator("[data-tour-tooltip] >> text=/menu de navegação/i"),
		).toBeVisible();
		await expect(page.locator("text=2 de 5")).toBeVisible();

		// Click next
		await page.locator("[data-tour-next]").click();

		// Step 3: Stats
		await page.waitForTimeout(300);
		await expect(
			page.locator("[data-tour-tooltip] >> text=/estatísticas/i"),
		).toBeVisible();
		await expect(page.locator("text=3 de 5")).toBeVisible();
	});

	test("should allow going back to previous step", async ({ page }) => {
		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Go to step 2
		await page.locator("[data-tour-next]").click();
		await page.waitForTimeout(300);

		// Verify we're on step 2
		await expect(page.locator("text=2 de 5")).toBeVisible();

		// Go back
		await page.locator("[data-tour-prev]").click();
		await page.waitForTimeout(300);

		// Verify we're back to step 1
		await expect(page.locator("text=1 de 5")).toBeVisible();
		await expect(
			page.locator("[data-tour-tooltip] >> text=/bem-vindo/i"),
		).toBeVisible();
	});

	test("should disable previous button on first step", async ({ page }) => {
		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Previous button should be disabled on first step
		await expect(page.locator("[data-tour-prev]")).toBeDisabled();
	});

	test("should skip tour when skip button is clicked", async ({ page }) => {
		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Click skip
		await page.locator("[data-tour-skip]").click();

		// Tour should disappear
		await expect(page.locator("[data-tour-tooltip]")).not.toBeVisible();
		await expect(page.locator("[data-tour-backdrop]")).not.toBeVisible();

		// Tour should be marked as completed
		const completedTours = await page.evaluate(() => {
			const stored = localStorage.getItem("ministerium_completed_tours");
			return stored ? JSON.parse(stored) : [];
		});

		expect(completedTours).toContain("dashboard-first-access");
	});

	test("should complete tour when finishing all steps", async ({ page }) => {
		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Navigate through all steps
		for (let i = 0; i < 4; i++) {
			await page.locator("[data-tour-next]").click();
			await page.waitForTimeout(300);
		}

		// On last step, button should say "Concluir"
		await expect(
			page.locator("[data-tour-next] >> text=/concluir/i"),
		).toBeVisible();

		// Click finish
		await page.locator("[data-tour-next]").click();

		// Tour should disappear
		await page.waitForTimeout(500);
		await expect(page.locator("[data-tour-tooltip]")).not.toBeVisible();

		// Tour should be marked as completed
		const completedTours = await page.evaluate(() => {
			const stored = localStorage.getItem("ministerium_completed_tours");
			return stored ? JSON.parse(stored) : [];
		});

		expect(completedTours).toContain("dashboard-first-access");
	});

	test("should not show tour on second visit", async ({ page }) => {
		// First visit - complete tour
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });
		await page.locator("[data-tour-skip]").click();

		// Reload page (second visit)
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Wait a bit to ensure tour would have started if it was going to
		await page.waitForTimeout(2000);

		// Tour should not appear
		await expect(page.locator("[data-tour-tooltip]")).not.toBeVisible();
	});

	test("should highlight target elements during tour", async ({ page }) => {
		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Dashboard title should have higher z-index
		const titleZIndex = await page
			.locator("[data-tour='dashboard-title']")
			.evaluate((el) => window.getComputedStyle(el).zIndex);
		expect(Number.parseInt(titleZIndex, 10)).toBeGreaterThan(1000);

		// Go to next step
		await page.locator("[data-tour-next]").click();
		await page.waitForTimeout(300);

		// Sidebar should now have higher z-index
		const sidebarZIndex = await page
			.locator("[data-tour='sidebar-navigation']")
			.evaluate((el) => window.getComputedStyle(el).zIndex);
		expect(Number.parseInt(sidebarZIndex, 10)).toBeGreaterThan(1000);
	});

	test("should respect feature toggle", async ({ page }) => {
		// Disable tour feature
		await page.evaluate(() => {
			localStorage.setItem(
				"ministerium_feature_toggles",
				JSON.stringify({ firstAccessTour: false, dashboardTour: false }),
			);
		});

		// Reload
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Wait a bit
		await page.waitForTimeout(2000);

		// Tour should not appear
		await expect(page.locator("[data-tour-tooltip]")).not.toBeVisible();
	});

	test("should keep tooltip visible within viewport on all steps", async ({
		page,
	}) => {
		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Get viewport size
		const viewport = page.viewportSize();
		if (!viewport) throw new Error("No viewport size");

		// Tolerance for browser rendering differences and animations
		const tolerance = 50;

		// Test each step
		for (let step = 0; step < 5; step++) {
			// Wait for tooltip to be visible
			await expect(page.locator("[data-tour-tooltip]")).toBeVisible();

			// Wait for animation to complete
			await page.waitForTimeout(400);

			// Get tooltip bounding box
			const tooltipBox = await page
				.locator("[data-tour-tooltip]")
				.boundingBox();

			if (!tooltipBox) {
				throw new Error(`Tooltip not found on step ${step + 1}`);
			}

			// Check tooltip is within viewport boundaries (with small tolerance)
			expect(tooltipBox.x).toBeGreaterThanOrEqual(-tolerance);
			expect(tooltipBox.y).toBeGreaterThanOrEqual(-tolerance);
			expect(tooltipBox.x + tooltipBox.width).toBeLessThanOrEqual(
				viewport.width + tolerance,
			);
			expect(tooltipBox.y + tooltipBox.height).toBeLessThanOrEqual(
				viewport.height + tolerance,
			);

			// Go to next step (except on last step)
			if (step < 4) {
				await page.locator("[data-tour-next]").click();
				await page.waitForTimeout(300);
			}
		}

		// Complete tour
		await page.locator("[data-tour-next]").click();
	});

	test("should keep tooltip visible on small viewport", async ({ page }) => {
		// Set small viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Clear tour state
		await page.evaluate(() => {
			localStorage.removeItem("ministerium_completed_tours");
			localStorage.setItem(
				"ministerium_feature_toggles",
				JSON.stringify({ firstAccessTour: true, dashboardTour: true }),
			);
		});

		// Reload
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Wait for tour to start
		await page.waitForSelector("[data-tour-tooltip]", { timeout: 3000 });

		// Get viewport size
		const viewport = page.viewportSize();
		if (!viewport) throw new Error("No viewport size");

		// Tolerance for browser rendering differences and animations
		const tolerance = 50;

		// Test first few steps on small viewport
		for (let step = 0; step < 3; step++) {
			await expect(page.locator("[data-tour-tooltip]")).toBeVisible();

			// Wait for animation to complete
			await page.waitForTimeout(400);

			const tooltipBox = await page
				.locator("[data-tour-tooltip]")
				.boundingBox();

			if (!tooltipBox) {
				throw new Error(`Tooltip not found on step ${step + 1}`);
			}

			// Check tooltip is within small viewport (with small tolerance)
			expect(tooltipBox.x).toBeGreaterThanOrEqual(-tolerance);
			expect(tooltipBox.y).toBeGreaterThanOrEqual(-tolerance);
			expect(tooltipBox.x + tooltipBox.width).toBeLessThanOrEqual(
				viewport.width + tolerance,
			);
			expect(tooltipBox.y + tooltipBox.height).toBeLessThanOrEqual(
				viewport.height + tolerance,
			);

			if (step < 2) {
				await page.locator("[data-tour-next]").click();
				await page.waitForTimeout(300);
			}
		}

		// Skip tour
		await page.locator("[data-tour-skip]").click();
	});
});
