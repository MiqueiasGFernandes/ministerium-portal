import { test, expect } from '@playwright/test';

test.describe('Members Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@ministerium.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should display members list', async ({ page }) => {
    await page.click('text=Membros');
    await expect(page).toHaveURL('/members');
    await expect(page.locator('text=Membros').first()).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should create new member', async ({ page }) => {
    await page.goto('/members');
    await page.click('text=Novo Membro');

    await expect(page).toHaveURL('/members/create');

    await page.fill('input[name="name"]', 'Teste E2E Member');
    await page.fill('input[name="email"]', 'teste@e2e.com');
    await page.fill('input[name="phone"]', '(11) 99999-9999');

    await page.click('button:has-text("Salvar")');

    await expect(page).toHaveURL('/members');
  });

  test('should filter members by status', async ({ page }) => {
    await page.goto('/members');

    await page.click('input[placeholder="Filtrar por status"]');
    await page.click('text=Ativo');

    await page.waitForTimeout(500);
    await expect(page.locator('table tbody tr')).not.toHaveCount(0);
  });
});
