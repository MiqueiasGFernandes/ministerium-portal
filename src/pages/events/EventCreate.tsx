import {
	Accordion,
	Button,
	Grid,
	Group,
	NumberInput,
	Paper,
	Select,
	Stack,
	Switch,
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
import { gradientButtonStyles } from "@/styles/buttonStyles";
import { type Event, type EventRegistrationConfig, EventStatus } from "@/types";

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
				enabled: false,
				fields: [],
				requiresApproval: false,
			},
		},
	});

	return (
		<Stack gap="lg">
			<Title order={2}>Novo Evento</Title>
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
					<Accordion>
						<Accordion.Item value="registration">
							<Accordion.Control>Inscrição Pública</Accordion.Control>
							<Accordion.Panel>
								<Stack gap="md">
									<Switch
										label="Habilitar inscrição pública"
										description="Permite que pessoas se inscrevam no evento através de um link público"
										checked={
											values.registrationConfig
												? (values.registrationConfig as EventRegistrationConfig)
														.enabled
												: false
										}
										onChange={(e) => {
											const currentConfig: EventRegistrationConfig =
												(values.registrationConfig as EventRegistrationConfig) || {
													enabled: false,
													fields: [],
													requiresApproval: false,
												};
											setFieldValue("registrationConfig", {
												...currentConfig,
												enabled: e.target.checked,
											});
										}}
									/>

									{values.registrationConfig &&
									(values.registrationConfig as EventRegistrationConfig)
										.enabled ? (
										<EventRegistrationFormBuilder
											value={
												values.registrationConfig as EventRegistrationConfig
											}
											onChange={(value) =>
												setFieldValue("registrationConfig", value)
											}
										/>
									) : null}
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
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
