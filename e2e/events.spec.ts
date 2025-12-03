import { test, expect } from '@playwright/test';

test.describe('Events Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@ministerium.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should display events list', async ({ page }) => {
    await page.click('text=Eventos');
    await expect(page).toHaveURL('/events');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should create new event', async ({ page }) => {
    await page.goto('/events');
    await page.click('text=Novo Evento');

    await expect(page).toHaveURL('/events/create');

    await page.fill('input[name="title"]', 'Evento E2E');
    await page.fill('textarea', 'Descrição do evento de teste');
    await page.fill('input[name="location"]', 'Local Teste');

    await page.click('button:has-text("Salvar")');

    await expect(page).toHaveURL('/events');
  });

  test('should view event details with QR code', async ({ page }) => {
    await page.goto('/events');

    await page.click('table tbody tr:first-child button[aria-label*="view"]').catch(() => {});
    await page.click('table tbody tr:first-child svg').first();

    await page.waitForTimeout(500);
    await expect(page.locator('text=QR Code Check-in')).toBeVisible();
  });
});
