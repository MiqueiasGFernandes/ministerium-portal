import {
	Avatar,
	Badge,
	Button,
	Card,
	CopyButton,
	Grid,
	Group,
	LoadingOverlay,
	Paper,
	Stack,
	Table,
	Text,
	Title,
	Tooltip,
} from "@mantine/core";
import { useShow } from "@refinedev/core";
import {
	IconCheck,
	IconCopy,
	IconEdit,
	IconQrcode,
	IconTicket,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { EVENT_STATUS_OPTIONS } from "@/config/constants";
import type { Event } from "@/types";

export const EventShow = () => {
	const navigate = useNavigate();
	const { queryResult } = useShow<Event>();
	const { data, isLoading } = queryResult;
	const event = data?.data;
	const statusOpt = EVENT_STATUS_OPTIONS.find((o) => o.value === event?.status);

	return (
		<Stack gap="lg" pos="relative">
			<LoadingOverlay visible={isLoading} />
			<Group justify="space-between">
				<Title order={2}>Detalhes do Evento</Title>
				<Button
					leftSection={<IconEdit size="1rem" />}
					onClick={() => navigate(`/events/edit/${event?.id}`)}
				>
					Editar
				</Button>
			</Group>
			{event && (
				<Grid>
					<Grid.Col span={{ base: 12, md: 8 }}>
						<Stack gap="md">
							<Paper shadow="xs" p="lg" radius="md" withBorder>
								<Stack gap="md">
									<Group justify="space-between">
										<Title order={3}>{event.title}</Title>
										<Badge size="lg" color={statusOpt?.color} variant="light">
											{statusOpt?.label}
										</Badge>
									</Group>
									<Text>{event.description}</Text>
									<Grid>
										<Grid.Col span={6}>
											<Text size="sm">
												<strong>Data:</strong>{" "}
												{dayjs(event.date).format("DD/MM/YYYY")}
											</Text>
										</Grid.Col>
										<Grid.Col span={6}>
											<Text size="sm">
												<strong>Horário:</strong> {event.time}
											</Text>
										</Grid.Col>
										<Grid.Col span={12}>
											<Text size="sm">
												<strong>Local:</strong> {event.location}
											</Text>
										</Grid.Col>
									</Grid>
								</Stack>
							</Paper>
							<Paper shadow="xs" p="lg" radius="md" withBorder>
								<Title order={4} mb="md">
									Inscritos ({event.attendees.length})
								</Title>
								<Table>
									<Table.Thead>
										<Table.Tr>
											<Table.Th>Nome</Table.Th>
											<Table.Th>Check-in</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{event.attendees.map((a) => (
											<Table.Tr key={a.id}>
												<Table.Td>
													<Group>
														<Avatar src={a.member?.photo} size="sm" />
														<Text size="sm">{a.member?.name}</Text>
													</Group>
												</Table.Td>
												<Table.Td>
													<Badge color={a.checkedIn ? "green" : "gray"}>
														{a.checkedIn ? "Sim" : "Não"}
													</Badge>
												</Table.Td>
											</Table.Tr>
										))}
									</Table.Tbody>
								</Table>
							</Paper>
						</Stack>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 4 }}>
						<Stack gap="md">
							{event.registrationConfig?.enabled && (
								<Card shadow="sm" padding="lg" radius="md" withBorder>
									<Stack align="center" gap="md">
										<IconTicket size={48} />
										<Title order={4}>Inscrição Pública</Title>
										<QRCodeSVG
											value={`${window.location.origin}/events/${event.id}/subscription`}
											size={200}
										/>
										<Text size="xs" c="dimmed" ta="center">
											Escaneie ou compartilhe o link para inscrições
										</Text>
										<CopyButton
											value={`${window.location.origin}/events/${event.id}/subscription`}
										>
											{({ copied, copy }) => (
												<Tooltip
													label={copied ? "Link copiado!" : "Copiar link"}
													withArrow
												>
													<Button
														variant="light"
														size="xs"
														onClick={copy}
														leftSection={
															copied ? (
																<IconCheck size={16} />
															) : (
																<IconCopy size={16} />
															)
														}
													>
														{copied ? "Copiado" : "Copiar Link"}
													</Button>
												</Tooltip>
											)}
										</CopyButton>
									</Stack>
								</Card>
							)}
							<Card shadow="sm" padding="lg" radius="md" withBorder>
								<Stack align="center" gap="md">
									<IconQrcode size={48} />
									<Title order={4}>QR Code Check-in</Title>
									<QRCodeSVG value={event.qrCode || event.id} size={200} />
									<Text size="xs" c="dimmed" ta="center">
										Escaneie para fazer check-in
									</Text>
								</Stack>
							</Card>
						</Stack>
					</Grid.Col>
				</Grid>
			)}
		</Stack>
	);
};
export default EventShow;
