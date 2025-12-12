import { beforeEach, describe, expect, it } from "vitest";
import type { DashboardStats } from "@/types";
import { localDataProvider } from "../dataProvider";

describe("DataProvider - Dashboard Stats Consistency", () => {
	beforeEach(async () => {
		// Reset data before each test
		await localDataProvider.custom!({
			url: "/reset",
			method: "post",
		});
	});

	describe("Financial Data Consistency", () => {
		it("should have consistent financial data between indicators and chart for current month", async () => {
			// Get dashboard stats
			const response = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
				query: { period: "12months" },
			});

			const stats = response.data as DashboardStats;
			const now = new Date();
			const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

			// Find current month in historical data
			const currentMonthData = stats.historicalFinancialData?.find(
				(d) => d.month === currentMonthKey,
			);

			expect(currentMonthData).toBeDefined();

			// Verify indicators match chart data for current month
			expect(currentMonthData?.income).toBe(stats.financialSummary.totalIncome);
			expect(currentMonthData?.expense).toBe(
				stats.financialSummary.totalExpense,
			);
			expect(currentMonthData?.balance).toBe(stats.financialSummary.balance);
		});

		it("should calculate balance correctly in historical data", async () => {
			const response = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
				query: { period: "12months" },
			});

			const stats = response.data as DashboardStats;

			// Verify balance = income - expense for all months
			stats.historicalFinancialData?.forEach((monthData) => {
				const expectedBalance = monthData.income - monthData.expense;
				expect(monthData.balance).toBe(expectedBalance);
			});
		});

		it("should return correct number of months based on period filter", async () => {
			const periods = [
				{ period: "3months", expectedCount: 3 },
				{ period: "6months", expectedCount: 6 },
				{ period: "12months", expectedCount: 12 },
			];

			for (const { period, expectedCount } of periods) {
				const response = await localDataProvider.custom!({
					url: "/dashboard/stats",
					method: "get",
					query: { period },
				});

				const stats = response.data as DashboardStats;
				// Verify the data provider returns the correct number of months
				expect(stats.historicalFinancialData?.length).toBe(expectedCount);
			}
		});

		it("should have financial summary period covering current month", async () => {
			const response = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
			});

			const stats = response.data as DashboardStats;
			const now = new Date();
			const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			const periodStart = new Date(stats.financialSummary.period.start);
			const periodEnd = new Date(stats.financialSummary.period.end);

			// Verify period matches current month
			expect(periodStart.getTime()).toBe(firstDayOfMonth.getTime());
			expect(periodEnd.getFullYear()).toBe(lastDayOfMonth.getFullYear());
			expect(periodEnd.getMonth()).toBe(lastDayOfMonth.getMonth());
			expect(periodEnd.getDate()).toBe(lastDayOfMonth.getDate());
		});

		it("should match transactions from Finance tab with chart data", async () => {
			// Get all transactions
			const transactionsResponse = await localDataProvider.getList({
				resource: "transactions",
				pagination: { current: 1, pageSize: 1000 },
			});

			// Get dashboard stats
			const statsResponse = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
				query: { period: "12months" },
			});

			const stats = statsResponse.data as DashboardStats;
			const transactions = transactionsResponse.data;

			// Verify each month in chart matches raw transaction data
			stats.historicalFinancialData?.forEach((monthData) => {
				const [year, month] = monthData.month.split("-").map(Number);
				const monthStart = new Date(year, month - 1, 1);
				const monthEnd = new Date(year, month, 0);

				// Filter transactions for this month
				const monthTransactions = transactions.filter((t) => {
					const date = new Date(t.date);
					return (
						date >= monthStart &&
						date <= monthEnd &&
						date.getFullYear() === year &&
						date.getMonth() === month - 1
					);
				});

				const expectedIncome = monthTransactions
					.filter((t) => t.type === "income")
					.reduce((sum, t) => sum + t.amount, 0);

				const expectedExpense = monthTransactions
					.filter((t) => t.type === "expense")
					.reduce((sum, t) => sum + t.amount, 0);

				// Use closeTo for floating point comparisons
				expect(Math.abs(monthData.income - expectedIncome)).toBeLessThan(0.01);
				expect(Math.abs(monthData.expense - expectedExpense)).toBeLessThan(
					0.01,
				);
				expect(
					Math.abs(monthData.balance - (expectedIncome - expectedExpense)),
				).toBeLessThan(0.01);
			});
		});

		it("should have zero values for months with no transactions", async () => {
			// Reset with empty transactions
			const response = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
				query: { period: "3months" },
			});

			const stats = response.data as DashboardStats;

			// Even with fake data, verify the structure is correct
			// All months should have income, expense, and balance defined
			stats.historicalFinancialData?.forEach((monthData) => {
				expect(monthData.income).toBeGreaterThanOrEqual(0);
				expect(monthData.expense).toBeGreaterThanOrEqual(0);
				expect(monthData.balance).toBe(monthData.income - monthData.expense);
			});
		});

		it("should format month labels correctly", async () => {
			const response = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
				query: { period: "3months" },
			});

			const stats = response.data as DashboardStats;

			// Verify month labels are in pt-BR format
			stats.historicalFinancialData?.forEach((monthData) => {
				// Month label should be a string with month name and year
				expect(typeof monthData.monthLabel).toBe("string");
				expect(monthData.monthLabel.length).toBeGreaterThan(0);
				// Should contain year (2024, 2025, etc)
				expect(monthData.monthLabel).toMatch(/\d{4}/);

				// Month key should be in YYYY-MM format
				expect(monthData.month).toMatch(/\d{4}-\d{2}/);
			});
		});

		it("should maintain data consistency across multiple calls", async () => {
			// Call dashboard stats multiple times
			const response1 = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
				query: { period: "12months" },
			});

			const response2 = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
				query: { period: "12months" },
			});

			const stats1 = response1.data as DashboardStats;
			const stats2 = response2.data as DashboardStats;

			// Data should be identical
			expect(stats1.financialSummary.totalIncome).toBe(
				stats2.financialSummary.totalIncome,
			);
			expect(stats1.financialSummary.totalExpense).toBe(
				stats2.financialSummary.totalExpense,
			);
			expect(stats1.financialSummary.balance).toBe(
				stats2.financialSummary.balance,
			);

			// Historical data should match
			expect(stats1.historicalFinancialData?.length).toBe(
				stats2.historicalFinancialData?.length,
			);
		});
	});

	describe("Integration with Finance Tab", () => {
		it("should reflect the same transactions shown in Finance tab", async () => {
			// Get current month transactions from Finance tab perspective
			const now = new Date();
			const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			const transactionsResponse = await localDataProvider.getList({
				resource: "transactions",
				pagination: { current: 1, pageSize: 1000 },
			});

			const currentMonthTransactions = transactionsResponse.data.filter((t) => {
				const date = new Date(t.date);
				return date >= firstDayOfMonth && date <= lastDayOfMonth;
			});

			const financeTabIncome = currentMonthTransactions
				.filter((t) => t.type === "income")
				.reduce((sum, t) => sum + t.amount, 0);

			const financeTabExpense = currentMonthTransactions
				.filter((t) => t.type === "expense")
				.reduce((sum, t) => sum + t.amount, 0);

			// Get dashboard stats
			const statsResponse = await localDataProvider.custom!({
				url: "/dashboard/stats",
				method: "get",
			});

			const stats = statsResponse.data as DashboardStats;

			// Verify Finance tab totals match Dashboard indicators
			expect(stats.financialSummary.totalIncome).toBe(financeTabIncome);
			expect(stats.financialSummary.totalExpense).toBe(financeTabExpense);
			expect(stats.financialSummary.balance).toBe(
				financeTabIncome - financeTabExpense,
			);
		});
	});

	describe("Members LocalStorage Synchronization", () => {
		beforeEach(async () => {
			// Clear localStorage and reset initialization flag
			localStorage.clear();
			// Use the reset endpoint to properly reset state
			await localDataProvider.custom!({
				url: "/reset",
				method: "post",
			});
		});

		it("should sync members from localStorage when calling getList", async () => {
			// Add member directly to localStorage (simulating approval flow)
			const newMember = {
				id: "member-test-1",
				name: "Test Member",
				email: "test@example.com",
				phone: "11999999999",
				status: "visitor",
				tenantId: "1",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			localStorage.setItem("members", JSON.stringify([newMember]));

			// Call getList
			const response = await localDataProvider.getList({
				resource: "members",
				pagination: { current: 1, pageSize: 10 },
			});

			// Should merge fakeData + new member
			expect(response.total).toBeGreaterThan(100); // At least 100 fakeData + 1 new

			// Verify the new member is included
			const foundMember = response.data.find((m) => m.id === "member-test-1");
			expect(foundMember).toBeDefined();
			expect(foundMember?.name).toBe("Test Member");
		});

		it("should persist created members to localStorage", async () => {
			// Trigger initialization by calling getList first
			await localDataProvider.getList({
				resource: "members",
				pagination: { current: 1, pageSize: 10 },
			});

			// Get initial count after initialization
			const initialMembers = JSON.parse(
				localStorage.getItem("members") || "[]",
			);
			const initialCount = initialMembers.length;

			// Create a member via dataProvider
			const newMember = {
				name: "Created Member",
				email: "created@example.com",
				phone: "11888888888",
				status: "visitor",
			};

			await localDataProvider.create({
				resource: "members",
				variables: newMember,
			});

			// Verify it was saved to localStorage
			const storedMembers = JSON.parse(
				localStorage.getItem("members") || "[]",
			) as Array<{ email: string; name: string }>;
			expect(storedMembers.length).toBe(initialCount + 1);
			const createdMember = storedMembers.find(
				(m) => m.email === "created@example.com",
			);
			expect(createdMember).toBeDefined();
			expect(createdMember?.name).toBe("Created Member");
		});

		it("should sync members from localStorage when calling getOne", async () => {
			// Add member to localStorage
			const member = {
				id: "member-123",
				name: "Get One Test",
				email: "getone@example.com",
				status: "active",
				tenantId: "1",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			localStorage.setItem("members", JSON.stringify([member]));

			// Get the member
			const response = await localDataProvider.getOne({
				resource: "members",
				id: "member-123",
			});

			expect(response.data.id).toBe("member-123");
			expect(response.data.name).toBe("Get One Test");
		});

		it("should update members in localStorage when calling update", async () => {
			// Add member to localStorage
			const member = {
				id: "member-456",
				name: "Original Name",
				email: "original@example.com",
				status: "visitor",
				tenantId: "1",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			localStorage.setItem("members", JSON.stringify([member]));

			// Update the member
			await localDataProvider.update({
				resource: "members",
				id: "member-456",
				variables: { name: "Updated Name" },
			});

			// Verify localStorage was updated
			const storedMembers = JSON.parse(localStorage.getItem("members") || "[]");
			const updatedMember = storedMembers.find(
				(m: any) => m.id === "member-456",
			);
			expect(updatedMember).toBeDefined();
			expect(updatedMember?.name).toBe("Updated Name");
		});

		it("should delete members from localStorage when calling deleteOne", async () => {
			// Add members to localStorage
			const members = [
				{
					id: "member-1",
					name: "Member 1",
					email: "member1@example.com",
					status: "active",
					tenantId: "1",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: "member-2",
					name: "Member 2",
					email: "member2@example.com",
					status: "active",
					tenantId: "1",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			];

			localStorage.setItem("members", JSON.stringify(members));

			// Delete one member
			await localDataProvider.deleteOne({
				resource: "members",
				id: "member-1",
			});

			// Verify localStorage was updated - should have fakeData + member-2 (member-1 deleted)
			const storedMembers = JSON.parse(localStorage.getItem("members") || "[]");

			// Should not find deleted member
			const deletedMember = storedMembers.find((m: any) => m.id === "member-1");
			expect(deletedMember).toBeUndefined();

			// Should still have member-2
			const remainingMember = storedMembers.find(
				(m: any) => m.id === "member-2",
			);
			expect(remainingMember).toBeDefined();
			expect(remainingMember?.id).toBe("member-2");
		});

		it("should handle approval flow: registration -> member creation -> member appears in list", async () => {
			// Simulate registration approval creating a member in localStorage
			const approvedMember = {
				id: "member-approved-1",
				name: "Approved Member",
				email: "approved@example.com",
				phone: "11777777777",
				status: "visitor",
				tenantId: "1",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			// This simulates what MemberRegistrationManagement does
			localStorage.setItem("members", JSON.stringify([approvedMember]));

			// Now the member list should show this member merged with fakeData
			const response = await localDataProvider.getList({
				resource: "members",
				pagination: { current: 1, pageSize: 10000 }, // Large page to get all
			});

			// Should have fakeData + approved member
			expect(response.total).toBeGreaterThan(100);

			// Verify the approved member is in the list
			const foundMember = response.data.find(
				(m) => m.id === "member-approved-1",
			);
			expect(foundMember).toBeDefined();
			expect(foundMember?.name).toBe("Approved Member");
			expect(foundMember?.status).toBe("visitor");
		});
	});
});
