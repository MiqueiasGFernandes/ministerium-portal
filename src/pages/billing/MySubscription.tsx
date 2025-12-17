import {
	Alert,
	Badge,
	Button,
	Card,
	Container,
	Divider,
	Grid,
	Group,
	LoadingOverlay,
	Modal,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useCustom, useList, useNavigation } from "@refinedev/core";
import {
	IconAlertCircle,
	IconCheck,
	IconCreditCard,
} from "@tabler/icons-react";
import { useState } from "react";
import {
	BillingCycleToggle,
	PlanCard,
	SubscriptionStatusBadge,
} from "@/components/billing";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { BillingCycle, Plan, Subscription } from "@/types";

/**
 * My Subscription page
 * Displays current subscription details and allows upgrades/downgrades
 */
export const MySubscription = () => {
	const { push } = useNavigation();
	const [showUpgradeModal, { open: openUpgrade, close: closeUpgrade }] =
		useDisclosure(false);
	const [showCancelModal, { open: openCancel, close: closeCancel }] =
		useDisclosure(false);
	const [isProcessing, setIsProcessing] = useState(false);

	// Fetch current subscription
	const {
		data: subscriptionData,
		isLoading: isSubLoading,
		refetch,
	} = useCustom<Subscription>({
		url: "/billing/subscription/tenant/1",
		method: "get",
	});

	const subscription = subscriptionData?.data;

	// Fetch all plans
	const { data: plansData } = useList<Plan>({
		resource: "plans",
		pagination: {
			mode: "off",
		},
	});

	const plans = plansData?.data || [];
	const currentPlan = subscription?.plan;

	const handleChangeCycle = async (newCycle: BillingCycle) => {
		if (!subscription) return;

		setIsProcessing(true);

		try {
			await fetch("/api/billing/change-cycle", {
				method: "POST",
				body: JSON.stringify({
					subscriptionId: subscription.id,
					billingCycle: newCycle,
				}),
			});

			notifications.show({
				title: "Ciclo alterado!",
				message: `Seu ciclo de cobrança foi alterado para ${newCycle === "monthly" ? "mensal" : "anual"}.`,
				color: "green",
				icon: <IconCheck />,
			});

			refetch();
		} catch (error) {
			notifications.show({
				title: "Erro",
				message: "Não foi possível alterar o ciclo de cobrança.",
				color: "red",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handleUpgrade = async (planId: string) => {
		if (!subscription) return;

		const plan = plans.find((p: Plan) => p.id === planId);
		if (plan?.isCustom) {
			push("/billing/enterprise-contact");
			return;
		}

		setIsProcessing(true);

		try {
			await fetch("/api/billing/upgrade", {
				method: "POST",
				body: JSON.stringify({
					subscriptionId: subscription.id,
					planId,
				}),
			});

			notifications.show({
				title: "Upgrade realizado!",
				message: "Seu plano foi atualizado com sucesso.",
				color: "green",
				icon: <IconCheck />,
			});

			refetch();
			closeUpgrade();
		} catch (error) {
			notifications.show({
				title: "Erro",
				message: "Não foi possível realizar o upgrade.",
				color: "red",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handleCancelSubscription = async () => {
		if (!subscription) return;

		setIsProcessing(true);

		try {
			await fetch("/api/billing/cancel", {
				method: "POST",
				body: JSON.stringify({
					subscriptionId: subscription.id,
				}),
			});

			notifications.show({
				title: "Assinatura cancelada",
				message: "Sua assinatura será cancelada no fim do período atual.",
				color: "yellow",
			});

			refetch();
			closeCancel();
		} catch (error) {
			notifications.show({
				title: "Erro",
				message: "Não foi possível cancelar a assinatura.",
				color: "red",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("pt-BR");
	};

	const isTrialActive = subscription?.status === "trial";
	const daysUntilTrialEnd =
		isTrialActive && subscription?.trialEndsAt
			? Math.ceil(
					(new Date(subscription.trialEndsAt).getTime() - Date.now()) /
						(1000 * 60 * 60 * 24),
				)
			: 0;

	return (
		<Container size="xl" py="xl">
			<Stack gap="xl" pos="relative">
				<LoadingOverlay visible={isSubLoading || isProcessing} />

				<Title order={1}>Minha Assinatura</Title>

				{/* No Subscription Alert */}
				{!subscription && (
					<Alert color="blue" icon={<IconAlertCircle />}>
						<Text fw={600}>Você ainda não possui uma assinatura ativa</Text>
						<Text size="sm">
							Escolha um dos nossos planos abaixo para começar a usar o sistema
							com todos os recursos disponíveis.
						</Text>
					</Alert>
				)}

				{/* Trial Banner */}
				{isTrialActive && (
					<Alert color="yellow" icon={<IconAlertCircle />}>
						<Text fw={600}>Período de Trial Ativo</Text>
						<Text size="sm">
							Você tem {daysUntilTrialEnd} dias restantes no período de teste
							gratuito. Assine um plano para continuar usando após o término.
						</Text>
					</Alert>
				)}

				{/* Cancel Warning */}
				{subscription?.cancelAtPeriodEnd && (
					<Alert color="red" icon={<IconAlertCircle />}>
						<Text fw={600}>Assinatura Cancelada</Text>
						<Text size="sm">
							Sua assinatura será cancelada em{" "}
							{formatDate(subscription.currentPeriodEnd)}. Você ainda pode usar
							o sistema até esta data.
						</Text>
					</Alert>
				)}

				{!subscription ? (
					// Show available plans when no subscription
					<Stack gap="lg">
						<div>
							<Title order={2}>Planos Disponíveis</Title>
							<Text c="dimmed" mt="xs">
								Escolha o plano ideal para sua organização
							</Text>
						</div>

						<Grid>
							{plans.map((plan: Plan) => (
								<Grid.Col
									key={plan.id}
									span={{ base: 12, sm: 6, md: 4, lg: 2.4 }}
								>
									<PlanCard
										plan={plan}
										billingCycle={"monthly" as BillingCycle}
										onSelect={() => {
											if (plan.isCustom) {
												push("/billing/enterprise-contact");
											} else {
												push(
													`/billing/checkout?planId=${plan.id}&cycle=monthly`,
												);
											}
										}}
										isPopular={plan.isPopular}
									/>
								</Grid.Col>
							))}
						</Grid>
					</Stack>
				) : (
					<Grid>
						{/* Current Subscription Details */}
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Card shadow="sm" padding="lg" radius="md" withBorder>
								<Stack gap="md">
									<Group justify="space-between">
										<Title order={3}>Plano Atual</Title>
										{subscription && (
											<SubscriptionStatusBadge status={subscription.status} />
										)}
									</Group>

									{currentPlan && subscription && (
										<>
											<div>
												<Text size="xl" fw={700}>
													{currentPlan.name}
												</Text>
												<Text size="sm" c="dimmed">
													{currentPlan.description}
												</Text>
											</div>

											<Divider />

											<Group justify="space-between">
												<Text>Ciclo de Cobrança:</Text>
												<Badge>
													{subscription.billingCycle === "monthly"
														? "Mensal"
														: "Anual"}
												</Badge>
											</Group>

											{!isTrialActive && (
												<>
													<Group justify="space-between">
														<Text>Valor:</Text>
														<Text fw={600}>
															R${" "}
															{subscription.billingCycle === "monthly"
																? currentPlan.monthlyPrice
																: currentPlan.annualPrice}
														</Text>
													</Group>

													<Group justify="space-between">
														<Text>Próxima Cobrança:</Text>
														<Text fw={600}>
															{formatDate(subscription.currentPeriodEnd)}
														</Text>
													</Group>
												</>
											)}

											{isTrialActive && (
												<Group justify="space-between">
													<Text>Trial Termina em:</Text>
													<Text fw={600}>
														{formatDate(subscription.trialEndsAt || "")}
													</Text>
												</Group>
											)}
										</>
									)}
								</Stack>
							</Card>
						</Grid.Col>

						{/* Actions */}
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Card shadow="sm" padding="lg" radius="md" withBorder>
								<Stack gap="md">
									<Title order={3}>Ações</Title>

									{/* Change Billing Cycle */}
									{subscription && !isTrialActive && (
										<>
											<Text size="sm" fw={600}>
												Alterar Ciclo de Cobrança
											</Text>
											<BillingCycleToggle
												value={subscription.billingCycle}
												onChange={handleChangeCycle}
											/>
											<Divider />
										</>
									)}

									{/* Upgrade */}
									<Button
										leftSection={<IconCreditCard />}
										onClick={openUpgrade}
										variant="light"
									>
										Fazer Upgrade
									</Button>

									{/* Cancel */}
									{subscription &&
										!subscription.cancelAtPeriodEnd &&
										!isTrialActive && (
											<Button variant="subtle" color="red" onClick={openCancel}>
												Cancelar Renovação
											</Button>
										)}

									{isTrialActive && (
										<Button
											styles={gradientButtonStyles}
											onClick={() => push("/billing/plans")}
											size="lg"
										>
											Assinar Agora
										</Button>
									)}
								</Stack>
							</Card>
						</Grid.Col>
					</Grid>
				)}

				{/* Upgrade Modal */}
				<Modal
					opened={showUpgradeModal}
					onClose={closeUpgrade}
					title="Fazer Upgrade"
					size="xl"
				>
					<Stack gap="md">
						<Text>
							Selecione o plano para o qual deseja fazer upgrade. O upgrade é
							aplicado imediatamente.
						</Text>

						<Grid>
							{plans
								.filter((p: Plan) => !p.isCustom)
								.map((plan: Plan) => (
									<Grid.Col key={plan.id} span={{ base: 12, sm: 6 }}>
										<PlanCard
											plan={plan}
											billingCycle={
												subscription?.billingCycle ||
												("monthly" as BillingCycle)
											}
											onSelect={handleUpgrade}
											isCurrentPlan={plan.id === currentPlan?.id}
										/>
									</Grid.Col>
								))}
						</Grid>

						{/* Custom Plan Option */}
						{plans
							.filter((p: Plan) => p.isCustom)
							.map((plan: Plan) => (
								<PlanCard
									key={plan.id}
									plan={plan}
									billingCycle={
										subscription?.billingCycle || ("monthly" as BillingCycle)
									}
									onSelect={handleUpgrade}
								/>
							))}
					</Stack>
				</Modal>

				{/* Cancel Modal */}
				<Modal
					opened={showCancelModal}
					onClose={closeCancel}
					title="Cancelar Renovação"
				>
					<Stack gap="md">
						<Alert color="yellow" icon={<IconAlertCircle />}>
							<Text fw={600}>Atenção</Text>
							<Text size="sm">
								Ao cancelar, você ainda poderá usar o sistema até{" "}
								{subscription && formatDate(subscription.currentPeriodEnd)}.
								Após esta data, seu acesso será limitado.
							</Text>
						</Alert>

						<Text>Tem certeza que deseja cancelar a renovação automática?</Text>

						<Group justify="flex-end">
							<Button variant="default" onClick={closeCancel}>
								Voltar
							</Button>
							<Button color="red" onClick={handleCancelSubscription}>
								Confirmar Cancelamento
							</Button>
						</Group>
					</Stack>
				</Modal>
			</Stack>
		</Container>
	);
};

export default MySubscription;
