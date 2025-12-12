import {
	Alert,
	Box,
	Button,
	Card,
	Container,
	Group,
	LoadingOverlay,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
	IconAlertCircle,
	IconCalendar,
	IconClock,
	IconMapPin,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DynamicForm } from "@/components/events/DynamicForm";
import { localDataProvider } from "@/providers/dataProvider";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Event, EventRegistrationConfig } from "@/types";

interface RegistrationConfigResponse {
	event: Pick<
		Event,
		"id" | "title" | "description" | "date" | "time" | "location"
	>;
	config: EventRegistrationConfig;
}

export const EventRegistration = () => {
	const { eventId } = useParams<{ eventId: string }>();
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [eventData, setEventData] = useState<RegistrationConfigResponse | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [formValues, setFormValues] = useState<Record<string, unknown>>({});
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		const loadEventConfig = async () => {
			if (!eventId) {
				setError("ID do evento não fornecido");
				setLoading(false);
				return;
			}

			try {
				const response = await localDataProvider.custom!({
					url: `/events/${eventId}/registration-config`,
					method: "get",
				});

				setEventData(response.data as RegistrationConfigResponse);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Não foi possível carregar as informações do evento",
				);
			} finally {
				setLoading(false);
			}
		};

		loadEventConfig();
	}, [eventId]);

	const validateForm = (): boolean => {
		const errors: Record<string, string> = {};

		if (!eventData?.config.fields) return true;

		for (const field of eventData.config.fields) {
			const value = formValues[field.id];

			// Check required fields
			if (field.required && !value) {
				errors[field.id] = "Este campo é obrigatório";
				continue;
			}

			// Skip validation if field is empty and not required
			if (!value) continue;

			// Email validation
			if (field.type === "email" && value) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value as string)) {
					errors[field.id] = "E-mail inválido";
				}
			}

			// Phone validation
			if (field.type === "phone" && value) {
				const phoneRegex = /^\+?[\d\s()-]+$/;
				if (!phoneRegex.test(value as string)) {
					errors[field.id] = "Telefone inválido";
				}
			}

			// Custom validation
			if (field.validation?.pattern && value) {
				const regex = new RegExp(field.validation.pattern);
				if (!regex.test(value as string)) {
					errors[field.id] = field.validation.message || "Formato inválido";
				}
			}

			// Min/Max validation for numbers
			if (field.type === "number" && typeof value === "number") {
				if (
					field.validation?.min !== undefined &&
					value < field.validation.min
				) {
					errors[field.id] = `Valor mínimo: ${field.validation.min}`;
				}
				if (
					field.validation?.max !== undefined &&
					value > field.validation.max
				) {
					errors[field.id] = `Valor máximo: ${field.validation.max}`;
				}
			}
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleFieldChange = (field: string, value: unknown) => {
		setFormValues((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (formErrors[field]) {
			setFormErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			notifications.show({
				title: "Erro",
				message: "Por favor, corrija os erros no formulário",
				color: "red",
			});
			return;
		}

		setSubmitting(true);

		try {
			// Extract standard fields
			const nameField = eventData?.config.fields.find(
				(f) => f.label.toLowerCase().includes("nome") || f.type === "text",
			);
			const emailField = eventData?.config.fields.find(
				(f) => f.type === "email",
			);
			const phoneField = eventData?.config.fields.find(
				(f) => f.type === "phone",
			);

			const payload = {
				eventId,
				name: nameField ? (formValues[nameField.id] as string) : "Participante",
				email: emailField ? (formValues[emailField.id] as string) : "",
				phone: phoneField ? (formValues[phoneField.id] as string) : undefined,
				formData: formValues,
			};

			const response = await localDataProvider.custom!({
				url: "/public/event-registration",
				method: "post",
				query: payload,
			});

			setSubmitted(true);

			notifications.show({
				title: "Sucesso!",
				message: response.data.message || "Inscrição realizada com sucesso",
				color: "green",
			});
		} catch (err) {
			notifications.show({
				title: "Erro",
				message:
					err instanceof Error
						? err.message
						: "Não foi possível realizar a inscrição",
				color: "red",
			});
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<Container size="sm" py="xl">
				<LoadingOverlay visible />
			</Container>
		);
	}

	if (error || !eventData) {
		return (
			<Container size="sm" py="xl">
				<Alert icon={<IconAlertCircle size={16} />} title="Erro" color="red">
					{error || "Evento não encontrado"}
				</Alert>
			</Container>
		);
	}

	if (submitted) {
		return (
			<Container size="sm" py="xl">
				<Card shadow="md" padding="xl" radius="md">
					<Stack gap="md" align="center">
						<Title order={2}>Inscrição Realizada!</Title>
						<Text size="lg" ta="center">
							{eventData.config.confirmationMessage ||
								"Sua inscrição foi realizada com sucesso. Você receberá mais informações em breve."}
						</Text>
						{eventData.config.requiresApproval && (
							<Alert color="blue" variant="light">
								<Text size="sm">
									Sua inscrição está pendente de aprovação. Aguarde a
									confirmação.
								</Text>
							</Alert>
						)}
					</Stack>
				</Card>
			</Container>
		);
	}

	return (
		<Container size="sm" py="xl">
			<Stack gap="lg">
				<Paper shadow="xs" p="xl" radius="md" withBorder>
					<Stack gap="md">
						<Title order={1}>{eventData.event.title}</Title>

						{eventData.event.description && (
							<Text c="dimmed">{eventData.event.description}</Text>
						)}

						<Stack gap="xs">
							<Group gap="xs">
								<IconCalendar size={16} />
								<Text size="sm">
									{new Date(eventData.event.date).toLocaleDateString("pt-BR")}
								</Text>
							</Group>

							<Group gap="xs">
								<IconClock size={16} />
								<Text size="sm">{eventData.event.time}</Text>
							</Group>

							<Group gap="xs">
								<IconMapPin size={16} />
								<Text size="sm">{eventData.event.location}</Text>
							</Group>
						</Stack>

						{eventData.config.capacity && (
							<Alert color="blue" variant="light">
								<Text size="sm">
									Vagas limitadas: {eventData.config.capacity} participantes
								</Text>
							</Alert>
						)}

						{eventData.config.registrationDeadline && (
							<Alert color="orange" variant="light">
								<Text size="sm">
									Inscrições até:{" "}
									{new Date(
										eventData.config.registrationDeadline,
									).toLocaleDateString("pt-BR")}
								</Text>
							</Alert>
						)}
					</Stack>
				</Paper>

				<Paper shadow="xs" p="xl" radius="md" withBorder>
					<form onSubmit={handleSubmit}>
						<Stack gap="lg">
							<Title order={2}>Formulário de Inscrição</Title>

							<DynamicForm
								fields={eventData.config.fields}
								values={formValues}
								errors={formErrors}
								onChange={handleFieldChange}
							/>

							<Group justify="flex-end" mt="md">
								<Button
									type="submit"
									loading={submitting}
									styles={gradientButtonStyles}
									size="lg"
								>
									Realizar Inscrição
								</Button>
							</Group>
						</Stack>
					</form>
				</Paper>

				<Box ta="center">
					<Text size="xs" c="dimmed">
						Ao se inscrever, você concorda com os termos e condições do evento.
					</Text>
				</Box>
			</Stack>
		</Container>
	);
};
