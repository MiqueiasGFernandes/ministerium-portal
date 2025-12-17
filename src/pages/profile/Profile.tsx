import { Card, Container, Stack, Text, Title } from "@mantine/core";
import { useGetIdentity } from "@refinedev/core";
import type { User } from "@/types";

/**
 * Profile page - displays user profile information
 */
export const Profile = () => {
	const { data: user } = useGetIdentity<User>();

	return (
		<Container size="md" py="xl">
			<Stack gap="xl">
				<Title order={1}>Meu Perfil</Title>

				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<div>
							<Text size="sm" c="dimmed">
								Nome
							</Text>
							<Text fw={500}>{user?.name}</Text>
						</div>

						<div>
							<Text size="sm" c="dimmed">
								E-mail
							</Text>
							<Text fw={500}>{user?.email}</Text>
						</div>

						<div>
							<Text size="sm" c="dimmed">
								Função
							</Text>
							<Text fw={500}>{user?.role}</Text>
						</div>
					</Stack>
				</Card>
			</Stack>
		</Container>
	);
};

export default Profile;
