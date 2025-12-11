import {
	ActionIcon,
	Badge,
	Button,
	Group,
	Modal,
	Paper,
	Select,
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
import {
	IconCheck,
	IconCopy,
	IconEdit,
	IconUserOff,
	IconUserX,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import {
	USER_ACCESS_STATUS_OPTIONS,
	USER_ROLE_OPTIONS,
} from "@/config/constants";
import { gradientButtonStyles } from "@/styles/components";
import type { AccessRequest, User, UserAccessStatus, UserRole } from "@/types";

export const UserManagement = () => {
	const [activeTab, setActiveTab] = useState<string | null>("pending");
	const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
	const [activeUsers, setActiveUsers] = useState<User[]>([]);
	const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(
		null,
	);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [selectedRole, setSelectedRole] = useState<string>("");
	const [denyReason, setDenyReason] = useState("");
	const [
		approveModalOpened,
		{ open: openApproveModal, close: closeApproveModal },
	] = useDisclosure(false);
	const [denyModalOpened, { open: openDenyModal, close: closeDenyModal }] =
		useDisclosure(false);
	const [roleModalOpened, { open: openRoleModal, close: closeRoleModal }] =
		useDisclosure(false);

	const loadData = useCallback(() => {
		// Load pending requests from localStorage
		const requests = JSON.parse(
			localStorage.getItem("accessRequests") || "[]",
		) as AccessRequest[];
		setPendingRequests(requests.filter((req) => req.status === "pending"));

		// Load active users from localStorage
		const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
		setActiveUsers(
			users.filter(
				(user) => user.status === "active" || user.status === "revoked",
			),
		);
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleApprove = (request: AccessRequest) => {
		setSelectedRequest(request);
		setSelectedRole("volunteer"); // Default role
		openApproveModal();
	};

	const confirmApproval = () => {
		if (!selectedRequest || !selectedRole) return;

		const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

		// Update request status
		const requests = JSON.parse(
			localStorage.getItem("accessRequests") || "[]",
		) as AccessRequest[];
		const updatedRequests = requests.map((req) =>
			req.id === selectedRequest.id
				? {
						...req,
						status: "active" as UserAccessStatus,
						respondedAt: new Date().toISOString(),
						respondedBy: currentUser.id,
						assignedRole: selectedRole as UserRole,
					}
				: req,
		);
		localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));

		// Create new user
		const newUser: User = {
			id: `user-${Date.now()}`,
			email: selectedRequest.email,
			name: selectedRequest.name,
			role: selectedRole as UserRole,
			tenantId: selectedRequest.tenantId,
			status: "active" as UserAccessStatus,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
		localStorage.setItem("users", JSON.stringify([...users, newUser]));

		notifications.show({
			title: "Usuário aprovado!",
			message: `${selectedRequest.name} foi aprovado com sucesso.`,
			color: "green",
			icon: <IconCheck />,
		});

		closeApproveModal();
		loadData();
		setSelectedRequest(null);
		setSelectedRole("");
	};

	const handleDeny = (request: AccessRequest) => {
		setSelectedRequest(request);
		setDenyReason("");
		openDenyModal();
	};

	const confirmDeny = () => {
		if (!selectedRequest) return;

		const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

		const requests = JSON.parse(
			localStorage.getItem("accessRequests") || "[]",
		) as AccessRequest[];
		const updatedRequests = requests.map((req) =>
			req.id === selectedRequest.id
				? {
						...req,
						status: "denied" as UserAccessStatus,
						respondedAt: new Date().toISOString(),
						respondedBy: currentUser.id,
					}
				: req,
		);
		localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));

		notifications.show({
			title: "Solicitação negada",
			message: `A solicitação de ${selectedRequest.name} foi negada.`,
			color: "red",
			icon: <IconX />,
		});

		closeDenyModal();
		loadData();
		setSelectedRequest(null);
		setDenyReason("");
	};

	const handleChangeRole = (user: User) => {
		setSelectedUser(user);
		setSelectedRole(user.role);
		openRoleModal();
	};

	const confirmRoleChange = () => {
		if (!selectedUser || !selectedRole) return;

		const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

		// Prevent user from editing their own role
		if (selectedUser.id === currentUser.id) {
			notifications.show({
				title: "Operação não permitida",
				message: "Você não pode alterar seu próprio nível de acesso.",
				color: "red",
			});
			closeRoleModal();
			return;
		}

		const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
		const updatedUsers = users.map((user) =>
			user.id === selectedUser.id
				? {
						...user,
						role: selectedRole as UserRole,
						updatedAt: new Date().toISOString(),
					}
				: user,
		);
		localStorage.setItem("users", JSON.stringify(updatedUsers));

		notifications.show({
			title: "Papel atualizado!",
			message: `O papel de ${selectedUser.name} foi atualizado com sucesso.`,
			color: "green",
			icon: <IconCheck />,
		});

		closeRoleModal();
		loadData();
		setSelectedUser(null);
		setSelectedRole("");
	};

	const handleRevokeAccess = (user: User) => {
		const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

		// Prevent user from revoking their own access
		if (user.id === currentUser.id) {
			notifications.show({
				title: "Operação não permitida",
				message: "Você não pode revogar seu próprio acesso.",
				color: "red",
			});
			return;
		}

		modals.openConfirmModal({
			title: "Revogar acesso",
			children: (
				<Text size="sm">
					Tem certeza que deseja revogar o acesso de{" "}
					<strong>{user.name}</strong>? O usuário não conseguirá mais fazer
					login no sistema.
				</Text>
			),
			labels: { confirm: "Revogar", cancel: "Cancelar" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				const users = JSON.parse(
					localStorage.getItem("users") || "[]",
				) as User[];
				const updatedUsers = users.map((u) =>
					u.id === user.id
						? {
								...u,
								status: "revoked" as UserAccessStatus,
								updatedAt: new Date().toISOString(),
							}
						: u,
				);
				localStorage.setItem("users", JSON.stringify(updatedUsers));

				notifications.show({
					title: "Acesso revogado",
					message: `O acesso de ${user.name} foi revogado.`,
					color: "orange",
					icon: <IconUserOff />,
				});

				loadData();
			},
		});
	};

	const getRoleBadgeColor = (role: UserRole): string => {
		const colors: Record<UserRole, string> = {
			admin: "red",
			leader: "blue",
			financial: "green",
			secretary: "cyan",
			volunteer: "gray",
		};
		return colors[role] || "gray";
	};

	const getStatusBadge = (status: UserAccessStatus) => {
		const option = USER_ACCESS_STATUS_OPTIONS.find(
			(opt) => opt.value === status,
		);
		return (
			<Badge color={option?.color || "gray"} variant="light">
				{option?.label || status}
			</Badge>
		);
	};

	const getRoleLabel = (role: UserRole): string => {
		const option = USER_ROLE_OPTIONS.find((opt) => opt.value === role);
		return option?.label || role;
	};

	const handleCopyInviteLink = () => {
		const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
		const tenantId = currentUser.tenantId || "1";
		const inviteUrl = `${window.location.origin}/request-access/${tenantId}`;

		navigator.clipboard
			.writeText(inviteUrl)
			.then(() => {
				notifications.show({
					title: "Link copiado!",
					message:
						"O link de convite foi copiado para a área de transferência.",
					color: "green",
					icon: <IconCheck />,
				});
			})
			.catch(() => {
				notifications.show({
					title: "Erro ao copiar",
					message: "Não foi possível copiar o link. Tente novamente.",
					color: "red",
					icon: <IconX />,
				});
			});
	};

	return (
		<Paper p="md">
			<Group justify="space-between" mb="xl">
				<Title order={2}>Gestão de Usuários</Title>
				<Button
					leftSection={<IconCopy size={18} />}
					onClick={handleCopyInviteLink}
					styles={gradientButtonStyles}
				>
					Copiar Link de Convite
				</Button>
			</Group>

			<Tabs value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value="pending">
						Solicitações Pendentes
						{pendingRequests.length > 0 && (
							<Badge ml="xs" size="sm" variant="filled" color="yellow">
								{pendingRequests.length}
							</Badge>
						)}
					</Tabs.Tab>
					<Tabs.Tab value="active">Usuários Ativos</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="pending" pt="md">
					{pendingRequests.length === 0 ? (
						<Text c="dimmed" ta="center" py="xl">
							Nenhuma solicitação pendente
						</Text>
					) : (
						<Table striped highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Nome</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th>Telefone</Table.Th>
									<Table.Th>Motivo</Table.Th>
									<Table.Th>Data</Table.Th>
									<Table.Th>Ações</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{pendingRequests.map((request) => (
									<Table.Tr key={request.id}>
										<Table.Td>{request.name}</Table.Td>
										<Table.Td>{request.email}</Table.Td>
										<Table.Td>{request.phone || "-"}</Table.Td>
										<Table.Td>
											<Tooltip label={request.reason || "Sem motivo informado"}>
												<Text lineClamp={1} size="sm">
													{request.reason || "-"}
												</Text>
											</Tooltip>
										</Table.Td>
										<Table.Td>
											{new Date(request.requestedAt).toLocaleDateString(
												"pt-BR",
											)}
										</Table.Td>
										<Table.Td>
											<Group gap="xs">
												<Button
													size="xs"
													color="green"
													variant="filled"
													onClick={() => handleApprove(request)}
													leftSection={<IconCheck size={16} />}
												>
													Aprovar
												</Button>
												<Button
													size="xs"
													color="red"
													variant="light"
													onClick={() => handleDeny(request)}
													leftSection={<IconX size={16} />}
												>
													Negar
												</Button>
											</Group>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}
				</Tabs.Panel>

				<Tabs.Panel value="active" pt="md">
					{activeUsers.length === 0 ? (
						<Text c="dimmed" ta="center" py="xl">
							Nenhum usuário ativo
						</Text>
					) : (
						<Table striped highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Nome</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th>Papel</Table.Th>
									<Table.Th>Status</Table.Th>
									<Table.Th>Criado em</Table.Th>
									<Table.Th>Ações</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{activeUsers.map((user) => (
									<Table.Tr key={user.id}>
										<Table.Td>{user.name}</Table.Td>
										<Table.Td>{user.email}</Table.Td>
										<Table.Td>
											<Badge
												color={getRoleBadgeColor(user.role)}
												variant="light"
											>
												{getRoleLabel(user.role)}
											</Badge>
										</Table.Td>
										<Table.Td>{getStatusBadge(user.status)}</Table.Td>
										<Table.Td>
											{new Date(user.createdAt).toLocaleDateString("pt-BR")}
										</Table.Td>
										<Table.Td>
											<Group gap="xs">
												<Tooltip label="Alterar papel">
													<ActionIcon
														color="blue"
														variant="subtle"
														onClick={() => handleChangeRole(user)}
														disabled={user.status === "revoked"}
													>
														<IconEdit size={18} />
													</ActionIcon>
												</Tooltip>
												{user.status === "active" && (
													<Tooltip label="Revogar acesso">
														<ActionIcon
															color="red"
															variant="subtle"
															onClick={() => handleRevokeAccess(user)}
														>
															<IconUserX size={18} />
														</ActionIcon>
													</Tooltip>
												)}
											</Group>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}
				</Tabs.Panel>
			</Tabs>

			{/* Approve Modal */}
			<Modal
				opened={approveModalOpened}
				onClose={closeApproveModal}
				title="Aprovar Solicitação"
			>
				<Stack gap="md">
					<Text size="sm">
						Selecione o nível de acesso para{" "}
						<strong>{selectedRequest?.name}</strong>:
					</Text>

					<Select
						label="Nível de acesso"
						placeholder="Selecione um papel"
						data={USER_ROLE_OPTIONS.map((role) => ({
							value: role.value,
							label: `${role.label} - ${role.description}`,
						}))}
						value={selectedRole}
						onChange={(value) => setSelectedRole(value || "")}
						required
					/>

					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={closeApproveModal}>
							Cancelar
						</Button>
						<Button
							color="green"
							onClick={confirmApproval}
							disabled={!selectedRole}
						>
							Aprovar
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* Deny Modal */}
			<Modal
				opened={denyModalOpened}
				onClose={closeDenyModal}
				title="Negar Solicitação"
			>
				<Stack gap="md">
					<Text size="sm">
						Tem certeza que deseja negar a solicitação de{" "}
						<strong>{selectedRequest?.name}</strong>?
					</Text>

					<Textarea
						label="Motivo da negação (opcional)"
						placeholder="Informe o motivo da negação"
						value={denyReason}
						onChange={(e) => setDenyReason(e.currentTarget.value)}
						minRows={3}
					/>

					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={closeDenyModal}>
							Cancelar
						</Button>
						<Button color="red" onClick={confirmDeny}>
							Negar
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* Change Role Modal */}
			<Modal
				opened={roleModalOpened}
				onClose={closeRoleModal}
				title="Alterar Papel do Usuário"
			>
				<Stack gap="md">
					<Text size="sm">
						Alterar o nível de acesso de <strong>{selectedUser?.name}</strong>:
					</Text>

					<Select
						label="Nível de acesso"
						placeholder="Selecione um papel"
						data={USER_ROLE_OPTIONS.map((role) => ({
							value: role.value,
							label: `${role.label} - ${role.description}`,
						}))}
						value={selectedRole}
						onChange={(value) => setSelectedRole(value || "")}
						required
					/>

					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={closeRoleModal}>
							Cancelar
						</Button>
						<Button
							color="blue"
							onClick={confirmRoleChange}
							disabled={!selectedRole || selectedRole === selectedUser?.role}
						>
							Alterar
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Paper>
	);
};
