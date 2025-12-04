import {
	Button,
	Grid,
	Group,
	NumberInput,
	Paper,
	Select,
	Stack,
	Textarea,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useGo } from "@refinedev/core";
import { useForm } from "@refinedev/mantine";
import { TRANSACTION_CATEGORIES } from "@/config/constants";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import { type Transaction, TransactionType } from "@/types";

export const TransactionCreate = () => {
	const go = useGo();
	const {
		saveButtonProps,
		getInputProps,
		refineCore: { formLoading },
	} = useForm<Transaction>({
		refineCoreProps: {
			onMutationSuccess: () => {
				notifications.show({
					title: "Sucesso!",
					message: "Transação criada com sucesso",
					color: "green",
				});
				go({ to: "/finance" });
			},
		},
		initialValues: {
			type: TransactionType.INCOME,
			amount: 0,
			category: "tithe",
			description: "",
			date: new Date(),
		},
	});

	return (
		<Stack gap="lg">
			<Title order={2}>Nova Transação</Title>
			<form>
				<Paper shadow="xs" p="lg" radius="md" withBorder>
					<Grid>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Select
								label="Tipo"
								required
								data={[
									{ value: "income", label: "Entrada" },
									{ value: "expense", label: "Saída" },
								]}
								{...getInputProps("type")}
							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Select
								label="Categoria"
								required
								data={TRANSACTION_CATEGORIES}
								{...getInputProps("category")}
							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<NumberInput
								label="Valor"
								required
								prefix="R$ "
								decimalScale={2}
								{...getInputProps("amount")}
							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<DateInput
								label="Data"
								required
								valueFormat="DD/MM/YYYY"
								{...getInputProps("date")}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<Textarea
								label="Descrição"
								required
								{...getInputProps("description")}
							/>
						</Grid.Col>
					</Grid>
					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={() => go({ to: "/finance" })}>
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
				</Paper>
			</form>
		</Stack>
	);
};
export default TransactionCreate;
