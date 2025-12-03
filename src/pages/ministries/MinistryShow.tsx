import {
	Badge,
	Button,
	Card,
	Divider,
	Grid,
	Group,
	Loader,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useGo, useOne, useList } from "@refinedev/core";
import { IconEdit, IconUsers, IconUser } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import type { Ministry, User } from "@/types";

export const MinistryShow = () => {
	const { id } = useParams<{ id: string }>();
	const go = useGo();

	const { data: ministryData, isLoading } = useOne<Ministry>({
		resource: "ministries",
		id: id || "",
	});

	const ministry = ministryData?.data;

	const { data: leaderData } = useOne<User>({
		resource: "users",
		id: ministry?.leaderId || "",
		queryOptions: {
			enabled: !!ministry?.leaderId,
		},
	});

	const { data: membersData } = useList<User>({
		resource: "users",
		filters: [
			{
				field: "id",
				operator: "in",
				value: ministry?.members || [],
			},
		],
		queryOptions: {
			enabled: !!ministry?.members && ministry.members.length > 0,
		},
	});

	if (isLoading) {
		return (
			<Stack align="center" justify="center" h={300}>
				<Loader size="lg" />
			</Stack>
		);
	}

	if (!ministry) {
		return <Text>Ministério não encontrado</Text>;
	}

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>{ministry.name}</Title>
				<Button
					leftSection={<IconEdit size="1rem" />}
					onClick={() => go({ to: `/ministries/edit/${id}` })}
				>
					Editar
				</Button>
			</Group>

			<Paper shadow="xs" p="lg" radius="md" withBorder>
				<Grid>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<Stack gap="xs">
							<Text size="sm" fw={500} c="dimmed">
								Descrição
							</Text>
							<Text>{ministry.description}</Text>
						</Stack>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 3 }}>
						<Stack gap="xs">
							<Text size="sm" fw={500} c="dimmed">
								Criado em
							</Text>
							<Text>{dayjs(ministry.createdAt).format("DD/MM/YYYY")}</Text>
						</Stack>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 3 }}>
						<Stack gap="xs">
							<Text size="sm" fw={500} c="dimmed">
								Atualizado em
							</Text>
							<Text>{dayjs(ministry.updatedAt).format("DD/MM/YYYY")}</Text>
						</Stack>
					</Grid.Col>
				</Grid>
			</Paper>

			<Grid>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group mb="md">
							<IconUser size="1.2rem" />
							<Title order={4}>Líder</Title>
						</Group>
						<Divider mb="md" />
						{leaderData?.data ? (
							<Stack gap="xs">
								<Text fw={500}>{leaderData.data.name}</Text>
								<Text size="sm" c="dimmed">
									{leaderData.data.email}
								</Text>
							</Stack>
						) : (
							<Text c="dimmed">Carregando...</Text>
						)}
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 6 }}>
					<Card shadow="xs" padding="lg" radius="md" withBorder>
						<Group mb="md" justify="space-between">
							<Group>
								<IconUsers size="1.2rem" />
								<Title order={4}>Membros</Title>
							</Group>
							<Badge variant="light" color="blue">
								{ministry.members.length}
							</Badge>
						</Group>
						<Divider mb="md" />
						<Stack gap="sm">
							{membersData?.data && membersData.data.length > 0 ? (
								membersData.data.map((member) => (
									<Group key={member.id} justify="space-between">
										<div>
											<Text size="sm" fw={500}>
												{member.name}
											</Text>
											<Text size="xs" c="dimmed">
												{member.email}
											</Text>
										</div>
										<Badge size="sm" variant="light">
											{member.role}
										</Badge>
									</Group>
								))
							) : (
								<Text c="dimmed" size="sm">
									Nenhum membro ainda
								</Text>
							)}
						</Stack>
					</Card>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};

export default MinistryShow;
