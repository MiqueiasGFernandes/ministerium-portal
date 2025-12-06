import {
	ActionIcon,
	Alert,
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	Grid,
	Group,
	Paper,
	Stack,
	Text,
	Title,
	Tooltip,
} from "@mantine/core";
import { useGetIdentity } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import {
	IconCalendar,
	IconCheck,
	IconInfoCircle,
	IconUserPlus,
	IconUsers,
} from "@tabler/icons-react";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { SCHEDULE_STATUS_OPTIONS } from "@/config/constants";
import { usePermissions } from "@/hooks/usePermissions";
import type { Schedule, ScheduleStatus, User } from "@/types";

export const ScheduleSignup = () => {
	const { data: identity } = useGetIdentity<User>();
	const { canCreate } = usePermissions();
	const [signingUp, setSigningUp] = useState<string | null>(null);

	// Check if user is already signed up for a schedule
	const isSignedUp = useCallback(
		(schedule: Schedule): boolean => {
			if (!identity) return false;
			return schedule.volunteers.some((v) => v.memberId === identity.id);
		},
		[identity],
	);

	// Get user's status for a schedule
	const getUserStatus = useCallback(
		(schedule: Schedule): ScheduleStatus | null => {
			if (!identity) return null;
			const volunteer = schedule.volunteers.find(
				(v) => v.memberId === identity.id,
			);
			return volunteer ? volunteer.status : null;
		},
		[identity],
	);

	// Handle signup
	const handleSignup = useCallback(async (scheduleId: string) => {
		setSigningUp(scheduleId);
		try {
			// TODO: Implement API call to sign up for schedule
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
			console.log("Signed up for schedule:", scheduleId);
			// Refresh data
		} catch (error) {
			console.error("Error signing up:", error);
		} finally {
			setSigningUp(null);
		}
	}, []);

	const columns = useMemo<ColumnDef<Schedule>[]>(
		() => [
			{
				id: "date",
				header: "Data",
				accessorKey: "date",
				cell: ({ getValue }) => (
					<Group gap="xs">
						<IconCalendar size="1rem" />
						<Text size="sm" fw={500}>
							{dayjs(getValue() as string).format("DD/MM/YYYY")}
						</Text>
					</Group>
				),
			},
			{
				id: "title",
				header: "Título",
				accessorKey: "title",
				cell: ({ getValue, row }) => (
					<Stack gap={4}>
						<Text size="sm" fw={600}>
							{getValue() as string}
						</Text>
						<Text size="xs" c="dimmed">
							{row.original.ministry?.name || "Sem ministério"}
						</Text>
					</Stack>
				),
			},
			{
				id: "description",
				header: "Descrição",
				accessorKey: "description",
				cell: ({ getValue }) => (
					<Text size="sm" lineClamp={2}>
						{getValue() as string}
					</Text>
				),
			},
			{
				id: "volunteers",
				header: "Vagas",
				accessorKey: "volunteers",
				cell: ({ getValue }) => {
					const volunteers = getValue() as { status: string }[];
					const confirmed = volunteers.filter(
						(v) => v.status === "confirmed",
					).length;
					const total = volunteers.length;
					const percentage = total > 0 ? (confirmed / total) * 100 : 0;

					return (
						<Group gap="xs">
							<IconUsers size="1rem" />
							<Text size="sm">
								{confirmed}/{total}
							</Text>
							<Badge
								size="xs"
								color={percentage === 100 ? "green" : "yellow"}
								variant="light"
							>
								{percentage.toFixed(0)}%
							</Badge>
						</Group>
					);
				},
			},
			{
				id: "status",
				header: "Seu Status",
				cell: ({ row }) => {
					const schedule = row.original;
					const signedUp = isSignedUp(schedule);
					const status = getUserStatus(schedule);

					if (!signedUp) {
						return (
							<Badge size="sm" color="gray" variant="light">
								Não inscrito
							</Badge>
						);
					}

					const statusOption = SCHEDULE_STATUS_OPTIONS.find(
						(o) => o.value === status,
					);

					return (
						<Badge
							size="sm"
							color={statusOption?.color || "gray"}
							variant="light"
						>
							{statusOption?.label || status}
						</Badge>
					);
				},
			},
			{
				id: "actions",
				header: "Ações",
				cell: ({ row }) => {
					const schedule = row.original;
					const signedUp = isSignedUp(schedule);

					if (signedUp) {
						return (
							<Tooltip label="Você já está inscrito">
								<ActionIcon variant="light" color="green" disabled>
									<IconCheck size="1rem" />
								</ActionIcon>
							</Tooltip>
						);
					}

					return (
						<Tooltip label="Inscrever-se nesta escala">
							<ActionIcon
								variant="light"
								color="blue"
								loading={signingUp === schedule.id}
								onClick={() => handleSignup(schedule.id)}
								disabled={!canCreate("schedules")}
							>
								<IconUserPlus size="1rem" />
							</ActionIcon>
						</Tooltip>
					);
				},
			},
		],
		[signingUp, canCreate, isSignedUp, getUserStatus, handleSignup],
	);

	const {
		getHeaderGroups,
		getRowModel,
		refineCore: { setCurrent, pageCount, current },
	} = useTable({
		columns,
		refineCoreProps: {
			resource: "schedules",
			// Filter only future schedules
			filters: {
				permanent: [
					{
						field: "date",
						operator: "gte",
						value: dayjs().format("YYYY-MM-DD"),
					},
				],
			},
			sorters: {
				initial: [
					{
						field: "date",
						order: "asc",
					},
				],
			},
		},
	});

	// Client-side filter to show only schedules with incomplete volunteers
	const availableRows = useMemo(() => {
		return getRowModel().rows.filter((row) => {
			const volunteers = row.original.volunteers;
			if (volunteers.length === 0) return true; // No volunteers yet, show it
			const confirmed = volunteers.filter(
				(v) => v.status === "confirmed",
			).length;
			return confirmed < volunteers.length; // Show if not all confirmed
		});
	}, [getRowModel]);

	return (
		<Stack gap="lg">
			<Box>
				<Title order={2}>Escalas Disponíveis</Title>
				<Text size="sm" c="dimmed">
					Inscreva-se nas escalas disponíveis para servir no ministério
				</Text>
			</Box>

			<Alert icon={<IconInfoCircle size="1rem" />} color="blue" variant="light">
				As inscrições estão sujeitas à aprovação dos líderes. Você será
				notificado quando sua inscrição for confirmada ou recusada.
			</Alert>

			{/* Stats Cards */}
			<Grid>
				<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group justify="space-between">
							<div>
								<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
									Escalas Disponíveis
								</Text>
								<Text size="xl" fw={700}>
									{availableRows.length}
								</Text>
							</div>
							<Avatar color="blue" variant="light" radius="xl" size="lg">
								<IconCalendar size="1.5rem" />
							</Avatar>
						</Group>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group justify="space-between">
							<div>
								<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
									Minhas Inscrições
								</Text>
								<Text size="xl" fw={700}>
									{
										availableRows.filter((row) => isSignedUp(row.original))
											.length
									}
								</Text>
							</div>
							<Avatar color="green" variant="light" radius="xl" size="lg">
								<IconUserPlus size="1.5rem" />
							</Avatar>
						</Group>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group justify="space-between">
							<div>
								<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
									Confirmadas
								</Text>
								<Text size="xl" fw={700}>
									{
										availableRows.filter(
											(row) => getUserStatus(row.original) === "confirmed",
										).length
									}
								</Text>
							</div>
							<Avatar color="teal" variant="light" radius="xl" size="lg">
								<IconCheck size="1.5rem" />
							</Avatar>
						</Group>
					</Card>
				</Grid.Col>
			</Grid>

			{/* Table */}
			<Paper shadow="xs" radius="md" withBorder>
				<Box style={{ overflowX: "auto" }}>
					<Box
						component="table"
						style={{ width: "100%", borderCollapse: "collapse" }}
					>
						<thead>
							{getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<Box
											component="th"
											key={header.id}
											p="md"
											style={{
												textAlign: "left",
												borderBottom: "1px solid var(--mantine-color-gray-3)",
												backgroundColor: "var(--mantine-color-gray-0)",
											}}
										>
											<Text size="xs" fw={700} tt="uppercase" c="dimmed">
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
											</Text>
										</Box>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{availableRows.map((row) => (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<Box
											component="td"
											key={cell.id}
											p="md"
											style={{
												borderBottom: "1px solid var(--mantine-color-gray-2)",
											}}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</Box>
									))}
								</tr>
							))}
						</tbody>
					</Box>
				</Box>

				{availableRows.length === 0 && (
					<Box p="xl" style={{ textAlign: "center" }}>
						<Text c="dimmed">Nenhuma escala disponível no momento</Text>
					</Box>
				)}

				<Group justify="center" p="md">
					{pageCount > 1 && (
						<Group>
							<Button
								variant="default"
								onClick={() => setCurrent(current - 1)}
								disabled={current === 1}
							>
								Anterior
							</Button>
							<Text size="sm">
								Página {current} de {pageCount}
							</Text>
							<Button
								variant="default"
								onClick={() => setCurrent(current + 1)}
								disabled={current === pageCount}
							>
								Próxima
							</Button>
						</Group>
					)}
				</Group>
			</Paper>
		</Stack>
	);
};

export default ScheduleSignup;
