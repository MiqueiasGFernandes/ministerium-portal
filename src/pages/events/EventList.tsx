import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Group,
	Pagination,
	Paper,
	Select,
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
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { CanCreate } from "@/components/auth/Can";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EVENT_STATUS_OPTIONS } from "@/config/constants";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Event, EventAttendee } from "@/types";

export const EventList = () => {
	const { create, edit, show } = useNavigation();
	const { mutate: deleteEvent } = useDelete();
	const invalidate = useInvalidate();
	const [statusFilter, setStatusFilter] = useState<string | undefined>(
		undefined,
	);

	const handleDelete = useCallback(
		(id: string, title: string) => {
			modals.openConfirmModal({
				title: "Confirmar exclusão",
				children: (
					<Text size="sm">
						Tem certeza que deseja excluir o evento <strong>{title}</strong>?
						Esta ação não pode ser desfeita.
					</Text>
				),
				labels: { confirm: "Excluir", cancel: "Cancelar" },
				confirmProps: { color: "red" },
				onConfirm: () => {
					deleteEvent(
						{
							resource: "events",
							id,
						},
						{
							onSuccess: () => {
								notifications.show({
									title: "Sucesso",
									message: "Evento excluído com sucesso!",
									color: "green",
								});
								invalidate({
									resource: "events",
									invalidates: ["list"],
								});
							},
							onError: () => {
								notifications.show({
									title: "Erro",
									message: "Erro ao excluir evento",
									color: "red",
								});
							},
						},
					);
				},
			});
		},
		[deleteEvent, invalidate],
	);

	const columns = useMemo<ColumnDef<Event>[]>(
		() => [
			{
				id: "title",
				header: "Título",
				accessorKey: "title",
				cell: ({ getValue }) => {
					const value = getValue() as string;
					return value || "-";
				},
			},
			{
				id: "date",
				header: "Data",
				accessorKey: "date",
				cell: ({ getValue }) => {
					const value = getValue() as string;
					return value ? dayjs(value).format("DD/MM/YYYY") : "-";
				},
			},
			{
				id: "time",
				header: "Horário",
				accessorKey: "time",
				cell: ({ getValue }) => {
					const value = getValue() as string;
					return value || "-";
				},
			},
			{
				id: "location",
				header: "Local",
				accessorKey: "location",
				cell: ({ getValue }) => {
					const value = getValue() as string;
					return (
						<Text size="sm" lineClamp={1}>
							{value || "-"}
						</Text>
					);
				},
			},
			{
				id: "status",
				header: "Status",
				accessorKey: "status",
				cell: ({ getValue }) => {
					const status = getValue() as string;
					const opt = EVENT_STATUS_OPTIONS.find((o) => o.value === status);
					return (
						<Badge color={opt?.color} variant="light">
							{opt?.label}
						</Badge>
					);
				},
			},
			{
				id: "attendees",
				header: "Inscritos",
				accessorKey: "attendees",
				cell: ({ getValue }) => {
					const attendees = getValue() as EventAttendee[];
					return <Badge>{attendees.length}</Badge>;
				},
			},
			{
				id: "actions",
				header: "Ações",
				cell: ({ row }) => (
					<Group gap="xs">
						<ActionIcon
							variant="light"
							color="blue"
							onClick={() => show("events", row.original.id)}
						>
							<IconEye size="1rem" />
						</ActionIcon>
						<ActionIcon
							variant="light"
							color="orange"
							onClick={() => edit("events", row.original.id)}
						>
							<IconEdit size="1rem" />
						</ActionIcon>
						<ActionIcon
							variant="light"
							color="red"
							onClick={() => handleDelete(row.original.id, row.original.title)}
						>
							<IconTrash size="1rem" />
						</ActionIcon>
					</Group>
				),
			},
		],
		[show, edit, handleDelete],
	);

	const {
		getHeaderGroups,
		getRowModel,
		refineCore: { setCurrent, pageCount, current, tableQueryResult },
		setPageSize,
		getState,
	} = useTable({
		columns,
		refineCoreProps: {
			resource: "events",
			filters: {
				permanent: [
					...(statusFilter
						? [
								{
									field: "status",
									operator: "eq" as const,
									value: statusFilter,
								},
							]
						: []),
				],
			},
		},
	});

	const isLoading = tableQueryResult?.isLoading ?? false;

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>Eventos</Title>
				<CanCreate resource="events">
					<Button
						leftSection={<IconPlus size="1rem" />}
						onClick={() => create("events")}
						styles={gradientButtonStyles}
					>
						Novo Evento
					</Button>
				</CanCreate>
			</Group>
			<Paper shadow="xs" p="md" radius="md" withBorder>
				<Select
					placeholder="Filtrar por status"
					data={EVENT_STATUS_OPTIONS}
					value={statusFilter}
					onChange={(value) => setStatusFilter(value ?? undefined)}
					clearable
				/>
			</Paper>
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
					<Select
						data={["10", "20", "50"]}
						value={String(getState().pagination.pageSize)}
						onChange={(v) => setPageSize(Number(v))}
						w={100}
					/>
					<Pagination total={pageCount} value={current} onChange={setCurrent} />
				</Group>
			</Paper>
		</Stack>
	);
};
export default EventList;
