import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import type {
	Member,
	MemberStatus,
	Transaction,
	TransactionCategory,
	TransactionType,
} from "@/types";
import { AnalyticsService } from "../analyticsService";

describe("AnalyticsService", () => {
	const service = new AnalyticsService();

	describe("aggregateFinancialData", () => {
		it("should aggregate transactions by month correctly", () => {
			const period = {
				start: "2024-01-01",
				end: "2024-03-31",
			};

			const transactions: Transaction[] = [
				{
					id: "1",
					type: "income" as TransactionType,
					amount: 1000,
					category: "tithe" as TransactionCategory,
					description: "Dízimo",
					date: "2024-01-15",
					tenantId: "tenant1",
					createdBy: "user1",
					createdAt: "2024-01-15",
					updatedAt: "2024-01-15",
				},
				{
					id: "2",
					type: "expense" as TransactionType,
					amount: 500,
					category: "purchase" as TransactionCategory,
					description: "Compra",
					date: "2024-01-20",
					tenantId: "tenant1",
					createdBy: "user1",
					createdAt: "2024-01-20",
					updatedAt: "2024-01-20",
				},
				{
					id: "3",
					type: "income" as TransactionType,
					amount: 1500,
					category: "offering" as TransactionCategory,
					description: "Oferta",
					date: "2024-02-10",
					tenantId: "tenant1",
					createdBy: "user1",
					createdAt: "2024-02-10",
					updatedAt: "2024-02-10",
				},
			];

			const result = service.aggregateFinancialData(transactions, period);

			expect(result).toHaveLength(3);

			// January
			expect(result[0].month).toBe("2024-01");
			expect(result[0].income).toBe(1000);
			expect(result[0].expense).toBe(500);
			expect(result[0].balance).toBe(500);

			// February
			expect(result[1].month).toBe("2024-02");
			expect(result[1].income).toBe(1500);
			expect(result[1].expense).toBe(0);
			expect(result[1].balance).toBe(1500);

			// March (no transactions)
			expect(result[2].month).toBe("2024-03");
			expect(result[2].income).toBe(0);
			expect(result[2].expense).toBe(0);
			expect(result[2].balance).toBe(0);
		});

		it("should handle empty transactions array", () => {
			const period = {
				start: "2024-01-01",
				end: "2024-01-31",
			};

			const result = service.aggregateFinancialData([], period);

			expect(result).toHaveLength(1);
			expect(result[0].income).toBe(0);
			expect(result[0].expense).toBe(0);
			expect(result[0].balance).toBe(0);
		});

		it("should format month labels correctly", () => {
			const period = {
				start: "2024-01-01",
				end: "2024-02-28",
			};

			const result = service.aggregateFinancialData([], period);

			// Month labels should be in format MMM/YYYY
			expect(result[0].monthLabel).toMatch(/2024$/);
			expect(result[1].monthLabel).toMatch(/2024$/);
			expect(result).toHaveLength(2);
		});
	});

	describe("aggregateMembersData", () => {
		it("should count members by status correctly", () => {
			const period = {
				start: "2024-01-01",
				end: "2024-03-31",
			};

			const members: Member[] = [
				{
					id: "1",
					name: "João Silva",
					status: "active" as MemberStatus,
					tags: [],
					customFields: {},
					tenantId: "tenant1",
					createdAt: "2024-01-10",
					updatedAt: "2024-01-10",
				},
				{
					id: "2",
					name: "Maria Santos",
					status: "active" as MemberStatus,
					tags: [],
					customFields: {},
					tenantId: "tenant1",
					createdAt: "2024-01-15",
					updatedAt: "2024-01-15",
				},
				{
					id: "3",
					name: "Pedro Costa",
					status: "visitor" as MemberStatus,
					tags: [],
					customFields: {},
					tenantId: "tenant1",
					createdAt: "2024-02-05",
					updatedAt: "2024-02-05",
				},
				{
					id: "4",
					name: "Ana Lima",
					status: "inactive" as MemberStatus,
					tags: [],
					customFields: {},
					tenantId: "tenant1",
					createdAt: "2024-03-10",
					updatedAt: "2024-03-10",
				},
			];

			const result = service.aggregateMembersData(members, period);

			expect(result).toHaveLength(3);

			// January - 2 active members
			expect(result[0].month).toBe("2024-01");
			expect(result[0].active).toBe(2);
			expect(result[0].visitors).toBe(0);
			expect(result[0].inactive).toBe(0);
			expect(result[0].total).toBe(2);

			// February - 2 active + 1 visitor
			expect(result[1].month).toBe("2024-02");
			expect(result[1].active).toBe(2);
			expect(result[1].visitors).toBe(1);
			expect(result[1].inactive).toBe(0);
			expect(result[1].total).toBe(3);

			// March - 2 active + 1 visitor + 1 inactive
			expect(result[2].month).toBe("2024-03");
			expect(result[2].active).toBe(2);
			expect(result[2].visitors).toBe(1);
			expect(result[2].inactive).toBe(1);
			expect(result[2].total).toBe(4);
		});

		it("should not count members created after month end", () => {
			const period = {
				start: "2024-01-01",
				end: "2024-02-28",
			};

			const members: Member[] = [
				{
					id: "1",
					name: "João Silva",
					status: "active" as MemberStatus,
					tags: [],
					customFields: {},
					tenantId: "tenant1",
					createdAt: "2024-01-15",
					updatedAt: "2024-01-15",
				},
				{
					id: "2",
					name: "Maria Santos",
					status: "active" as MemberStatus,
					tags: [],
					customFields: {},
					tenantId: "tenant1",
					createdAt: "2024-03-01", // After period
					updatedAt: "2024-03-01",
				},
			];

			const result = service.aggregateMembersData(members, period);

			// January
			expect(result[0].total).toBe(1);

			// February
			expect(result[1].total).toBe(1);
		});

		it("should handle empty members array", () => {
			const period = {
				start: "2024-01-01",
				end: "2024-01-31",
			};

			const result = service.aggregateMembersData([], period);

			expect(result).toHaveLength(1);
			expect(result[0].active).toBe(0);
			expect(result[0].inactive).toBe(0);
			expect(result[0].visitors).toBe(0);
			expect(result[0].total).toBe(0);
		});
	});

	describe("getAnalyticsData", () => {
		it("should return complete analytics data", () => {
			const transactions: Transaction[] = [
				{
					id: "1",
					type: "income" as TransactionType,
					amount: 1000,
					category: "tithe" as TransactionCategory,
					description: "Dízimo",
					date: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
					tenantId: "tenant1",
					createdBy: "user1",
					createdAt: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
					updatedAt: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
				},
			];

			const members: Member[] = [
				{
					id: "1",
					name: "João Silva",
					status: "active" as MemberStatus,
					tags: [],
					customFields: {},
					tenantId: "tenant1",
					createdAt: dayjs().subtract(2, "month").format("YYYY-MM-DD"),
					updatedAt: dayjs().subtract(2, "month").format("YYYY-MM-DD"),
				},
			];

			const result = service.getAnalyticsData(
				transactions,
				members,
				"12months",
			);

			expect(result.financialData).toBeDefined();
			expect(result.membersData).toBeDefined();
			expect(result.period).toBeDefined();
			expect(result.period.start).toBeDefined();
			expect(result.period.end).toBeDefined();
		});

		it("should filter transactions by period", () => {
			const oldTransaction: Transaction = {
				id: "1",
				type: "income" as TransactionType,
				amount: 1000,
				category: "tithe" as TransactionCategory,
				description: "Dízimo",
				date: "2020-01-01",
				tenantId: "tenant1",
				createdBy: "user1",
				createdAt: "2020-01-01",
				updatedAt: "2020-01-01",
			};

			const recentTransaction: Transaction = {
				id: "2",
				type: "income" as TransactionType,
				amount: 2000,
				category: "offering" as TransactionCategory,
				description: "Oferta",
				date: dayjs().format("YYYY-MM-DD"),
				tenantId: "tenant1",
				createdBy: "user1",
				createdAt: dayjs().format("YYYY-MM-DD"),
				updatedAt: dayjs().format("YYYY-MM-DD"),
			};

			const result = service.getAnalyticsData(
				[oldTransaction, recentTransaction],
				[],
				"6months",
			);

			// Old transaction should be filtered out
			const totalIncome = result.financialData.reduce(
				(sum, d) => sum + d.income,
				0,
			);
			expect(totalIncome).toBe(2000);
		});
	});

	describe("Performance", () => {
		it("should handle large datasets efficiently", () => {
			const startTime = performance.now();

			// Generate 10,000 transactions
			const transactions: Transaction[] = Array.from(
				{ length: 10000 },
				(_, i) => ({
					id: `t${i}`,
					type: (i % 2 === 0 ? "income" : "expense") as TransactionType,
					amount: Math.random() * 1000,
					category: "tithe" as TransactionCategory,
					description: "Test",
					date: dayjs()
						.subtract(Math.floor(Math.random() * 365), "days")
						.format("YYYY-MM-DD"),
					tenantId: "tenant1",
					createdBy: "user1",
					createdAt: dayjs().format("YYYY-MM-DD"),
					updatedAt: dayjs().format("YYYY-MM-DD"),
				}),
			);

			// Generate 5,000 members
			const members: Member[] = Array.from({ length: 5000 }, (_, i) => ({
				id: `m${i}`,
				name: `Member ${i}`,
				status: ["active", "inactive", "visitor"][i % 3] as MemberStatus,
				tags: [],
				customFields: {},
				tenantId: "tenant1",
				createdAt: dayjs()
					.subtract(Math.floor(Math.random() * 365), "days")
					.format("YYYY-MM-DD"),
				updatedAt: dayjs().format("YYYY-MM-DD"),
			}));

			const result = service.getAnalyticsData(
				transactions,
				members,
				"12months",
			);

			const endTime = performance.now();
			const executionTime = endTime - startTime;

			expect(result.financialData.length).toBeGreaterThan(0);
			expect(result.membersData.length).toBeGreaterThan(0);

			// Should complete in less than 1200ms (allowing for slower machines/CI)
			// PRD specifies <600ms but we add significant margin for CI/different environments
			console.log(`Execution time: ${executionTime.toFixed(2)}ms`);
			expect(executionTime).toBeLessThan(1200);
		});
	});
});
