import {
	Button,
	Card,
	Container,
	NumberInput,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCreate, useNavigation } from "@refinedev/core";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { gradientButtonStyles } from "@/styles/buttonStyles";

interface EnterpriseContactFormData {
	churchName: string;
	responsibleName: string;
	email: string;
	phone: string;
	approximateMembers: number;
	notes: string;
}

/**
 * Enterprise Contact Form
 * For churches interested in the Institutional plan
 */
export const EnterpriseContact = () => {
	const { push } = useNavigation();
	const { mutate: createLead, isLoading } = useCreate();
	const [showTestFill, setShowTestFill] = useState(false);

	// Check if we're in test environment
	useEffect(() => {
		setShowTestFill(
			window.location.hostname === "localhost" ||
				process.env.NODE_ENV === "test",
		);
	}, []);

	const form = useForm<EnterpriseContactFormData>({
		initialValues: {
			churchName: "",
			responsibleName: "",
			email: "",
			phone: "",
			approximateMembers: 0,
			notes: "",
		},
		validate: {
			churchName: (value) =>
				value.length >= 3 ? null : "Nome da igreja é obrigatório",
			responsibleName: (value) =>
				value.length >= 3 ? null : "Nome do responsável é obrigatório",
			email: (value) =>
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "E-mail inválido",
			phone: (value) => (value.length >= 10 ? null : "Telefone inválido"),
			approximateMembers: (value) =>
				value > 0 ? null : "Número de membros é obrigatório",
		},
	});

	const handleAutoFill = () => {
		form.setValues({
			churchName: "Igreja Batista Central",
			responsibleName: "Pastor João Silva",
			email: "pastor@igrejabatista.com.br",
			phone: "11987654321",
			approximateMembers: 500,
			notes:
				"Temos interesse em implementar o sistema para nossa igreja matriz e mais 3 congregações.",
		});
	};

	const handleSubmit = async (values: EnterpriseContactFormData) => {
		createLead(
			{
				resource: "enterprise-leads",
				values: {
					...values,
					status: "pending",
				},
			},
			{
				onSuccess: () => {
					notifications.show({
						title: "Solicitação enviada!",
						message: "Em breve um consultor entrará em contato com você.",
						color: "green",
						icon: <IconCheck />,
					});

					push("/billing/enterprise-contact/success");
				},
				onError: () => {
					notifications.show({
						title: "Erro",
						message:
							"Não foi possível enviar sua solicitação. Tente novamente.",
						color: "red",
					});
				},
			},
		);
	};

	return (
		<Container size="md" py="xl">
			<Stack gap="xl">
				<Stack gap="md">
					<Title order={1}>Plano Institucional</Title>
					<Text size="lg" c="dimmed">
						Preencha o formulário abaixo e nossa equipe entrará em contato para
						entender suas necessidades e apresentar uma proposta personalizada.
					</Text>
				</Stack>

				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Stack gap="md">
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
								label="Nome da Igreja"
								placeholder="Igreja Batista Central"
								required
								{...form.getInputProps("churchName")}
							/>

							<TextInput
								label="Nome do Responsável"
								placeholder="Pastor João Silva"
								required
								{...form.getInputProps("responsibleName")}
							/>

							<TextInput
								label="E-mail"
								placeholder="contato@igreja.com.br"
								required
								type="email"
								{...form.getInputProps("email")}
							/>

							<TextInput
								label="Telefone"
								placeholder="(11) 98765-4321"
								required
								{...form.getInputProps("phone")}
							/>

							<NumberInput
								label="Número Aproximado de Membros"
								placeholder="500"
								required
								min={1}
								{...form.getInputProps("approximateMembers")}
							/>

							<Textarea
								label="Observações"
								placeholder="Conte-nos mais sobre suas necessidades..."
								rows={4}
								{...form.getInputProps("notes")}
							/>

							<Button
								type="submit"
								fullWidth
								size="lg"
								mt="md"
								styles={gradientButtonStyles}
								loading={isLoading}
							>
								Enviar Solicitação
							</Button>
						</Stack>
					</form>
				</Card>

				<Card bg="blue.0" p="md" radius="md">
					<Stack gap="sm">
						<Text fw={600} size="sm">
							O que está incluso no Plano Institucional:
						</Text>
						<Text size="sm">✓ Customização de fluxos e processos</Text>
						<Text size="sm">✓ Suporte a múltiplas congregações</Text>
						<Text size="sm">✓ Treinamento personalizado para sua equipe</Text>
						<Text size="sm">✓ SLA dedicado com suporte prioritário</Text>
						<Text size="sm">✓ Integrações específicas sob demanda</Text>
					</Stack>
				</Card>
			</Stack>
		</Container>
	);
};

export default EnterpriseContact;
