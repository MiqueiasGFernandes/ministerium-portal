import dayjs from "dayjs";
import type {
	AnalyticsData,
	Member,
	MonthlyFinancialData,
	MonthlyMembersData,
	PeriodFilter,
	Transaction,
} from "@/types";

/**
 * Analytics Service
 * Handles data aggregation and calculations for analytics charts
 * Following SRP: Single responsibility for analytics data processing
 */
export class AnalyticsService {
	/**
	 * Get period range based on filter
	 */
	getPeriodRange(filter: PeriodFilter): { start: string; end: string } {
		const now = dayjs();
		let start: dayjs.Dayjs;

		switch (filter) {
			case "3months":
				start = now.subtract(2, "month").startOf("month");
				break;
			case "6months":
				start = now.subtract(5, "month").startOf("month");
				break;
			case "12months":
				start = now.subtract(11, "month").startOf("month");
				break;
			default:
				start = now.subtract(11, "month").startOf("month");
		}

		return {
			start: start.format("YYYY-MM-DD"),
			end: now.endOf("month").format("YYYY-MM-DD"),
		};
	}

	/**
	 * Generate month labels for the period
	 */
	private generateMonthLabels(start: string, end: string): string[] {
		const labels: string[] = [];
		let current = dayjs(start).startOf("month");
		const endDate = dayjs(end).startOf("month");

		while (
			current.isBefore(endDate) ||
			current.format("YYYY-MM") === endDate.format("YYYY-MM")
		) {
			labels.push(current.format("YYYY-MM"));
			current = current.add(1, "month");
		}

		return labels;
	}

	/**
	 * Aggregate financial data by month
	 * Performance: O(n) where n is number of transactions
	 */
	aggregateFinancialData(
		transactions: Transaction[],
		period: { start: string; end: string },
	): MonthlyFinancialData[] {
		const monthLabels = this.generateMonthLabels(period.start, period.end);

		// Initialize data structure with 0 values - O(m) where m is number of months
		const monthlyMap = new Map<string, MonthlyFinancialData>();
		for (const month of monthLabels) {
			monthlyMap.set(month, {
				month,
				monthLabel: dayjs(month).format("MMM/YYYY"),
				income: 0,
				expense: 0,
				balance: 0,
			});
		}

		// Aggregate transactions - O(n)
		for (const transaction of transactions) {
			const transactionMonth = dayjs(transaction.date).format("YYYY-MM");
			const monthData = monthlyMap.get(transactionMonth);

			if (monthData) {
				if (transaction.type === "income") {
					monthData.income += transaction.amount;
				} else if (transaction.type === "expense") {
					monthData.expense += transaction.amount;
				}
			}
		}

		// Calculate balances - O(m)
		const result: MonthlyFinancialData[] = [];
		for (const monthData of monthlyMap.values()) {
			monthData.balance = monthData.income - monthData.expense;
			result.push(monthData);
		}

		return result;
	}

	/**
	 * Aggregate members data by month
	 * Uses snapshot approach: count members by status at each month end
	 * Performance: O(n*m) where n is number of members and m is number of months
	 * For better performance with large datasets, consider caching or incremental updates
	 */
	aggregateMembersData(
		members: Member[],
		period: { start: string; end: string },
	): MonthlyMembersData[] {
		const monthLabels = this.generateMonthLabels(period.start, period.end);
		const result: MonthlyMembersData[] = [];

		// For each month, calculate the status count at month end
		for (const month of monthLabels) {
			const monthEnd = dayjs(month).endOf("month");
			const data: MonthlyMembersData = {
				month,
				monthLabel: dayjs(month).format("MMM/YYYY"),
				active: 0,
				inactive: 0,
				visitors: 0,
				total: 0,
			};

			// Count members by status at this point in time
			for (const member of members) {
				// Only count members that were created before or during this month
				const createdAt = dayjs(member.createdAt);
				if (createdAt.isAfter(monthEnd)) {
					continue;
				}

				// Count based on current status
				// Note: In a real implementation, you'd want a history table to track status changes over time
				switch (member.status) {
					case "active":
						data.active++;
						break;
					case "inactive":
						data.inactive++;
						break;
					case "visitor":
						data.visitors++;
						break;
				}
				data.total++;
			}

			result.push(data);
		}

		return result;
	}

	/**
	 * Get complete analytics data
	 */
	getAnalyticsData(
		transactions: Transaction[],
		members: Member[],
		filter: PeriodFilter = "12months",
	): AnalyticsData {
		const period = this.getPeriodRange(filter);

		// Filter data by period
		const filteredTransactions = transactions.filter((t) => {
			const date = dayjs(t.date);
			return date.isAfter(period.start) && date.isBefore(period.end);
		});

		return {
			financialData: this.aggregateFinancialData(filteredTransactions, period),
			membersData: this.aggregateMembersData(members, period),
			period,
		};
	}
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
