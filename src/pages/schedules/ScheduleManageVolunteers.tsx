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
	Modal,
	MultiSelect,
	Paper,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
	Title,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
	useInvalidate,
	useList,
	useNavigation,
	useOne,
	useUpdate,
} from "@refinedev/core";
import {
	IconCheck,
	IconClock,
	IconInfoCircle,
	IconSearch,
	IconTrash,
	IconUserPlus,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SCHEDULE_STATUS_OPTIONS } from "@/config/constants";
import { usePermissions } from "@/hooks/usePermissions";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Member, Schedule, ScheduleStatus } from "@/types";

export const ScheduleManageVolunteers = () => {
	const { scheduleId } = useParams<{ scheduleId: string }>();
	const { list } = useNavigation();
	const { isAdmin, isLeader } = usePermissions();
	const [opened, { open, close }] = useDisclosure(false);
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string | null>(null);

	const { mutate: updateSchedule } = useUpdate();
	const invalidate = useInvalidate();

	// Fetch schedule data
	const { data: scheduleData, isLoading: scheduleLoading } = useOne<Schedule>({
		resource: "schedules",
		id: scheduleId || "",
		queryOptions: {
			enabled: !!scheduleId,
		},
	});

	// Fetch members list
	const { data: membersData, isLoading: membersLoading } = useList<Member>({
		resource: "members",
		filters: [
			{
				field: "status",
				operator: "eq",
				value: "active",
			},
		],
	});

	const schedule = scheduleData?.data;
	const members = membersData?.data || [];

	// Filter volunteers based on search and status
	const filteredVolunteers = useMemo(() => {
		if (!schedule) return [];

		let filtered = schedule.volunteers;

		if (searchQuery) {
			filtered = filtered.filter((v) =>
				v.member?.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		if (statusFilter) {
			filtered = filtered.filter((v) => v.status === statusFilter);
		}

		return filtered;
	}, [schedule, searchQuery, statusFilter]);

	// Get members not yet in schedule
	const availableMembers = useMemo(() => {
		if (!schedule) return members;

		const volunteerIds = schedule.volunteers.map((v) => v.memberId);
		return members.filter((m) => !volunteerIds.includes(m.id));
	}, [members, schedule]);

	// Handle add volunteers
	const handleAddVolunteers = async () => {
		if (!schedule) return;

		try {
			const newVolunteers = selectedMembers.map((memberId) => ({
				id: `volunteer-${Date.now()}-${memberId}`,
				scheduleId: schedule.id,
				memberId,
				status: "pending" as ScheduleStatus,
				respondedAt: null,
				member: members.find((m) => m.id === memberId),
			}));

			updateSchedule(
				{
					resource: "schedules",
					id: schedule.id,
					values: {
						...schedule,
						volunteers: [...schedule.volunteers, ...newVolunteers],
					},
				},
				{
					onSuccess: () => {
						notifications.show({
							title: "Sucesso",
							message: "Voluntários adicionados com sucesso!",
							color: "green",
						});
						invalidate({
							resource: "schedules",
							invalidates: ["detail"],
							id: schedule.id,
						});
						setSelectedMembers([]);
						close();
					},
					onError: () => {
						notifications.show({
							title: "Erro",
							message: "Erro ao adicionar voluntários",
							color: "red",
						});
					},
				},
			);
		} catch (error) {
			console.error("Error adding volunteers:", error);
		}
	};

	// Handle update status
	const handleUpdateStatus = async (
		volunteerId: string,
		status: ScheduleStatus,
	) => {
		if (!schedule) return;

		try {
			const updatedVolunteers = schedule.volunteers.map((v) =>
				v.id === volunteerId
					? { ...v, status, respondedAt: new Date().toISOString() }
					: v,
			);

			updateSchedule(
				{
					resource: "schedules",
					id: schedule.id,
					values: {
						...schedule,
						volunteers: updatedVolunteers,
					},
				},
				{
					onSuccess: () => {
						notifications.show({
							title: "Sucesso",
							message: "Status atualizado com sucesso!",
							color: "green",
						});
						invalidate({
							resource: "schedules",
							invalidates: ["detail"],
							id: schedule.id,
						});
					},
					onError: () => {
						notifications.show({
							title: "Erro",
							message: "Erro ao atualizar status",
							color: "red",
						});
					},
				},
			);
		} catch (error) {
			console.error("Error updating status:", error);
		}
	};

	// Handle remove volunteer
	const handleRemoveVolunteer = async (
		volunteerId: string,
		volunteerName: string,
	) => {
		if (!schedule) return;

		modals.openConfirmModal({
			title: "Confirmar remoção",
			children: (
				<Text size="sm">
					Tem certeza que deseja remover <strong>{volunteerName}</strong> desta
					escala? Esta ação não pode ser desfeita.
				</Text>
			),
			labels: { confirm: "Remover", cancel: "Cancelar" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				try {
					const updatedVolunteers = schedule.volunteers.filter(
						(v) => v.id !== volunteerId,
					);

					updateSchedule(
						{
							resource: "schedules",
							id: schedule.id,
							values: {
								...schedule,
								volunteers: updatedVolunteers,
							},
						},
						{
							onSuccess: () => {
								notifications.show({
									title: "Sucesso",
									message: "Voluntário removido com sucesso!",
									color: "green",
								});
								invalidate({
									resource: "schedules",
									invalidates: ["detail"],
									id: schedule.id,
								});
							},
							onError: () => {
								notifications.show({
									title: "Erro",
									message: "Erro ao remover voluntário",
									color: "red",
								});
							},
						},
					);
				} catch (error) {
					console.error("Error removing volunteer:", error);
				}
			},
		});
	};

	if (!isAdmin() && !isLeader()) {
		return (
			<Stack gap="lg">
				<Title order={2}>Gerenciar Voluntários</Title>
				<Alert icon={<IconX size="1rem" />} title="Acesso Negado" color="red">
					Você não tem permissão para gerenciar voluntários em escalas.
				</Alert>
			</Stack>
		);
	}

	if (!scheduleId) {
		return (
			<Stack gap="lg">
				<Title order={2}>Gerenciar Voluntários</Title>
				<Alert
					icon={<IconInfoCircle size="1rem" />}
					title="Escala não especificada"
					color="blue"
				>
					Por favor, selecione uma escala para gerenciar os voluntários.
				</Alert>
				<Button onClick={() => list("schedules")} variant="light">
					Ver Escalas
				</Button>
			</Stack>
		);
	}

	if (scheduleLoading || membersLoading) {
		return <Text>Carregando...</Text>;
	}

	if (!schedule) {
		return (
			<Alert icon={<IconX size="1rem" />} title="Erro" color="red">
				Escala não encontrada.
			</Alert>
		);
	}

	const confirmedCount = schedule.volunteers.filter(
		(v) => v.status === "confirmed",
	).length;
	const pendingCount = schedule.volunteers.filter(
		(v) => v.status === "pending",
	).length;
	const declinedCount = schedule.volunteers.filter(
		(v) => v.status === "declined",
	).length;

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Box>
					<Title order={2}>Gerenciar Voluntários</Title>
					<Text size="sm" c="dimmed">
						{schedule.title} - {dayjs(schedule.date).format("DD/MM/YYYY")}
					</Text>
				</Box>
				<Button
					leftSection={<IconUserPlus size="1rem" />}
					onClick={open}
					styles={gradientButtonStyles}
				>
					Adicionar Voluntários
				</Button>
			</Group>

			{/* Stats Cards */}
			<Grid>
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group justify="space-between">
							<div>
								<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
									Total
								</Text>
								<Text size="xl" fw={700}>
									{schedule.volunteers.length}
								</Text>
							</div>
							<Avatar color="blue" variant="light" radius="xl" size="lg">
								<IconUsers size="1.5rem" />
							</Avatar>
						</Group>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group justify="space-between">
							<div>
								<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
									Confirmados
								</Text>
								<Text size="xl" fw={700} c="green">
									{confirmedCount}
								</Text>
							</div>
							<Avatar color="green" variant="light" radius="xl" size="lg">
								<IconCheck size="1.5rem" />
							</Avatar>
						</Group>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group justify="space-between">
							<div>
								<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
									Pendentes
								</Text>
								<Text size="xl" fw={700} c="yellow">
									{pendingCount}
								</Text>
							</div>
							<Avatar color="yellow" variant="light" radius="xl" size="lg">
								<IconClock size="1.5rem" />
							</Avatar>
						</Group>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group justify="space-between">
							<div>
								<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
									Recusados
								</Text>
								<Text size="xl" fw={700} c="red">
									{declinedCount}
								</Text>
							</div>
							<Avatar color="red" variant="light" radius="xl" size="lg">
								<IconX size="1.5rem" />
							</Avatar>
						</Group>
					</Card>
				</Grid.Col>
			</Grid>

			{/* Filters */}
			<Paper shadow="xs" p="md" radius="md" withBorder>
				<Grid>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<TextInput
							placeholder="Buscar voluntário..."
							leftSection={<IconSearch size="1rem" />}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.currentTarget.value)}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<Select
							placeholder="Filtrar por status"
							data={SCHEDULE_STATUS_OPTIONS}
							value={statusFilter}
							onChange={setStatusFilter}
							clearable
						/>
					</Grid.Col>
				</Grid>
			</Paper>

			{/* Volunteers Table */}
			<Paper shadow="xs" radius="md" withBorder>
				<Box style={{ overflowX: "auto" }}>
					<Table striped highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Voluntário</Table.Th>
								<Table.Th>Email</Table.Th>
								<Table.Th>Telefone</Table.Th>
								<Table.Th>Status</Table.Th>
								<Table.Th>Respondido em</Table.Th>
								<Table.Th>Ações</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{filteredVolunteers.map((volunteer) => {
								const statusOption = SCHEDULE_STATUS_OPTIONS.find(
									(o) => o.value === volunteer.status,
								);

								return (
									<Table.Tr key={volunteer.id}>
										<Table.Td>
											<Group gap="sm">
												<Avatar
													src={volunteer.member?.photo}
													radius="xl"
													size="sm"
												/>
												<Text size="sm" fw={500}>
													{volunteer.member?.name || "Desconhecido"}
												</Text>
											</Group>
										</Table.Td>
										<Table.Td>
											<Text size="sm" c="dimmed">
												{volunteer.member?.email || "-"}
											</Text>
										</Table.Td>
										<Table.Td>
											<Text size="sm" c="dimmed">
												{volunteer.member?.phone || "-"}
											</Text>
										</Table.Td>
										<Table.Td>
											<Badge
												color={statusOption?.color || "gray"}
												variant="light"
											>
												{statusOption?.label || volunteer.status}
											</Badge>
										</Table.Td>
										<Table.Td>
											<Text size="sm" c="dimmed">
												{volunteer.respondedAt
													? dayjs(volunteer.respondedAt).format(
															"DD/MM/YYYY HH:mm",
														)
													: "-"}
											</Text>
										</Table.Td>
										<Table.Td>
											<Group gap="xs">
												{volunteer.status !== "confirmed" && (
													<Tooltip label="Confirmar">
														<ActionIcon
															variant="light"
															color="green"
															onClick={() =>
																handleUpdateStatus(
																	volunteer.id,
																	"confirmed" as ScheduleStatus,
																)
															}
														>
															<IconCheck size="1rem" />
														</ActionIcon>
													</Tooltip>
												)}
												{volunteer.status !== "declined" && (
													<Tooltip label="Recusar">
														<ActionIcon
															variant="light"
															color="red"
															onClick={() =>
																handleUpdateStatus(
																	volunteer.id,
																	"declined" as ScheduleStatus,
																)
															}
														>
															<IconX size="1rem" />
														</ActionIcon>
													</Tooltip>
												)}
												<Tooltip label="Remover">
													<ActionIcon
														variant="light"
														color="red"
														onClick={() =>
															handleRemoveVolunteer(
																volunteer.id,
																volunteer.member?.name || "Voluntário",
															)
														}
													>
														<IconTrash size="1rem" />
													</ActionIcon>
												</Tooltip>
											</Group>
										</Table.Td>
									</Table.Tr>
								);
							})}
						</Table.Tbody>
					</Table>
				</Box>

				{filteredVolunteers.length === 0 && (
					<Box p="xl" style={{ textAlign: "center" }}>
						<Text c="dimmed">Nenhum voluntário encontrado</Text>
					</Box>
				)}
			</Paper>

			{/* Add Volunteers Modal */}
			<Modal
				opened={opened}
				onClose={close}
				title="Adicionar Voluntários"
				size="lg"
			>
				<Stack gap="md">
					<Alert
						icon={<IconInfoCircle size="1rem" />}
						color="blue"
						variant="light"
					>
						Selecione os membros que deseja adicionar a esta escala. Eles serão
						notificados e poderão aceitar ou recusar a participação.
					</Alert>

					<MultiSelect
						label="Membros"
						placeholder="Selecione os membros"
						data={availableMembers.map((m) => ({
							value: m.id,
							label: m.name,
						}))}
						value={selectedMembers}
						onChange={setSelectedMembers}
						searchable
						maxDropdownHeight={200}
					/>

					<Group justify="flex-end" mt="md">
						<Button variant="light" onClick={close}>
							Cancelar
						</Button>
						<Button
							onClick={handleAddVolunteers}
							disabled={selectedMembers.length === 0}
							styles={gradientButtonStyles}
						>
							Adicionar{" "}
							{selectedMembers.length > 0 && `(${selectedMembers.length})`}
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Stack>
	);
};

export default ScheduleManageVolunteers;
