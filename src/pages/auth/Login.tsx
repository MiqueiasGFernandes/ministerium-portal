import {
	Alert,
	Anchor,
	Box,
	Button,
	Center,
	Divider,
	Grid,
	Group,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLogin } from "@refinedev/core";
import {
	IconAlertCircle,
	IconBuildingChurch,
	IconLock,
	IconMail,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { LoginCredentials } from "@/types";

export const Login = () => {
	const { mutate: login, isLoading } = useLogin<LoginCredentials>();
	const [error, setError] = useState<string>("");
	const theme = useMantineTheme();

	// Set document title
	useEffect(() => {
		document.title = "Ministerium | Acesse sua Conta";
	}, []);

	const form = useForm({
		initialValues: {
			email: "admin@ministerium.com",
			password: "admin123",
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
			password: (value) =>
				value.length >= 3 ? null : "Senha deve ter no mínimo 3 caracteres",
		},
	});

	const handleSubmit = (values: LoginCredentials) => {
		setError("");
		console.log("Submitting login with:", values);

		login(values, {
			onSuccess: (data) => {
				console.log("Login successful:", data);
			},
			onError: (error) => {
				console.error("Login error:", error);
				setError(error.message || "Erro ao fazer login");
			},
		});
	};

	return (
		<Box
			style={{
				minHeight: "100vh",
				background: theme.other.gradients.background,
			}}
		>
			{/* Mobile Layout */}
			<Box
				hiddenFrom="sm"
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "2rem",
				}}
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					style={{ width: "100%" }}
				>
					<Box
						style={{
							width: "100%",
							maxWidth: "460px",
							background: "white",
							borderRadius: "12px",
							padding: "2rem",
							boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
							margin: "0 auto",
						}}
					>
						<Stack gap="lg">
							<Center>
								<Stack gap="xs" align="center">
									<Title order={2} ta="center" fw={700}>
										Acesse sua Conta
									</Title>
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

									<PasswordInput
										label="Sua Senha"
										placeholder="Digite sua senha"
										required
										leftSection={<IconLock size={18} />}
										{...form.getInputProps("password")}
									/>

									<Button
										type="submit"
										fullWidth
										size="md"
										loading={isLoading}
										mt="xl"
										styles={gradientButtonStyles}
									>
										Entrar
									</Button>
								</Stack>
							</form>

							<Divider
								label="ou"
								labelPosition="center"
								styles={{
									label: { fontSize: "0.875rem", color: "#868e96" },
								}}
							/>

							<Stack gap="xs" align="center">
								<Text size="sm" c="dimmed">
									Primeira vez aqui?
								</Text>
								<Anchor
									component={Link}
									to="/onboarding"
									size="sm"
									fw={500}
									c="ministerium-link.7"
									style={{
										textDecoration: "none",
										transition: "all 0.2s ease",
									}}
									styles={{
										root: {
											"&:hover": {
												color: theme.colors["ministerium-link"][8],
												transform: "translateY(-1px)",
											},
										},
									}}
								>
									Criar minha Organização
								</Anchor>
							</Stack>
						</Stack>
					</Box>
				</motion.div>
			</Box>

			{/* Desktop Grid Layout */}
			<Box
				visibleFrom="sm"
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "2rem",
				}}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					style={{ width: "100%", maxWidth: "1200px" }}
				>
					<Grid
						gutter={0}
						style={{
							width: "100%",
							background: "white",
							borderRadius: "12px",
							overflow: "hidden",
							boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
						}}
					>
						{/* Left Side - Branding */}
						<Grid.Col span={5}>
							<Box
								style={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									backgroundImage: `${theme.other.gradients.backgroundOverlay}, url(/assets/bg-login.jpg)`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									backgroundBlendMode: "overlay",
									padding: "4rem 3rem",
									minHeight: "600px",
									position: "relative",
									overflow: "hidden",
								}}
							>
								{/* Dark overlay for better text contrast */}
								<Box
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										backgroundColor: "rgba(0, 0, 0, 0.35)",
										zIndex: 1,
									}}
								/>
								<Stack
									gap="xl"
									align="center"
									style={{ position: "relative", zIndex: 2 }}
								>
									<Group gap="md" align="flex-end" wrap="nowrap">
										<IconBuildingChurch
											size={68}
											stroke={1.5}
											color="white"
											style={{ flexShrink: 0 }}
										/>
										<Title
											order={1}
											c="white"
											style={{
												fontFamily:
													'"Space Grotesk", "Inter", -apple-system, sans-serif',
												fontWeight: 800,
												fontSize: "3.5rem",
												letterSpacing: "-0.02em",
												lineHeight: 1,
												paddingBottom: "2px",
											}}
										>
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
							<Box
								style={{
									height: "100%",
									display: "flex",
									alignItems: "center",
									padding: "4rem 3rem",
									minHeight: "600px",
								}}
							>
								<Stack gap="xl" style={{ width: "100%" }}>
									<Center>
										<Stack gap="xs" align="center">
											<Title order={2} ta="center" fw={700}>
												Acesse sua Conta
											</Title>
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

											<PasswordInput
												label="Sua Senha"
												placeholder="Digite sua senha"
												required
												leftSection={<IconLock size={18} />}
												{...form.getInputProps("password")}
											/>

											<Button
												type="submit"
												fullWidth
												size="md"
												loading={isLoading}
												mt="xl"
												styles={gradientButtonStyles}
											>
												Entrar
											</Button>
										</Stack>
									</form>

									<Divider
										label="ou"
										labelPosition="center"
										styles={{
											label: { fontSize: "0.875rem", color: "#868e96" },
										}}
									/>

									<Stack gap="xs" align="center">
										<Text size="sm" c="dimmed">
											Primeira vez aqui?
										</Text>
										<Anchor
											component={Link}
											to="/onboarding"
											size="sm"
											fw={500}
											c="ministerium-link.7"
											style={{
												textDecoration: "none",
												transition: "all 0.2s ease",
											}}
											styles={{
												root: {
													"&:hover": {
														color: theme.colors["ministerium-link"][8],
														transform: "translateY(-1px)",
													},
												},
											}}
										>
											Criar minha Organização
										</Anchor>
									</Stack>
								</Stack>
							</Box>
						</Grid.Col>
					</Grid>
				</motion.div>
			</Box>
		</Box>
	);
};

export default Login;
