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
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@refinedev/mantine";
import { useEffect } from "react";
import { TRANSACTION_CATEGORIES } from "@/config/constants";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Transaction } from "@/types";

export const TransactionEdit = () => {
	const {
		saveButtonProps,
		getInputProps,
		setFieldValue,
		values,
		refineCore: { formLoading, queryResult },
	} = useForm<Transaction>({
		refineCoreProps: {
			action: "edit",
			resource: "transactions",
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
					setFieldValue(
						key as keyof Transaction,
						data[key as keyof Transaction],
					);
				}
			});
		}
	}, [queryResult?.data?.data, values, setFieldValue]);

	return (
		<Stack gap="lg" pos="relative">
			<LoadingOverlay visible={queryResult?.isLoading || false} />
			<Title order={2}>Editar Transação</Title>
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
export default TransactionEdit;
