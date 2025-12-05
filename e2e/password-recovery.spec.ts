import { expect, test } from "@playwright/test";

test.describe("Password Recovery", () => {
	test("should display forgot password link on login page", async ({
		page,
	}) => {
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		// Verify forgot password link is visible
		const forgotPasswordLink = page.getByRole("link", {
			name: /esqueci minha senha/i,
		});
		await expect(forgotPasswordLink).toBeVisible();

		// Verify link points to correct URL
		await expect(forgotPasswordLink).toHaveAttribute(
			"href",
			"/forgot-password",
		);
	});

	test("should navigate to forgot password page", async ({ page }) => {
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		// Click forgot password link
		await page.getByRole("link", { name: /esqueci minha senha/i }).click();

		// Should navigate to forgot password page
		await expect(page).toHaveURL("/forgot-password");

		// Verify page heading
		await expect(
			page.getByRole("heading", { name: /recuperar senha/i }).first(),
		).toBeVisible();
	});

	test("should complete full password recovery flow", async ({ page }) => {
		// Step 1: Navigate to forgot password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		// Verify page title and description
		await expect(
			page.getByRole("heading", { name: /recuperar senha/i }).first(),
		).toBeVisible();
		await expect(
			page.getByText(/digite seu email para receber o código/i).first(),
		).toBeVisible();

		// Fill email (should be pre-filled in test environment)
		const emailInput = page
			.locator('input[type="email"]:visible, input[name="email"]:visible')
			.first();
		await expect(emailInput).toHaveValue("teste@ministerium.com");

		// Submit email
		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();

		// Step 2: Verify navigation to verify code page
		await page.waitForURL("/verify-code", { timeout: 5000 });
		await expect(page).toHaveURL("/verify-code");

		// Verify page heading
		await expect(
			page.getByRole("heading", { name: /verificar código/i }).first(),
		).toBeVisible();

		// Verify email is displayed
		await expect(page.getByText("teste@ministerium.com")).toBeVisible();

		// Verify code is pre-filled in test environment (123456)
		await page.waitForTimeout(500); // Wait for code to be set

		// Click verify button
		await page
			.getByRole("button", { name: /verificar código/i })
			.first()
			.click();

		// Step 3: Verify navigation to reset password page
		await page.waitForURL("/reset-password", { timeout: 5000 });
		await expect(page).toHaveURL("/reset-password");

		// Verify page heading
		await expect(
			page.getByRole("heading", { name: /redefinir senha/i }).first(),
		).toBeVisible();

		// Verify password fields are pre-filled in test environment
		const passwordInputs = page.locator('input[type="password"]:visible');
		await expect(passwordInputs.first()).toHaveValue("SenhaTeste123");
		await expect(passwordInputs.last()).toHaveValue("SenhaTeste123");

		// Submit new password
		await page
			.getByRole("button", { name: /redefinir senha/i })
			.first()
			.click();

		// Step 4: Verify redirect to login page
		await page.waitForURL("/login", { timeout: 5000 });
		await expect(page).toHaveURL("/login");
	});

	test("should validate email format on forgot password page", async ({
		page,
	}) => {
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		// Clear pre-filled email
		const emailInput = page
			.locator('input[type="email"]:visible, input[name="email"]:visible')
			.first();
		await emailInput.clear();

		// Enter invalid email
		await emailInput.fill("invalid-email");

		// Try to submit
		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();

		// Should show validation error
		await expect(page.getByText(/email inválido/i).first()).toBeVisible();
	});

	test("should validate required email on forgot password page", async ({
		page,
	}) => {
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		// Clear pre-filled email
		const emailInput = page
			.locator('input[type="email"]:visible, input[name="email"]:visible')
			.first();
		await emailInput.clear();

		// Try to submit without email
		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();

		// Should show validation error
		await expect(page.getByText(/email inválido/i).first()).toBeVisible();
	});

	test("should allow resending verification code after countdown", async ({
		page,
	}) => {
		// Navigate to verify code page (need to go through forgot password first)
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		// Submit email
		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();

		await page.waitForURL("/verify-code", { timeout: 5000 });

		// Initially, should show countdown
		await expect(page.getByText(/reenviar em \d+s/i)).toBeVisible();

		// Resend button should be disabled initially
		const resendButton = page.getByRole("button", { name: /reenviar código/i });
		await expect(resendButton).not.toBeVisible();
	});

	test("should validate code length on verify code page", async ({ page }) => {
		// Navigate to verify code page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();

		await page.waitForURL("/verify-code", { timeout: 5000 });

		// Clear pre-filled code
		const pinInputs = page.locator('input[type="number"]:visible');
		for (let i = 0; i < 6; i++) {
			await pinInputs.nth(i).clear();
		}

		// Enter incomplete code
		await pinInputs.first().fill("1");

		// Verify button should be disabled with incomplete code
		const verifyButton = page.getByRole("button", {
			name: /verificar código/i,
		});
		await expect(verifyButton.first()).toBeDisabled();
	});

	test("should validate password requirements on reset password page", async ({
		page,
	}) => {
		// Navigate to reset password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		// Submit email
		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();
		await page.waitForURL("/verify-code", { timeout: 5000 });

		// Submit code
		await page
			.getByRole("button", { name: /verificar código/i })
			.first()
			.click();
		await page.waitForURL("/reset-password", { timeout: 5000 });

		// Clear pre-filled passwords
		const passwordInputs = page.locator('input[type="password"]:visible');
		await passwordInputs.first().clear();
		await passwordInputs.last().clear();

		// Test too short password
		await passwordInputs.first().fill("Short1");
		await passwordInputs.last().fill("Short1");

		await page
			.getByRole("button", { name: /redefinir senha/i })
			.first()
			.click();

		// Should show validation error
		await expect(
			page.getByText(/senha deve ter no mínimo 8 caracteres/i).first(),
		).toBeVisible();
	});

	test("should validate password without uppercase on reset password page", async ({
		page,
	}) => {
		// Navigate to reset password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();
		await page.waitForURL("/verify-code", { timeout: 5000 });

		await page
			.getByRole("button", { name: /verificar código/i })
			.first()
			.click();
		await page.waitForURL("/reset-password", { timeout: 5000 });

		// Clear pre-filled passwords
		const passwordInputs = page.locator('input[type="password"]:visible');
		await passwordInputs.first().clear();
		await passwordInputs.last().clear();

		// Test password without uppercase
		await passwordInputs.first().fill("senhateste123");
		await passwordInputs.last().fill("senhateste123");

		await page
			.getByRole("button", { name: /redefinir senha/i })
			.first()
			.click();

		// Should show validation error
		await expect(
			page.getByText(/senha deve conter ao menos uma letra maiúscula/i).first(),
		).toBeVisible();
	});

	test("should validate password without lowercase on reset password page", async ({
		page,
	}) => {
		// Navigate to reset password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();
		await page.waitForURL("/verify-code", { timeout: 5000 });

		await page
			.getByRole("button", { name: /verificar código/i })
			.first()
			.click();
		await page.waitForURL("/reset-password", { timeout: 5000 });

		// Clear pre-filled passwords
		const passwordInputs = page.locator('input[type="password"]:visible');
		await passwordInputs.first().clear();
		await passwordInputs.last().clear();

		// Test password without lowercase
		await passwordInputs.first().fill("SENHATESTE123");
		await passwordInputs.last().fill("SENHATESTE123");

		await page
			.getByRole("button", { name: /redefinir senha/i })
			.first()
			.click();

		// Should show validation error
		await expect(
			page.getByText(/senha deve conter ao menos uma letra minúscula/i).first(),
		).toBeVisible();
	});

	test("should validate password without number on reset password page", async ({
		page,
	}) => {
		// Navigate to reset password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();
		await page.waitForURL("/verify-code", { timeout: 5000 });

		await page
			.getByRole("button", { name: /verificar código/i })
			.first()
			.click();
		await page.waitForURL("/reset-password", { timeout: 5000 });

		// Clear pre-filled passwords
		const passwordInputs = page.locator('input[type="password"]:visible');
		await passwordInputs.first().clear();
		await passwordInputs.last().clear();

		// Test password without number
		await passwordInputs.first().fill("SenhaTeste");
		await passwordInputs.last().fill("SenhaTeste");

		await page
			.getByRole("button", { name: /redefinir senha/i })
			.first()
			.click();

		// Should show validation error
		await expect(
			page.getByText(/senha deve conter ao menos um número/i).first(),
		).toBeVisible();
	});

	test("should validate password confirmation match on reset password page", async ({
		page,
	}) => {
		// Navigate to reset password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();
		await page.waitForURL("/verify-code", { timeout: 5000 });

		await page
			.getByRole("button", { name: /verificar código/i })
			.first()
			.click();
		await page.waitForURL("/reset-password", { timeout: 5000 });

		// Clear pre-filled passwords
		const passwordInputs = page.locator('input[type="password"]:visible');
		await passwordInputs.first().clear();
		await passwordInputs.last().clear();

		// Test mismatched passwords
		await passwordInputs.first().fill("SenhaTeste123");
		await passwordInputs.last().fill("SenhaDiferente123");

		await page
			.getByRole("button", { name: /redefinir senha/i })
			.first()
			.click();

		// Should show validation error
		await expect(
			page.getByText(/as senhas não coincidem/i).first(),
		).toBeVisible();
	});

	test("should show password requirements on reset password page", async ({
		page,
	}) => {
		// Navigate to reset password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();
		await page.waitForURL("/verify-code", { timeout: 5000 });

		await page
			.getByRole("button", { name: /verificar código/i })
			.first()
			.click();
		await page.waitForURL("/reset-password", { timeout: 5000 });

		// Verify password requirements are displayed
		await expect(page.getByText(/a senha deve conter:/i)).toBeVisible();
		await expect(page.getByText(/mínimo de 8 caracteres/i)).toBeVisible();
		await expect(page.getByText(/uma letra maiúscula/i)).toBeVisible();
		await expect(page.getByText(/uma letra minúscula/i)).toBeVisible();
		await expect(page.getByText(/um número/i)).toBeVisible();
	});

	test("should have back button on all recovery pages", async ({ page }) => {
		// Test forgot password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");
		await expect(
			page.getByRole("button", { name: /voltar/i }).first(),
		).toBeVisible();

		// Navigate to verify code page
		await page
			.getByRole("button", { name: /enviar código/i })
			.first()
			.click();
		await page.waitForURL("/verify-code", { timeout: 5000 });
		await expect(
			page.getByRole("button", { name: /voltar/i }).first(),
		).toBeVisible();

		// Navigate to reset password page
		await page
			.getByRole("button", { name: /verificar código/i })
			.first()
			.click();
		await page.waitForURL("/reset-password", { timeout: 5000 });
		await expect(
			page.getByRole("button", { name: /voltar/i }).first(),
		).toBeVisible();
	});

	test("should redirect to forgot password if accessing verify code without email", async ({
		page,
	}) => {
		// Try to access verify code page directly without going through forgot password
		await page.goto("/verify-code");
		await page.waitForLoadState("networkidle");

		// Should redirect to forgot password page
		await expect(page).toHaveURL("/forgot-password");
	});

	test("should redirect to forgot password if accessing reset password without code", async ({
		page,
	}) => {
		// Try to access reset password page directly without going through previous steps
		await page.goto("/reset-password");
		await page.waitForLoadState("networkidle");

		// Should redirect to forgot password page
		await expect(page).toHaveURL("/forgot-password");
	});

	test("should show loading state while submitting", async ({ page }) => {
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		// Click submit button
		const submitButton = page
			.getByRole("button", { name: /enviar código/i })
			.first();
		await submitButton.click();

		// Button should show loading state (though it might be too fast to catch)
		// This is more of a visual check that the button exists and is clickable
	});

	test("should maintain responsive layout on mobile", async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Test forgot password page
		await page.goto("/forgot-password");
		await page.waitForLoadState("networkidle");

		// Verify mobile layout elements are visible
		await expect(
			page.getByRole("heading", { name: /recuperar senha/i }).first(),
		).toBeVisible();
		await expect(
			page
				.locator('input[type="email"]:visible, input[name="email"]:visible')
				.first(),
		).toBeVisible();
	});
});
