import {
	Alert,
	Anchor,
	Box,
	Button,
	Center,
	Divider,
	Select,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
	IconAlertCircle,
	IconCalendar,
	IconCheck,
	IconHome,
	IconInfoCircle,
	IconMail,
	IconMapPin,
	IconPhone,
	IconUser,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LGPDConsent } from "@/components/lgpd/LGPDConsent";
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from "@/config/constants";
import { createLoginStyles, gradientButtonStyles } from "@/styles/components";
import { type MemberRegistration, MemberRegistrationStatus } from "@/types";

interface MemberRegistrationFormData {
	name: string;
	email: string;
	phone: string;
	birthDate: Date | null;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	maritalStatus?: string;
	gender?: string;
	notes?: string;
	acceptedTerms: boolean;
}

export const MemberRegistrationPage = () => {
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const { tenantId } = useParams<{ tenantId: string }>();
	const theme = useMantineTheme();

	// Create styles instance
	const styles = useMemo(() => createLoginStyles(theme), [theme]);

	// Set document title
	useEffect(() => {
		document.title = "Ministerium | Cadastro de Membro";
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

	const form = useForm<MemberRegistrationFormData>({
		initialValues: {
			name: "",
			email: "",
			phone: "",
			birthDate: null,
			address: "",
			city: "",
			state: "",
			zipCode: "",
			maritalStatus: "",
			gender: "",
			notes: "",
			acceptedTerms: false,
		},
		validate: {
			name: (value) => {
				if (!value || value.trim().length === 0) {
					return "Nome completo é obrigatório";
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
			phone: (value) => {
				if (!value || value.trim().length === 0) {
					return "Telefone é obrigatório";
				}
				// Basic phone validation
				const phoneNumbers = value.replace(/\D/g, "");
				if (phoneNumbers.length < 10) {
					return "Telefone inválido";
				}
				return null;
			},
			birthDate: (value) => {
				if (!value) {
					return "Data de nascimento é obrigatória";
				}
				// Check if date is in the future
				if (value > new Date()) {
					return "Data de nascimento não pode ser no futuro";
				}
				// Check if person is at least 1 year old
				const oneYearAgo = new Date();
				oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
				if (value > oneYearAgo) {
					return "Data de nascimento inválida";
				}
				return null;
			},
			acceptedTerms: (value) => {
				if (!value) {
					return "Você deve aceitar os termos de uso e privacidade";
				}
				return null;
			},
		},
	});

	const handleSubmit = async (values: MemberRegistrationFormData) => {
		if (!tenantId) {
			return;
		}

		try {
			setLoading(true);
			setError("");

			// Create member registration object
			const registration: MemberRegistration = {
				id: `member-registration-${Date.now()}`,
				name: values.name,
				email: values.email,
				phone: values.phone,
				birthDate: values.birthDate?.toISOString() || "",
				address: values.address,
				city: values.city,
				state: values.state,
				zipCode: values.zipCode,
				maritalStatus: values.maritalStatus as any,
				gender: values.gender as any,
				notes: values.notes,
				acceptedTerms: values.acceptedTerms,
				acceptedAt: new Date().toISOString(),
				status: MemberRegistrationStatus.PENDING,
				tenantId: tenantId,
				registeredAt: new Date().toISOString(),
			};

			// Store in localStorage (in production, this would be an API call)
			const existingRegistrations = JSON.parse(
				localStorage.getItem("memberRegistrations") || "[]",
			);

			// Check if email already has a pending registration for this tenant
			const hasPendingRegistration = existingRegistrations.some(
				(reg: MemberRegistration) =>
					reg.email === values.email &&
					reg.tenantId === tenantId &&
					reg.status === MemberRegistrationStatus.PENDING,
			);

			if (hasPendingRegistration) {
				setError(
					"Você já possui um cadastro pendente para esta igreja. Aguarde aprovação de um administrador.",
				);
				setLoading(false);
				return;
			}

			localStorage.setItem(
				"memberRegistrations",
				JSON.stringify([...existingRegistrations, registration]),
			);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 800));

			setSubmitted(true);
			setLoading(false);

			notifications.show({
				title: "Cadastro enviado!",
				message:
					"Seu cadastro foi enviado com sucesso. Aguarde aprovação de um administrador.",
				color: "green",
				icon: <IconCheck />,
			});
		} catch (_error) {
			setError("Ocorreu um erro ao enviar seu cadastro. Tente novamente.");
			setLoading(false);
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
									Cadastro Enviado!
								</Title>
								<Text c="dimmed" ta="center">
									Seu cadastro está em análise. Você será notificado assim que
									um administrador aprovar seu cadastro como membro.
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
										3. Após aprovação, você fará parte oficialmente da
										comunidade
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

	// Registration Form
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
										Cadastro de Membro
									</Title>
									<Text size="sm" c="dimmed" ta="center">
										Preencha o formulário abaixo para se cadastrar como membro
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
										required
										leftSection={<IconPhone size={18} />}
										{...form.getInputProps("phone")}
									/>

									<DateInput
										label="Data de Nascimento"
										placeholder="Selecione sua data de nascimento"
										required
										leftSection={<IconCalendar size={18} />}
										valueFormat="DD/MM/YYYY"
										maxDate={new Date()}
										{...form.getInputProps("birthDate")}
									/>

									<Select
										label="Estado Civil"
										placeholder="Selecione seu estado civil"
										data={MARITAL_STATUS_OPTIONS}
										leftSection={<IconUser size={18} />}
										clearable
										{...form.getInputProps("maritalStatus")}
									/>

									<Select
										label="Gênero"
										placeholder="Selecione seu gênero"
										data={GENDER_OPTIONS}
										leftSection={<IconUser size={18} />}
										clearable
										{...form.getInputProps("gender")}
									/>

									<Divider label="Endereço (opcional)" labelPosition="center" />

									<TextInput
										label="Endereço"
										placeholder="Rua, número, complemento"
										leftSection={<IconHome size={18} />}
										{...form.getInputProps("address")}
									/>

									<TextInput
										label="Cidade"
										placeholder="Sua cidade"
										leftSection={<IconMapPin size={18} />}
										{...form.getInputProps("city")}
									/>

									<TextInput
										label="Estado"
										placeholder="UF"
										leftSection={<IconMapPin size={18} />}
										maxLength={2}
										{...form.getInputProps("state")}
									/>

									<TextInput
										label="CEP"
										placeholder="00000-000"
										leftSection={<IconMapPin size={18} />}
										{...form.getInputProps("zipCode")}
									/>

									<Textarea
										label="Observações (opcional)"
										placeholder="Alguma informação adicional que gostaria de compartilhar"
										minRows={3}
										maxRows={6}
										{...form.getInputProps("notes")}
									/>

									<Divider />

									<LGPDConsent form={form} />

									<Button
										type="submit"
										fullWidth
										size="md"
										mt="xl"
										loading={loading}
										styles={gradientButtonStyles}
									>
										Enviar Cadastro
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
									Já é membro?
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

export default MemberRegistrationPage;
