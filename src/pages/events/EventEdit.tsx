import {
	Accordion,
	Button,
	Grid,
	Group,
	LoadingOverlay,
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
import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/mantine";
import { useEffect } from "react";
import { EventRegistrationFormBuilder } from "@/components/events/EventRegistrationFormBuilder";
import { EVENT_STATUS_OPTIONS } from "@/config/constants";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Event, EventRegistrationConfig } from "@/types";

export const EventEdit = () => {
	const { list } = useNavigation();
	const {
		saveButtonProps,
		getInputProps,
		setFieldValue,
		values,
		refineCore: { formLoading, queryResult },
	} = useForm<Event>({
		refineCoreProps: {
			action: "edit",
			resource: "events",
			onMutationSuccess: () => {
				notifications.show({
					title: "Sucesso!",
					message: "Evento atualizado com sucesso",
					color: "green",
				});
				list("events");
			},
		},
	});

	// Initialize form values when data is loaded
	useEffect(() => {
		const data = queryResult?.data?.data;
		if (data && Object.keys(values).length === 0) {
			// Convert date string to Date object if needed
			if (data.date && typeof data.date === "string") {
				setFieldValue("date", new Date(data.date));
			}
			// Set all other fields
			Object.keys(data).forEach((key) => {
				if (key !== "date") {
					setFieldValue(key as keyof Event, data[key as keyof Event]);
				}
			});
		}
	}, [queryResult?.data?.data, values, setFieldValue]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted, values:", values);
		saveButtonProps.onClick?.();
	};

	return (
		<Stack gap="lg" pos="relative">
			<LoadingOverlay visible={queryResult?.isLoading || false} />
			<Title order={2}>Editar Evento</Title>
			<form onSubmit={handleSubmit}>
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
					<Accordion defaultValue="registration">
						<Accordion.Item value="registration">
							<Accordion.Control>Inscrição Pública</Accordion.Control>
							<Accordion.Panel>
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
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
				</Paper>

				<Group justify="flex-end" mt="md">
					<Button variant="default" onClick={() => list("events")}>
						Cancelar
					</Button>
					<Button
						type="submit"
						{...saveButtonProps}
						loading={formLoading}
						styles={gradientButtonStyles}
					>
						Salvar Alterações
					</Button>
				</Group>
			</form>
		</Stack>
	);
};
export default EventEdit;
