import {
	Alert,
	Box,
	Button,
	Center,
	Divider,
	Group,
	LoadingOverlay,
	Stack,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
	IconAlertCircle,
	IconCalendar,
	IconClock,
	IconMail,
	IconMapPin,
	IconPhone,
	IconUser,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DynamicForm } from "@/components/events/DynamicForm";
import { localDataProvider } from "@/providers/dataProvider";
import { createLoginStyles, gradientButtonStyles } from "@/styles/components";
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
	const [submitted, setSubmitted] = useState(false);
	const [customFieldsValues, setCustomFieldsValues] = useState<
		Record<string, unknown>
	>({});
	const [customFieldsErrors, setCustomFieldsErrors] = useState<
		Record<string, string>
	>({});
	const theme = useMantineTheme();

	const styles = useMemo(() => createLoginStyles(theme), [theme]);

	// Form for required fields (name, email, phone)
	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			phone: "",
		},
		validate: {
			name: (value) =>
				value.trim().length >= 3
					? null
					: "Nome deve ter no mínimo 3 caracteres",
			email: (value) =>
				/^\S+@\S+\.\S+$/.test(value) ? null : "E-mail inválido",
			phone: (value) => {
				const phoneRegex = /^\+?[\d\s()-]+$/;
				return phoneRegex.test(value) && value.trim().length >= 10
					? null
					: "Telefone inválido";
			},
		},
	});

	useEffect(() => {
		const loadEventConfig = async () => {
			if (!eventId) {
				setError("ID do evento não fornecido");
				setLoading(false);
				return;
			}

			try {
				if (!localDataProvider.custom) {
					throw new Error("Data provider custom method not available");
				}

				const response = await localDataProvider.custom({
					url: `/events/${eventId}/registration-config`,
					method: "get",
				});

				setEventData(response.data as RegistrationConfigResponse);
			} catch (err) {
				console.error("Error loading event config:", err);
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

	const validateCustomFields = (): boolean => {
		const errors: Record<string, string> = {};

		if (!eventData?.config.fields) return true;

		for (const field of eventData.config.fields) {
			const value = customFieldsValues[field.id];

			if (field.required && !value) {
				errors[field.id] = "Este campo é obrigatório";
				continue;
			}

			if (!value) continue;

			if (field.validation?.pattern && value) {
				const regex = new RegExp(field.validation.pattern);
				if (!regex.test(value as string)) {
					errors[field.id] = field.validation.message || "Formato inválido";
				}
			}

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

		setCustomFieldsErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleCustomFieldChange = (field: string, value: unknown) => {
		setCustomFieldsValues((prev) => ({ ...prev, [field]: value }));
		if (customFieldsErrors[field]) {
			setCustomFieldsErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleSubmit = async (values: typeof form.values) => {
		if (!validateCustomFields()) {
			notifications.show({
				title: "Erro",
				message: "Por favor, corrija os erros no formulário",
				color: "red",
			});
			return;
		}

		setSubmitting(true);

		try {
			if (!localDataProvider.custom) {
				throw new Error("Data provider custom method not available");
			}

			const payload = {
				eventId,
				name: values.name,
				email: values.email,
				phone: values.phone,
				formData: customFieldsValues,
			};

			const response = await localDataProvider.custom({
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
			<Box style={styles.container}>
				<LoadingOverlay visible />
			</Box>
		);
	}

	if (error || !eventData) {
		return (
			<Box style={styles.container}>
				<Center style={{ minHeight: "100vh", padding: "1rem" }}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						style={{ width: "100%", maxWidth: "600px" }}
					>
						<Box style={styles.mobileCard}>
							<Alert
								icon={<IconAlertCircle size={16} />}
								title="Erro"
								color="red"
							>
								{error || "Evento não encontrado"}
							</Alert>
						</Box>
					</motion.div>
				</Center>
			</Box>
		);
	}

	if (submitted) {
		// Create Google Calendar link
		const createGoogleCalendarLink = () => {
			const eventDate = new Date(eventData.event.date);
			const [hours, minutes] = eventData.event.time.split(":");
			eventDate.setHours(
				Number.parseInt(hours, 10),
				Number.parseInt(minutes, 10),
			);

			// Format date for Google Calendar (yyyyMMddTHHmmss)
			const formatDateForGoogle = (date: Date) => {
				return date
					.toISOString()
					.replace(/-|:|\.\d+/g, "")
					.split("Z")[0];
			};

			const startDate = formatDateForGoogle(eventDate);
			// Assume 2 hour duration
			const endDate = formatDateForGoogle(
				new Date(eventDate.getTime() + 2 * 60 * 60 * 1000),
			);

			const params = new URLSearchParams({
				action: "TEMPLATE",
				text: eventData.event.title,
				dates: `${startDate}/${endDate}`,
				details: eventData.event.description || "",
				location: eventData.event.location,
			});

			return `https://calendar.google.com/calendar/render?${params.toString()}`;
		};

		return (
			<Box style={styles.container}>
				<Center style={{ minHeight: "100vh", padding: "1rem" }}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						style={{ width: "100%", maxWidth: "600px" }}
					>
						<Box style={styles.mobileCard}>
							<Stack gap="md" align="center">
								<Title order={2}>Inscrição Realizada!</Title>
								<Text size="lg" ta="center">
									{eventData.config.confirmationMessage ||
										"Sua inscrição foi realizada com sucesso. Você receberá mais informações em breve."}
								</Text>
								<Button
									component="a"
									href={createGoogleCalendarLink()}
									target="_blank"
									rel="noopener noreferrer"
									variant="light"
									leftSection={<IconCalendar size={18} />}
								>
									Adicionar ao Google Agenda
								</Button>
							</Stack>
						</Box>
					</motion.div>
				</Center>
			</Box>
		);
	}

	return (
		<Box style={styles.container}>
			<Center style={{ minHeight: "100vh", padding: "1rem" }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					style={{ width: "100%", maxWidth: "600px" }}
				>
					<Box style={styles.mobileCard}>
						<Stack gap="lg">
							{/* Event Header */}
							<Stack gap="xs">
								<Title order={2} ta="center" fw={700}>
									{eventData.event.title}
								</Title>
								{eventData.event.description && (
									<Text size="sm" c="dimmed" ta="center">
										{eventData.event.description}
									</Text>
								)}
							</Stack>

							{/* Event Details */}
							<Stack gap="xs">
								<Group gap="md" justify="center" wrap="nowrap">
									<Group gap="xs" wrap="nowrap">
										<IconCalendar size={16} />
										<Text size="sm">
											{new Date(eventData.event.date).toLocaleDateString(
												"pt-BR",
											)}
										</Text>
									</Group>
									<Group gap="xs" wrap="nowrap">
										<IconClock size={16} />
										<Text size="sm">{eventData.event.time}</Text>
									</Group>
								</Group>
								<Group gap="xs" justify="center">
									<IconMapPin size={16} />
									<Text
										size="sm"
										component="a"
										href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.event.location)}`}
										target="_blank"
										rel="noopener noreferrer"
										style={{ textDecoration: "underline", cursor: "pointer" }}
									>
										{eventData.event.location}
									</Text>
								</Group>
							</Stack>

							{eventData.config.capacity && (
								<Alert color="blue" variant="light">
									<Text size="sm" ta="center">
										Vagas limitadas: {eventData.config.capacity} participantes
									</Text>
								</Alert>
							)}

							<Divider />

							{/* Registration Form */}
							<form onSubmit={form.onSubmit(handleSubmit)}>
								<Stack gap="lg">
									<Title order={4} ta="center">
										Dados de Inscrição
									</Title>

									<TextInput
										label="Nome Completo"
										placeholder="Seu nome completo"
										required
										leftSection={<IconUser size={18} />}
										{...form.getInputProps("name")}
									/>

									<TextInput
										label="E-mail"
										placeholder="seu@email.com"
										required
										leftSection={<IconMail size={18} />}
										{...form.getInputProps("email")}
									/>

									<TextInput
										label="Telefone"
										placeholder="(00) 00000-0000"
										required
										leftSection={<IconPhone size={18} />}
										{...form.getInputProps("phone")}
									/>

									{eventData.config.fields &&
										eventData.config.fields.length > 0 && (
											<>
												<Divider label="Informações Adicionais" />
												<DynamicForm
													fields={eventData.config.fields}
													values={customFieldsValues}
													errors={customFieldsErrors}
													onChange={handleCustomFieldChange}
												/>
											</>
										)}

									<Button
										type="submit"
										fullWidth
										size="md"
										loading={submitting}
										mt="xl"
										styles={gradientButtonStyles}
									>
										Realizar Inscrição
									</Button>
								</Stack>
							</form>
						</Stack>
					</Box>
				</motion.div>
			</Center>
		</Box>
	);
};
