import {
	Button,
	Grid,
	Group,
	Paper,
	Select,
	Stack,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useGo, useList } from "@refinedev/core";
import { useForm } from "@refinedev/mantine";
import type { Ministry, Schedule } from "@/types";

export const ScheduleCreate = () => {
	const go = useGo();

	const { data: ministriesData, isLoading: loadingMinistries } =
		useList<Ministry>({
			resource: "ministries",
			pagination: { mode: "off" },
		});

	const {
		saveButtonProps,
		getInputProps,
		refineCore: { formLoading },
	} = useForm<Schedule>({
		refineCoreProps: {
			onMutationSuccess: () => {
				notifications.show({
					title: "Sucesso!",
					message: "Escala criada com sucesso",
					color: "green",
				});
				go({ to: "/schedules" });
			},
		},
		initialValues: {
			title: "",
			description: "",
			date: new Date(),
			ministryId: "",
			volunteers: [],
		},
	});

	const ministries =
		ministriesData?.data.map((ministry) => ({
			value: ministry.id,
			label: ministry.name,
		})) || [];

	return (
		<Stack gap="lg">
			<Title order={2}>Nova Escala</Title>
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
								disabled={loadingMinistries}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<Textarea label="Descrição" {...getInputProps("description")} />
						</Grid.Col>
					</Grid>
					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={() => go({ to: "/schedules" })}>
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
export default ScheduleCreate;
