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
import { EVENT_STATUS_OPTIONS } from "@/config/constants";
import { type Event, EventStatus } from "@/types";

export const EventCreate = () => {
	const go = useGo();
	const {
		saveButtonProps,
		getInputProps,
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
					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={() => go({ to: "/events" })}>
							Cancelar
						</Button>
						<Button {...saveButtonProps} loading={formLoading}>
							Salvar
						</Button>
					</Group>
				</Paper>
			</form>
		</Stack>
	);
};
export default EventCreate;
