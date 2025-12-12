import { expect, test } from "@playwright/test";

test.describe("Member Registration Management", () => {
	test.beforeEach(async ({ page }) => {
		// Login as admin
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		await page
			.locator(
				'input[name="email"]:visible, input[placeholder*="email"]:visible',
			)
			.first()
			.fill("admin@example.com");

		await page.locator('input[type="password"]:visible').fill("password");
		await page.getByRole("button", { name: /entrar/i }).click();
		await page.waitForURL("/");

		// Create a test member registration
		const registration = {
			id: "test-registration-1",
			name: "João Silva",
			email: "joao@example.com",
			phone: "11987654321",
			birthDate: new Date("1990-01-01").toISOString(),
			maritalStatus: "single",
			gender: "male",
			acceptedTerms: true,
			acceptedAt: new Date().toISOString(),
			status: "pending",
			tenantId: "1",
			registeredAt: new Date().toISOString(),
		};

		await page.evaluate((reg) => {
			const registrations = JSON.parse(
				localStorage.getItem("memberRegistrations") || "[]",
			);
			localStorage.setItem(
				"memberRegistrations",
				JSON.stringify([...registrations, reg]),
			);
		}, registration);
	});

	test("should display member registrations management page", async ({
		page,
	}) => {
		await page.goto("/members");
		await page.getByRole("button", { name: /cadastros pendentes/i }).click();
		await page.waitForURL("/members/registrations");

		// Should show page title
		await expect(
			page.getByRole("heading", { name: /cadastros de membros/i }),
		).toBeVisible();

		// Should show tabs
		await expect(page.getByText(/pendentes/i).first()).toBeVisible();
		await expect(page.getByText(/aprovados/i).first()).toBeVisible();
		await expect(page.getByText(/negados/i).first()).toBeVisible();
	});

	test("should display pending registrations in table", async ({ page }) => {
		await page.goto("/members/registrations");
		await page.waitForLoadState("networkidle");

		// Should show registration data
		await expect(page.getByText("João Silva")).toBeVisible();
		await expect(page.getByText("joao@example.com")).toBeVisible();
		await expect(page.getByText("11987654321")).toBeVisible();

		// Should show action buttons
		await expect(
			page.getByRole("button", { name: /visualizar/i }).first(),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /aprovar/i }).first(),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /negar/i }).first(),
		).toBeVisible();
	});

	test("should approve member registration successfully", async ({ page }) => {
		await page.goto("/members/registrations");
		await page.waitForLoadState("networkidle");

		// Click approve button
		await page
			.getByRole("button", { name: /aprovar/i })
			.first()
			.click();

		// Confirm approval in modal
		await expect(page.getByText(/confirmar aprovação/i)).toBeVisible();
		await page
			.getByRole("button", { name: /confirmar/i })
			.last()
			.click();

		// Should show success message
		await expect(page.getByText(/aprovado com sucesso/i)).toBeVisible();

		// Should move to approved tab
		await page
			.getByText(/aprovados/i)
			.first()
			.click();
		await expect(page.getByText("João Silva")).toBeVisible();

		// Verify member was created
		const members = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("members") || "[]");
		});

		const createdMember = members.find((m) => m.email === "joao@example.com");
		expect(createdMember).toBeTruthy();
		expect(createdMember.name).toBe("João Silva");
		expect(createdMember.status).toBe("visitor");
	});

	test("should show approved member in members list", async ({ page }) => {
		await page.goto("/members/registrations");
		await page.waitForLoadState("networkidle");

		// Approve the registration
		await page
			.getByRole("button", { name: /aprovar/i })
			.first()
			.click();

		// Confirm approval
		await page
			.getByRole("button", { name: /confirmar/i })
			.last()
			.click();

		// Wait for success notification
		await expect(page.getByText(/aprovado com sucesso/i)).toBeVisible();

		// Navigate to members list
		await page.goto("/members");
		await page.waitForLoadState("networkidle");

		// Should show the approved member in the members list
		await expect(page.getByText("João Silva")).toBeVisible();
		await expect(page.getByText("joao@example.com")).toBeVisible();

		// Verify member status is visitor
		const visitorBadge = page
			.locator('tr:has-text("João Silva")')
			.locator("text=/visitante/i");
		await expect(visitorBadge).toBeVisible();
	});

	test("should deny member registration with reason", async ({ page }) => {
		await page.goto("/members/registrations");
		await page.waitForLoadState("networkidle");

		// Click deny button
		await page.getByRole("button", { name: /negar/i }).first().click();

		// Should show denial modal
		await expect(page.getByText(/motivo da negação/i)).toBeVisible();

		// Fill denial reason
		await page
			.getByPlaceholder(/descreva o motivo/i)
			.fill("Informações incompletas");

		// Confirm denial
		await page.getByRole("button", { name: /confirmar negação/i }).click();

		// Should show success message
		await expect(page.getByText(/negado com sucesso/i)).toBeVisible();

		// Should move to denied tab
		await page
			.getByText(/negados/i)
			.first()
			.click();
		await expect(page.getByText("João Silva")).toBeVisible();

		// Verify registration was updated
		const registrations = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("memberRegistrations") || "[]");
		});

		const deniedRegistration = registrations.find(
			(r) => r.email === "joao@example.com",
		);
		expect(deniedRegistration).toBeTruthy();
		expect(deniedRegistration.status).toBe("denied");
		expect(deniedRegistration.denialReason).toBe("Informações incompletas");
	});

	test("should view registration details in modal", async ({ page }) => {
		await page.goto("/members/registrations");
		await page.waitForLoadState("networkidle");

		// Click view details button
		await page
			.getByRole("button", { name: /visualizar/i })
			.first()
			.click();

		// Should show details modal
		await expect(
			page.getByRole("heading", { name: /detalhes do cadastro/i }),
		).toBeVisible();

		// Should show all registration information
		await expect(page.getByText("João Silva")).toBeVisible();
		await expect(page.getByText("joao@example.com")).toBeVisible();
		await expect(page.getByText("11987654321")).toBeVisible();
		await expect(page.getByText(/01\/01\/1990/)).toBeVisible();
		await expect(page.getByText(/solteiro/i)).toBeVisible();
		await expect(page.getByText(/masculino/i)).toBeVisible();

		// Close modal
		await page.getByRole("button", { name: /fechar/i }).click();
		await expect(
			page.getByRole("heading", { name: /detalhes do cadastro/i }),
		).not.toBeVisible();
	});

	test("should show badge count on pending tab", async ({ page }) => {
		await page.goto("/members/registrations");
		await page.waitForLoadState("networkidle");

		// Should show badge with count
		const badge = page
			.locator('[data-active="true"]')
			.locator(".mantine-Badge");
		await expect(badge).toBeVisible();
		await expect(badge).toHaveText("1");
	});

	test("should filter registrations by status tabs", async ({ page }) => {
		// Create approved and denied registrations
		const approvedRegistration = {
			id: "test-registration-2",
			name: "Maria Santos",
			email: "maria@example.com",
			phone: "11987654322",
			birthDate: new Date("1992-05-15").toISOString(),
			acceptedTerms: true,
			acceptedAt: new Date().toISOString(),
			status: "approved",
			tenantId: "1",
			registeredAt: new Date().toISOString(),
			approvedAt: new Date().toISOString(),
			approvedBy: "admin-1",
		};

		const deniedRegistration = {
			id: "test-registration-3",
			name: "Pedro Costa",
			email: "pedro@example.com",
			phone: "11987654323",
			birthDate: new Date("1988-12-20").toISOString(),
			acceptedTerms: true,
			acceptedAt: new Date().toISOString(),
			status: "denied",
			tenantId: "1",
			registeredAt: new Date().toISOString(),
			deniedAt: new Date().toISOString(),
			deniedBy: "admin-1",
			denialReason: "Duplicado",
		};

		await page.evaluate(
			({ approved, denied }) => {
				const registrations = JSON.parse(
					localStorage.getItem("memberRegistrations") || "[]",
				);
				localStorage.setItem(
					"memberRegistrations",
					JSON.stringify([...registrations, approved, denied]),
				);
			},
			{ approved: approvedRegistration, denied: deniedRegistration },
		);

		await page.goto("/members/registrations");
		await page.waitForLoadState("networkidle");

		// Pending tab should show João
		await expect(page.getByText("João Silva")).toBeVisible();
		await expect(page.getByText("Maria Santos")).not.toBeVisible();
		await expect(page.getByText("Pedro Costa")).not.toBeVisible();

		// Approved tab should show Maria
		await page
			.getByText(/aprovados/i)
			.first()
			.click();
		await expect(page.getByText("João Silva")).not.toBeVisible();
		await expect(page.getByText("Maria Santos")).toBeVisible();
		await expect(page.getByText("Pedro Costa")).not.toBeVisible();

		// Denied tab should show Pedro
		await page
			.getByText(/negados/i)
			.first()
			.click();
		await expect(page.getByText("João Silva")).not.toBeVisible();
		await expect(page.getByText("Maria Santos")).not.toBeVisible();
		await expect(page.getByText("Pedro Costa")).toBeVisible();
	});

	test("should restrict access to non-authorized roles", async ({ page }) => {
		// Login as volunteer (no access to member registrations)
		await page.goto("/login");
		await page.evaluate(() => {
			const user = {
				id: "volunteer-1",
				name: "Volunteer User",
				email: "volunteer@example.com",
				role: "volunteer",
				tenantId: "1",
				status: "active",
			};
			localStorage.setItem("user", JSON.stringify(user));
		});

		await page.goto("/members/registrations");
		await page.waitForLoadState("networkidle");

		// Should redirect to unauthorized or show access denied
		const url = page.url();
		expect(
			url.includes("/unauthorized") || url.includes("/login") || url === "/",
		).toBeTruthy();
	});
});
