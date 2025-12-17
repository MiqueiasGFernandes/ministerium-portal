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
 * Enterprise Contact Success page
 * Displays confirmation after enterprise lead form submission
 */
export const EnterpriseContactSuccess = () => {
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
							Solicitação Enviada!
						</Title>
						<Text size="lg" c="dimmed" ta="center">
							Recebemos sua solicitação para o Plano Institucional.
						</Text>
					</Stack>

					<Card bg="blue.0" p="md" radius="md" w="100%">
						<Stack gap="sm">
							<Text fw={600} size="sm">
								Próximos passos:
							</Text>
							<Text size="sm">✓ Nossa equipe analisará suas necessidades</Text>
							<Text size="sm">
								✓ Um consultor entrará em contato em até 24 horas
							</Text>
							<Text size="sm">✓ Apresentaremos uma proposta personalizada</Text>
						</Stack>
					</Card>

					<Group mt="md" w="100%">
						<Button
							fullWidth
							size="lg"
							styles={gradientButtonStyles}
							onClick={() => push("/")}
						>
							Voltar ao Início
						</Button>
					</Group>

					<Text size="sm" c="dimmed" ta="center">
						Você receberá um e-mail de confirmação com mais informações.
					</Text>
				</Stack>
			</Card>
		</Container>
	);
};

export default EnterpriseContactSuccess;
