import {
	Button,
	Grid,
	Group,
	LoadingOverlay,
	Paper,
	Select,
	Stack,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/mantine";
import { useEffect } from "react";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Schedule } from "@/types";

export const ScheduleEdit = () => {
	const { list } = useNavigation();
	const {
		saveButtonProps,
		getInputProps,
		setFieldValue,
		values,
		refineCore: { formLoading, queryResult },
	} = useForm<Schedule>({
		refineCoreProps: {
			action: "edit",
			resource: "schedules",
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
					setFieldValue(key as keyof Schedule, data[key as keyof Schedule]);
				}
			});
		}
	}, [queryResult?.data?.data, values, setFieldValue]);

	const ministries = [
		{ value: "ministry-1", label: "Louvor e Adoração" },
		{ value: "ministry-2", label: "Mídia" },
		{ value: "ministry-3", label: "Recepção" },
	];

	return (
		<Stack gap="lg" pos="relative">
			<LoadingOverlay visible={queryResult?.isLoading || false} />
			<Title order={2}>Editar Escala</Title>
			<form>
				<Paper shadow="xs" p="lg" radius="md" withBorder>
					<Grid>
						<Grid.Col span={{ base: 12, md: 8 }}>
							<TextInput label="Título" required {...getInputProps("title")} />
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<DateInput
								label="Data"
								required
								valueFormat="DD/MM/YYYY"
								{...getInputProps("date")}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<Select
								label="Ministério"
								required
								data={ministries}
								{...getInputProps("ministryId")}
								searchable
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<Textarea label="Descrição" {...getInputProps("description")} />
						</Grid.Col>
					</Grid>
					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={() => list("schedules")}>
							Cancelar
						</Button>
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
export default ScheduleEdit;
