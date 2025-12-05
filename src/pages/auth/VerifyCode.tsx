import {
	Alert,
	Box,
	Button,
	Center,
	Grid,
	Group,
	PinInput,
	Stack,
	Text,
	Title,
	useMantineTheme,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconArrowLeft,
	IconBuildingChurch,
	IconCheck,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shouldShowTestData } from "@/config/env";
import { createLoginStyles, gradientButtonStyles } from "@/styles/components";

export const VerifyCode = () => {
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [code, setCode] = useState(shouldShowTestData() ? "123456" : "");
	const [email, setEmail] = useState("");
	const [canResend, setCanResend] = useState(false);
	const [countdown, setCountdown] = useState(60);
	const theme = useMantineTheme();
	const navigate = useNavigate();

	// Create styles instance
	const styles = useMemo(() => createLoginStyles(theme), [theme]);

	// Set document title
	useEffect(() => {
		document.title = "Ministerium | Verificar Código";
	}, []);

	// Get email from session storage
	useEffect(() => {
		const storedEmail = sessionStorage.getItem("reset-email");
		if (!storedEmail) {
			navigate("/forgot-password");
			return;
		}
		setEmail(storedEmail);
	}, [navigate]);

	// Countdown timer for resend
	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [countdown]);

	const handleSubmit = async () => {
		if (code.length !== 6) {
			setError("Por favor, digite o código completo");
			return;
		}

		setError("");
		setIsLoading(true);

		try {
			// Simular verificação de código
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Para demo, aceitar o código "123456"
			if (code !== "123456") {
				throw new Error("Código inválido");
			}

			// Armazenar código verificado para próxima etapa
			sessionStorage.setItem("reset-code", code);

			// Navegar para página de redefinição de senha
			navigate("/reset-password");
		} catch (err) {
			setError("Código inválido. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResend = async () => {
		if (!canResend) return;

		setError("");
		setIsLoading(true);

		try {
			// Simular reenvio de código
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Resetar countdown
			setCountdown(60);
			setCanResend(false);
			setCode("");
		} catch (err) {
			setError("Erro ao reenviar código. Tente novamente.");
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
										Verificar Código
									</Title>
									<Text size="sm" c="dimmed" ta="center">
										Digite o código de 6 dígitos enviado para
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

							<Stack gap="xl" align="center">
								<PinInput
									length={6}
									size="lg"
									type="number"
									value={code}
									onChange={setCode}
									placeholder="0"
									disabled={isLoading}
								/>

								<Button
									fullWidth
									size="md"
									loading={isLoading}
									disabled={code.length !== 6}
									onClick={handleSubmit}
									styles={gradientButtonStyles}
									rightSection={<IconCheck size={18} />}
								>
									Verificar Código
								</Button>

								<Stack gap="xs" align="center">
									<Text size="sm" c="dimmed">
										Não recebeu o código?
									</Text>
									{canResend ? (
										<Button
											variant="subtle"
											size="sm"
											onClick={handleResend}
											disabled={isLoading}
										>
											Reenviar código
										</Button>
									) : (
										<Text size="sm" c="dimmed">
											Reenviar em {countdown}s
										</Text>
									)}
								</Stack>
							</Stack>

							<Group justify="center" mt="md">
								<Button
									component={Link}
									to="/forgot-password"
									variant="subtle"
									leftSection={<IconArrowLeft size={18} />}
								>
									Voltar
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
												Verificar Código
											</Title>
											<Text size="sm" c="dimmed" ta="center">
												Digite o código de 6 dígitos enviado para
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

									<Stack gap="xl" align="center">
										<PinInput
											length={6}
											size="xl"
											type="number"
											value={code}
											onChange={setCode}
											placeholder="0"
											disabled={isLoading}
										/>

										<Button
											fullWidth
											size="md"
											loading={isLoading}
											disabled={code.length !== 6}
											onClick={handleSubmit}
											styles={gradientButtonStyles}
											rightSection={<IconCheck size={18} />}
										>
											Verificar Código
										</Button>

										<Stack gap="xs" align="center">
											<Text size="sm" c="dimmed">
												Não recebeu o código?
											</Text>
											{canResend ? (
												<Button
													variant="subtle"
													size="sm"
													onClick={handleResend}
													disabled={isLoading}
												>
													Reenviar código
												</Button>
											) : (
												<Text size="sm" c="dimmed">
													Reenviar em {countdown}s
												</Text>
											)}
										</Stack>
									</Stack>

									<Group justify="center" mt="md">
										<Button
											component={Link}
											to="/forgot-password"
											variant="subtle"
											leftSection={<IconArrowLeft size={18} />}
										>
											Voltar
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

export default VerifyCode;
