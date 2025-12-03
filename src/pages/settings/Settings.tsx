import {
	Box,
	Button,
	ColorInput,
	FileInput,
	Group,
	Image,
	Paper,
	Stack,
	Tabs,
	TextInput,
	Title,
} from "@mantine/core";
import { IconPalette, IconSettings, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { fakeData } from "@/utils/fakeData";

export const Settings = () => {
	const [tenant, setTenant] = useState(fakeData.tenant);
	const [logoPreview, setLogoPreview] = useState(tenant.logo);

	const handleSave = () => {
		console.log("Saving tenant settings:", tenant);
	};

	return (
		<Stack gap="lg">
			<Title order={2}>Configurações</Title>
			<Paper shadow="xs" radius="md" withBorder>
				<Tabs defaultValue="general">
					<Tabs.List>
						<Tabs.Tab
							value="general"
							leftSection={<IconSettings size="1rem" />}
						>
							Geral
						</Tabs.Tab>
						<Tabs.Tab
							value="appearance"
							leftSection={<IconPalette size="1rem" />}
						>
							Aparência
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="general" p="lg">
						<Stack gap="md">
							<TextInput
								label="Nome da Igreja"
								value={tenant.name}
								onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
							/>
							<TextInput
								label="Subdomínio"
								value={tenant.subdomain}
								onChange={(e) =>
									setTenant({ ...tenant, subdomain: e.target.value })
								}
							/>
							<Group justify="flex-end">
								<Button onClick={handleSave}>Salvar</Button>
							</Group>
						</Stack>
					</Tabs.Panel>

					<Tabs.Panel value="appearance" p="lg">
						<Stack gap="md">
							<Stack gap="sm">
								<TextInput label="Logo" disabled value={logoPreview || ""} />
								{logoPreview && (
									<Box w={120}>
										<Image
											src={logoPreview}
											alt="Logo"
											radius="md"
											fit="contain"
											h={80}
										/>
									</Box>
								)}
								<FileInput
									placeholder="Selecione um logo"
									leftSection={<IconUpload size="1rem" />}
									accept="image/*"
									onChange={(file) => {
										if (file) {
											const reader = new FileReader();
											reader.onloadend = () => {
												const base64 = reader.result as string;
												setLogoPreview(base64);
												setTenant({ ...tenant, logo: base64 });
											};
											reader.readAsDataURL(file);
										}
									}}
								/>
							</Stack>
							<ColorInput
								label="Cor Primária"
								value={tenant.primaryColor}
								onChange={(color) =>
									setTenant({ ...tenant, primaryColor: color })
								}
							/>
							<Group justify="flex-end">
								<Button onClick={handleSave}>Salvar</Button>
							</Group>
						</Stack>
					</Tabs.Panel>
				</Tabs>
			</Paper>
		</Stack>
	);
};
export default Settings;
