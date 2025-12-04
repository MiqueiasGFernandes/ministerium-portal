import {
	Button,
	FileInput,
	Group,
	Paper,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBuilding, IconPhoto } from "@tabler/icons-react";
import { useState } from "react";
import { shouldShowTestData } from "@/config/env";
import { onboardingService } from "@/services/onboarding";
import type { OnboardingStepProps } from "@/types";
import { onboardingAutoFill } from "@/utils/onboardingFakeData";

/**
 * Tenant Info Step Component
 * Single Responsibility: Collects tenant/organization basic information
 */
export const TenantInfoStep = ({
	data,
	onNext,
	onBack,
}: OnboardingStepProps) => {
	const [logoPreview, setLogoPreview] = useState<string | undefined>(
		data.tenant?.logo,
	);

	const form = useForm({
		initialValues: {
			name: data.tenant?.name ?? "",
			logo: data.tenant?.logo ?? "",
		},
		validate: {
			name: (value) =>
				value.trim().length < 3
					? "Nome deve ter pelo menos 3 caracteres"
					: null,
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

							<FileInput
								label="Logo da Organização (Opcional)"
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
											maxWidth: "200px",
											maxHeight: "100px",
											objectFit: "contain",
										}}
									/>
								</Paper>
							)}
						</Stack>
					</Paper>

					<Group justify="space-between" mt="xl">
						{onBack ? (
							<Button
								variant="subtle"
								onClick={onBack}
								data-testid="back-button"
							>
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
