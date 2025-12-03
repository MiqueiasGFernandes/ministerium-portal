import { Button, Center, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import type { OnboardingStepProps } from "@/types";

/**
 * Complete Step Component
 * Single Responsibility: Shows completion message and final action
 */
export const CompleteStep = ({
	data,
	onNext,
}: OnboardingStepProps) => {
	const handleFinish = () => {
		onNext({});
	};

	return (
		<Center style={{ minHeight: "60vh" }}>
			<Paper p="xl" radius="md" withBorder shadow="md" maw={600}>
				<Stack gap="xl" align="center">
					<IconCircleCheck size={80} stroke={1.5} color="#40C057" />

					<Stack gap="md" align="center">
						<Title order={1} ta="center">
							Tudo Pronto!
						</Title>
						<Text size="lg" c="dimmed" ta="center">
							Sua organização foi configurada com sucesso
						</Text>
					</Stack>

					<Stack gap="sm" align="center" w="100%">
						<Paper p="md" bg="gray.0" radius="md" w="100%">
							<Stack gap="xs">
								<Group justify="space-between">
									<Text fw={500}>Organização:</Text>
									<Text c="dimmed">{data.tenant?.name}</Text>
								</Group>
								<Group justify="space-between">
									<Text fw={500}>Subdomínio:</Text>
									<Text c="dimmed">{data.tenant?.subdomain}</Text>
								</Group>
								<Group justify="space-between">
									<Text fw={500}>Administrador:</Text>
									<Text c="dimmed">{data.admin?.name}</Text>
								</Group>
								<Group justify="space-between">
									<Text fw={500}>Email:</Text>
									<Text c="dimmed">{data.admin?.email}</Text>
								</Group>
							</Stack>
						</Paper>

						<Text size="sm" ta="center" c="dimmed">
							Você já pode começar a usar o sistema com todas as funcionalidades
							ativadas.
						</Text>
					</Stack>

					<Button
						size="lg"
						fullWidth
						onClick={handleFinish}
						leftSection={<IconCircleCheck size={20} />}
						data-testid="complete-finish-button"
					>
						Acessar o Sistema
					</Button>
				</Stack>
			</Paper>
		</Center>
	);
};
