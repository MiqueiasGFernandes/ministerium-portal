import {
	Button,
	FileInput,
	Grid,
	Group,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconLock,
	IconMail,
	IconPhone,
	IconPhoto,
	IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import type { OnboardingStepProps } from "@/types";
import { onboardingService } from "@/services/onboarding";
import { onboardingAutoFill } from "@/utils/onboardingFakeData";
import { shouldShowTestData } from "@/config/env";

/**
 * Admin Info Step Component
 * Single Responsibility: Collects administrator user information
 */
export const AdminInfoStep = ({ data, onNext, onBack }: OnboardingStepProps) => {
	const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
		data.admin?.avatar,
	);

	const form = useForm({
		initialValues: {
			name: data.admin?.name ?? "",
			email: data.admin?.email ?? "",
			password: data.admin?.password ?? "",
			confirmPassword: data.admin?.confirmPassword ?? "",
			phone: data.admin?.phone ?? "",
			avatar: data.admin?.avatar ?? "",
		},
		validate: {
			name: (value) =>
				value.trim().length < 3
					? "Nome deve ter pelo menos 3 caracteres"
					: null,
			email: (value) =>
				!/^\S+@\S+\.\S+$/.test(value) ? "Email inválido" : null,
			password: (value) => {
				if (value.length < 8) {
					return "Senha deve ter pelo menos 8 caracteres";
				}
				const hasUpperCase = /[A-Z]/.test(value);
				const hasLowerCase = /[a-z]/.test(value);
				const hasNumber = /[0-9]/.test(value);
				const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

				if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
					return "Senha deve conter maiúsculas, minúsculas, números e caracteres especiais";
				}
				return null;
			},
			confirmPassword: (value, values) =>
				value !== values.password ? "Senhas não coincidem" : null,
			phone: (value) => {
				if (!value) return null;
				const phoneDigits = value.replace(/\D/g, "");
				if (phoneDigits.length < 10 || phoneDigits.length > 11) {
					return "Telefone inválido";
				}
				return null;
			},
		},
	});

	const handleAvatarChange = (file: File | null) => {
		if (!file) {
			setAvatarPreview(undefined);
			form.setFieldValue("avatar", "");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result as string;
			setAvatarPreview(base64);
			form.setFieldValue("avatar", base64);
		};
		reader.readAsDataURL(file);
	};

	const handleAutoFill = () => {
		const fakeData = onboardingAutoFill.admin();
		form.setValues(fakeData);
		setAvatarPreview(fakeData.avatar);
	};

	const handleSubmit = (values: typeof form.values) => {
		const validation = onboardingService.validateStep(data.currentStep, {
			...data,
			admin: values,
		});

		if (!validation.isValid) {
			const firstError = Object.keys(validation.errors)[0];
			form.setFieldError(firstError, validation.errors[firstError]);
			return;
		}

		onNext({
			admin: values,
		});
	};

	return (
		<Stack gap="xl">
			<Stack gap="xs">
				<Title order={2}>Informações do Administrador</Title>
				<Text c="dimmed">
					Configure sua conta de administrador para acessar o sistema
				</Text>
			</Stack>

			{shouldShowTestData() && (
				<Button
					variant="light"
					onClick={handleAutoFill}
					size="xs"
					data-testid="autofill-button"
				>
					Preencher automaticamente (Teste)
				</Button>
			)}

			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="md">
					<Paper p="md" withBorder>
						<Stack gap="md">
							<TextInput
								label="Nome Completo"
								placeholder="Ex: João da Silva"
								required
								leftSection={<IconUser size={18} />}
								{...form.getInputProps("name")}
								data-testid="admin-name-input"
							/>

							<TextInput
								label="Email"
								placeholder="seu@email.com"
								required
								type="email"
								leftSection={<IconMail size={18} />}
								{...form.getInputProps("email")}
								data-testid="admin-email-input"
							/>

							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<PasswordInput
										label="Senha"
										placeholder="Sua senha"
										required
										leftSection={<IconLock size={18} />}
										{...form.getInputProps("password")}
										data-testid="admin-password-input"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<PasswordInput
										label="Confirmar Senha"
										placeholder="Digite novamente"
										required
										leftSection={<IconLock size={18} />}
										{...form.getInputProps("confirmPassword")}
										data-testid="admin-confirm-password-input"
									/>
								</Grid.Col>
							</Grid>

							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<TextInput
										label="Telefone (Opcional)"
										placeholder="(11) 98765-4321"
										leftSection={<IconPhone size={18} />}
										{...form.getInputProps("phone")}
										data-testid="admin-phone-input"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<FileInput
										label="Foto de Perfil (Opcional)"
										placeholder="Clique para selecionar"
										accept="image/*"
										leftSection={<IconPhoto size={18} />}
										onChange={handleAvatarChange}
										data-testid="admin-avatar-input"
									/>
									{avatarPreview && (
										<Paper mt="xs" p="xs" withBorder>
											<img
												src={avatarPreview}
												alt="Preview"
												style={{
													width: "60px",
													height: "60px",
													borderRadius: "50%",
													objectFit: "cover",
												}}
											/>
										</Paper>
									)}
								</Grid.Col>
							</Grid>
						</Stack>
					</Paper>

					<Group justify="space-between" mt="xl">
						<Button variant="subtle" onClick={onBack} data-testid="back-button">
							Voltar
						</Button>

						<Button type="submit" data-testid="next-button">
							Próximo
						</Button>
					</Group>
				</Stack>
			</form>
		</Stack>
	);
};
