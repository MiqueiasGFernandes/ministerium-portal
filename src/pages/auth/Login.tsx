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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLogin } from "@refinedev/core";
import {
	IconAlertCircle,
	IconBuildingChurch,
	IconLock,
	IconMail,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { LoginCredentials } from "@/types";

export const Login = () => {
	const { mutate: login, isLoading } = useLogin<LoginCredentials>();
	const [error, setError] = useState<string>("");

	// Set document title
	useEffect(() => {
		document.title = "Ministerium | Entrar";
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
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}
		>
			{/* Desktop Grid Layout */}
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
				<Box
					style={{
						width: "100%",
						maxWidth: "460px",
						background: "white",
						borderRadius: "12px",
						padding: "2rem",
						boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
					}}
				>
					<Stack gap="lg">
						<Center>
							<Stack gap="xs" align="center">
								<Title order={2} ta="center" fw={700}>
									Entrar
								</Title>
								<Text size="sm" c="dimmed" ta="center">
									Acesse sua conta
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
							<Stack gap="md">
								<TextInput
									label="Email"
									placeholder="seu@email.com"
									required
									leftSection={<IconMail size={18} />}
									{...form.getInputProps("email")}
								/>

								<PasswordInput
									label="Senha"
									placeholder="Sua senha"
									required
									leftSection={<IconLock size={18} />}
									{...form.getInputProps("password")}
								/>

								<Button
									type="submit"
									fullWidth
									size="md"
									loading={isLoading}
									mt="md"
								>
									Entrar
								</Button>
							</Stack>
						</form>

						<Divider label="ou" labelPosition="center" />

						<Stack gap="xs" align="center">
							<Text size="sm" c="dimmed">
								Não tem uma conta?
							</Text>
							<Anchor component={Link} to="/onboarding" size="sm" fw={500}>
								Criar nova organização
							</Anchor>
						</Stack>
					</Stack>
				</Box>
			</Box>

			{/* Mobile Layout */}
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
				<Grid
					gutter={0}
					style={{
						width: "100%",
						maxWidth: "1200px",
						background: "white",
						borderRadius: "12px",
						overflow: "hidden",
						boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
					}}
				>
					{/* Left Side - Branding */}
					<Grid.Col span={6}>
						<Box
							style={{
								height: "100%",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
								padding: "4rem 3rem",
								minHeight: "600px",
							}}
						>
							<Stack gap="xl" align="center">
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
								<Text size="xl" c="white" ta="center" fw={500}>
									Sistema de Gestão Ministerial
								</Text>
								<Text size="md" c="rgba(255,255,255,0.9)" ta="center">
									Organize e gerencie sua igreja de forma eficiente
								</Text>
							</Stack>
						</Box>
					</Grid.Col>

					{/* Right Side - Form */}
					<Grid.Col span={6}>
						<Box
							style={{
								height: "100%",
								display: "flex",
								alignItems: "center",
								padding: "4rem 3rem",
								minHeight: "600px",
							}}
						>
							<Stack gap="lg" style={{ width: "100%" }}>
								<Center>
									<Stack gap="xs" align="center">
										<Title order={2} ta="center" fw={700}>
											Entrar
										</Title>
										<Text size="sm" c="dimmed" ta="center">
											Acesse sua conta
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
									<Stack gap="md">
										<TextInput
											label="Email"
											placeholder="seu@email.com"
											required
											leftSection={<IconMail size={18} />}
											{...form.getInputProps("email")}
										/>

										<PasswordInput
											label="Senha"
											placeholder="Sua senha"
											required
											leftSection={<IconLock size={18} />}
											{...form.getInputProps("password")}
										/>

										<Button
											type="submit"
											fullWidth
											size="md"
											loading={isLoading}
											mt="md"
										>
											Entrar
										</Button>
									</Stack>
								</form>

								<Divider label="ou" labelPosition="center" />

								<Stack gap="xs" align="center">
									<Text size="sm" c="dimmed">
										Não tem uma conta?
									</Text>
									<Anchor component={Link} to="/onboarding" size="sm" fw={500}>
										Criar nova organização
									</Anchor>
								</Stack>
							</Stack>
						</Box>
					</Grid.Col>
				</Grid>
			</Box>
		</Box>
	);
};

export default Login;
