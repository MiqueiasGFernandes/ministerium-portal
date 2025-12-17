import {
	Alert,
	Badge,
	Button,
	Card,
	Container,
	Divider,
	Group,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigation } from "@refinedev/core";
import {
	IconCheck,
	IconCreditCard,
	IconShoppingCart,
	IconTrendingUp,
	IconUserPlus,
	IconX,
} from "@tabler/icons-react";
import { gradientButtonStyles } from "@/styles/buttonStyles";

/**
 * Billing Demo Page
 * Provides easy access to test all billing journeys
 */
export const BillingDemo = () => {
	const { push } = useNavigation();

	const clearSubscription = () => {
		localStorage.removeItem("subscriptions");
		localStorage.removeItem("paymentMethods");
		localStorage.removeItem("invoices");
		notifications.show({
			title: "Assinatura limpa!",
			message: "Você pode agora testar o fluxo do zero.",
			color: "green",
			icon: <IconCheck />,
		});
	};

	const createTrialSubscription = () => {
		const now = new Date();
		const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

		const trial = {
			id: "subscription-1",
			tenantId: "1",
			planId: "plan-essencial",
			status: "trial",
			billingCycle: "monthly",
			currentPeriodStart: now.toISOString(),
			currentPeriodEnd: trialEnd.toISOString(),
			trialEndsAt: trialEnd.toISOString(),
			cancelAtPeriodEnd: false,
			createdAt: now.toISOString(),
			updatedAt: now.toISOString(),
		};

		localStorage.setItem("subscriptions", JSON.stringify([trial]));
		notifications.show({
			title: "Trial criado!",
			message: "Você agora tem uma assinatura trial de 14 dias.",
			color: "blue",
			icon: <IconCheck />,
		});
	};

	const addManyMembers = (count: number) => {
		const existingMembers = JSON.parse(localStorage.getItem("members") || "[]");
		const newMembers = [];

		for (let i = 0; i < count; i++) {
			newMembers.push({
				id: `demo-member-${Date.now()}-${i}`,
				name: `Membro Demo ${i + 1}`,
				email: `demo${i}@test.com`,
				status: "active",
				tags: [],
				customFields: {},
				tenantId: "1",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});
		}

		localStorage.setItem(
			"members",
			JSON.stringify([...existingMembers, ...newMembers]),
		);

		notifications.show({
			title: "Membros adicionados!",
			message: `${count} membros foram adicionados para teste de limites.`,
			color: "green",
			icon: <IconUserPlus />,
		});
	};

	return (
		<Container size="lg" py="xl">
			<Stack gap="xl">
				<div>
					<Title order={1}>Demo - Jornada de Billing</Title>
					<Text c="dimmed" mt="sm">
						Use esta página para testar facilmente todos os fluxos de assinatura
					</Text>
				</div>

				<Alert color="blue" title="Ambiente de Demonstração">
					Esta página facilita o teste de todas as funcionalidades de billing.
					Todas as ações aqui são simuladas e usam dados fake.
				</Alert>

				{/* Jornada 1: Nova Assinatura */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Group justify="space-between">
							<div>
								<Title order={3}>
									<IconShoppingCart
										size={20}
										style={{ verticalAlign: "middle", marginRight: 8 }}
									/>
									Jornada 1: Nova Assinatura
								</Title>
								<Text size="sm" c="dimmed" mt="xs">
									Teste o fluxo completo de seleção de plano até pagamento
								</Text>
							</div>
							<Badge color="blue">Iniciante</Badge>
						</Group>

						<Divider />

						<Stack gap="xs">
							<Text fw={500} size="sm">
								Passos:
							</Text>
							<Text size="sm">1. Limpe a assinatura atual (se houver)</Text>
							<Text size="sm">2. Navegue para a página de planos</Text>
							<Text size="sm">3. Selecione um plano</Text>
							<Text size="sm">4. Use o botão "Auto-preencher"</Text>
							<Text size="sm">5. Confirme o pagamento</Text>
						</Stack>

						<Group>
							<Button
								variant="outline"
								color="red"
								leftSection={<IconX size={16} />}
								onClick={clearSubscription}
							>
								1. Limpar Assinatura
							</Button>
							<Button
								styles={gradientButtonStyles}
								leftSection={<IconShoppingCart size={16} />}
								onClick={() => push("/billing/plans")}
							>
								2. Ir para Planos
							</Button>
						</Group>
					</Stack>
				</Card>

				{/* Jornada 2: Trial → Paid */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Group justify="space-between">
							<div>
								<Title order={3}>
									<IconCreditCard
										size={20}
										style={{ verticalAlign: "middle", marginRight: 8 }}
									/>
									Jornada 2: Trial → Assinatura Paga
								</Title>
								<Text size="sm" c="dimmed" mt="xs">
									Teste a conversão de trial para assinatura paga
								</Text>
							</div>
							<Badge color="yellow">Intermediário</Badge>
						</Group>

						<Divider />

						<Stack gap="xs">
							<Text fw={500} size="sm">
								Passos:
							</Text>
							<Text size="sm">1. Crie uma assinatura trial</Text>
							<Text size="sm">2. Vá para "Minha Assinatura"</Text>
							<Text size="sm">3. Clique em "Assinar Agora"</Text>
							<Text size="sm">4. Complete o checkout</Text>
						</Stack>

						<Group>
							<Button
								variant="outline"
								onClick={createTrialSubscription}
								leftSection={<IconCheck size={16} />}
							>
								1. Criar Trial
							</Button>
							<Button
								styles={gradientButtonStyles}
								onClick={() => push("/billing/subscription")}
								leftSection={<IconCreditCard size={16} />}
							>
								2. Ver Assinatura
							</Button>
						</Group>
					</Stack>
				</Card>

				{/* Jornada 3: Upgrade por Limite */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Group justify="space-between">
							<div>
								<Title order={3}>
									<IconTrendingUp
										size={20}
										style={{ verticalAlign: "middle", marginRight: 8 }}
									/>
									Jornada 3: Upgrade por Limite de Membros
								</Title>
								<Text size="sm" c="dimmed" mt="xs">
									Teste o upgrade quando o limite de membros é atingido
								</Text>
							</div>
							<Badge color="orange">Avançado</Badge>
						</Group>

						<Divider />

						<Stack gap="xs">
							<Text fw={500} size="sm">
								Passos:
							</Text>
							<Text size="sm">
								1. Assine o plano Essencial (limite 100 membros)
							</Text>
							<Text size="sm">2. Adicione 95 membros fake</Text>
							<Text size="sm">3. Navegue para membros</Text>
							<Text size="sm">4. Veja a notificação de limite próximo</Text>
							<Text size="sm">5. Adicione mais 10 membros (total 105)</Text>
							<Text size="sm">6. Veja a notificação de limite excedido</Text>
							<Text size="sm">7. Faça upgrade do plano</Text>
						</Stack>

						<Group>
							<Button
								variant="outline"
								onClick={() => addManyMembers(95)}
								leftSection={<IconUserPlus size={16} />}
							>
								2. Adicionar 95 Membros
							</Button>
							<Button
								variant="outline"
								onClick={() => addManyMembers(10)}
								leftSection={<IconUserPlus size={16} />}
							>
								5. Adicionar +10 Membros
							</Button>
							<Button
								styles={gradientButtonStyles}
								onClick={() => push("/members")}
							>
								3. Ir para Membros
							</Button>
						</Group>
					</Stack>
				</Card>

				{/* Jornada 4: Gerenciar Assinatura */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Group justify="space-between">
							<div>
								<Title order={3}>
									<IconCreditCard
										size={20}
										style={{ verticalAlign: "middle", marginRight: 8 }}
									/>
									Jornada 4: Gerenciar Assinatura
								</Title>
								<Text size="sm" c="dimmed" mt="xs">
									Teste todas as operações de gerenciamento
								</Text>
							</div>
							<Badge color="grape">Completo</Badge>
						</Group>

						<Divider />

						<Stack gap="xs">
							<Text fw={500} size="sm">
								Operações disponíveis:
							</Text>
							<Text size="sm">✓ Fazer upgrade de plano</Text>
							<Text size="sm">✓ Mudar ciclo (mensal ↔ anual)</Text>
							<Text size="sm">✓ Cancelar renovação</Text>
							<Text size="sm">✓ Ver histórico de faturas</Text>
						</Stack>

						<Button
							styles={gradientButtonStyles}
							onClick={() => push("/billing/subscription")}
							fullWidth
						>
							Ir para Minha Assinatura
						</Button>
					</Stack>
				</Card>

				{/* Quick Actions */}
				<Card shadow="sm" padding="lg" radius="md" withBorder bg="gray.0">
					<Stack gap="md">
						<Title order={4}>Ações Rápidas</Title>
						<Group>
							<Button
								variant="light"
								onClick={() => push("/billing/plans")}
								size="sm"
							>
								Ver Planos
							</Button>
							<Button
								variant="light"
								onClick={() => push("/billing/subscription")}
								size="sm"
							>
								Minha Assinatura
							</Button>
							<Button
								variant="light"
								onClick={() => push("/billing/enterprise-contact")}
								size="sm"
							>
								Contato Enterprise
							</Button>
							<Button
								variant="light"
								color="red"
								onClick={clearSubscription}
								size="sm"
							>
								Resetar Tudo
							</Button>
						</Group>
					</Stack>
				</Card>
			</Stack>
		</Container>
	);
};

export default BillingDemo;
