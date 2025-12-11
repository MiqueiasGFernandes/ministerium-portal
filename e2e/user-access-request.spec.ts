import { expect, test } from "@playwright/test";

test.describe("User Access Request", () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage before each test
		await page.goto("/");
		await page.evaluate(() => {
			localStorage.removeItem("accessRequests");
		});
	});

	test("should display request access page", async ({ page }) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Verify page title and description
		await expect(
			page.getByRole("heading", { name: /solicitar acesso/i }),
		).toBeVisible();
		await expect(page.getByText(/preencha o formulário abaixo/i)).toBeVisible();
	});

	test("should validate required fields", async ({ page }) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Try to submit without filling required fields
		const submitButton = page.getByRole("button", {
			name: /enviar solicitação/i,
		});
		await submitButton.click();

		// Should show validation errors
		await expect(page.getByText(/nome é obrigatório/i)).toBeVisible();
		await expect(page.getByText(/email é obrigatório/i)).toBeVisible();
	});

	test("should validate name minimum length", async ({ page }) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Fill name with less than 3 characters
		await page.getByLabel(/nome completo/i).fill("Ab");
		await page.getByLabel(/^email$/i).fill("test@example.com");

		const submitButton = page.getByRole("button", {
			name: /enviar solicitação/i,
		});
		await submitButton.click();

		// Should show validation error
		await expect(
			page.getByText(/nome deve ter no mínimo 3 caracteres/i),
		).toBeVisible();
	});

	test("should validate email format", async ({ page }) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		await page.getByLabel(/nome completo/i).fill("Test User");
		await page.getByLabel(/^email$/i).fill("invalid-email");

		const submitButton = page.getByRole("button", {
			name: /enviar solicitação/i,
		});
		await submitButton.click();

		// Should show validation error
		await expect(page.getByText(/email inválido/i)).toBeVisible();
	});

	test("should submit access request successfully", async ({ page }) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Fill the form
		await page.getByLabel(/nome completo/i).fill("João Silva");
		await page.getByLabel(/^email$/i).fill("joao@example.com");
		await page.getByLabel(/telefone/i).fill("(11) 98765-4321");
		await page.getByLabel(/cargo\/área/i).fill("Voluntário");
		await page
			.getByLabel(/motivo do acesso/i)
			.fill("Gostaria de ajudar no ministério de louvor");

		// Submit the form
		const submitButton = page.getByRole("button", {
			name: /enviar solicitação/i,
		});
		await submitButton.click();

		// Wait for success message
		await page.waitForTimeout(1000);

		// Should show success state
		await expect(
			page.getByRole("heading", { name: /solicitação enviada/i }),
		).toBeVisible();
		await expect(
			page.getByText(/sua solicitação de acesso está em análise/i),
		).toBeVisible();

		// Verify the request was stored in localStorage
		const storedRequests = await page.evaluate(() => {
			return localStorage.getItem("accessRequests");
		});

		expect(storedRequests).toBeTruthy();
		const requests = JSON.parse(storedRequests || "[]");
		expect(requests).toHaveLength(1);
		expect(requests[0].email).toBe("joao@example.com");
		expect(requests[0].name).toBe("João Silva");
		expect(requests[0].status).toBe("pending");
	});

	test("should prevent duplicate pending requests", async ({ page }) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Create first request
		await page.getByLabel(/nome completo/i).fill("João Silva");
		await page.getByLabel(/^email$/i).fill("joao@example.com");

		await page.getByRole("button", { name: /enviar solicitação/i }).click();
		await page.waitForTimeout(1000);

		// Go back to request access page
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Try to submit with same email
		await page.getByLabel(/nome completo/i).fill("João Silva");
		await page.getByLabel(/^email$/i).fill("joao@example.com");

		await page.getByRole("button", { name: /enviar solicitação/i }).click();
		await page.waitForTimeout(1000);

		// Should show warning about existing request
		await expect(
			page.getByText(/você já possui uma solicitação pendente/i),
		).toBeVisible();
	});

	test("should allow navigation to login page", async ({ page }) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Click on login link
		const loginButton = page.getByRole("button", {
			name: /já tem acesso\? fazer login/i,
		});
		await loginButton.click();

		// Should navigate to login page
		await expect(page).toHaveURL("/login");
	});

	test("should allow navigation to login from success page", async ({
		page,
	}) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Submit a request
		await page.getByLabel(/nome completo/i).fill("Test User");
		await page.getByLabel(/^email$/i).fill("test@example.com");

		await page.getByRole("button", { name: /enviar solicitação/i }).click();
		await page.waitForTimeout(1000);

		// Click on login button from success page
		const loginButton = page.getByRole("button", { name: /ir para login/i });
		await loginButton.click();

		// Should navigate to login page
		await expect(page).toHaveURL("/login");
	});

	test("should include all optional fields in request", async ({ page }) => {
		await page.goto("/request-access");
		await page.waitForLoadState("networkidle");

		// Fill all fields including optional ones
		await page.getByLabel(/nome completo/i).fill("Maria Santos");
		await page.getByLabel(/^email$/i).fill("maria@example.com");
		await page.getByLabel(/telefone/i).fill("(21) 99999-8888");
		await page.getByLabel(/cargo\/área/i).fill("Líder de Célula");
		await page
			.getByLabel(/motivo do acesso/i)
			.fill("Preciso acessar para gerenciar minha célula");

		await page.getByRole("button", { name: /enviar solicitação/i }).click();
		await page.waitForTimeout(1000);

		// Verify all fields were stored
		const storedRequests = await page.evaluate(() => {
			return localStorage.getItem("accessRequests");
		});

		const requests = JSON.parse(storedRequests || "[]");
		expect(requests[0].phone).toBe("(21) 99999-8888");
		expect(requests[0].position).toBe("Líder de Célula");
		expect(requests[0].reason).toBe(
			"Preciso acessar para gerenciar minha célula",
		);
	});
});
