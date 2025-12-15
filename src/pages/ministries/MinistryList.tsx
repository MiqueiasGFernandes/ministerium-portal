import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Group,
	Pagination,
	Paper,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useDelete, useInvalidate, useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Ministry } from "@/types";

export const MinistryList = () => {
	const { create, edit, show } = useNavigation();
	const { mutate: deleteMinistry } = useDelete();
	const invalidate = useInvalidate();

	const handleDelete = useCallback(
		(id: string, name: string) => {
			modals.openConfirmModal({
				title: "Confirmar exclusão",
				children: (
					<Text size="sm">
						Tem certeza que deseja excluir o ministério <strong>{name}</strong>?
						Esta ação não pode ser desfeita.
					</Text>
				),
				labels: { confirm: "Excluir", cancel: "Cancelar" },
				confirmProps: { color: "red" },
				onConfirm: () => {
					deleteMinistry(
						{
							resource: "ministries",
							id,
						},
						{
							onSuccess: () => {
								notifications.show({
									title: "Sucesso",
									message: "Ministério excluído com sucesso!",
									color: "green",
								});
								invalidate({
									resource: "ministries",
									invalidates: ["list"],
								});
							},
							onError: () => {
								notifications.show({
									title: "Erro",
									message: "Erro ao excluir ministério",
									color: "red",
								});
							},
						},
					);
				},
			});
		},
		[deleteMinistry, invalidate],
	);

	const columns = useMemo<ColumnDef<Ministry>[]>(
		() => [
			{ id: "name", header: "Nome", accessorKey: "name" },
			{
				id: "description",
				header: "Descrição",
				accessorKey: "description",
				cell: ({ getValue }: { getValue: () => unknown }) => {
					const description = getValue() as string;
					return (
						<Text size="sm" lineClamp={2} maw={300}>
							{description}
						</Text>
					);
				},
			},
			{
				id: "leader",
				header: "Líder",
				accessorKey: "leader.name",
			},
			{
				id: "members",
				header: "Membros",
				accessorKey: "members",
				cell: ({ getValue }: { getValue: () => unknown }) => {
					const members = getValue() as string[];
					return (
						<Badge variant="light" color="blue">
							{members.length}
						</Badge>
					);
				},
			},
			{
				id: "createdAt",
				header: "Criado em",
				accessorKey: "createdAt",
				cell: ({ getValue }: { getValue: () => unknown }) =>
					dayjs(getValue() as string).format("DD/MM/YYYY"),
			},
			{
				id: "actions",
				header: "Ações",
				cell: ({ row }: { row: { original: Ministry } }) => (
					<Group gap="xs">
						<ActionIcon
							variant="light"
							color="blue"
							onClick={() => show("ministries", row.original.id)}
						>
							<IconEye size="1rem" />
						</ActionIcon>
						<ActionIcon
							variant="light"
							color="orange"
							onClick={() => edit("ministries", row.original.id)}
						>
							<IconEdit size="1rem" />
						</ActionIcon>
						<ActionIcon
							variant="light"
							color="red"
							onClick={() => handleDelete(row.original.id, row.original.name)}
						>
							<IconTrash size="1rem" />
						</ActionIcon>
					</Group>
				),
			},
		],
		[edit, show, handleDelete],
	);

	const {
		getHeaderGroups,
		getRowModel,
		refineCore: { setCurrent, pageCount, current, tableQueryResult },
	} = useTable({
		columns,
		refineCoreProps: { resource: "ministries" },
	});

	const isLoading = tableQueryResult?.isLoading ?? false;

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>Ministérios</Title>
				<Button
					leftSection={<IconPlus size="1rem" />}
					onClick={() => create("ministries")}
					styles={gradientButtonStyles}
				>
					Novo Ministério
				</Button>
			</Group>
			<Paper shadow="xs" radius="md" withBorder>
				<Box style={{ overflowX: "auto" }}>
					<Table striped highlightOnHover>
						<Table.Thead>
							{getHeaderGroups().map((hg) => (
								<Table.Tr key={hg.id}>
									{hg.headers.map((h) => (
										<Table.Th key={h.id}>
											{flexRender(h.column.columnDef.header, h.getContext())}
										</Table.Th>
									))}
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
					<Pagination total={pageCount} value={current} onChange={setCurrent} />
				</Group>
			</Paper>
		</Stack>
	);
};

export default MinistryList;
