import {
	Alert,
	Center,
	Container,
	Loader,
	Paper,
	Progress,
	Stack,
	Stepper,
	Text,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingService } from "@/services/onboarding";
import { type OnboardingData, OnboardingStatus, OnboardingStep } from "@/types";
import {
	AdminInfoStep,
	CompleteStep,
	OrganizationDetailsStep,
	PreferencesStep,
	TenantInfoStep,
	WelcomeStep,
} from "./steps";

/**
 * Main Onboarding Component
 * Single Responsibility: Orchestrates the onboarding flow
 * Open/Closed Principle: New steps can be added without modifying this component
 */
export const Onboarding = () => {
	const navigate = useNavigate();
	const [onboardingData, setOnboardingData] = useState<OnboardingData>(
		onboardingService.initialize(),
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string>("");

	// Set document title
	useEffect(() => {
		document.title = "Ministerium | Cadastro";
	}, []);

	// Get step index for Stepper component
	const getActiveStepIndex = (step: OnboardingStep): number => {
		const stepMap: Record<OnboardingStep, number> = {
			[OnboardingStep.WELCOME]: 0,
			[OnboardingStep.TENANT_INFO]: 1,
			[OnboardingStep.ADMIN_INFO]: 2,
			[OnboardingStep.ORGANIZATION_DETAILS]: 3,
			[OnboardingStep.PREFERENCES]: 4,
			[OnboardingStep.COMPLETE]: 5,
		};
		return stepMap[step] || 0;
	};

	const handleNext = async (stepData: Partial<OnboardingData>) => {
		setError("");

		// Update data
		const updatedData = onboardingService.updateStep(onboardingData, stepData);

		// If we're at the complete step, submit the onboarding
		if (updatedData.currentStep === OnboardingStep.COMPLETE) {
			setIsSubmitting(true);
			try {
				const result = await onboardingService.complete(updatedData);

				if (!result.success) {
					setError(result.message || "Erro ao concluir onboarding");
					setIsSubmitting(false);
					return;
				}

				// Mark as completed
				const completedData = {
					...updatedData,
					status: OnboardingStatus.COMPLETED,
					completedAt: new Date().toISOString(),
				};
				setOnboardingData(completedData);

				// Store in localStorage for now (in production, this would be on the backend)
				localStorage.setItem(
					"onboarding_completed",
					JSON.stringify(completedData),
				);

				// Redirect to login or dashboard
				setTimeout(() => {
					navigate("/login");
				}, 2000);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Erro ao concluir onboarding",
				);
				setIsSubmitting(false);
			}
			return;
		}

		// Move to next step
		const nextStep = onboardingService.nextStep(updatedData.currentStep);
		if (nextStep) {
			setOnboardingData({
				...updatedData,
				currentStep: nextStep,
			});
		}
	};

	const handleBack = () => {
		const previousStep = onboardingService.previousStep(
			onboardingData.currentStep,
		);
		if (previousStep) {
			setOnboardingData({
				...onboardingData,
				currentStep: previousStep,
			});
		}
	};

	const handleSkip = () => {
		if (onboardingService.canSkipStep(onboardingData.currentStep)) {
			const nextStep = onboardingService.nextStep(onboardingData.currentStep);
			if (nextStep) {
				setOnboardingData({
					...onboardingData,
					currentStep: nextStep,
				});
			}
		}
	};

	// Calculate progress
	const progress = onboardingService.calculateProgress(
		onboardingData.currentStep,
	);

	// Render the current step component
	const renderStep = () => {
		const stepProps = {
			data: onboardingData,
			onNext: handleNext,
			onBack:
				onboardingData.currentStep !== OnboardingStep.WELCOME
					? handleBack
					: undefined,
			onSkip: onboardingService.canSkipStep(onboardingData.currentStep)
				? handleSkip
				: undefined,
		};

		switch (onboardingData.currentStep) {
			case OnboardingStep.WELCOME:
				return <WelcomeStep {...stepProps} />;

			case OnboardingStep.TENANT_INFO:
				return <TenantInfoStep {...stepProps} />;

			case OnboardingStep.ADMIN_INFO:
				return <AdminInfoStep {...stepProps} />;

			case OnboardingStep.ORGANIZATION_DETAILS:
				return <OrganizationDetailsStep {...stepProps} />;

			case OnboardingStep.PREFERENCES:
				return <PreferencesStep {...stepProps} />;

			case OnboardingStep.COMPLETE:
				return <CompleteStep {...stepProps} />;

			default:
				return null;
		}
	};

	if (isSubmitting) {
		return (
			<Center style={{ minHeight: "100vh" }}>
				<Stack align="center" gap="md">
					<Loader size="xl" />
					<Text size="lg" fw={500}>
						Configurando sua organização...
					</Text>
				</Stack>
			</Center>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				padding: "2rem 0",
			}}
		>
			<Container size="lg" py="xl">
				<Stack gap="xl">
					{/* Progress Bar - Only show for non-welcome/complete steps */}
					{onboardingData.currentStep !== OnboardingStep.WELCOME &&
						onboardingData.currentStep !== OnboardingStep.COMPLETE && (
							<Paper p="md" radius="md" shadow="sm">
								<Stack gap="xs">
									<Text size="sm" fw={500} c="dimmed">
										Progresso: {progress}%
									</Text>
									<Progress
										value={progress}
										size="lg"
										radius="xl"
										data-testid="onboarding-progress"
									/>
								</Stack>
							</Paper>
						)}

					{/* Stepper - Only show for non-welcome/complete steps */}
					{onboardingData.currentStep !== OnboardingStep.WELCOME &&
						onboardingData.currentStep !== OnboardingStep.COMPLETE && (
							<Paper p="md" radius="md" shadow="sm">
								<Stepper
									active={getActiveStepIndex(onboardingData.currentStep)}
									size="sm"
									data-testid="onboarding-stepper"
								>
									<Stepper.Step
										label="Organização"
										description="Informações básicas"
									/>
									<Stepper.Step label="Administrador" description="Sua conta" />
									<Stepper.Step
										label="Detalhes"
										description="Informações adicionais"
									/>
									<Stepper.Step
										label="Preferências"
										description="Configurações"
									/>
								</Stepper>
							</Paper>
						)}

					{/* Error Alert */}
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

					{/* Step Content */}
					<Paper
						p="xl"
						radius="md"
						shadow="xl"
						data-testid="onboarding-step-content"
					>
						{renderStep()}
					</Paper>
				</Stack>
			</Container>
		</div>
	);
};

export default Onboarding;
