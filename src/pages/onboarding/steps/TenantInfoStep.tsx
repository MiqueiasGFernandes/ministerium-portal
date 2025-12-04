import {
	Button,
	ColorInput,
	FileInput,
	Grid,
	Group,
	Paper,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconBuilding,
	IconColorPicker,
	IconPhoto,
	IconWorld,
} from "@tabler/icons-react";
import { useState } from "react";
import type { OnboardingStepProps } from "@/types";
import { onboardingService } from "@/services/onboarding";
import { onboardingAutoFill } from "@/utils/onboardingFakeData";
import { shouldShowTestData } from "@/config/env";

/**
 * Tenant Info Step Component
 * Single Responsibility: Collects tenant/organization basic information
 */
export const TenantInfoStep = ({ data, onNext, onBack }: OnboardingStepProps) => {
	const [logoPreview, setLogoPreview] = useState<string | undefined>(
		data.tenant?.logo,
	);

	const form = useForm({
		initialValues: {
			name: data.tenant?.name ?? "",
			subdomain: data.tenant?.subdomain ?? "",
			logo: data.tenant?.logo ?? "",
			primaryColor: data.tenant?.primaryColor ?? "#228BE6",
		},
		validate: {
			name: (value) =>
				value.trim().length < 3
					? "Nome deve ter pelo menos 3 caracteres"
					: null,
			subdomain: (value) => {
				if (value.trim().length < 3) {
					return "Subdomínio deve ter pelo menos 3 caracteres";
				}
				if (!/^[a-z0-9-]+$/.test(value)) {
					return "Use apenas letras minúsculas, números e hífens";
				}
				return null;
			},
			primaryColor: (value) =>
				!/^#[0-9A-F]{6}$/i.test(value) ? "Cor inválida" : null,
		},
	});

	const handleLogoChange = (file: File | null) => {
		if (!file) {
			setLogoPreview(undefined);
			form.setFieldValue("logo", "");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result as string;
			setLogoPreview(base64);
			form.setFieldValue("logo", base64);
		};
		reader.readAsDataURL(file);
	};

	const handleAutoFill = () => {
		const fakeData = onboardingAutoFill.tenant();
		form.setValues(fakeData);
		setLogoPreview(fakeData.logo);
	};

	const handleSubmit = (values: typeof form.values) => {
		const validation = onboardingService.validateStep(data.currentStep, {
			...data,
			tenant: values,
		});

		if (!validation.isValid) {
			const firstError = Object.keys(validation.errors)[0];
			form.setFieldError(firstError, validation.errors[firstError]);
			return;
		}

		onNext({
			tenant: values,
		});
	};

	return (
		<Stack gap="xl">
			<Stack gap="xs">
				<Title order={2}>Informações da Organização</Title>
				<Text c="dimmed">
					Vamos começar com as informações básicas da sua organização
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
								label="Nome da Organização"
								placeholder="Ex: Igreja Batista Esperança"
								required
								leftSection={<IconBuilding size={18} />}
								{...form.getInputProps("name")}
								data-testid="tenant-name-input"
							/>

							<TextInput
								label="Subdomínio"
								placeholder="Ex: esperanca"
								description="Será usado na URL: esperanca.ministerium.com"
								required
								leftSection={<IconWorld size={18} />}
								{...form.getInputProps("subdomain")}
								onChange={(e) => {
									const value = e.currentTarget.value
										.toLowerCase()
										.normalize("NFD")
										.replace(/[\u0300-\u036f]/g, "")
										.replace(/[^a-z0-9-]/g, "");
									form.setFieldValue("subdomain", value);
								}}
								data-testid="tenant-subdomain-input"
							/>

							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<FileInput
										label="Logo da Organização"
										placeholder="Clique para selecionar"
										accept="image/*"
										leftSection={<IconPhoto size={18} />}
										onChange={handleLogoChange}
										data-testid="tenant-logo-input"
									/>
									{logoPreview && (
										<Paper mt="xs" p="xs" withBorder>
											<img
												src={logoPreview}
												alt="Preview"
												style={{
													maxWidth: "100%",
													maxHeight: "100px",
													objectFit: "contain",
												}}
											/>
										</Paper>
									)}
								</Grid.Col>

								<Grid.Col span={{ base: 12, md: 6 }}>
									<ColorInput
										label="Cor Primária"
										description="Cor principal da sua organização"
										required
										leftSection={<IconColorPicker size={18} />}
										{...form.getInputProps("primaryColor")}
										data-testid="tenant-color-input"
									/>
								</Grid.Col>
							</Grid>
						</Stack>
					</Paper>

					<Group justify="space-between" mt="xl">
						{onBack ? (
							<Button variant="subtle" onClick={onBack} data-testid="back-button">
								Voltar
							</Button>
						) : (
							<div />
						)}

						<Button type="submit" data-testid="next-button">
							Próximo
						</Button>
					</Group>
				</Stack>
			</form>
		</Stack>
	);
};
