import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@ministerium.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should display dashboard widgets', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Total de Membros')).toBeVisible();
    await expect(page.locator('text=Entradas do Mês')).toBeVisible();
    await expect(page.locator('text=Saídas do Mês')).toBeVisible();
    await expect(page.locator('text=Saldo do Mês')).toBeVisible();
  });

  test('should display upcoming events', async ({ page }) => {
    await expect(page.locator('text=Próximos Eventos')).toBeVisible();
  });

  test('should display upcoming schedules', async ({ page }) => {
    await expect(page.locator('text=Escalas da Semana')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Total de Membros')).toBeVisible();
  });
});
