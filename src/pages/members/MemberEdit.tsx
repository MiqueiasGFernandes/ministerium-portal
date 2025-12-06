import {
	Box,
	Button,
	FileInput,
	Grid,
	Group,
	Image,
	LoadingOverlay,
	MultiSelect,
	Paper,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useGo } from "@refinedev/core";
import { useForm } from "@refinedev/mantine";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { MEMBER_STATUS_OPTIONS } from "@/config/constants";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Member } from "@/types";

export const MemberEdit = () => {
	const go = useGo();
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);

	const {
		saveButtonProps,
		getInputProps,
		setFieldValue,
		values,
		refineCore: { formLoading, queryResult },
	} = useForm<Member>({
		refineCoreProps: {
			action: "edit",
			resource: "members",
			onMutationSuccess: () => {
				notifications.show({
					title: "Sucesso!",
					message: "Membro atualizado com sucesso",
					color: "green",
				});
				go({ to: "/members" });
			},
		},
		validate: {
			name: (value: string) =>
				value.length < 2 ? "Nome deve ter pelo menos 2 caracteres" : null,
			email: (value: string) =>
				value && !/^\S+@\S+$/.test(value) ? "Email inválido" : null,
			phone: (value: string) =>
				value && value.length < 10 ? "Telefone inválido" : null,
		},
	});

	const availableTags = [
		"Líder",
		"Diácono",
		"Professor",
		"Músico",
		"Jovem",
		"Criança",
		"Família Nova",
		"Batizado",
		"Membro",
	];

	const brazilianStates = [
		"AC",
		"AL",
		"AP",
		"AM",
		"BA",
		"CE",
		"DF",
		"ES",
		"GO",
		"MA",
		"MT",
		"MS",
		"MG",
		"PA",
		"PB",
		"PR",
		"PE",
		"PI",
		"RJ",
		"RN",
		"RS",
		"RO",
		"RR",
		"SC",
		"SP",
		"SE",
		"TO",
	];

	// Initialize form values when data is loaded
	useEffect(() => {
		const data = queryResult?.data?.data;
		if (data && Object.keys(values).length === 0) {
			// Convert birthDate string to Date object if needed
			if (data.birthDate && typeof data.birthDate === "string") {
				setFieldValue("birthDate", new Date(data.birthDate));
			}
			// Set all other fields
			Object.keys(data).forEach((key) => {
				if (key !== "birthDate") {
					setFieldValue(key as keyof Member, data[key as keyof Member]);
				}
			});
		}
	}, [queryResult?.data?.data, values, setFieldValue]);

	useEffect(() => {
		if (values?.photo) {
			setPhotoPreview(values.photo as string);
		}
	}, [values?.photo]);

	const handlePhotoChange = (file: File | null) => {
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64 = reader.result as string;
				setPhotoPreview(base64);
				setFieldValue("photo", base64);
			};
			reader.readAsDataURL(file);
		} else {
			setPhotoPreview(null);
			setFieldValue("photo", "");
		}
	};

	const isLoading = queryResult?.isLoading;

	return (
		<Stack gap="lg" pos="relative">
			<LoadingOverlay visible={isLoading || false} />

			<Group justify="space-between">
				<Title order={2}>Editar Membro</Title>
			</Group>

			<form>
				<Stack gap="lg">
					{/* Personal Information */}
					<Paper shadow="xs" p="lg" radius="md" withBorder>
						<Title order={4} mb="md">
							Informações Pessoais
						</Title>

						<Grid>
							{/* Photo Upload */}
							<Grid.Col span={12}>
								<Stack gap="sm">
									<Text size="sm" fw={500}>
										Foto
									</Text>
									<Group align="flex-start">
										{photoPreview && (
											<Box w={120} h={120}>
												<Image
													src={photoPreview}
													alt="Preview"
													radius="md"
													fit="cover"
													h={120}
													w={120}
												/>
											</Box>
										)}
										<FileInput
											placeholder="Selecione uma foto"
											leftSection={<IconUpload size="1rem" />}
											accept="image/png,image/jpeg,image/jpg"
											onChange={handlePhotoChange}
											clearable
										/>
									</Group>
								</Stack>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<TextInput
									label="Nome Completo"
									placeholder="João da Silva"
									required
									{...getInputProps("name")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<DateInput
									label="Data de Nascimento"
									placeholder="Selecione a data"
									valueFormat="DD/MM/YYYY"
									{...getInputProps("birthDate")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<TextInput
									label="Email"
									placeholder="joao@email.com"
									{...getInputProps("email")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<TextInput
									label="Telefone"
									placeholder="(11) 99999-9999"
									{...getInputProps("phone")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<Select
									label="Status"
									placeholder="Selecione o status"
									data={MEMBER_STATUS_OPTIONS}
									required
									{...getInputProps("status")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<MultiSelect
									label="Tags"
									placeholder="Selecione as tags"
									data={availableTags}
									{...getInputProps("tags")}
								/>
							</Grid.Col>
						</Grid>
					</Paper>

					{/* Address */}
					<Paper shadow="xs" p="lg" radius="md" withBorder>
						<Title order={4} mb="md">
							Endereço
						</Title>

						<Grid>
							<Grid.Col span={{ base: 12, md: 8 }}>
								<TextInput
									label="Rua"
									placeholder="Rua das Flores"
									{...getInputProps("address.street")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label="Número"
									placeholder="123"
									{...getInputProps("address.number")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<TextInput
									label="Complemento"
									placeholder="Apto 45"
									{...getInputProps("address.complement")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<TextInput
									label="CEP"
									placeholder="12345-678"
									{...getInputProps("address.zipCode")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 8 }}>
								<TextInput
									label="Cidade"
									placeholder="São Paulo"
									{...getInputProps("address.city")}
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 4 }}>
								<Select
									label="Estado"
									placeholder="SP"
									data={brazilianStates}
									{...getInputProps("address.state")}
									searchable
								/>
							</Grid.Col>
						</Grid>
					</Paper>

					{/* Actions */}
					<Group justify="flex-end">
						<Button variant="default" onClick={() => go({ to: "/members" })}>
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
				</Stack>
			</form>
		</Stack>
	);
};

export default MemberEdit;
