import {
	Button,
	Center,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconBuildingChurch, IconRocket } from "@tabler/icons-react";
import { gradientButtonStyles } from "@/styles/buttonStyles";
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
			<Paper p="xl" radius="md" shadow="md" maw={600}>
				<Stack gap="xl" align="center">
					<Group gap="md" align="flex-end" wrap="nowrap">
						<IconBuildingChurch
							size={60}
							stroke={1.5}
							color="#667eea"
							style={{ flexShrink: 0 }}
						/>
						<Title
							order={1}
							style={{
								fontFamily:
									'"Space Grotesk", "Inter", -apple-system, sans-serif',
								fontWeight: 800,
								fontSize: "3rem",
								letterSpacing: "-0.02em",
								lineHeight: 1,
								color: "#667eea",
								paddingBottom: "2px",
							}}
						>
							Ministerium
						</Title>
					</Group>

					<Stack gap="md" align="center">
						<Title order={2} ta="center" fw={600}>
							Bem-vindo!
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
						styles={gradientButtonStyles}
					>
						Começar
					</Button>
				</Stack>
			</Paper>
		</Center>
	);
};
