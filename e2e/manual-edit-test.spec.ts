import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/**
 * Manual test to verify edit forms load data
 * This test will check the browser console for debug logs
 */

// Helper function to login
async function loginAs(
	page: Page,
	email: string,
	password: string,
): Promise<void> {
	await page.goto("/login");
	await page.waitForLoadState("networkidle");

	await page.locator('input[name="email"]:visible').first().clear();
	await page.locator('input[type="password"]:visible').first().clear();

	await page.locator('input[name="email"]:visible').first().fill(email);
	await page.locator('input[type="password"]:visible').first().fill(password);
	await page.locator('button[type="submit"]:visible').first().click();

	await page.waitForURL("/", { timeout: 10000 });
	await page.waitForLoadState("networkidle");
}

test.describe("Manual Edit Form Test", () => {
	test("should load data in event edit form", async ({ page }) => {
		// Collect console logs
		const consoleLogs: string[] = [];
		page.on("console", (msg) => {
			consoleLogs.push(`${msg.type()}: ${msg.text()}`);
		});

		// Login
		await loginAs(page, "admin@ministerium.com", "admin123");

		// Navigate directly to a known event edit page
		// Using the first event from fakeData which should be event-1
		await page.goto("/events/edit/event-1");
		await page.waitForLoadState("networkidle");

		// Wait a bit for React to render and console logs to appear
		await page.waitForTimeout(3000);

		//Print all console logs first to see what's happening
		console.log("\n=== Browser Console Logs ===");
		for (const log of consoleLogs) {
			console.log(log);
		}
		console.log("=== End Console Logs ===\n");

		// Check if title input exists
		const titleInput = page.locator('input[name="title"]');
		const titleExists = await titleInput.count();
		console.log("Title input count:", titleExists);

		if (titleExists > 0) {
			const titleValue = await titleInput.inputValue();
			console.log("Title input value:", titleValue);
			console.log("Title value length:", titleValue.length);

			// The bug: fields are empty when they should have data
			// This test documents the issue - we expect it to fail
			if (titleValue === "") {
				console.log(
					"\n❌ BUG CONFIRMED: Edit form is NOT loading data from the record!",
				);
			} else {
				console.log("\n✓ Edit form is correctly loading data:", titleValue);
			}
		}
	});
});
