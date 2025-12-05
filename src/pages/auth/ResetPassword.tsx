import {
	Alert,
	Box,
	Button,
	Center,
	Grid,
	Group,
	PasswordInput,
	Stack,
	Text,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconAlertCircle,
	IconArrowLeft,
	IconBuildingChurch,
	IconCheck,
	IconLock,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shouldShowTestData } from "@/config/env";
import { createLoginStyles, gradientButtonStyles } from "@/styles/components";

export const ResetPassword = () => {
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const theme = useMantineTheme();
	const navigate = useNavigate();

	// Create styles instance
	const styles = useMemo(() => createLoginStyles(theme), [theme]);

	// Set document title
	useEffect(() => {
		document.title = "Ministerium | Redefinir Senha";
	}, []);

	// Verify previous steps
	useEffect(() => {
		const storedEmail = sessionStorage.getItem("reset-email");
		const storedCode = sessionStorage.getItem("reset-code");

		if (!storedEmail || !storedCode) {
			navigate("/forgot-password");
			return;
		}

		setEmail(storedEmail);
	}, [navigate]);

	const form = useForm({
		initialValues: {
			password: shouldShowTestData() ? "SenhaTeste123" : "",
			confirmPassword: shouldShowTestData() ? "SenhaTeste123" : "",
		},
		validate: {
			password: (value) => {
				if (value.length < 8) {
					return "Senha deve ter no mínimo 8 caracteres";
				}
				if (!/[A-Z]/.test(value)) {
					return "Senha deve conter ao menos uma letra maiúscula";
				}
				if (!/[a-z]/.test(value)) {
					return "Senha deve conter ao menos uma letra minúscula";
				}
				if (!/[0-9]/.test(value)) {
					return "Senha deve conter ao menos um número";
				}
				return null;
			},
			confirmPassword: (value, values) =>
				value !== values.password ? "As senhas não coincidem" : null,
		},
	});

	const handleSubmit = async (values: {
		password: string;
		confirmPassword: string;
	}) => {
		setError("");
		setIsLoading(true);

		try {
			// Simular redefinição de senha
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Limpar dados da sessão
			sessionStorage.removeItem("reset-email");
			sessionStorage.removeItem("reset-code");

			// Navegar para login com mensagem de sucesso
			navigate("/login", {
				state: { message: "Senha redefinida com sucesso! Faça login." },
			});
		} catch (err) {
			setError("Erro ao redefinir senha. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box style={styles.container}>
			{/* Mobile Layout */}
			<Box hiddenFrom="sm" style={styles.mobileWrapper}>
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
										Redefinir Senha
									</Title>
									<Text size="sm" c="dimmed" ta="center">
										Crie uma nova senha para
									</Text>
									<Text size="sm" fw={600}>
										{email}
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
									<PasswordInput
										label="Nova Senha"
										placeholder="Digite sua nova senha"
										required
										leftSection={<IconLock size={18} />}
										{...form.getInputProps("password")}
									/>

									<PasswordInput
										label="Confirmar Senha"
										placeholder="Digite sua senha novamente"
										required
										leftSection={<IconLock size={18} />}
										{...form.getInputProps("confirmPassword")}
									/>

									<Box>
										<Text size="xs" c="dimmed" mb="xs">
											A senha deve conter:
										</Text>
										<Stack gap={4}>
											<Text size="xs" c="dimmed">
												• Mínimo de 8 caracteres
											</Text>
											<Text size="xs" c="dimmed">
												• Uma letra maiúscula
											</Text>
											<Text size="xs" c="dimmed">
												• Uma letra minúscula
											</Text>
											<Text size="xs" c="dimmed">
												• Um número
											</Text>
										</Stack>
									</Box>

									<Button
										type="submit"
										fullWidth
										size="md"
										loading={isLoading}
										mt="xl"
										styles={gradientButtonStyles}
										rightSection={<IconCheck size={18} />}
									>
										Redefinir Senha
									</Button>
								</Stack>
							</form>

							<Group justify="center">
								<Button
									component={Link}
									to="/login"
									variant="subtle"
									leftSection={<IconArrowLeft size={18} />}
								>
									Voltar para Login
								</Button>
							</Group>
						</Stack>
					</Box>
				</motion.div>
			</Box>

			{/* Desktop Grid Layout */}
			<Box visibleFrom="sm" style={styles.desktopWrapper}>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					style={styles.desktopGridWrapper}
				>
					<Grid gutter={0} style={styles.desktopCard}>
						{/* Left Side - Branding */}
						<Grid.Col span={5}>
							<Box style={styles.brandingSection}>
								{/* Dark overlay for better text contrast */}
								<Box style={styles.brandingOverlay} />
								<Stack gap="xl" align="center" style={styles.brandingContent}>
									<Group gap="md" align="flex-end" wrap="nowrap">
										<IconBuildingChurch
											size={68}
											stroke={1.5}
											color="white"
											style={{ flexShrink: 0 }}
										/>
										<Title order={1} c="white" style={styles.logoText}>
											Ministerium
										</Title>
									</Group>
									<Title
										order={2}
										c="white"
										ta="center"
										fw={600}
										size="1.75rem"
									>
										A Gestão da sua Igreja, Simplificada.
									</Title>
									<Text
										size="lg"
										c="rgba(255,255,255,0.95)"
										ta="center"
										maw={420}
									>
										Organize membros, finanças e escalas em um só lugar. Foco
										total na Missão.
									</Text>
								</Stack>
							</Box>
						</Grid.Col>

						{/* Right Side - Form */}
						<Grid.Col span={7}>
							<Box style={styles.formSection}>
								<Stack gap="xl" style={styles.formWrapper}>
									<Center>
										<Stack gap="xs" align="center">
											<Title order={2} ta="center" fw={700}>
												Redefinir Senha
											</Title>
											<Text size="sm" c="dimmed" ta="center">
												Crie uma nova senha para
											</Text>
											<Text size="sm" fw={600}>
												{email}
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
											<PasswordInput
												label="Nova Senha"
												placeholder="Digite sua nova senha"
												required
												leftSection={<IconLock size={18} />}
												{...form.getInputProps("password")}
											/>

											<PasswordInput
												label="Confirmar Senha"
												placeholder="Digite sua senha novamente"
												required
												leftSection={<IconLock size={18} />}
												{...form.getInputProps("confirmPassword")}
											/>

											<Box>
												<Text size="xs" c="dimmed" mb="xs">
													A senha deve conter:
												</Text>
												<Stack gap={4}>
													<Text size="xs" c="dimmed">
														• Mínimo de 8 caracteres
													</Text>
													<Text size="xs" c="dimmed">
														• Uma letra maiúscula
													</Text>
													<Text size="xs" c="dimmed">
														• Uma letra minúscula
													</Text>
													<Text size="xs" c="dimmed">
														• Um número
													</Text>
												</Stack>
											</Box>

											<Button
												type="submit"
												fullWidth
												size="md"
												loading={isLoading}
												mt="xl"
												styles={gradientButtonStyles}
												rightSection={<IconCheck size={18} />}
											>
												Redefinir Senha
											</Button>
										</Stack>
									</form>

									<Group justify="center">
										<Button
											component={Link}
											to="/login"
											variant="subtle"
											leftSection={<IconArrowLeft size={18} />}
										>
											Voltar para Login
										</Button>
									</Group>
								</Stack>
							</Box>
						</Grid.Col>
					</Grid>
				</motion.div>
			</Box>
		</Box>
	);
};

export default ResetPassword;
