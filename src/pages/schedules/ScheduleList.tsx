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
import { useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { Schedule } from "@/types";

export const ScheduleList = () => {
	const { create, edit } = useNavigation();

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
							color="orange"
							onClick={() => edit("schedules", row.original.id)}
						>
							<IconEdit size="1rem" />
						</ActionIcon>
						<ActionIcon variant="light" color="red">
							<IconTrash size="1rem" />
						</ActionIcon>
					</Group>
				),
			},
		],
		[edit],
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
				<Button
					leftSection={<IconPlus size="1rem" />}
					onClick={() => create("schedules")}
				>
					Nova Escala
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
