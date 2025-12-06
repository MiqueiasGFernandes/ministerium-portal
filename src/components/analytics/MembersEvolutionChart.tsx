import { Card, Group, Select, Stack, Text, Title } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { MonthlyMembersData, PeriodFilter } from "@/types";

interface MembersEvolutionChartProps {
	data: MonthlyMembersData[];
	onPeriodChange?: (period: PeriodFilter) => void;
	isLoading?: boolean;
}

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: MonthlyMembersData;
	}>;
}

/**
 * Members Evolution Chart Component
 * Displays trends in member status over time
 * Following Component Composition and SRP patterns
 */
export const MembersEvolutionChart = ({
	data,
	onPeriodChange,
	isLoading = false,
}: MembersEvolutionChartProps) => {
	const [period, setPeriod] = useState<PeriodFilter>("12months");

	const handlePeriodChange = (value: string | null) => {
		if (value) {
			const newPeriod = value as PeriodFilter;
			setPeriod(newPeriod);
			onPeriodChange?.(newPeriod);
		}
	};

	const CustomTooltip = ({ active, payload }: TooltipProps) => {
		if (active && payload && payload.length) {
			return (
				<Card shadow="md" p="sm" withBorder>
					<Stack gap="xs">
						<Text size="sm" fw={600}>
							{payload[0].payload.monthLabel}
						</Text>
						<Group gap="xs">
							<div
								style={{
									width: 12,
									height: 12,
									backgroundColor: "#3B82F6",
									borderRadius: 2,
								}}
							/>
							<Text size="sm">Ativos:</Text>
							<Text size="sm" fw={600} c="blue">
								{payload[0].payload.active}
							</Text>
						</Group>
						<Group gap="xs">
							<div
								style={{
									width: 12,
									height: 12,
									backgroundColor: "#94A3B8",
									borderRadius: 2,
								}}
							/>
							<Text size="sm">Inativos:</Text>
							<Text size="sm" fw={600} c="gray">
								{payload[0].payload.inactive}
							</Text>
						</Group>
						<Group gap="xs">
							<div
								style={{
									width: 12,
									height: 12,
									backgroundColor: "#F59E0B",
									borderRadius: 2,
								}}
							/>
							<Text size="sm">Visitantes:</Text>
							<Text size="sm" fw={600} c="yellow">
								{payload[0].payload.visitors}
							</Text>
						</Group>
						<Group gap="xs" pt="xs" style={{ borderTop: "1px solid #E2E8F0" }}>
							<Text size="sm" fw={600}>
								Total:
							</Text>
							<Text size="sm" fw={700}>
								{payload[0].payload.total}
							</Text>
						</Group>
					</Stack>
				</Card>
			);
		}
		return null;
	};

	const getLatestData = () => {
		if (data.length === 0) {
			return { active: 0, inactive: 0, visitors: 0, total: 0 };
		}
		return data[data.length - 1];
	};

	const getGrowthRate = () => {
		if (data.length < 2) return null;

		const current = data[data.length - 1].total;
		const previous = data[data.length - 2].total;

		if (previous === 0) return null;

		const rate = ((current - previous) / previous) * 100;
		return rate;
	};

	const latest = getLatestData();
	const growthRate = getGrowthRate();

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Group gap="sm">
						<IconUsers size={24} color="#3B82F6" />
						<Title order={4}>Evolução de Membros</Title>
					</Group>
					<Select
						value={period}
						onChange={handlePeriodChange}
						data={[
							{ value: "6months", label: "Últimos 6 meses" },
							{ value: "12months", label: "Últimos 12 meses" },
							{ value: "currentYear", label: "Ano atual" },
						]}
						disabled={isLoading}
						w={180}
					/>
				</Group>

				{data.length === 0 ? (
					<Text size="sm" c="dimmed" ta="center" py="xl">
						Nenhum dado de membros disponível para o período selecionado
					</Text>
				) : (
					<ResponsiveContainer width="100%" height={350}>
						<LineChart
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" opacity={0.3} />
							<XAxis
								dataKey="monthLabel"
								tick={{ fontSize: 12 }}
								tickLine={false}
							/>
							<YAxis tick={{ fontSize: 12 }} tickLine={false} />
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
							<Line
								type="monotone"
								dataKey="active"
								stroke="#3B82F6"
								strokeWidth={2}
								name="Ativos"
								dot={{ r: 4 }}
								activeDot={{ r: 6 }}
							/>
							<Line
								type="monotone"
								dataKey="inactive"
								stroke="#94A3B8"
								strokeWidth={2}
								name="Inativos"
								dot={{ r: 4 }}
								activeDot={{ r: 6 }}
							/>
							<Line
								type="monotone"
								dataKey="visitors"
								stroke="#F59E0B"
								strokeWidth={2}
								name="Visitantes"
								dot={{ r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				)}

				<Group justify="space-around" mt="md">
					<div>
						<Text size="xs" c="dimmed" tt="uppercase" ta="center">
							Ativos
						</Text>
						<Text size="lg" fw={700} c="blue" ta="center">
							{latest.active}
						</Text>
					</div>
					<div>
						<Text size="xs" c="dimmed" tt="uppercase" ta="center">
							Inativos
						</Text>
						<Text size="lg" fw={700} c="gray" ta="center">
							{latest.inactive}
						</Text>
					</div>
					<div>
						<Text size="xs" c="dimmed" tt="uppercase" ta="center">
							Visitantes
						</Text>
						<Text size="lg" fw={700} c="yellow" ta="center">
							{latest.visitors}
						</Text>
					</div>
					<div>
						<Text size="xs" c="dimmed" tt="uppercase" ta="center">
							Total
						</Text>
						<Text size="lg" fw={700} ta="center">
							{latest.total}
						</Text>
						{growthRate !== null && (
							<Text
								size="xs"
								c={growthRate >= 0 ? "green" : "red"}
								ta="center"
								fw={600}
							>
								{growthRate >= 0 ? "+" : ""}
								{growthRate.toFixed(1)}% vs mês anterior
							</Text>
						)}
					</div>
				</Group>
			</Stack>
		</Card>
	);
};

export default MembersEvolutionChart;
