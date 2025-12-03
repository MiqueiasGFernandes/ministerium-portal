import {
	Avatar,
	Badge,
	Button,
	Card,
	Divider,
	Grid,
	Group,
	LoadingOverlay,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useShow } from "@refinedev/core";
import {
	IconCalendar,
	IconEdit,
	IconMail,
	IconMapPin,
	IconPhone,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { MEMBER_STATUS_OPTIONS } from "@/config/constants";
import type { Member } from "@/types";

export const MemberShow = () => {
	const navigate = useNavigate();

	const { queryResult } = useShow<Member>();
	const { data, isLoading } = queryResult;
	const member = data?.data;

	const getStatusOption = (status: string) =>
		MEMBER_STATUS_OPTIONS.find((o) => o.value === status);

	const calculateAge = (birthDate: string) => {
		return dayjs().diff(dayjs(birthDate), "year");
	};

	return (
		<Stack gap="lg" pos="relative">
			<LoadingOverlay visible={isLoading} />

			<Group justify="space-between">
				<Title order={2}>Detalhes do Membro</Title>
				<Button
					leftSection={<IconEdit size="1rem" />}
					onClick={() => navigate(`/members/edit/${member?.id}`)}
				>
					Editar
				</Button>
			</Group>

			{member && (
				<Grid>
					{/* Main Info Card */}
					<Grid.Col span={{ base: 12, md: 4 }}>
						<Card shadow="sm" padding="lg" radius="md" withBorder>
							<Stack align="center" gap="md">
								<Avatar src={member.photo} size={120} radius={120} />

								<Stack gap="xs" align="center">
									<Title order={3}>{member.name}</Title>
									<Badge
										size="lg"
										color={getStatusOption(member.status)?.color || "gray"}
										variant="light"
									>
										{getStatusOption(member.status)?.label || member.status}
									</Badge>
								</Stack>

								<Divider w="100%" />

								{/* Contact Info */}
								<Stack gap="sm" w="100%">
									{member.email && (
										<Group gap="xs">
											<IconMail size="1rem" />
											<Text size="sm">{member.email}</Text>
										</Group>
									)}

									{member.phone && (
										<Group gap="xs">
											<IconPhone size="1rem" />
											<Text size="sm">{member.phone}</Text>
										</Group>
									)}

									{member.birthDate && (
										<Group gap="xs">
											<IconCalendar size="1rem" />
											<Text size="sm">
												{dayjs(member.birthDate).format("DD/MM/YYYY")} (
												{calculateAge(member.birthDate)} anos)
											</Text>
										</Group>
									)}
								</Stack>

								{/* Tags */}
								{member.tags && member.tags.length > 0 && (
									<>
										<Divider w="100%" />
										<Stack gap="xs" w="100%">
											<Text size="sm" fw={600}>
												Tags:
											</Text>
											<Group gap="xs">
												{member.tags.map((tag) => (
													<Badge key={tag} variant="dot">
														{tag}
													</Badge>
												))}
											</Group>
										</Stack>
									</>
								)}
							</Stack>
						</Card>
					</Grid.Col>

					{/* Details */}
					<Grid.Col span={{ base: 12, md: 8 }}>
						<Stack gap="md">
							{/* Address */}
							{member.address && (
								<Paper shadow="xs" p="lg" radius="md" withBorder>
									<Group mb="md">
										<IconMapPin size="1.2rem" />
										<Title order={4}>Endereço</Title>
									</Group>

									<Stack gap="xs">
										<Text size="sm">
											<strong>Rua:</strong> {member.address.street},{" "}
											{member.address.number}
										</Text>
										{member.address.complement && (
											<Text size="sm">
												<strong>Complemento:</strong>{" "}
												{member.address.complement}
											</Text>
										)}
										<Text size="sm">
											<strong>Cidade:</strong> {member.address.city} -{" "}
											{member.address.state}
										</Text>
										<Text size="sm">
											<strong>CEP:</strong> {member.address.zipCode}
										</Text>
									</Stack>
								</Paper>
							)}

							{/* Custom Fields */}
							{member.customFields &&
								Object.keys(member.customFields).length > 0 && (
									<Paper shadow="xs" p="lg" radius="md" withBorder>
										<Title order={4} mb="md">
											Informações Adicionais
										</Title>

										<Grid>
											{Object.entries(member.customFields).map(
												([key, value]) => (
													<Grid.Col key={key} span={{ base: 12, sm: 6 }}>
														<Stack gap="xs">
															<Text size="sm" fw={600} tt="capitalize">
																{key}:
															</Text>
															<Text size="sm" c="dimmed">
																{String(value)}
															</Text>
														</Stack>
													</Grid.Col>
												),
											)}
										</Grid>
									</Paper>
								)}

							{/* Metadata */}
							<Paper shadow="xs" p="lg" radius="md" withBorder>
								<Title order={4} mb="md">
									Metadados
								</Title>

								<Grid>
									<Grid.Col span={{ base: 12, sm: 6 }}>
										<Stack gap="xs">
											<Text size="sm" fw={600}>
												Criado em:
											</Text>
											<Text size="sm" c="dimmed">
												{dayjs(member.createdAt).format("DD/MM/YYYY HH:mm")}
											</Text>
										</Stack>
									</Grid.Col>

									<Grid.Col span={{ base: 12, sm: 6 }}>
										<Stack gap="xs">
											<Text size="sm" fw={600}>
												Atualizado em:
											</Text>
											<Text size="sm" c="dimmed">
												{dayjs(member.updatedAt).format("DD/MM/YYYY HH:mm")}
											</Text>
										</Stack>
									</Grid.Col>
								</Grid>
							</Paper>
						</Stack>
					</Grid.Col>
				</Grid>
			)}
		</Stack>
	);
};

export default MemberShow;
