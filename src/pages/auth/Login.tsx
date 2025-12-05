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
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createLoginStyles, gradientButtonStyles } from "@/styles/components";
import type { LoginCredentials } from "@/types";

export const Login = () => {
	const { mutate: login, isLoading } = useLogin<LoginCredentials>();
	const [error, setError] = useState<string>("");
	const theme = useMantineTheme();

	// Create styles instance
	const styles = useMemo(() => createLoginStyles(theme), [theme]);

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
									label: styles.dividerLabel,
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
									style={styles.linkStyle}
									styles={{
										root: {
											"&:hover": styles.getLinkHoverStyle(),
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
											label: styles.dividerLabel,
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
											style={styles.linkStyle}
											styles={{
												root: {
													"&:hover": styles.getLinkHoverStyle(),
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
