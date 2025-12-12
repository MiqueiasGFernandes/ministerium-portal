import {
	Checkbox,
	NumberInput,
	Select,
	Stack,
	Text,
	Textarea,
	TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import type { EventFormField } from "@/types";

interface DynamicFormProps {
	fields: EventFormField[];
	values: Record<string, unknown>;
	errors: Record<string, string>;
	onChange: (field: string, value: unknown) => void;
}

export const DynamicForm = ({
	fields,
	values,
	errors,
	onChange,
}: DynamicFormProps) => {
	const renderField = (field: EventFormField) => {
		const commonProps = {
			label: field.label,
			required: field.required,
			description: field.description,
			placeholder: field.placeholder,
			error: errors[field.id],
		};

		switch (field.type) {
			case "text":
				return (
					<TextInput
						{...commonProps}
						value={(values[field.id] as string) || ""}
						onChange={(e) => onChange(field.id, e.target.value)}
					/>
				);

			case "email":
				return (
					<TextInput
						{...commonProps}
						type="email"
						value={(values[field.id] as string) || ""}
						onChange={(e) => onChange(field.id, e.target.value)}
					/>
				);

			case "phone":
				return (
					<TextInput
						{...commonProps}
						type="tel"
						value={(values[field.id] as string) || ""}
						onChange={(e) => onChange(field.id, e.target.value)}
					/>
				);

			case "number":
				return (
					<NumberInput
						{...commonProps}
						value={(values[field.id] as number) || undefined}
						onChange={(value) => onChange(field.id, value)}
						min={field.validation?.min}
						max={field.validation?.max}
					/>
				);

			case "date":
				return (
					<DateInput
						{...commonProps}
						value={
							values[field.id] ? new Date(values[field.id] as string) : null
						}
						onChange={(value) => onChange(field.id, value?.toISOString() || "")}
						valueFormat="DD/MM/YYYY"
					/>
				);

			case "select":
				return (
					<Select
						{...commonProps}
						data={field.options || []}
						value={(values[field.id] as string) || null}
						onChange={(value) => onChange(field.id, value || "")}
					/>
				);

			case "multiselect":
				return (
					<Select
						{...commonProps}
						data={field.options || []}
						value={(values[field.id] as string) || null}
						onChange={(value) => onChange(field.id, value || "")}
						multiple
					/>
				);

			case "textarea":
				return (
					<Textarea
						{...commonProps}
						value={(values[field.id] as string) || ""}
						onChange={(e) => onChange(field.id, e.target.value)}
						rows={4}
					/>
				);

			case "checkbox":
				return (
					<Checkbox
						label={field.label}
						description={field.description}
						error={errors[field.id]}
						checked={(values[field.id] as boolean) || false}
						onChange={(e) => onChange(field.id, e.target.checked)}
					/>
				);

			case "radio":
				return (
					<Stack gap="xs">
						<Text size="sm" fw={500}>
							{field.label}
							{field.required && <span style={{ color: "red" }}> *</span>}
						</Text>
						{field.description && (
							<Text size="xs" c="dimmed">
								{field.description}
							</Text>
						)}
						<Stack gap="xs">
							{field.options?.map((option) => (
								<Checkbox
									key={option}
									label={option}
									checked={(values[field.id] as string) === option}
									onChange={() => onChange(field.id, option)}
								/>
							))}
						</Stack>
						{errors[field.id] && (
							<Text size="xs" c="red">
								{errors[field.id]}
							</Text>
						)}
					</Stack>
				);

			default:
				return null;
		}
	};

	// Sort fields by order
	const sortedFields = [...fields].sort((a, b) => a.order - b.order);

	return (
		<Stack gap="md">
			{sortedFields.map((field) => (
				<div key={field.id}>{renderField(field)}</div>
			))}
		</Stack>
	);
};
