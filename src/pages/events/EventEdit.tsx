import {
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
import { useForm } from "@refinedev/mantine";
import { EVENT_STATUS_OPTIONS } from "@/config/constants";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Event } from "@/types";

export const EventEdit = () => {
	const {
		saveButtonProps,
		getInputProps,
		refineCore: { formLoading, queryResult },
	} = useForm<Event>({
		refineCoreProps: { action: "edit" },
	});

	return (
		<Stack gap="lg" pos="relative">
			<LoadingOverlay visible={queryResult?.isLoading || false} />
			<Title order={2}>Editar Evento</Title>
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
						<Button variant="default">Cancelar</Button>
						<Button
							{...saveButtonProps}
							loading={formLoading}
							styles={gradientButtonStyles}
						>
							Salvar Alterações
						</Button>
					</Group>
				</Paper>
			</form>
		</Stack>
	);
};
export default EventEdit;
