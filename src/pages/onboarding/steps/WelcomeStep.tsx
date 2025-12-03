import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core";
import { IconRocket } from "@tabler/icons-react";
import type { OnboardingStepProps } from "@/types";

/**
 * Welcome Step Component
 * Single Responsibility: Displays welcome message and starts onboarding
 */
export const WelcomeStep = ({ onNext }: OnboardingStepProps) => {
	const handleStart = () => {
		onNext({});
	};

	return (
		<Center style={{ minHeight: "60vh" }}>
			<Paper p="xl" radius="md" withBorder shadow="md" maw={600}>
				<Stack gap="xl" align="center">
					<IconRocket size={80} stroke={1.5} color="#228BE6" />

					<Stack gap="md" align="center">
						<Title order={1} ta="center">
							Bem-vindo ao Ministerium
						</Title>
						<Text size="lg" c="dimmed" ta="center">
							Estamos felizes em tê-lo aqui!
						</Text>
					</Stack>

					<Stack gap="sm" align="center">
						<Text ta="center">
							Vamos configurar sua organização em apenas alguns passos simples.
						</Text>
						<Text size="sm" c="dimmed" ta="center">
							Isso levará apenas alguns minutos e você poderá começar a usar
							todas as funcionalidades do sistema.
						</Text>
					</Stack>

					<Button
						size="lg"
						fullWidth
						onClick={handleStart}
						leftSection={<IconRocket size={20} />}
						data-testid="welcome-start-button"
					>
						Começar
					</Button>
				</Stack>
			</Paper>
		</Center>
	);
};
