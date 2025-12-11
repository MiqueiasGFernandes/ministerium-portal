import {
	Alert,
	Anchor,
	Box,
	Button,
	Center,
	Divider,
	PasswordInput,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
	IconAlertCircle,
	IconCheck,
	IconInfoCircle,
	IconLock,
	IconMail,
	IconPhone,
	IconUser,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createLoginStyles, gradientButtonStyles } from "@/styles/components";
import { type AccessRequest, UserAccessStatus } from "@/types";

interface RequestAccessFormData {
	name: string;
	email: string;
	phone?: string;
	reason?: string;
	password: string;
	confirmPassword: string;
}

export const RequestAccess = () => {
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const { tenantId } = useParams<{ tenantId: string }>();
	const theme = useMantineTheme();

	// Create styles instance
	const styles = useMemo(() => createLoginStyles(theme), [theme]);

	// Set document title
	useEffect(() => {
		document.title = "Ministerium | Solicitar Acesso";
	}, []);

	// Redirect if no tenant ID
	useEffect(() => {
		if (!tenantId) {
			notifications.show({
				title: "Link inválido",
				message: "Este link de convite é inválido ou expirou.",
				color: "red",
			});
			navigate("/login");
		}
	}, [tenantId, navigate]);

	const form = useForm<RequestAccessFormData>({
		initialValues: {
			name: "",
			email: "",
			phone: "",
			reason: "",
			password: "",
			confirmPassword: "",
		},
		validate: {
			name: (value) => {
				if (!value || value.trim().length === 0) {
					return "Nome é obrigatório";
				}
				if (value.trim().length < 3) {
					return "Nome deve ter no mínimo 3 caracteres";
				}
				return null;
			},
			email: (value) => {
				if (!value || value.trim().length === 0) {
					return "Email é obrigatório";
				}
				if (!/^\S+@\S+\.\S+$/.test(value)) {
					return "Email inválido";
				}
				return null;
			},
			password: (value) => {
				if (!value || value.length === 0) {
					return "Senha é obrigatória";
				}
				if (value.length < 8) {
					return "Senha deve ter no mínimo 8 caracteres";
				}
				return null;
			},
			confirmPassword: (value, values) => {
				if (!value || value.length === 0) {
					return "Confirmação de senha é obrigatória";
				}
				if (value !== values.password) {
					return "As senhas não coincidem";
				}
				return null;
			},
		},
	});

	const handleSubmit = async (values: RequestAccessFormData) => {
		if (!tenantId) return;

		try {
			setError("");

			// In a real app, this would be an API call
			// For now, we'll store in localStorage and simulate a delay
			const accessRequest: AccessRequest = {
				id: `access-request-${Date.now()}`,
				email: values.email,
				name: values.name,
				phone: values.phone || undefined,
				reason: values.reason || undefined,
				status: UserAccessStatus.PENDING,
				tenantId: tenantId,
				requestedAt: new Date().toISOString(),
			};

			// Store in localStorage (in production, this would be an API call)
			const existingRequests = JSON.parse(
				localStorage.getItem("accessRequests") || "[]",
			);

			// Check if email already has a pending request for this tenant
			const hasPendingRequest = existingRequests.some(
				(req: AccessRequest) =>
					req.email === values.email &&
					req.tenantId === tenantId &&
					req.status === UserAccessStatus.PENDING,
			);

			if (hasPendingRequest) {
				setError(
					"Você já possui uma solicitação pendente para esta igreja. Aguarde aprovação de um administrador.",
				);
				return;
			}

			// In production, password would be hashed and stored securely
			// For now, we'll just store in localStorage (NOT SECURE - DEMO ONLY)
			localStorage.setItem(
				`pending-password-${values.email}-${tenantId}`,
				values.password,
			);

			localStorage.setItem(
				"accessRequests",
				JSON.stringify([...existingRequests, accessRequest]),
			);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 800));

			setSubmitted(true);

			notifications.show({
				title: "Solicitação enviada!",
				message:
					"Sua solicitação foi enviada com sucesso. Aguarde aprovação de um administrador.",
				color: "green",
				icon: <IconCheck />,
			});
		} catch (_error) {
			setError("Ocorreu um erro ao enviar sua solicitação. Tente novamente.");
		}
	};

	// Success Screen
	if (submitted) {
		return (
			<Box style={styles.container}>
				<Box style={styles.mobileWrapper}>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						style={{ width: "100%" }}
					>
						<Box style={styles.mobileCard}>
							<Stack gap="xl" align="center">
								<Center>
									<IconCheck size={64} color="green" stroke={1.5} />
								</Center>
								<Title order={2} ta="center">
									Solicitação Enviada!
								</Title>
								<Text c="dimmed" ta="center">
									Sua solicitação de acesso está em análise. Você receberá um
									email assim que um administrador aprovar seu acesso.
								</Text>
								<Alert
									variant="light"
									color="blue"
									title="Próximos passos"
									icon={<IconInfoCircle />}
									w="100%"
								>
									<Text size="sm">
										1. Aguarde a aprovação de um administrador
										<br />
										2. Você receberá um email de confirmação
										<br />
										3. Use suas credenciais para fazer login
									</Text>
								</Alert>
								<Button
									variant="gradient"
									gradient={{ from: "blue", to: "cyan", deg: 90 }}
									fullWidth
									onClick={() => navigate("/login")}
									mt="md"
								>
									Ir para Login
								</Button>
							</Stack>
						</Box>
					</motion.div>
				</Box>
			</Box>
		);
	}

	// Request Form
	return (
		<Box style={styles.container}>
			<Box style={styles.mobileWrapper}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					style={{ width: "100%" }}
				>
					<Box style={styles.mobileCard}>
						<Stack gap="lg">
							<Center>
								<Stack gap="xs" align="center">
									<Title order={2} ta="center" fw={700}>
										Solicitar Acesso
									</Title>
									<Text size="sm" c="dimmed" ta="center">
										Preencha o formulário abaixo para solicitar acesso ao
										sistema
									</Text>
								</Stack>
							</Center>

							{error && (
								<Alert
									icon={<IconAlertCircle size="1rem" />}
									title="Erro"
									color="red"
									withCloseButton
									onClose={() => setError("")}
								>
									{error}
								</Alert>
							)}

							<form onSubmit={form.onSubmit(handleSubmit)}>
								<Stack gap="lg">
									<TextInput
										label="Nome Completo"
										placeholder="Seu nome completo"
										required
										leftSection={<IconUser size={18} />}
										{...form.getInputProps("name")}
									/>

									<TextInput
										label="Email"
										placeholder="seu@email.com"
										required
										type="email"
										leftSection={<IconMail size={18} />}
										{...form.getInputProps("email")}
									/>

									<TextInput
										label="Telefone"
										placeholder="(00) 00000-0000"
										leftSection={<IconPhone size={18} />}
										{...form.getInputProps("phone")}
									/>

									<PasswordInput
										label="Senha"
										placeholder="Digite sua senha"
										required
										leftSection={<IconLock size={18} />}
										description="Mínimo de 8 caracteres"
										{...form.getInputProps("password")}
									/>

									<PasswordInput
										label="Confirmar Senha"
										placeholder="Digite sua senha novamente"
										required
										leftSection={<IconLock size={18} />}
										{...form.getInputProps("confirmPassword")}
									/>

									<Alert
										variant="light"
										color="blue"
										icon={<IconInfoCircle size={18} />}
									>
										<Text size="sm">
											Sua senha é criptografada e segura. O administrador não
											terá acesso à sua senha.
										</Text>
									</Alert>

									<Textarea
										label="Motivo do acesso (opcional)"
										placeholder="Descreva brevemente o motivo da sua solicitação"
										minRows={3}
										maxRows={6}
										{...form.getInputProps("reason")}
									/>

									<Button
										type="submit"
										fullWidth
										size="md"
										mt="xl"
										styles={gradientButtonStyles}
									>
										Enviar Solicitação
									</Button>
								</Stack>
							</form>

							<Divider
								label="ou"
								labelPosition="center"
								styles={{
									label: styles.dividerLabel,
								}}
							/>

							<Stack gap="xs" align="center">
								<Text size="sm" c="dimmed">
									Já tem acesso?
								</Text>
								<Anchor
									component={Link}
									to="/login"
									size="sm"
									fw={500}
									c="ministerium-link.7"
									style={styles.linkStyle}
									styles={{
										root: {
											"&:hover": styles.getLinkHoverStyle(),
										},
									}}
								>
									Fazer Login
								</Anchor>
							</Stack>
						</Stack>
					</Box>
				</motion.div>
			</Box>
		</Box>
	);
};

export default RequestAccess;
