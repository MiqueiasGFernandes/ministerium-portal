import {
	Button,
	Grid,
	Group,
	Loader,
	Paper,
	Select,
	Stack,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useGo, useList } from "@refinedev/core";
import { useForm } from "@refinedev/mantine";
import type { Ministry, User } from "@/types";

export const MinistryEdit = () => {
	const go = useGo();

	const { data: usersData, isLoading: loadingUsers } = useList<User>({
		resource: "users",
		pagination: { mode: "off" },
		filters: [
			{
				field: "role",
				operator: "in",
				value: ["LEADER", "ADMIN"],
			},
		],
	});

	const {
		saveButtonProps,
		getInputProps,
		refineCore: { formLoading, queryResult },
	} = useForm<Ministry>({
		refineCoreProps: {
			onMutationSuccess: () => {
				notifications.show({
					title: "Sucesso!",
					message: "Ministério atualizado com sucesso",
					color: "green",
				});
				go({ to: "/ministries" });
			},
		},
	});

	const leaderOptions =
		usersData?.data.map((user) => ({
			value: user.id,
			label: user.name,
		})) || [];

	if (queryResult?.isLoading) {
		return (
			<Stack align="center" justify="center" h={300}>
				<Loader size="lg" />
			</Stack>
		);
	}

	return (
		<Stack gap="lg">
			<Title order={2}>Editar Ministério</Title>
			<form>
				<Paper shadow="xs" p="lg" radius="md" withBorder>
					<Grid>
						<Grid.Col span={{ base: 12, md: 8 }}>
							<TextInput
								label="Nome do Ministério"
								placeholder="Ex: Louvor e Adoração"
								required
								{...getInputProps("name")}
							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Select
								label="Líder"
								placeholder="Selecione um líder"
								required
								data={leaderOptions}
								{...getInputProps("leaderId")}
								searchable
								disabled={loadingUsers}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<Textarea
								label="Descrição"
								placeholder="Descreva o propósito e atividades do ministério"
								minRows={4}
								{...getInputProps("description")}
							/>
						</Grid.Col>
					</Grid>
					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={() => go({ to: "/ministries" })}>
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

export default MinistryEdit;
