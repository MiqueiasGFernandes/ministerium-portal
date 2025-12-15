import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Grid,
	Group,
	Pagination,
	Paper,
	Select,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useDelete, useInvalidate, useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import {
	IconArrowDown,
	IconArrowUp,
	IconEdit,
	IconPlus,
	IconSelector,
	IconTrash,
	IconTrendingDown,
	IconTrendingUp,
} from "@tabler/icons-react";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { TRANSACTION_CATEGORIES } from "@/config/constants";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Transaction, TransactionType } from "@/types";

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);

export const TransactionList = () => {
	const { create, edit } = useNavigation();
	const { mutate: deleteTransaction } = useDelete();
	const invalidate = useInvalidate();

	const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
	const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
		undefined,
	);
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
		null,
		null,
	]);

	const handleDelete = useCallback(
		(id: string, description: string) => {
			modals.openConfirmModal({
				title: "Confirmar exclusão",
				children: (
					<Text size="sm">
						Tem certeza que deseja excluir a transação{" "}
						<strong>{description}</strong>? Esta ação não pode ser desfeita.
					</Text>
				),
				labels: { confirm: "Excluir", cancel: "Cancelar" },
				confirmProps: { color: "red" },
				onConfirm: () => {
					deleteTransaction(
						{
							resource: "transactions",
							id,
						},
						{
							onSuccess: () => {
								notifications.show({
									title: "Sucesso",
									message: "Transação excluída com sucesso!",
									color: "green",
								});
								invalidate({
									resource: "transactions",
									invalidates: ["list"],
								});
							},
							onError: () => {
								notifications.show({
									title: "Erro",
									message: "Erro ao excluir transação",
									color: "red",
								});
							},
						},
					);
				},
			});
		},
		[deleteTransaction, invalidate],
	);

	const columns = useMemo<ColumnDef<Transaction>[]>(
		() => [
			{
				id: "date",
				header: "Data",
				accessorKey: "date",
				enableSorting: true,
				cell: ({ getValue }) =>
					dayjs(getValue() as string).format("DD/MM/YYYY"),
			},
			{
				id: "type",
				header: "Tipo",
				accessorKey: "type",
				enableSorting: true,
				cell: ({ getValue }) => {
					const type = getValue() as TransactionType;
					return (
						<Badge
							color={type === "income" ? "green" : "red"}
							variant="light"
							leftSection={
								type === "income" ? (
									<IconTrendingUp size="0.8rem" />
								) : (
									<IconTrendingDown size="0.8rem" />
								)
							}
						>
							{type === "income" ? "Entrada" : "Saída"}
						</Badge>
					);
				},
			},
			{
				id: "category",
				header: "Categoria",
				accessorKey: "category",
				enableSorting: true,
				cell: ({ getValue }) => {
					const category = getValue() as string;
					const cat = TRANSACTION_CATEGORIES.find((c) => c.value === category);
					return <Text size="sm">{cat?.label || category}</Text>;
				},
			},
			{
				id: "description",
				header: "Descrição",
				accessorKey: "description",
				enableSorting: true,
				cell: ({ getValue }) => (
					<Text size="sm" lineClamp={1}>
						{getValue() as string}
					</Text>
				),
			},
			{
				id: "amount",
				header: "Valor",
				accessorKey: "amount",
				enableSorting: true,
				cell: ({ row, getValue }) => {
					const type = row.original.type;
					const amount = getValue() as number;
					return (
						<Text size="sm" fw={600} c={type === "income" ? "green" : "red"}>
							{type === "income" ? "+" : "-"} {formatCurrency(amount)}
						</Text>
					);
				},
			},
			{
				id: "actions",
				header: "Ações",
				enableSorting: false,
				cell: ({ row }) => (
					<Group gap="xs">
						<ActionIcon
							variant="light"
							color="orange"
							onClick={() => edit("transactions", row.original.id)}
						>
							<IconEdit size="1rem" />
						</ActionIcon>
						<ActionIcon
							variant="light"
							color="red"
							onClick={() =>
								handleDelete(row.original.id, row.original.description)
							}
						>
							<IconTrash size="1rem" />
						</ActionIcon>
					</Group>
				),
			},
		],
		[edit, handleDelete],
	);

	const {
		getHeaderGroups,
		getRowModel,
		refineCore: {
			setCurrent,
			pageCount,
			current,
			sorters,
			setSorters,
			tableQueryResult,
		},
		setPageSize,
		getState,
	} = useTable({
		columns,
		refineCoreProps: {
			resource: "transactions",
			filters: {
				permanent: [
					...(typeFilter
						? [{ field: "type", operator: "eq" as const, value: typeFilter }]
						: []),
					...(categoryFilter
						? [
								{
									field: "category",
									operator: "eq" as const,
									value: categoryFilter,
								},
							]
						: []),
				],
			},
		},
		enableSorting: true,
		manualSorting: true,
	});

	const isLoading = tableQueryResult?.isLoading ?? false;

	// Helper to get sort icon
	const getSortIcon = (columnId: string) => {
		const sort = sorters?.find((s) => s.field === columnId);
		if (!sort) return <IconSelector size="0.9rem" />;
		return sort.order === "asc" ? (
			<IconArrowUp size="0.9rem" />
		) : (
			<IconArrowDown size="0.9rem" />
		);
	};

	// Handle column sort
	const handleSort = useCallback(
		(columnId: string) => {
			const currentSort = sorters?.find((s) => s.field === columnId);

			if (!currentSort) {
				setSorters([{ field: columnId, order: "asc" }]);
			} else if (currentSort.order === "asc") {
				setSorters([{ field: columnId, order: "desc" }]);
			} else {
				setSorters([]);
			}
		},
		[sorters, setSorters],
	);

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>Financeiro</Title>
				<Button
					leftSection={<IconPlus size="1rem" />}
					onClick={() => create("transactions")}
					styles={gradientButtonStyles}
				>
					Nova Transação
				</Button>
			</Group>

			{/* Filters */}
			<Paper shadow="xs" p="md" radius="md" withBorder>
				<Grid>
					<Grid.Col span={{ base: 12, sm: 4 }}>
						<Select
							placeholder="Tipo"
							data={[
								{ value: "income", label: "Entrada" },
								{ value: "expense", label: "Saída" },
							]}
							value={typeFilter}
							onChange={(value) => setTypeFilter(value ?? undefined)}
							clearable
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 4 }}>
						<Select
							placeholder="Categoria"
							data={TRANSACTION_CATEGORIES}
							value={categoryFilter}
							onChange={(value) => setCategoryFilter(value ?? undefined)}
							clearable
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 4 }}>
						<DatePickerInput
							type="range"
							placeholder="Período"
							value={dateRange}
							onChange={setDateRange}
							clearable
						/>
					</Grid.Col>
				</Grid>
			</Paper>

			{/* Table */}
			<Paper shadow="xs" radius="md" withBorder>
				<Box style={{ overflowX: "auto" }}>
					<Table striped highlightOnHover>
						<Table.Thead>
							{getHeaderGroups().map((headerGroup) => (
								<Table.Tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const canSort =
											header.column.columnDef.enableSorting !== false;
										return (
											<Table.Th
												key={header.id}
												style={{
													cursor: canSort ? "pointer" : "default",
													userSelect: "none",
												}}
												onClick={() => canSort && handleSort(header.column.id)}
											>
												<Group gap="xs" wrap="nowrap">
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{canSort && getSortIcon(header.column.id)}
												</Group>
											</Table.Th>
										);
									})}
								</Table.Tr>
							))}
						</Table.Thead>
						<Table.Tbody>
							{isLoading ? (
								<TableSkeleton columns={columns.length} rows={5} />
							) : (
								getRowModel().rows.map((row) => (
									<Table.Tr key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<Table.Td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</Table.Td>
										))}
									</Table.Tr>
								))
							)}
						</Table.Tbody>
					</Table>
				</Box>

				<Group justify="space-between" p="md">
					<Select
						data={["10", "20", "50", "100"]}
						value={String(getState().pagination.pageSize)}
						onChange={(value) => setPageSize(Number(value))}
						w={100}
					/>
					<Pagination total={pageCount} value={current} onChange={setCurrent} />
				</Group>
			</Paper>
		</Stack>
	);
};

export default TransactionList;
