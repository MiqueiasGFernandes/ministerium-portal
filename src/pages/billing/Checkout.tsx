import {
	Alert,
	Button,
	Card,
	Container,
	Divider,
	Grid,
	Group,
	LoadingOverlay,
	NumberInput,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useNavigation, useOne, useParsed } from "@refinedev/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Plan } from "@/types";

interface CheckoutFormData {
	cardNumber: string;
	cardHolderName: string;
	cardExpMonth: string;
	cardExpYear: string;
	cardCvv: string;
}

/**
 * Checkout page - processes subscription payment
 * Follows PRD specifications for payment flow
 */
export const Checkout = () => {
	const { push } = useNavigation();
	const { params } = useParsed<{ planId?: string; cycle?: string }>();
	const [isProcessing, setIsProcessing] = useState(false);
	const [showTestFill, setShowTestFill] = useState(false);

	const planId = params?.planId;
	const billingCycle = params?.cycle || "monthly";

	// Check if we're in test environment
	useEffect(() => {
		setShowTestFill(
			window.location.hostname === "localhost" ||
				process.env.NODE_ENV === "test",
		);
	}, []);

	// Fetch plan details
	const { data: planData, isLoading: isPlanLoading } = useOne<Plan>({
		resource: "plans",
		id: planId || "",
		queryOptions: {
			enabled: !!planId,
		},
	});

	const plan = planData?.data;

	const form = useForm<CheckoutFormData>({
		initialValues: {
			cardNumber: "",
			cardHolderName: "",
			cardExpMonth: "",
			cardExpYear: "",
			cardCvv: "",
		},
		validate: {
			cardNumber: (value) =>
				value.length === 16 ? null : "Número do cartão deve ter 16 dígitos",
			cardHolderName: (value) =>
				value.length >= 3 ? null : "Nome do titular é obrigatório",
			cardExpMonth: (value) => {
				const month = Number.parseInt(value);
				return month >= 1 && month <= 12 ? null : "Mês inválido";
			},
			cardExpYear: (value) => {
				const year = Number.parseInt(value);
				const currentYear = new Date().getFullYear();
				return year >= currentYear ? null : "Ano inválido";
			},
			cardCvv: (value) =>
				value.length === 3 || value.length === 4 ? null : "CVV inválido",
		},
	});

	const handleAutoFill = () => {
		form.setValues({
			cardNumber: "4532123456789012",
			cardHolderName: "João Silva",
			cardExpMonth: "12",
			cardExpYear: "2025",
			cardCvv: "123",
		});
	};

	const handleSubmit = async (values: CheckoutFormData) => {
		if (!plan) return;

		setIsProcessing(true);

		try {
			// Simulate payment processing
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Process checkout via custom endpoint
			await fetch("/api/billing/checkout", {
				method: "POST",
				body: JSON.stringify({
					planId: plan.id,
					billingCycle,
					tenantId: "1", // In real app, get from auth context
					paymentMethod: values,
				}),
			});

			notifications.show({
				title: "Pagamento processado!",
				message: "Sua assinatura foi ativada com sucesso.",
				color: "green",
				icon: <IconCheck />,
			});

			// Redirect to success page
			push("/billing/checkout/success");
		} catch (error) {
			notifications.show({
				title: "Erro no pagamento",
				message: "Não foi possível processar o pagamento. Tente novamente.",
				color: "red",
				icon: <IconAlertCircle />,
			});
		} finally {
			setIsProcessing(false);
		}
	};

	if (!planId) {
		return (
			<Container size="sm" py="xl">
				<Alert color="red" icon={<IconAlertCircle />}>
					Plano não especificado. Por favor, selecione um plano.
				</Alert>
			</Container>
		);
	}

	const price =
		plan && (billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice);

	return (
		<Container size="lg" py="xl">
			<Stack gap="xl" pos="relative">
				<LoadingOverlay visible={isPlanLoading || isProcessing} />

				<Title order={1}>Finalizar Assinatura</Title>

				<Grid>
					{/* Payment Form */}
					<Grid.Col span={{ base: 12, md: 7 }}>
						<Card shadow="sm" padding="lg" radius="md" withBorder>
							<form onSubmit={form.onSubmit(handleSubmit)}>
								<Stack gap="md">
									<Title order={3}>Dados do Pagamento</Title>

									{showTestFill && (
										<Button
											variant="light"
											color="orange"
											onClick={handleAutoFill}
											fullWidth
										>
											🧪 Auto-preencher (Ambiente de Teste)
										</Button>
									)}

									<TextInput
										label="Número do Cartão"
										placeholder="1234 5678 9012 3456"
										required
										maxLength={16}
										{...form.getInputProps("cardNumber")}
									/>

									<TextInput
										label="Nome do Titular"
										placeholder="Nome como está no cartão"
										required
										{...form.getInputProps("cardHolderName")}
									/>

									<Grid>
										<Grid.Col span={4}>
											<Select
												label="Mês"
												placeholder="MM"
												required
												data={Array.from({ length: 12 }, (_, i) => ({
													value: String(i + 1).padStart(2, "0"),
													label: String(i + 1).padStart(2, "0"),
												}))}
												{...form.getInputProps("cardExpMonth")}
											/>
										</Grid.Col>
										<Grid.Col span={4}>
											<NumberInput
												label="Ano"
												placeholder="AAAA"
												required
												min={new Date().getFullYear()}
												max={new Date().getFullYear() + 20}
												{...form.getInputProps("cardExpYear")}
											/>
										</Grid.Col>
										<Grid.Col span={4}>
											<TextInput
												label="CVV"
												placeholder="123"
												required
												maxLength={4}
												{...form.getInputProps("cardCvv")}
											/>
										</Grid.Col>
									</Grid>

									<Button
										type="submit"
										fullWidth
										size="lg"
										mt="md"
										styles={gradientButtonStyles}
										loading={isProcessing}
									>
										Confirmar Pagamento
									</Button>
								</Stack>
							</form>
						</Card>
					</Grid.Col>

					{/* Order Summary */}
					<Grid.Col span={{ base: 12, md: 5 }}>
						<Card shadow="sm" padding="lg" radius="md" withBorder>
							<Stack gap="md">
								<Title order={3}>Resumo do Pedido</Title>

								{plan && (
									<>
										<div>
											<Text fw={600}>{plan.name}</Text>
											<Text size="sm" c="dimmed">
												{plan.description}
											</Text>
										</div>

										<Divider />

										<Group justify="space-between">
											<Text>Plano:</Text>
											<Text fw={600}>{plan.name}</Text>
										</Group>

										<Group justify="space-between">
											<Text>Ciclo:</Text>
											<Text fw={600}>
												{billingCycle === "monthly" ? "Mensal" : "Anual"}
											</Text>
										</Group>

										<Divider />

										<Group justify="space-between">
											<Text size="lg" fw={700}>
												Total:
											</Text>
											<Text size="xl" fw={700} c="blue">
												R$ {price}
											</Text>
										</Group>

										{billingCycle === "annual" && (
											<Alert color="green" variant="light">
												<Text size="sm">
													Você está economizando ~17% com o plano anual!
												</Text>
											</Alert>
										)}

										<Text size="xs" c="dimmed">
											Ao confirmar, você concorda com nossos termos de serviço e
											política de privacidade.
										</Text>
									</>
								)}
							</Stack>
						</Card>
					</Grid.Col>
				</Grid>
			</Stack>
		</Container>
	);
};

export default Checkout;
