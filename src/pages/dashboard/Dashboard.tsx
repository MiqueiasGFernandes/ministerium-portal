import {
	Alert,
	Badge,
	Box,
	Card,
	Grid,
	Group,
	Paper,
	Progress,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	ThemeIcon,
	Timeline,
	Title,
} from "@mantine/core";
import { useCustom } from "@refinedev/core";
import {
	IconCalendarEvent,
	IconCash,
	IconClipboardList,
	IconInfoCircle,
	IconTrendingDown,
	IconTrendingUp,
	IconUsers,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import type { DashboardStats } from "@/types";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback, useState } from "react";
import { FinancialChart } from "@/components/analytics/FinancialChart";
import { MembersEvolutionChart } from "@/components/analytics/MembersEvolutionChart";
import { shouldShowTestData } from "@/config/env";
import { useDashboardTour } from "@/hooks/useDashboardTour";
import { usePermissions } from "@/hooks/usePermissions";
import type { PeriodFilter } from "@/types";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

/**
 * Dashboard Component
 * Main dashboard with statistics and widgets
 */
export const Dashboard = () => {
	// RBAC - Check permissions
	const { canView, isAdmin } = usePermissions();
	const canViewAnalytics = canView("analytics");
	const canViewFinancialChart = isAdmin() || canView("finance"); // Admins and financial users can view financial chart

	// Analytics state - controls which period to fetch from backend
	const [analyticsPeriod, setAnalyticsPeriod] =
		useState<PeriodFilter>("12months");

	// Fetch dashboard stats with period filter for analytics
	const { data, isLoading } = useCustom<DashboardStats>({
		url: "/dashboard/stats",
		method: "get",
		config: {
			query: {
				period: analyticsPeriod,
			},
		},
	});

	const stats = data?.data;

	// Initialize dashboard tour
	useDashboardTour();

	// Handler for period changes - both charts use the same period
	const handlePeriodChange = useCallback((period: PeriodFilter) => {
		setAnalyticsPeriod(period);
	}, []);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	const getBalanceColor = (balance: number) => {
		if (balance > 0) return "green";
		if (balance < 0) return "red";
		return "gray";
	};

	return (
		<Stack gap="lg">
			<Title order={2} data-tour="dashboard-title">
				Dashboard
			</Title>

			{shouldShowTestData() && (
				<Alert
					icon={<IconInfoCircle />}
					title="Bem-vindo ao Ministerium!"
					color="blue"
					variant="light"
				>
					Este é um ambiente de demonstração com dados fake. Explore todas as
					funcionalidades!
				</Alert>
			)}

			{/* Stats Cards */}
			<SimpleGrid
				cols={{ base: 1, sm: 2, lg: 4 }}
				spacing="lg"
				data-tour="dashboard-stats"
			>
				{/* Total Members */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="apart">
						<div>
							<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
								Total de Membros
							</Text>
							<Text size="xl" fw={700}>
								{isLoading ? (
									<Skeleton height={30} width={60} />
								) : (
									stats?.totalMembers
								)}
							</Text>
						</div>
						<ThemeIcon size="xl" radius="md" variant="light" color="blue">
							<IconUsers size="1.8rem" />
						</ThemeIcon>
					</Group>
					{!isLoading && stats && (
						<Group mt="md" gap="xs">
							<Text size="sm" c="dimmed">
								Ativos:
							</Text>
							<Badge color="green" variant="light">
								{stats.activeMembers}
							</Badge>
							<Text size="sm" c="dimmed">
								Visitantes:
							</Text>
							<Badge color="blue" variant="light">
								{stats.visitors}
							</Badge>
						</Group>
					)}
				</Card>

				{/* Total Income */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="apart">
						<div>
							<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
								Entradas do Mês
							</Text>
							<Text size="xl" fw={700} c="green">
								{isLoading ? (
									<Skeleton height={30} width={100} />
								) : (
									formatCurrency(stats?.financialSummary.totalIncome || 0)
								)}
							</Text>
						</div>
						<ThemeIcon size="xl" radius="md" variant="light" color="green">
							<IconTrendingUp size="1.8rem" />
						</ThemeIcon>
					</Group>
				</Card>

				{/* Total Expenses */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="apart">
						<div>
							<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
								Saídas do Mês
							</Text>
							<Text size="xl" fw={700} c="red">
								{isLoading ? (
									<Skeleton height={30} width={100} />
								) : (
									formatCurrency(stats?.financialSummary.totalExpense || 0)
								)}
							</Text>
						</div>
						<ThemeIcon size="xl" radius="md" variant="light" color="red">
							<IconTrendingDown size="1.8rem" />
						</ThemeIcon>
					</Group>
				</Card>

				{/* Balance */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="apart">
						<div>
							<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
								Saldo do Mês
							</Text>
							<Text
								size="xl"
								fw={700}
								c={
									stats
										? getBalanceColor(stats.financialSummary.balance)
										: "gray"
								}
							>
								{isLoading ? (
									<Skeleton height={30} width={100} />
								) : (
									formatCurrency(stats?.financialSummary.balance || 0)
								)}
							</Text>
						</div>
						<ThemeIcon
							size="xl"
							radius="md"
							variant="light"
							color={
								stats ? getBalanceColor(stats.financialSummary.balance) : "gray"
							}
						>
							<IconCash size="1.8rem" />
						</ThemeIcon>
					</Group>
				</Card>
			</SimpleGrid>

			<Grid>
				{/* Upcoming Events */}
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper
						shadow="sm"
						p="lg"
						radius="md"
						withBorder
						h="100%"
						data-tour="upcoming-events"
					>
						<Group mb="md">
							<ThemeIcon size="lg" radius="md" variant="light" color="violet">
								<IconCalendarEvent size="1.2rem" />
							</ThemeIcon>
							<Title order={4}>Próximos Eventos</Title>
						</Group>

						{isLoading ? (
							<Stack gap="sm">
								{[1, 2, 3].map((i) => (
									<Skeleton key={i} height={60} />
								))}
							</Stack>
						) : stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
							<Timeline bulletSize={24} lineWidth={2}>
								{stats.upcomingEvents.slice(0, 5).map((event) => (
									<Timeline.Item
										key={event.id}
										bullet={<IconCalendarEvent size="0.8rem" />}
										title={event.title}
									>
										<Text size="sm" c="dimmed">
											{dayjs(event.date).format("DD/MM/YYYY")} às {event.time}
										</Text>
										<Text size="sm" c="dimmed">
											{event.location}
										</Text>
										<Badge size="sm" variant="light" mt="xs">
											{event.attendees?.length || 0} inscritos
										</Badge>
									</Timeline.Item>
								))}
							</Timeline>
						) : (
							<Text size="sm" c="dimmed">
								Nenhum evento próximo agendado.
							</Text>
						)}
					</Paper>
				</Grid.Col>

				{/* Upcoming Schedules */}
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
						<Group mb="md">
							<ThemeIcon size="lg" radius="md" variant="light" color="orange">
								<IconClipboardList size="1.2rem" />
							</ThemeIcon>
							<Title order={4}>Escalas da Semana</Title>
						</Group>

						{isLoading ? (
							<Stack gap="sm">
								{[1, 2, 3].map((i) => (
									<Skeleton key={i} height={60} />
								))}
							</Stack>
						) : stats?.upcomingSchedules &&
							stats.upcomingSchedules.length > 0 ? (
							<Stack gap="md">
								{stats.upcomingSchedules.slice(0, 5).map((schedule) => {
									const confirmed =
										schedule.volunteers?.filter((v) => v.status === "confirmed")
											.length || 0;
									const total = schedule.volunteers?.length || 0;
									const percentage = total > 0 ? (confirmed / total) * 100 : 0;

									return (
										<Box key={schedule.id}>
											<Group justify="apart" mb="xs">
												<div>
													<Text size="sm" fw={500}>
														{schedule.title}
													</Text>
													<Text size="xs" c="dimmed">
														{dayjs(schedule.date).format("DD/MM/YYYY")}
													</Text>
												</div>
												<Badge
													color={percentage === 100 ? "green" : "yellow"}
													variant="light"
												>
													{confirmed}/{total}
												</Badge>
											</Group>
											<Progress
												value={percentage}
												color={percentage === 100 ? "green" : "yellow"}
											/>
										</Box>
									);
								})}
							</Stack>
						) : (
							<Text size="sm" c="dimmed">
								Nenhuma escala agendada para esta semana.
							</Text>
						)}
					</Paper>
				</Grid.Col>
			</Grid>

			{/* Analytics Charts */}
			{canViewAnalytics && (
				<Grid>
					{/* Financial Chart - Only visible for admins */}
					{canViewFinancialChart && (
						<Grid.Col span={{ base: 12, lg: canViewAnalytics ? 6 : 12 }}>
							{isLoading ? (
								<Skeleton height={450} />
							) : (
								<FinancialChart
									data={stats?.historicalFinancialData || []}
									onPeriodChange={handlePeriodChange}
								/>
							)}
						</Grid.Col>
					)}

					{/* Members Evolution Chart - Visible for admins and leaders */}
					<Grid.Col
						span={{
							base: 12,
							lg: canViewFinancialChart ? 6 : 12,
						}}
					>
						{isLoading ? (
							<Skeleton height={450} />
						) : (
							<MembersEvolutionChart
								data={stats?.historicalMembersData || []}
								onPeriodChange={handlePeriodChange}
							/>
						)}
					</Grid.Col>
				</Grid>
			)}
		</Stack>
	);
};

export default Dashboard;
