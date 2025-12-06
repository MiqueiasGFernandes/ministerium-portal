import { Card, Group, Select, Stack, Text, Title } from "@mantine/core";
import { IconCash } from "@tabler/icons-react";
import { useState } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { MonthlyFinancialData, PeriodFilter } from "@/types";

interface FinancialChartProps {
	data: MonthlyFinancialData[];
	onPeriodChange?: (period: PeriodFilter) => void;
	isLoading?: boolean;
}

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: MonthlyFinancialData;
	}>;
}

/**
 * Financial Chart Component
 * Displays monthly income/expense trends with balance line
 * Following Component Composition pattern for better reusability
 */
export const FinancialChart = ({
	data,
	onPeriodChange,
	isLoading = false,
}: FinancialChartProps) => {
	const [period, setPeriod] = useState<PeriodFilter>("12months");

	const handlePeriodChange = (value: string | null) => {
		if (value) {
			const newPeriod = value as PeriodFilter;
			setPeriod(newPeriod);
			onPeriodChange?.(newPeriod);
		}
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
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
									backgroundColor: "#22C55E",
									borderRadius: 2,
								}}
							/>
							<Text size="sm">Entradas:</Text>
							<Text size="sm" fw={600} c="green">
								{formatCurrency(payload[0].payload.income)}
							</Text>
						</Group>
						<Group gap="xs">
							<div
								style={{
									width: 12,
									height: 12,
									backgroundColor: "#EF4444",
									borderRadius: 2,
								}}
							/>
							<Text size="sm">Saídas:</Text>
							<Text size="sm" fw={600} c="red">
								{formatCurrency(payload[0].payload.expense)}
							</Text>
						</Group>
						<Group gap="xs">
							<div
								style={{
									width: 12,
									height: 12,
									backgroundColor: "#3B82F6",
									borderRadius: 2,
								}}
							/>
							<Text size="sm">Saldo:</Text>
							<Text
								size="sm"
								fw={600}
								c={payload[0].payload.balance >= 0 ? "blue" : "red"}
							>
								{formatCurrency(payload[0].payload.balance)}
							</Text>
						</Group>
					</Stack>
				</Card>
			);
		}
		return null;
	};

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Group gap="sm">
						<IconCash size={24} color="#3B82F6" />
						<Title order={4}>Finanças Mensais</Title>
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
						Nenhum dado financeiro disponível para o período selecionado
					</Text>
				) : (
					<ResponsiveContainer width="100%" height={350}>
						<ComposedChart
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" opacity={0.3} />
							<XAxis
								dataKey="monthLabel"
								tick={{ fontSize: 12 }}
								tickLine={false}
							/>
							<YAxis
								tickFormatter={(value) => {
									if (value >= 1000000) {
										return `${(value / 1000000).toFixed(1)}M`;
									}
									if (value >= 1000) {
										return `${(value / 1000).toFixed(0)}k`;
									}
									return value.toString();
								}}
								tick={{ fontSize: 12 }}
								tickLine={false}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
							<Bar
								dataKey="income"
								fill="#22C55E"
								name="Entradas"
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="expense"
								fill="#EF4444"
								name="Saídas"
								radius={[4, 4, 0, 0]}
							/>
							<Line
								type="monotone"
								dataKey="balance"
								stroke="#3B82F6"
								strokeWidth={2}
								name="Saldo"
								dot={{ r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				)}

				<Group justify="space-around" mt="md">
					<div>
						<Text size="xs" c="dimmed" tt="uppercase" ta="center">
							Total Entradas
						</Text>
						<Text size="lg" fw={700} c="green" ta="center">
							{formatCurrency(data.reduce((sum, d) => sum + d.income, 0))}
						</Text>
					</div>
					<div>
						<Text size="xs" c="dimmed" tt="uppercase" ta="center">
							Total Saídas
						</Text>
						<Text size="lg" fw={700} c="red" ta="center">
							{formatCurrency(data.reduce((sum, d) => sum + d.expense, 0))}
						</Text>
					</div>
					<div>
						<Text size="xs" c="dimmed" tt="uppercase" ta="center">
							Saldo Total
						</Text>
						<Text
							size="lg"
							fw={700}
							c={
								data.reduce((sum, d) => sum + d.balance, 0) >= 0
									? "blue"
									: "red"
							}
							ta="center"
						>
							{formatCurrency(data.reduce((sum, d) => sum + d.balance, 0))}
						</Text>
					</div>
				</Group>
			</Stack>
		</Card>
	);
};

export default FinancialChart;
