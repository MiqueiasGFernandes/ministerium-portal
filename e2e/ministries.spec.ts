import { expect, test } from "@playwright/test";

test.describe("Ministries Module", () => {
	test.beforeEach(async ({ page }) => {
		// Login before each test
		await page.goto("/login", { waitUntil: "networkidle" });

		// Wait for login form to be visible
		await page.waitForSelector('input[type="email"]', { timeout: 10000 });

		await page.fill('input[type="email"]', "admin@ministerium.com");
		await page.fill('input[type="password"]', "admin123");
		await page.click('button[type="submit"]');

		// Wait for navigation to complete
		await page.waitForURL("/", { timeout: 10000 });

		// Ensure dashboard is loaded
		await page.waitForSelector("text=Dashboard", { timeout: 5000 });
	});

	test("should display ministries list", async ({ page }) => {
		// Navigate to ministries page
		await page.click("text=Ministérios");
		await expect(page).toHaveURL("/ministries");

		// Check if page title is visible
		await expect(page.locator("text=Ministérios").first()).toBeVisible();

		// Check if table is visible
		await expect(page.locator("table")).toBeVisible();

		// Check if "Novo Ministério" button is visible
		await expect(page.locator("text=Novo Ministério")).toBeVisible();
	});

	test("should display ministry table columns", async ({ page }) => {
		await page.goto("/ministries");

		// Wait for table to load
		await page.waitForSelector("table");

		// Check table headers
		await expect(page.locator('th:has-text("Nome")')).toBeVisible();
		await expect(page.locator('th:has-text("Descrição")')).toBeVisible();
		await expect(page.locator('th:has-text("Líder")')).toBeVisible();
		await expect(page.locator('th:has-text("Membros")')).toBeVisible();
		await expect(page.locator('th:has-text("Criado em")')).toBeVisible();
		await expect(page.locator('th:has-text("Ações")')).toBeVisible();
	});

	test("should create new ministry", async ({ page }) => {
		await page.goto("/ministries");

		// Click "Novo Ministério" button
		await page.click("text=Novo Ministério");
		await expect(page).toHaveURL("/ministries/create");

		// Check if form title is visible
		await expect(page.locator("text=Novo Ministério").first()).toBeVisible();

		// Fill ministry form
		await page.fill('input[name="name"]', "Teste E2E Ministério");
		await page.fill(
			'textarea[name="description"]',
			"Este é um ministério criado via teste E2E para validar a funcionalidade de criação.",
		);

		// Select a leader (wait for the select to be enabled)
		await page.waitForSelector('button:has-text("Selecione um líder")', {
			state: "visible",
		});
		await page.click('button:has-text("Selecione um líder")');

		// Wait for options to appear and select the first one
		await page.waitForSelector('[role="option"]');
		await page.click('[role="option"]', { timeout: 5000 });

		// Click save button
		await page.click('button:has-text("Salvar")');

		// Should redirect to ministries list
		await expect(page).toHaveURL("/ministries", { timeout: 10000 });

		// Check if success notification appears
		await expect(page.locator("text=Sucesso!")).toBeVisible({
			timeout: 5000,
		});
		await expect(
			page.locator("text=Ministério criado com sucesso"),
		).toBeVisible();
	});

	test("should validate required fields", async ({ page }) => {
		await page.goto("/ministries/create");

		// Try to save without filling required fields
		await page.click('button:has-text("Salvar")');

		// Should stay on create page (validation should prevent submission)
		await expect(page).toHaveURL("/ministries/create");
	});

	test("should edit ministry", async ({ page }) => {
		await page.goto("/ministries");

		// Wait for table to load
		await page.waitForSelector("table tbody tr");

		// Click edit button on first ministry (orange edit icon)
		await page.click('button[color="orange"]', { timeout: 5000 });

		// Should navigate to edit page
		await expect(page.url()).toContain("/ministries/edit/");

		// Check if form title is visible
		await expect(
			page.locator("text=Editar Ministério").first(),
		).toBeVisible();

		// Update ministry name
		const newName = `Ministério Editado ${Date.now()}`;
		await page.fill('input[name="name"]', newName);

		// Click save button
		await page.click('button:has-text("Salvar")');

		// Should redirect to ministries list
		await expect(page).toHaveURL("/ministries", { timeout: 10000 });

		// Check if success notification appears
		await expect(
			page.locator("text=Ministério atualizado com sucesso"),
		).toBeVisible({ timeout: 5000 });
	});

	test("should view ministry details", async ({ page }) => {
		await page.goto("/ministries");

		// Wait for table to load
		await page.waitForSelector("table tbody tr");

		// Click view button on first ministry (blue eye icon)
		await page.click('button[color="blue"]', { timeout: 5000 });

		// Should navigate to show page
		await expect(page.url()).toContain("/ministries/show/");

		// Check if ministry details are visible
		await expect(page.locator("text=Descrição")).toBeVisible();
		await expect(page.locator("text=Criado em")).toBeVisible();
		await expect(page.locator("text=Atualizado em")).toBeVisible();
		await expect(page.locator("text=Líder")).toBeVisible();
		await expect(page.locator("text=Membros")).toBeVisible();

		// Check if edit button is visible
		await expect(page.locator('button:has-text("Editar")')).toBeVisible();
	});

	test("should navigate from details to edit", async ({ page }) => {
		await page.goto("/ministries");

		// Wait for table and click view button
		await page.waitForSelector("table tbody tr");
		await page.click('button[color="blue"]');

		// Wait for details page
		await expect(page.url()).toContain("/ministries/show/");

		// Click edit button from details page
		await page.click('button:has-text("Editar")');

		// Should navigate to edit page
		await expect(page.url()).toContain("/ministries/edit/");
		await expect(
			page.locator("text=Editar Ministério").first(),
		).toBeVisible();
	});

	test("should cancel creation and return to list", async ({ page }) => {
		await page.goto("/ministries/create");

		// Fill some data
		await page.fill('input[name="name"]', "Ministério Cancelado");

		// Click cancel button
		await page.click('button:has-text("Cancelar")');

		// Should redirect to ministries list
		await expect(page).toHaveURL("/ministries");
	});

	test("should cancel editing and return to list", async ({ page }) => {
		await page.goto("/ministries");

		// Click edit button on first ministry
		await page.waitForSelector("table tbody tr");
		await page.click('button[color="orange"]');

		// Wait for edit page
		await expect(page.url()).toContain("/ministries/edit/");

		// Click cancel button
		await page.click('button:has-text("Cancelar")');

		// Should redirect to ministries list
		await expect(page).toHaveURL("/ministries");
	});

	test("should show member count badge in list", async ({ page }) => {
		await page.goto("/ministries");

		// Wait for table to load
		await page.waitForSelector("table tbody tr");

		// Check if badge with member count is visible
		const badge = page.locator('table tbody tr:first-child td').nth(3);
		await expect(badge).toBeVisible();

		// Badge should contain a number
		const badgeText = await badge.textContent();
		expect(badgeText).toMatch(/\d+/);
	});

	test("should display ministry in schedules dropdown", async ({ page }) => {
		// First, ensure we have a ministry
		await page.goto("/ministries");
		await page.waitForSelector("table tbody tr");

		// Get the first ministry name
		const firstMinistryName = await page
			.locator("table tbody tr:first-child td:first-child")
			.textContent();

		// Navigate to schedules create page
		await page.click("text=Escalas");
		await page.click("text=Nova Escala");

		// Wait for ministry select to be enabled
		await page.waitForSelector('button:has-text("Selecione")', {
			state: "visible",
		});

		// Click ministry select dropdown
		await page.click('label:has-text("Ministério") + div button');

		// Wait for options to appear
		await page.waitForSelector('[role="option"]');

		// Check if the ministry appears in the dropdown
		if (firstMinistryName) {
			await expect(
				page.locator(`[role="option"]:has-text("${firstMinistryName.trim()}")`),
			).toBeVisible({ timeout: 5000 });
		}
	});

	test("should paginate ministries list", async ({ page }) => {
		await page.goto("/ministries");

		// Wait for table to load
		await page.waitForSelector("table tbody tr");

		// Check if pagination controls exist
		const pagination = page.locator('[aria-label="Pagination"]');

		// Pagination should be visible if there are enough ministries
		const rowCount = await page.locator("table tbody tr").count();

		if (rowCount >= 10) {
			await expect(pagination).toBeVisible();
		}
	});

	test("should have proper ministry permissions for admin", async ({ page }) => {
		// Admin should see all CRUD buttons
		await page.goto("/ministries");

		// "Novo Ministério" button should be visible
		await expect(page.locator("text=Novo Ministério")).toBeVisible();

		// Wait for table and check action buttons
		await page.waitForSelector("table tbody tr");

		// Edit and delete buttons should be visible
		await expect(page.locator('button[color="orange"]').first()).toBeVisible();
		await expect(page.locator('button[color="red"]').first()).toBeVisible();
	});
});
