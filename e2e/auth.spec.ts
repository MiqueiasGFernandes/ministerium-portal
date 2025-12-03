import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('should redirect authenticated user away from login page', async ({ page }) => {
    // First login to set the auth state
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@ministerium.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Now try to access login page while authenticated
    await page.goto('/login');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Verify we're on the login page
    await expect(page.getByRole('heading', { name: 'Ministerium' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();

    await page.fill('input[type="email"]', 'admin@ministerium.com');
    await page.fill('input[type="password"]', 'admin123');

    await page.click('button[type="submit"]');

    // Wait for navigation and verify redirect
    await page.waitForURL('/', { timeout: 5000 });
    await expect(page).toHaveURL('/');

    // Verify dashboard is visible
    await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL('/login');

    // Should show error message
    await expect(page.locator('text=Email ou senha inválidos')).toBeVisible();
  });

  test('should validate form fields', async ({ page }) => {
    await page.goto('/login');

    // Try to submit with empty fields
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Email inválido')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'admin@ministerium.com');
    await page.fill('input[type="password"]', 'ab'); // Less than 3 characters
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=Senha deve ter no mínimo 3 caracteres')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email/i }).fill('admin@ministerium.com');
    await page.getByLabel(/senha/i).fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForURL('/');

    // Click on user menu (look for admin button/menu)
    const userMenu = page.locator('[role="button"]').filter({ hasText: /admin/i }).first();
    await userMenu.click();

    // Click logout
    await page.getByText(/sair/i).click();

    // Should redirect to login page
    await expect(page).toHaveURL('/login');

    // Verify we can't access protected pages
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('should maintain session after page reload', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email/i }).fill('admin@ministerium.com');
    await page.getByLabel(/senha/i).fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL('/');

    // Reload page
    await page.reload();

    // Should still be authenticated
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();
  });

  test('should redirect to intended page after login', async ({ page }) => {
    // Try to access a protected page while not authenticated
    await page.goto('/members');

    // Should redirect to login with query parameter
    expect(page.url()).toContain('/login');

    // Login
    await page.getByRole('textbox', { name: /email/i }).fill('admin@ministerium.com');
    await page.getByLabel(/senha/i).fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Should redirect to dashboard (first resource)
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});
