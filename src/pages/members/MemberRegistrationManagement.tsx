import {
	ActionIcon,
	Badge,
	Button,
	Group,
	Modal,
	Paper,
	Stack,
	Table,
	Tabs,
	Text,
	Textarea,
	Title,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCreate } from "@refinedev/core";
import { IconCheck, IconEye, IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import {
	MARITAL_STATUS_OPTIONS,
	MEMBER_REGISTRATION_STATUS_OPTIONS,
} from "@/config/constants";
import type {
	MemberRegistration,
	MemberRegistrationStatus,
	MemberStatus,
} from "@/types";
import { MemberRegistrationStatus as StatusEnum } from "@/types";

/**
 * Member Registration Management Page
 * Allows admins, leaders, and secretaries to approve or deny member registrations
 *
 * Single Responsibility: Manages pending member registration approvals
 */
export const MemberRegistrationManagement = () => {
	const { mutate: createMember } = useCreate();
	const [activeTab, setActiveTab] = useState<string | null>("pending");
	const [pendingRegistrations, setPendingRegistrations] = useState<
		MemberRegistration[]
	>([]);
	const [approvedRegistrations, setApprovedRegistrations] = useState<
		MemberRegistration[]
	>([]);
	const [deniedRegistrations, setDeniedRegistrations] = useState<
		MemberRegistration[]
	>([]);
	const [selectedRegistration, setSelectedRegistration] =
		useState<MemberRegistration | null>(null);
	const [denyReason, setDenyReason] = useState("");

	const [
		detailsModalOpened,
		{ open: openDetailsModal, close: closeDetailsModal },
	] = useDisclosure(false);
	const [denyModalOpened, { open: openDenyModal, close: closeDenyModal }] =
		useDisclosure(false);

	const loadData = useCallback(() => {
		// Load registrations from localStorage
		const registrations = JSON.parse(
			localStorage.getItem("memberRegistrations") || "[]",
		) as MemberRegistration[];

		setPendingRegistrations(
			registrations.filter((reg) => reg.status === StatusEnum.PENDING),
		);
		setApprovedRegistrations(
			registrations.filter((reg) => reg.status === StatusEnum.APPROVED),
		);
		setDeniedRegistrations(
			registrations.filter((reg) => reg.status === StatusEnum.DENIED),
		);
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleViewDetails = (registration: MemberRegistration) => {
		setSelectedRegistration(registration);
		openDetailsModal();
	};

	const handleApprove = (registration: MemberRegistration) => {
		modals.openConfirmModal({
			title: "Aprovar Cadastro de Membro",
			children: (
				<Text size="sm">
					Tem certeza que deseja aprovar o cadastro de{" "}
					<strong>{registration.name}</strong>?
					<br />
					<br />
					Um novo membro será criado no sistema com status "Visitante".
				</Text>
			),
			labels: { confirm: "Aprovar", cancel: "Cancelar" },
			confirmProps: { color: "green" },
			onConfirm: () => confirmApproval(registration),
		});
	};

	const confirmApproval = (registration: MemberRegistration) => {
		try {
			const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

			// Update registration status
			const registrations = JSON.parse(
				localStorage.getItem("memberRegistrations") || "[]",
			) as MemberRegistration[];

			const updatedRegistrations = registrations.map((reg) => {
				if (reg.id === registration.id) {
					return {
						...reg,
						status: StatusEnum.APPROVED,
						approvedAt: new Date().toISOString(),
						approvedBy: currentUser.id,
					};
				}
				return reg;
			});

			localStorage.setItem(
				"memberRegistrations",
				JSON.stringify(updatedRegistrations),
			);

			// Create new member using dataProvider (handles localStorage merge automatically)
			const memberData = {
				name: registration.name,
				email: registration.email,
				phone: registration.phone,
				birthDate: registration.birthDate,
				address: registration.address
					? {
							street: registration.address || "",
							number: "",
							city: registration.city || "",
							state: registration.state || "",
							zipCode: registration.zipCode || "",
						}
					: undefined,
				photo: undefined,
				status: "visitor" as MemberStatus,
				tags: [],
				customFields: {
					registrationId: registration.id,
					maritalStatus: registration.maritalStatus,
					gender: registration.gender,
					notes: registration.notes,
				},
			};

			createMember(
				{
					resource: "members",
					values: memberData,
				},
				{
					onSuccess: () => {
						// Reload data
						loadData();

						notifications.show({
							title: "Cadastro aprovado!",
							message: `${registration.name} foi aprovado e adicionado como membro visitante.`,
							color: "green",
							icon: <IconCheck />,
						});
					},
					onError: () => {
						notifications.show({
							title: "Erro ao criar membro",
							message: "Ocorreu um erro ao criar o membro. Tente novamente.",
							color: "red",
							icon: <IconX />,
						});
					},
				},
			);
		} catch (error) {
			notifications.show({
				title: "Erro ao aprovar",
				message: "Ocorreu um erro ao aprovar o cadastro. Tente novamente.",
				color: "red",
				icon: <IconX />,
			});
		}
	};

	const handleDeny = (registration: MemberRegistration) => {
		setSelectedRegistration(registration);
		setDenyReason("");
		openDenyModal();
	};

	const confirmDeny = () => {
		if (!selectedRegistration) return;

		try {
			const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

			// Update registration status
			const registrations = JSON.parse(
				localStorage.getItem("memberRegistrations") || "[]",
			) as MemberRegistration[];

			const updatedRegistrations = registrations.map((reg) => {
				if (reg.id === selectedRegistration.id) {
					return {
						...reg,
						status: StatusEnum.DENIED,
						deniedAt: new Date().toISOString(),
						deniedBy: currentUser.id,
						denialReason: denyReason || "Não especificado",
					};
				}
				return reg;
			});

			localStorage.setItem(
				"memberRegistrations",
				JSON.stringify(updatedRegistrations),
			);

			// Reload data
			loadData();
			closeDenyModal();

			notifications.show({
				title: "Cadastro negado",
				message: `O cadastro de ${selectedRegistration.name} foi negado.`,
				color: "yellow",
			});
		} catch (error) {
			notifications.show({
				title: "Erro ao negar",
				message: "Ocorreu um erro ao negar o cadastro. Tente novamente.",
				color: "red",
				icon: <IconX />,
			});
		}
	};

	const getStatusBadge = (status: MemberRegistrationStatus) => {
		const option = MEMBER_REGISTRATION_STATUS_OPTIONS.find(
			(opt) => opt.value === status,
		);
		return (
			<Badge color={option?.color || "gray"} variant="light">
				{option?.label || status}
			</Badge>
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<Paper p="md">
			<Group justify="space-between" mb="xl">
				<Title order={2}>Cadastros de Membros</Title>
			</Group>

			<Tabs value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value="pending">
						Pendentes
						{pendingRegistrations.length > 0 && (
							<Badge size="sm" variant="filled" color="yellow" ml="xs" circle>
								{pendingRegistrations.length}
							</Badge>
						)}
					</Tabs.Tab>
					<Tabs.Tab value="approved">Aprovados</Tabs.Tab>
					<Tabs.Tab value="denied">Negados</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="pending" pt="md">
					{pendingRegistrations.length === 0 ? (
						<Text c="dimmed" ta="center" py="xl">
							Nenhum cadastro pendente
						</Text>
					) : (
						<Table striped highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Nome</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th>Telefone</Table.Th>
									<Table.Th>Data do Cadastro</Table.Th>
									<Table.Th>Ações</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{pendingRegistrations.map((registration) => (
									<Table.Tr key={registration.id}>
										<Table.Td>{registration.name}</Table.Td>
										<Table.Td>{registration.email}</Table.Td>
										<Table.Td>{registration.phone}</Table.Td>
										<Table.Td>{formatDate(registration.registeredAt)}</Table.Td>
										<Table.Td>
											<Group gap="xs">
												<Tooltip label="Ver detalhes">
													<ActionIcon
														variant="light"
														color="blue"
														onClick={() => handleViewDetails(registration)}
													>
														<IconEye size={18} />
													</ActionIcon>
												</Tooltip>
												<Tooltip label="Aprovar">
													<ActionIcon
														variant="light"
														color="green"
														onClick={() => handleApprove(registration)}
													>
														<IconCheck size={18} />
													</ActionIcon>
												</Tooltip>
												<Tooltip label="Negar">
													<ActionIcon
														variant="light"
														color="red"
														onClick={() => handleDeny(registration)}
													>
														<IconX size={18} />
													</ActionIcon>
												</Tooltip>
											</Group>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}
				</Tabs.Panel>

				<Tabs.Panel value="approved" pt="md">
					{approvedRegistrations.length === 0 ? (
						<Text c="dimmed" ta="center" py="xl">
							Nenhum cadastro aprovado
						</Text>
					) : (
						<Table striped highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Nome</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th>Status</Table.Th>
									<Table.Th>Data de Aprovação</Table.Th>
									<Table.Th>Ações</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{approvedRegistrations.map((registration) => (
									<Table.Tr key={registration.id}>
										<Table.Td>{registration.name}</Table.Td>
										<Table.Td>{registration.email}</Table.Td>
										<Table.Td>{getStatusBadge(registration.status)}</Table.Td>
										<Table.Td>
											{registration.approvedAt
												? formatDate(registration.approvedAt)
												: "-"}
										</Table.Td>
										<Table.Td>
											<Tooltip label="Ver detalhes">
												<ActionIcon
													variant="light"
													color="blue"
													onClick={() => handleViewDetails(registration)}
												>
													<IconEye size={18} />
												</ActionIcon>
											</Tooltip>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}
				</Tabs.Panel>

				<Tabs.Panel value="denied" pt="md">
					{deniedRegistrations.length === 0 ? (
						<Text c="dimmed" ta="center" py="xl">
							Nenhum cadastro negado
						</Text>
					) : (
						<Table striped highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Nome</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th>Status</Table.Th>
									<Table.Th>Data da Negação</Table.Th>
									<Table.Th>Ações</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{deniedRegistrations.map((registration) => (
									<Table.Tr key={registration.id}>
										<Table.Td>{registration.name}</Table.Td>
										<Table.Td>{registration.email}</Table.Td>
										<Table.Td>{getStatusBadge(registration.status)}</Table.Td>
										<Table.Td>
											{registration.deniedAt
												? formatDate(registration.deniedAt)
												: "-"}
										</Table.Td>
										<Table.Td>
											<Tooltip label="Ver detalhes">
												<ActionIcon
													variant="light"
													color="blue"
													onClick={() => handleViewDetails(registration)}
												>
													<IconEye size={18} />
												</ActionIcon>
											</Tooltip>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}
				</Tabs.Panel>
			</Tabs>

			{/* Details Modal */}
			<Modal
				opened={detailsModalOpened}
				onClose={closeDetailsModal}
				title="Detalhes do Cadastro"
				size="lg"
			>
				{selectedRegistration && (
					<Stack gap="md">
						<div>
							<Text size="sm" fw={500} c="dimmed">
								Nome Completo
							</Text>
							<Text>{selectedRegistration.name}</Text>
						</div>
						<div>
							<Text size="sm" fw={500} c="dimmed">
								Email
							</Text>
							<Text>{selectedRegistration.email}</Text>
						</div>
						<div>
							<Text size="sm" fw={500} c="dimmed">
								Telefone
							</Text>
							<Text>{selectedRegistration.phone}</Text>
						</div>
						<div>
							<Text size="sm" fw={500} c="dimmed">
								Data de Nascimento
							</Text>
							<Text>
								{new Date(selectedRegistration.birthDate).toLocaleDateString(
									"pt-BR",
								)}
							</Text>
						</div>
						{selectedRegistration.maritalStatus && (
							<div>
								<Text size="sm" fw={500} c="dimmed">
									Estado Civil
								</Text>
								<Text>
									{
										MARITAL_STATUS_OPTIONS.find(
											(opt) => opt.value === selectedRegistration.maritalStatus,
										)?.label
									}
								</Text>
							</div>
						)}
						{selectedRegistration.gender && (
							<div>
								<Text size="sm" fw={500} c="dimmed">
									Gênero
								</Text>
								<Text>
									{selectedRegistration.gender === "male"
										? "Masculino"
										: selectedRegistration.gender === "female"
											? "Feminino"
											: "Outro"}
								</Text>
							</div>
						)}
						{selectedRegistration.address && (
							<div>
								<Text size="sm" fw={500} c="dimmed">
									Endereço
								</Text>
								<Text>
									{selectedRegistration.address}
									{selectedRegistration.city &&
										`, ${selectedRegistration.city}`}
									{selectedRegistration.state &&
										` - ${selectedRegistration.state}`}
									{selectedRegistration.zipCode &&
										` - CEP: ${selectedRegistration.zipCode}`}
								</Text>
							</div>
						)}
						{selectedRegistration.notes && (
							<div>
								<Text size="sm" fw={500} c="dimmed">
									Observações
								</Text>
								<Text>{selectedRegistration.notes}</Text>
							</div>
						)}
						<div>
							<Text size="sm" fw={500} c="dimmed">
								Status
							</Text>
							{getStatusBadge(selectedRegistration.status)}
						</div>
						<div>
							<Text size="sm" fw={500} c="dimmed">
								Aceite LGPD
							</Text>
							<Text>
								{selectedRegistration.acceptedTerms ? "Sim" : "Não"} -{" "}
								{formatDate(selectedRegistration.acceptedAt)}
							</Text>
						</div>
						{selectedRegistration.denialReason && (
							<div>
								<Text size="sm" fw={500} c="dimmed">
									Motivo da Negação
								</Text>
								<Text>{selectedRegistration.denialReason}</Text>
							</div>
						)}
					</Stack>
				)}
			</Modal>

			{/* Deny Modal */}
			<Modal
				opened={denyModalOpened}
				onClose={closeDenyModal}
				title="Negar Cadastro"
			>
				<Stack gap="md">
					<Text size="sm">
						Tem certeza que deseja negar o cadastro de{" "}
						<strong>{selectedRegistration?.name}</strong>?
					</Text>
					<Textarea
						label="Motivo da negação (opcional)"
						placeholder="Descreva o motivo..."
						value={denyReason}
						onChange={(e) => setDenyReason(e.currentTarget.value)}
						minRows={3}
					/>
					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={closeDenyModal}>
							Cancelar
						</Button>
						<Button color="red" onClick={confirmDeny}>
							Confirmar Negação
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Paper>
	);
};

export default MemberRegistrationManagement;
