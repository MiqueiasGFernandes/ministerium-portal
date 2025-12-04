import {
	Button,
	Grid,
	Group,
	Paper,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
	IconBuilding,
	IconCalendar,
	IconMail,
	IconMapPin,
	IconPhone,
	IconWorld,
} from "@tabler/icons-react";
import type { OnboardingStepProps } from "@/types";
import { onboardingService } from "@/services/onboarding";
import { onboardingAutoFill } from "@/utils/onboardingFakeData";
import { shouldShowTestData } from "@/config/env";

/**
 * Organization Details Step Component
 * Single Responsibility: Collects detailed organization information
 * This step can be skipped
 */
export const OrganizationDetailsStep = ({
	data,
	onNext,
	onBack,
	onSkip,
}: OnboardingStepProps) => {
	const form = useForm({
		initialValues: {
			street: data.organization?.address?.street ?? "",
			number: data.organization?.address?.number ?? "",
			complement: data.organization?.address?.complement ?? "",
			city: data.organization?.address?.city ?? "",
			state: data.organization?.address?.state ?? "",
			zipCode: data.organization?.address?.zipCode ?? "",
			phone: data.organization?.phone ?? "",
			email: data.organization?.email ?? "",
			website: data.organization?.website ?? "",
			foundedDate: data.organization?.foundedDate
				? new Date(data.organization.foundedDate)
				: null,
			description: data.organization?.description ?? "",
		},
		validate: {
			street: (value) =>
				value.trim().length < 3
					? "Rua deve ter pelo menos 3 caracteres"
					: null,
			number: (value) =>
				value.trim().length < 1 ? "Número é obrigatório" : null,
			city: (value) =>
				value.trim().length < 2
					? "Cidade deve ter pelo menos 2 caracteres"
					: null,
			state: (value) =>
				value.trim().length !== 2
					? "Estado deve ter 2 caracteres (ex: SP)"
					: null,
			zipCode: (value) =>
				!/^\d{5}-?\d{3}$/.test(value) ? "CEP inválido (ex: 12345-678)" : null,
			phone: (value) =>
				value.length < 10 ? "Telefone é obrigatório" : null,
			email: (value) =>
				!/^\S+@\S+\.\S+$/.test(value) ? "Email inválido" : null,
			website: (value) => {
				if (!value) return null;
				try {
					new URL(value);
					return null;
				} catch {
					return "URL inválida (ex: https://exemplo.com)";
				}
			},
		},
	});

	const handleAutoFill = () => {
		const fakeData = onboardingAutoFill.organization();
		form.setValues({
			street: fakeData.address.street,
			number: fakeData.address.number,
			complement: fakeData.address.complement ?? "",
			city: fakeData.address.city,
			state: fakeData.address.state,
			zipCode: fakeData.address.zipCode,
			phone: fakeData.phone,
			email: fakeData.email,
			website: fakeData.website ?? "",
			foundedDate: fakeData.foundedDate ? new Date(fakeData.foundedDate) : null,
			description: fakeData.description ?? "",
		});
	};

	const handleSubmit = (values: typeof form.values) => {
		const organizationData = {
			address: {
				street: values.street,
				number: values.number,
				complement: values.complement,
				city: values.city,
				state: values.state,
				zipCode: values.zipCode,
			},
			phone: values.phone,
			email: values.email,
			website: values.website,
			foundedDate: values.foundedDate?.toISOString().split("T")[0],
			description: values.description,
		};

		const validation = onboardingService.validateStep(data.currentStep, {
			...data,
			organization: organizationData,
		});

		if (!validation.isValid) {
			const firstError = Object.keys(validation.errors)[0];
			const fieldName = firstError.replace("address.", "");
			form.setFieldError(fieldName, validation.errors[firstError]);
			return;
		}

		onNext({
			organization: organizationData,
		});
	};

	return (
		<Stack gap="xl">
			<Stack gap="xs">
				<Title order={2}>Detalhes da Organização</Title>
				<Text c="dimmed">
					Adicione mais informações sobre sua organização (você pode pular esta
					etapa)
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
									<IconMapPin size={20} />
									Endereço
								</Group>
							</Title>

							<Grid>
								<Grid.Col span={{ base: 12, md: 8 }}>
									<TextInput
										label="Rua"
										placeholder="Ex: Rua das Flores"
										required
										{...form.getInputProps("street")}
										data-testid="org-street-input"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 4 }}>
									<TextInput
										label="Número"
										placeholder="123"
										required
										{...form.getInputProps("number")}
										data-testid="org-number-input"
									/>
								</Grid.Col>
							</Grid>

							<Grid>
								<Grid.Col span={{ base: 12, md: 4 }}>
									<TextInput
										label="Complemento"
										placeholder="Sala 10"
										{...form.getInputProps("complement")}
										data-testid="org-complement-input"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 4 }}>
									<TextInput
										label="Cidade"
										placeholder="São Paulo"
										required
										{...form.getInputProps("city")}
										data-testid="org-city-input"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 6, md: 2 }}>
									<TextInput
										label="Estado"
										placeholder="SP"
										required
										maxLength={2}
										{...form.getInputProps("state")}
										onChange={(e) =>
											form.setFieldValue(
												"state",
												e.currentTarget.value.toUpperCase(),
											)
										}
										data-testid="org-state-input"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 6, md: 2 }}>
									<TextInput
										label="CEP"
										placeholder="12345-678"
										required
										{...form.getInputProps("zipCode")}
										data-testid="org-zipcode-input"
									/>
								</Grid.Col>
							</Grid>
						</Stack>
					</Paper>

					<Paper p="md" withBorder>
						<Stack gap="md">
							<Title order={4}>
								<Group gap="xs">
									<IconBuilding size={20} />
									Informações de Contato
								</Group>
							</Title>

							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<TextInput
										label="Telefone"
										placeholder="(11) 1234-5678"
										required
										leftSection={<IconPhone size={18} />}
										{...form.getInputProps("phone")}
										data-testid="org-phone-input"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<TextInput
										label="Email"
										placeholder="contato@igreja.com"
										required
										type="email"
										leftSection={<IconMail size={18} />}
										{...form.getInputProps("email")}
										data-testid="org-email-input"
									/>
								</Grid.Col>
							</Grid>

							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<TextInput
										label="Website (Opcional)"
										placeholder="https://www.igreja.com"
										leftSection={<IconWorld size={18} />}
										{...form.getInputProps("website")}
										data-testid="org-website-input"
									/>
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<DateInput
										label="Data de Fundação (Opcional)"
										placeholder="Selecione a data"
										leftSection={<IconCalendar size={18} />}
										{...form.getInputProps("foundedDate")}
										data-testid="org-founded-input"
									/>
								</Grid.Col>
							</Grid>

							<Textarea
								label="Descrição (Opcional)"
								placeholder="Conte um pouco sobre a história e missão da sua organização..."
								rows={4}
								{...form.getInputProps("description")}
								data-testid="org-description-input"
							/>
						</Stack>
					</Paper>

					<Group justify="space-between" mt="xl">
						<Button variant="subtle" onClick={onBack} data-testid="back-button">
							Voltar
						</Button>

						<Group gap="md">
							{onSkip && (
								<Button
									variant="light"
									onClick={onSkip}
									data-testid="skip-button"
								>
									Pular
								</Button>
							)}
							<Button type="submit" data-testid="next-button">
								Próximo
							</Button>
						</Group>
					</Group>
				</Stack>
			</form>
		</Stack>
	);
};
