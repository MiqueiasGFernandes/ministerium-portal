import {
	ActionIcon,
	Box,
	Button,
	Group,
	Pagination,
	Paper,
	Progress,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useDelete, useInvalidate, useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import {
	IconEdit,
	IconEye,
	IconPlus,
	IconTrash,
	IconUserPlus,
	IconUsers,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { CanCreate, CanDelete, CanEdit } from "@/components/auth/Can";
import { usePermissions } from "@/hooks/usePermissions";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Schedule } from "@/types";

export const ScheduleList = () => {
	const { create, edit, show, push } = useNavigation();
	const { isVolunteer, isAdmin, isLeader } = usePermissions();
	const { mutate: deleteSchedule } = useDelete();
	const invalidate = useInvalidate();

	const handleDelete = useCallback(
		(id: string, title: string) => {
			modals.openConfirmModal({
				title: "Confirmar exclusão",
				children: (
					<Text size="sm">
						Tem certeza que deseja excluir a escala <strong>{title}</strong>?
						Esta ação não pode ser desfeita.
					</Text>
				),
				labels: { confirm: "Excluir", cancel: "Cancelar" },
				confirmProps: { color: "red" },
				onConfirm: () => {
					deleteSchedule(
						{
							resource: "schedules",
							id,
						},
						{
							onSuccess: () => {
								notifications.show({
									title: "Sucesso",
									message: "Escala excluída com sucesso!",
									color: "green",
								});
								invalidate({
									resource: "schedules",
									invalidates: ["list"],
								});
							},
							onError: () => {
								notifications.show({
									title: "Erro",
									message: "Erro ao excluir escala",
									color: "red",
								});
							},
						},
					);
				},
			});
		},
		[deleteSchedule, invalidate],
	);

	const columns = useMemo<ColumnDef<Schedule>[]>(
		() => [
			{ id: "title", header: "Título", accessorKey: "title" },
			{ id: "ministry", header: "Ministério", accessorKey: "ministry.name" },
			{
				id: "date",
				header: "Data",
				accessorKey: "date",
				cell: ({ getValue }: { getValue: () => unknown }) =>
					dayjs(getValue() as string).format("DD/MM/YYYY"),
			},
			{
				id: "volunteers",
				header: "Voluntários",
				accessorKey: "volunteers",
				cell: ({ getValue }: { getValue: () => unknown }) => {
					const volunteers = getValue() as { status: string }[];
					const confirmed = volunteers.filter(
						(v) => v.status === "confirmed",
					).length;
					const percentage = (confirmed / volunteers.length) * 100;
					return (
						<Box w={150}>
							<Group gap="xs" mb={4}>
								<Text size="xs">
									{confirmed}/{volunteers.length}
								</Text>
							</Group>
							<Progress
								value={percentage}
								color={percentage === 100 ? "green" : "yellow"}
								size="sm"
							/>
						</Box>
					);
				},
			},
			{
				id: "actions",
				header: "Ações",
				cell: ({ row }: { row: { original: Schedule } }) => (
					<Group gap="xs">
						<ActionIcon
							variant="light"
							color="blue"
							onClick={() => show("schedules", row.original.id)}
							title="Visualizar"
						>
							<IconEye size="1rem" />
						</ActionIcon>
						{(isAdmin() || isLeader()) && (
							<ActionIcon
								variant="light"
								color="teal"
								onClick={() => push(`/schedules/manage/${row.original.id}`)}
								title="Gerenciar Voluntários"
							>
								<IconUsers size="1rem" />
							</ActionIcon>
						)}
						<CanEdit resource="schedules">
							<ActionIcon
								variant="light"
								color="orange"
								onClick={() => edit("schedules", row.original.id)}
								title="Editar"
							>
								<IconEdit size="1rem" />
							</ActionIcon>
						</CanEdit>
						<CanDelete resource="schedules">
							<ActionIcon
								variant="light"
								color="red"
								title="Excluir"
								onClick={() =>
									handleDelete(row.original.id, row.original.title)
								}
							>
								<IconTrash size="1rem" />
							</ActionIcon>
						</CanDelete>
					</Group>
				),
			},
		],
		[edit, show, push, isAdmin, isLeader, handleDelete],
	);

	const {
		getHeaderGroups,
		getRowModel,
		refineCore: { setCurrent, pageCount, current },
	} = useTable({
		columns,
		refineCoreProps: { resource: "schedules" },
	});

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>Escalas</Title>
				<Group>
					{isVolunteer() && (
						<Button
							variant="light"
							color="teal"
							leftSection={<IconUserPlus size="1rem" />}
							onClick={() => push("/schedules/signup")}
						>
							Auto-inscrição
						</Button>
					)}
					<CanCreate resource="schedules">
						<Button
							leftSection={<IconPlus size="1rem" />}
							onClick={() => create("schedules")}
							styles={gradientButtonStyles}
						>
							Nova Escala
						</Button>
					</CanCreate>
				</Group>
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
							{getRowModel().rows.map((row) => (
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
							))}
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
export default ScheduleList;
