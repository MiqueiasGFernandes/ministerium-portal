import {
	ActionIcon,
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	Grid,
	Group,
	Paper,
	Progress,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { useNavigation, useOne } from "@refinedev/core";
import {
	IconArrowLeft,
	IconCalendar,
	IconEdit,
	IconUsers,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { CanEdit } from "@/components/auth/Can";
import { SCHEDULE_STATUS_OPTIONS } from "@/config/constants";
import { usePermissions } from "@/hooks/usePermissions";
import type { Schedule } from "@/types";

interface ScheduleShowProps {
	id?: string;
}

export const ScheduleShow = ({ id: propId }: ScheduleShowProps = {}) => {
	const { list, edit, push } = useNavigation();
	const { isAdmin, isLeader } = usePermissions();

	// Get id from props or URL params
	const scheduleId = propId || window.location.pathname.split("/").pop();

	const { data, isLoading } = useOne<Schedule>({
		resource: "schedules",
		id: scheduleId || "",
		queryOptions: {
			enabled: !!scheduleId,
		},
	});

	const schedule = data?.data;

	if (isLoading) {
		return <Text>Carregando...</Text>;
	}

	if (!schedule) {
		return (
			<Stack gap="lg">
				<Title order={2}>Escala não encontrada</Title>
				<Button onClick={() => list("schedules")}>Voltar para Escalas</Button>
			</Stack>
		);
	}

	const confirmedCount = schedule.volunteers.filter(
		(v) => v.status === "confirmed",
	).length;
	const pendingCount = schedule.volunteers.filter(
		(v) => v.status === "pending",
	).length;
	const percentage =
		schedule.volunteers.length > 0
			? (confirmedCount / schedule.volunteers.length) * 100
			: 0;

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Group>
					<ActionIcon
						variant="light"
						size="lg"
						onClick={() => list("schedules")}
					>
						<IconArrowLeft size="1.2rem" />
					</ActionIcon>
					<Title order={2}>{schedule.title}</Title>
				</Group>
				<Group>
					{(isAdmin() || isLeader()) && (
						<Button
							variant="light"
							color="teal"
							leftSection={<IconUsers size="1rem" />}
							onClick={() => push(`/schedules/manage/${schedule.id}`)}
						>
							Gerenciar Voluntários
						</Button>
					)}
					<CanEdit resource="schedules">
						<Button
							variant="light"
							leftSection={<IconEdit size="1rem" />}
							onClick={() => edit("schedules", schedule.id)}
						>
							Editar
						</Button>
					</CanEdit>
				</Group>
			</Group>

			{/* Info Cards */}
			<Grid>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Card shadow="sm" padding="lg" radius="md" withBorder>
						<Stack gap="md">
							<Group>
								<IconCalendar size="1.5rem" />
								<div>
									<Text size="sm" c="dimmed">
										Data
									</Text>
									<Text size="lg" fw={500}>
										{dayjs(schedule.date).format("DD/MM/YYYY")}
									</Text>
								</div>
							</Group>

							<div>
								<Text size="sm" c="dimmed" mb={4}>
									Ministério
								</Text>
								<Badge size="lg" variant="light">
									{schedule.ministry?.name || "Sem ministério"}
								</Badge>
							</div>

							{schedule.description && (
								<div>
									<Text size="sm" c="dimmed" mb={4}>
										Descrição
									</Text>
									<Text size="sm">{schedule.description}</Text>
								</div>
							)}
						</Stack>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 6 }}>
					<Card shadow="sm" padding="lg" radius="md" withBorder>
						<Stack gap="md">
							<div>
								<Text size="sm" c="dimmed" mb={8}>
									Progresso de Confirmações
								</Text>
								<Progress
									value={percentage}
									size="xl"
									radius="md"
									color={percentage === 100 ? "green" : "yellow"}
								/>
								<Group justify="space-between" mt={8}>
									<Text size="sm" c="dimmed">
										{confirmedCount} de {schedule.volunteers.length} confirmados
									</Text>
									<Text size="sm" fw={500}>
										{percentage.toFixed(0)}%
									</Text>
								</Group>
							</div>

							<Grid>
								<Grid.Col span={6}>
									<Paper p="md" withBorder>
										<Text size="xs" c="dimmed" tt="uppercase">
											Confirmados
										</Text>
										<Text size="xl" fw={700} c="green">
											{confirmedCount}
										</Text>
									</Paper>
								</Grid.Col>
								<Grid.Col span={6}>
									<Paper p="md" withBorder>
										<Text size="xs" c="dimmed" tt="uppercase">
											Pendentes
										</Text>
										<Text size="xl" fw={700} c="yellow">
											{pendingCount}
										</Text>
									</Paper>
								</Grid.Col>
							</Grid>
						</Stack>
					</Card>
				</Grid.Col>
			</Grid>

			{/* Volunteers Table */}
			<Paper shadow="sm" radius="md" withBorder>
				<Box
					p="md"
					style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
				>
					<Title order={4}>Voluntários</Title>
				</Box>
				<Box style={{ overflowX: "auto" }}>
					<Table>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Voluntário</Table.Th>
								<Table.Th>Email</Table.Th>
								<Table.Th>Telefone</Table.Th>
								<Table.Th>Status</Table.Th>
								<Table.Th>Respondido em</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{schedule.volunteers.length === 0 ? (
								<Table.Tr>
									<Table.Td colSpan={5}>
										<Text ta="center" c="dimmed" py="xl">
											Nenhum voluntário cadastrado nesta escala
										</Text>
									</Table.Td>
								</Table.Tr>
							) : (
								schedule.volunteers.map((volunteer) => {
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
										</Table.Tr>
									);
								})
							)}
						</Table.Tbody>
					</Table>
				</Box>
			</Paper>
		</Stack>
	);
};

export default ScheduleShow;
