import {
	Alert,
	Anchor,
	Button,
	Center,
	Container,
	Divider,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLogin } from "@refinedev/core";
import { IconAlertCircle, IconLock, IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { shouldShowTestData } from "@/config/env";
import type { LoginCredentials } from "@/types";

export const Login = () => {
	const { mutate: login, isLoading } = useLogin<LoginCredentials>();
	const [error, setError] = useState<string>("");

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
		<Center
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}
		>
			<Container size={460} my={40}>
				<Paper radius="md" p="xl" withBorder shadow="xl">
					<Stack gap="lg">
						<Center>
							<Stack gap="xs" align="center">
								<Title order={2} ta="center" fw={700}>
									Ministerium
								</Title>
								<Text size="sm" c="dimmed" ta="center">
									ERP para Gestão de Igrejas
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

						{shouldShowTestData() && (
							<Paper p="md" radius="md" bg="gray.0">
								<Stack gap="xs">
									<Text size="xs" fw={600} c="dimmed">
										Credenciais de teste:
									</Text>
									<Text size="xs" c="dimmed">
										Admin: admin@ministerium.com / qualquer senha (3+
										caracteres)
									</Text>
									<Text size="xs" c="dimmed">
										Líder: Use qualquer email dos usuários fake
									</Text>
								</Stack>
							</Paper>
						)}

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
				</Paper>
			</Container>
		</Center>
	);
};

export default Login;
