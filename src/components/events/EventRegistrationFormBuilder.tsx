import {
	ActionIcon,
	Button,
	Card,
	Group,
	NumberInput,
	Select,
	Stack,
	Switch,
	Text,
	Textarea,
	TextInput,
} from "@mantine/core";
import { IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import type {
	EventFormField,
	EventRegistrationConfig,
	FormFieldType,
} from "@/types";

interface EventRegistrationFormBuilderProps {
	value: EventRegistrationConfig;
	onChange: (value: EventRegistrationConfig) => void;
}

const FIELD_TYPES = [
	{ value: "text", label: "Texto" },
	{ value: "email", label: "E-mail" },
	{ value: "phone", label: "Telefone" },
	{ value: "number", label: "Número" },
	{ value: "date", label: "Data" },
	{ value: "select", label: "Seleção" },
	{ value: "textarea", label: "Texto Longo" },
	{ value: "checkbox", label: "Caixa de Seleção" },
];

export const EventRegistrationFormBuilder = ({
	value,
	onChange,
}: EventRegistrationFormBuilderProps) => {
	const [expandedField, setExpandedField] = useState<string | null>(null);

	const addField = () => {
		const newField: EventFormField = {
			id: `field-${Date.now()}`,
			label: "Novo Campo",
			type: "text" as FormFieldType,
			required: false,
			order: value.fields.length,
		};

		onChange({
			...value,
			fields: [...value.fields, newField],
		});
	};

	const updateField = (id: string, updates: Partial<EventFormField>) => {
		onChange({
			...value,
			fields: value.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
		});
	};

	const removeField = (id: string) => {
		onChange({
			...value,
			fields: value.fields.filter((f) => f.id !== id),
		});
	};

	return (
		<Stack gap="md">
			<Card padding="md" withBorder>
				<Stack gap="md">
					<Text fw={500}>Configurações Gerais</Text>

					<NumberInput
						label="Capacidade máxima"
						description="Deixe vazio para capacidade ilimitada"
						value={value.capacity || ""}
						onChange={(val) =>
							onChange({ ...value, capacity: Number(val) || undefined })
						}
						min={1}
					/>

					<Textarea
						label="Mensagem de confirmação"
						description="Mensagem exibida após o envio do formulário"
						value={value.confirmationMessage || ""}
						onChange={(e) =>
							onChange({ ...value, confirmationMessage: e.target.value })
						}
						rows={3}
					/>
				</Stack>
			</Card>

			<Group justify="space-between">
				<Text fw={500}>Campos do Formulário</Text>
				<Button
					leftSection={<IconPlus size={16} />}
					onClick={addField}
					variant="light"
					size="sm"
				>
					Adicionar Campo
				</Button>
			</Group>

			<Stack gap="sm">
				{value.fields.map((field) => (
					<Card key={field.id} padding="md" withBorder>
						<Stack gap="sm">
							<Group justify="space-between">
								<Group gap="xs">
									<ActionIcon variant="subtle" size="sm">
										<IconGripVertical size={16} />
									</ActionIcon>
									<Text size="sm" fw={500}>
										{field.label}
									</Text>
									<Text size="xs" c="dimmed">
										({field.type})
									</Text>
								</Group>
								<ActionIcon
									color="red"
									variant="subtle"
									onClick={() => removeField(field.id)}
								>
									<IconTrash size={16} />
								</ActionIcon>
							</Group>

							{expandedField === field.id && (
								<Stack gap="xs">
									<TextInput
										label="Label"
										value={field.label}
										onChange={(e) =>
											updateField(field.id, { label: e.target.value })
										}
										required
									/>
									<Select
										label="Tipo"
										data={FIELD_TYPES}
										value={field.type}
										onChange={(value) =>
											updateField(field.id, { type: value as FormFieldType })
										}
									/>
									<TextInput
										label="Placeholder"
										description="Texto de exemplo que aparece dentro do campo antes do usuário digitar"
										value={field.placeholder || ""}
										onChange={(e) =>
											updateField(field.id, { placeholder: e.target.value })
										}
									/>
									<Textarea
										label="Descrição"
										value={field.description || ""}
										onChange={(e) =>
											updateField(field.id, { description: e.target.value })
										}
										rows={2}
									/>
									{(field.type === "select" || field.type === "radio") && (
										<Textarea
											label="Opções (uma por linha)"
											value={field.options?.join("\n") || ""}
											onChange={(e) =>
												updateField(field.id, {
													options: e.target.value.split("\n").filter(Boolean),
												})
											}
											rows={3}
										/>
									)}
									<Switch
										label="Campo obrigatório"
										checked={field.required}
										onChange={(e) =>
											updateField(field.id, { required: e.target.checked })
										}
									/>
								</Stack>
							)}

							<Button
								variant="subtle"
								size="xs"
								onClick={() =>
									setExpandedField(expandedField === field.id ? null : field.id)
								}
							>
								{expandedField === field.id ? "Recolher" : "Expandir"}
							</Button>
						</Stack>
					</Card>
				))}
			</Stack>
		</Stack>
	);
};
