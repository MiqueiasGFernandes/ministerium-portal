import {
	Button,
	Grid,
	Group,
	NumberInput,
	Paper,
	Select,
	Stack,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useGo } from "@refinedev/core";
import { useForm } from "@refinedev/mantine";
import { EventRegistrationFormBuilder } from "@/components/events/EventRegistrationFormBuilder";
import { EVENT_STATUS_OPTIONS } from "@/config/constants";
import { shouldShowTestData } from "@/config/env";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import { type Event, type EventRegistrationConfig, EventStatus } from "@/types";
import { generateEventFormData } from "@/utils/fakeData";

export const EventCreate = () => {
	const go = useGo();
	const {
		saveButtonProps,
		getInputProps,
		setFieldValue,
		values,
		refineCore: { formLoading },
	} = useForm<Event>({
		refineCoreProps: {
			onMutationSuccess: () => {
				notifications.show({
					title: "Sucesso!",
					message: "Evento criado com sucesso",
					color: "green",
				});
				go({ to: "/events" });
			},
		},
		initialValues: {
			title: "",
			description: "",
			date: new Date(),
			time: "19:00",
			location: "",
			status: EventStatus.DRAFT,
			attendees: [],
			registrationConfig: {
				enabled: true,
				fields: [],
			},
		},
	});

	const handleAutoFill = () => {
		const fakeData = generateEventFormData();
		setFieldValue("title", fakeData.title);
		setFieldValue("description", fakeData.description);
		setFieldValue("date", fakeData.date);
		setFieldValue("time", fakeData.time);
		setFieldValue("location", fakeData.location);
		setFieldValue("maxAttendees", fakeData.maxAttendees);
		setFieldValue("status", fakeData.status);
		setFieldValue("registrationConfig", fakeData.registrationConfig);

		notifications.show({
			title: "Formulário preenchido",
			message: "Dados de teste foram inseridos automaticamente",
			color: "blue",
		});
	};

	return (
		<Stack gap="lg">
			<Title order={2}>Novo Evento</Title>

			{shouldShowTestData() && (
				<Button
					variant="light"
					onClick={handleAutoFill}
					size="xs"
					data-testid="autofill-button"
				>
					🎲 Auto Preencher (Teste)
				</Button>
			)}

			<form>
				<Paper shadow="xs" p="lg" radius="md" withBorder>
					<Grid>
						<Grid.Col span={{ base: 12, md: 8 }}>
							<TextInput label="Título" required {...getInputProps("title")} />
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Select
								label="Status"
								required
								data={EVENT_STATUS_OPTIONS}
								{...getInputProps("status")}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<Textarea label="Descrição" {...getInputProps("description")} />
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<DateInput
								label="Data"
								required
								valueFormat="DD/MM/YYYY"
								{...getInputProps("date")}
							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<TimeInput label="Horário" required {...getInputProps("time")} />
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<NumberInput
								label="Máx. Participantes"
								{...getInputProps("maxAttendees")}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<TextInput
								label="Local"
								required
								{...getInputProps("location")}
							/>
						</Grid.Col>
					</Grid>
				</Paper>

				<Paper shadow="xs" p="lg" radius="md" withBorder mt="md">
					<EventRegistrationFormBuilder
						value={
							(values.registrationConfig as EventRegistrationConfig) || {
								enabled: true,
								fields: [],
							}
						}
						onChange={(value) =>
							setFieldValue("registrationConfig", {
								...value,
								enabled: true,
							})
						}
					/>
				</Paper>

				<Group justify="flex-end" mt="md">
					<Button variant="default" onClick={() => go({ to: "/events" })}>
						Cancelar
					</Button>
					<Button
						{...saveButtonProps}
						loading={formLoading}
						styles={gradientButtonStyles}
					>
						Salvar
					</Button>
				</Group>
			</form>
		</Stack>
	);
};
export default EventCreate;
