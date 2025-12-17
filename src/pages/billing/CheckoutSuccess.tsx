import {
	Button,
	Card,
	Container,
	Group,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { useNavigation } from "@refinedev/core";
import { IconCheck } from "@tabler/icons-react";
import { gradientButtonStyles } from "@/styles/buttonStyles";

/**
 * Checkout Success page
 * Displays confirmation after successful subscription payment
 */
export const CheckoutSuccess = () => {
	const { push } = useNavigation();

	return (
		<Container size="sm" py="xl">
			<Card shadow="lg" padding="xl" radius="md" withBorder>
				<Stack gap="xl" align="center">
					<ThemeIcon color="green" size={80} radius="xl">
						<IconCheck size={48} />
					</ThemeIcon>

					<Stack gap="md" align="center">
						<Title order={1} ta="center">
							Pagamento Confirmado!
						</Title>
						<Text size="lg" c="dimmed" ta="center">
							Sua assinatura foi ativada com sucesso.
						</Text>
					</Stack>

					<Card bg="blue.0" p="md" radius="md" w="100%">
						<Stack gap="sm">
							<Text fw={600} size="sm">
								Próximos passos:
							</Text>
							<Text size="sm">
								✓ Acesse todas as funcionalidades do seu plano
							</Text>
							<Text size="sm">
								✓ Configure sua igreja e comece a gerenciar membros
							</Text>
							<Text size="sm">
								✓ Explore os recursos disponíveis no dashboard
							</Text>
						</Stack>
					</Card>

					<Group mt="md" w="100%">
						<Button
							fullWidth
							size="lg"
							styles={gradientButtonStyles}
							onClick={() => push("/")}
						>
							Começar Agora
						</Button>
					</Group>

					<Text size="sm" c="dimmed" ta="center">
						Você receberá um e-mail de confirmação com os detalhes da sua
						assinatura.
					</Text>
				</Stack>
			</Card>
		</Container>
	);
};

export default CheckoutSuccess;
