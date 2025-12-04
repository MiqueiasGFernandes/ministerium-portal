import {
	Button,
	Checkbox,
	Grid,
	Group,
	Paper,
	Select,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconBell,
	IconCalendar,
	IconCash,
	IconSettings,
	IconUsers,
	IconWorld,
} from "@tabler/icons-react";
import type { OnboardingStepProps } from "@/types";
import { onboardingService } from "@/services/onboarding";
import { onboardingAutoFill } from "@/utils/onboardingFakeData";
import { shouldShowTestData } from "@/config/env";

/**
 * Preferences Step Component
 * Single Responsibility: Collects user preferences and feature selection
 */
export const PreferencesStep = ({
	data,
	onNext,
	onBack,
}: OnboardingStepProps) => {
	const form = useForm({
		initialValues: {
			members: data.preferences?.features?.members ?? true,
			finance: data.preferences?.features?.finance ?? true,
			events: data.preferences?.features?.events ?? true,
			schedules: data.preferences?.features?.schedules ?? true,
			ministries: data.preferences?.features?.ministries ?? true,
			emailNotifications: data.preferences?.notifications?.email ?? true,
			pushNotifications: data.preferences?.notifications?.push ?? false,
			language: data.preferences?.language ?? "pt-BR",
			timezone: data.preferences?.timezone ?? "America/Sao_Paulo",
		},
		validate: {
			language: (value) => (!value ? "Idioma é obrigatório" : null),
			timezone: (value) => (!value ? "Fuso horário é obrigatório" : null),
		},
	});

	const handleAutoFill = () => {
		const fakeData = onboardingAutoFill.preferences();
		form.setValues({
			members: fakeData.features.members,
			finance: fakeData.features.finance,
			events: fakeData.features.events,
			schedules: fakeData.features.schedules,
			ministries: fakeData.features.ministries,
			emailNotifications: fakeData.notifications.email,
			pushNotifications: fakeData.notifications.push,
			language: fakeData.language,
			timezone: fakeData.timezone,
		});
	};

	const handleSubmit = (values: typeof form.values) => {
		const preferencesData = {
			features: {
				members: values.members,
				finance: values.finance,
				events: values.events,
				schedules: values.schedules,
				ministries: values.ministries,
			},
			notifications: {
				email: values.emailNotifications,
				push: values.pushNotifications,
			},
			language: values.language,
			timezone: values.timezone,
		};

		const validation = onboardingService.validateStep(data.currentStep, {
			...data,
			preferences: preferencesData,
		});

		if (!validation.isValid) {
			const firstError = Object.keys(validation.errors)[0];
			form.setFieldError(firstError, validation.errors[firstError]);
			return;
		}

		// Check if at least one feature is enabled
		const hasAnyFeature =
			values.members ||
			values.finance ||
			values.events ||
			values.schedules ||
			values.ministries;

		if (!hasAnyFeature) {
			form.setFieldError(
				"members",
				"Selecione pelo menos uma funcionalidade",
			);
			return;
		}

		onNext({
			preferences: preferencesData,
		});
	};

	return (
		<Stack gap="xl">
			<Stack gap="xs">
				<Title order={2}>Preferências do Sistema</Title>
				<Text c="dimmed">
					Personalize as funcionalidades e configurações do sistema
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
							<Title order={4}>
								<Group gap="xs">
									<IconSettings size={20} />
									Funcionalidades
								</Group>
							</Title>

							<Text size="sm" c="dimmed">
								Selecione as funcionalidades que deseja ativar (você pode
								alterar depois)
							</Text>

							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Checkbox
										label={
											<Group gap="xs">
												<IconUsers size={18} />
												Gestão de Membros
											</Group>
										}
										description="Cadastro e gerenciamento de membros"
										{...form.getInputProps("members", { type: "checkbox" })}
										data-testid="feature-members-checkbox"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<Checkbox
										label={
											<Group gap="xs">
												<IconCash size={18} />
												Controle Financeiro
											</Group>
										}
										description="Gestão de dízimos, ofertas e despesas"
										{...form.getInputProps("finance", { type: "checkbox" })}
										data-testid="feature-finance-checkbox"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<Checkbox
										label={
											<Group gap="xs">
												<IconCalendar size={18} />
												Eventos
											</Group>
										}
										description="Criação e gestão de eventos"
										{...form.getInputProps("events", { type: "checkbox" })}
										data-testid="feature-events-checkbox"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<Checkbox
										label={
											<Group gap="xs">
												<IconCalendar size={18} />
												Escalas
											</Group>
										}
										description="Escalas de voluntários"
										{...form.getInputProps("schedules", { type: "checkbox" })}
										data-testid="feature-schedules-checkbox"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<Checkbox
										label={
											<Group gap="xs">
												<IconUsers size={18} />
												Ministérios
											</Group>
										}
										description="Gestão de ministérios e equipes"
										{...form.getInputProps("ministries", { type: "checkbox" })}
										data-testid="feature-ministries-checkbox"
									/>
								</Grid.Col>
							</Grid>
						</Stack>
					</Paper>

					<Paper p="md" withBorder>
						<Stack gap="md">
							<Title order={4}>
								<Group gap="xs">
									<IconBell size={20} />
									Notificações
								</Group>
							</Title>

							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Checkbox
										label="Notificações por Email"
										description="Receber atualizações por email"
										{...form.getInputProps("emailNotifications", {
											type: "checkbox",
										})}
										data-testid="notification-email-checkbox"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<Checkbox
										label="Notificações Push"
										description="Receber notificações no navegador"
										{...form.getInputProps("pushNotifications", {
											type: "checkbox",
										})}
										data-testid="notification-push-checkbox"
									/>
								</Grid.Col>
							</Grid>
						</Stack>
					</Paper>

					<Paper p="md" withBorder>
						<Stack gap="md">
							<Title order={4}>
								<Group gap="xs">
									<IconWorld size={20} />
									Regionalização
								</Group>
							</Title>

							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Select
										label="Idioma"
										placeholder="Selecione o idioma"
										required
										data={[
											{ value: "pt-BR", label: "Português (Brasil)" },
											{ value: "en-US", label: "English (US)" },
											{ value: "es-ES", label: "Español" },
										]}
										{...form.getInputProps("language")}
										data-testid="language-select"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<Select
										label="Fuso Horário"
										placeholder="Selecione o fuso horário"
										required
										data={[
											{ value: "America/Sao_Paulo", label: "Brasília (UTC-3)" },
											{ value: "America/Manaus", label: "Manaus (UTC-4)" },
											{ value: "America/Rio_Branco", label: "Rio Branco (UTC-5)" },
											{
												value: "America/Noronha",
												label: "Fernando de Noronha (UTC-2)",
											},
										]}
										{...form.getInputProps("timezone")}
										data-testid="timezone-select"
									/>
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
