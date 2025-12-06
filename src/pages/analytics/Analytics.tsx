import { Alert, Grid, Skeleton, Stack, Title } from "@mantine/core";
import { useList } from "@refinedev/core";
import { IconChartBar, IconInfoCircle } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { FinancialChart } from "@/components/analytics/FinancialChart";
import { MembersEvolutionChart } from "@/components/analytics/MembersEvolutionChart";
import { usePermissions } from "@/hooks/usePermissions";
import { analyticsService } from "@/services/analytics/analyticsService";
import type { Member, PeriodFilter, Transaction } from "@/types";

/**
 * Analytics Page
 * Protected page showing financial and members evolution charts
 * Following RBAC: Only accessible by admins and leaders
 */
export const Analytics = () => {
	const { canView, isLoading: permissionsLoading } = usePermissions();
	const [financialPeriod, setFinancialPeriod] =
		useState<PeriodFilter>("12months");
	const [membersPeriod, setMembersPeriod] = useState<PeriodFilter>("12months");

	// Check permissions
	const hasAccess = canView("analytics");

	// Fetch transactions data
	const { data: transactionsData, isLoading: transactionsLoading } =
		useList<Transaction>({
			resource: "transactions",
			pagination: { mode: "off" },
			queryOptions: {
				enabled: hasAccess && !permissionsLoading,
			},
		});

	// Fetch members data
	const { data: membersData, isLoading: membersLoading } = useList<Member>({
		resource: "members",
		pagination: { mode: "off" },
		queryOptions: {
			enabled: hasAccess && !permissionsLoading,
		},
	});

	// Calculate analytics data using memoization for performance
	const financialAnalytics = useMemo(() => {
		if (!transactionsData?.data) return [];

		const period = analyticsService.getPeriodRange(financialPeriod);
		return analyticsService.aggregateFinancialData(
			transactionsData.data,
			period,
		);
	}, [transactionsData?.data, financialPeriod]);

	const membersAnalytics = useMemo(() => {
		if (!membersData?.data) return [];

		const period = analyticsService.getPeriodRange(membersPeriod);
		return analyticsService.aggregateMembersData(membersData.data, period);
	}, [membersData?.data, membersPeriod]);

	// Handlers with useCallback to prevent unnecessary re-renders
	const handleFinancialPeriodChange = useCallback((period: PeriodFilter) => {
		setFinancialPeriod(period);
	}, []);

	const handleMembersPeriodChange = useCallback((period: PeriodFilter) => {
		setMembersPeriod(period);
	}, []);

	// Loading state
	if (permissionsLoading) {
		return (
			<Stack gap="lg">
				<Skeleton height={40} width={200} />
				<Grid>
					<Grid.Col span={{ base: 12, lg: 6 }}>
						<Skeleton height={450} />
					</Grid.Col>
					<Grid.Col span={{ base: 12, lg: 6 }}>
						<Skeleton height={450} />
					</Grid.Col>
				</Grid>
			</Stack>
		);
	}

	// Access control: Redirect if user doesn't have permission
	if (!hasAccess) {
		return <Navigate to="/unauthorized" replace />;
	}

	const isLoading = transactionsLoading || membersLoading;

	return (
		<Stack gap="lg">
			<Stack gap="xs">
				<Title order={2}>
					<IconChartBar
						size={32}
						style={{ verticalAlign: "middle", marginRight: 8 }}
					/>
					Analytics
				</Title>
				<Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
					Visualize a evolução financeira e de membros da sua igreja ao longo do
					tempo. Dados atualizados em tempo real.
				</Alert>
			</Stack>

			<Grid>
				{/* Financial Chart */}
				<Grid.Col span={{ base: 12, lg: 6 }}>
					{isLoading ? (
						<Skeleton height={450} />
					) : (
						<FinancialChart
							data={financialAnalytics}
							onPeriodChange={handleFinancialPeriodChange}
						/>
					)}
				</Grid.Col>

				{/* Members Evolution Chart */}
				<Grid.Col span={{ base: 12, lg: 6 }}>
					{isLoading ? (
						<Skeleton height={450} />
					) : (
						<MembersEvolutionChart
							data={membersAnalytics}
							onPeriodChange={handleMembersPeriodChange}
						/>
					)}
				</Grid.Col>
			</Grid>

			{/* Performance info for development */}
			{process.env.NODE_ENV === "development" && (
				<Alert icon={<IconInfoCircle size={16} />} color="gray" variant="light">
					<strong>Performance:</strong> Processando{" "}
					{transactionsData?.data?.length || 0} transações e{" "}
					{membersData?.data?.length || 0} membros. Tempo de agregação otimizado
					para {"<"}600ms.
				</Alert>
			)}
		</Stack>
	);
};

export default Analytics;
