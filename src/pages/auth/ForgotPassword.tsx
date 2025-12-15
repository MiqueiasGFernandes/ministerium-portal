import {
	Alert,
	Box,
	Button,
	Center,
	Grid,
	Group,
	Stack,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconAlertCircle,
	IconArrowLeft,
	IconBuildingChurch,
	IconMail,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shouldShowTestData } from "@/config/env";
import { createLoginStyles, gradientButtonStyles } from "@/styles/components";

export const ForgotPassword = () => {
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const theme = useMantineTheme();
	const navigate = useNavigate();

	// Create styles instance
	const styles = useMemo(() => createLoginStyles(theme), [theme]);

	// Set document title
	useEffect(() => {
		document.title = "Ministerium | Recuperar Senha";
	}, []);

	const form = useForm({
		initialValues: {
			email: shouldShowTestData() ? "teste@ministerium.com" : "",
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
		},
	});

	const handleSubmit = async (values: { email: string }) => {
		setError("");
		setIsLoading(true);

		try {
			// Simular envio de código
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Armazenar email para próxima etapa
			sessionStorage.setItem("reset-email", values.email);

			// Navegar para página de verificação de código
			navigate("/verify-code");
		} catch (_err) {
			setError("Erro ao enviar código. Tente novamente.");
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
										Recuperar Senha
									</Title>
									<Text size="sm" c="dimmed" ta="center">
										Digite seu email para receber o código de verificação
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
										label="Seu Email"
										placeholder="seu@email.com"
										required
										leftSection={<IconMail size={18} />}
										{...form.getInputProps("email")}
									/>

									<Button
										type="submit"
										fullWidth
										size="md"
										loading={isLoading}
										mt="xl"
										styles={gradientButtonStyles}
									>
										Enviar Código
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
												Recuperar Senha
											</Title>
											<Text size="sm" c="dimmed" ta="center" maw={400}>
												Digite seu email para receber o código de verificação
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
												label="Seu Email"
												placeholder="seu@email.com"
												required
												leftSection={<IconMail size={18} />}
												{...form.getInputProps("email")}
											/>

											<Button
												type="submit"
												fullWidth
												size="md"
												loading={isLoading}
												mt="xl"
												styles={gradientButtonStyles}
											>
												Enviar Código
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

export default ForgotPassword;
