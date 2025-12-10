import {
	ActionIcon,
	Alert,
	Autocomplete,
	Avatar,
	Badge,
	Box,
	Button,
	CloseButton,
	Grid,
	Group,
	MultiSelect,
	Pagination,
	Paper,
	Select,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useDelete, useInvalidate, useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import {
	IconArrowDown,
	IconArrowUp,
	IconEdit,
	IconEye,
	IconLock,
	IconPlus,
	IconSearch,
	IconSelector,
	IconTrash,
} from "@tabler/icons-react";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { type KeyboardEvent, useCallback, useMemo, useState } from "react";
import { CanCreate, CanDelete, CanEdit } from "@/components/auth/Can";
import { MEMBER_STATUS_OPTIONS } from "@/config/constants";
import { usePermissions } from "@/hooks/usePermissions";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { Member, MemberStatus } from "@/types";

export const MemberList = () => {
	const { create, edit, show } = useNavigation();
	const { mutate: deleteMember } = useDelete();
	const invalidate = useInvalidate();
	const { isVolunteer, canView } = usePermissions();

	const handleDelete = useCallback(
		(id: string, name: string) => {
			modals.openConfirmModal({
				title: "Confirmar exclusão",
				children: (
					<Text size="sm">
						Tem certeza que deseja excluir o membro <strong>{name}</strong>?
						Esta ação não pode ser desfeita.
					</Text>
				),
				labels: { confirm: "Excluir", cancel: "Cancelar" },
				confirmProps: { color: "red" },
				onConfirm: () => {
					deleteMember(
						{
							resource: "members",
							id,
						},
						{
							onSuccess: () => {
								notifications.show({
									title: "Sucesso",
									message: "Membro excluído com sucesso!",
									color: "green",
								});
								invalidate({
									resource: "members",
									invalidates: ["list"],
								});
							},
							onError: () => {
								notifications.show({
									title: "Erro",
									message: "Erro ao excluir membro",
									color: "red",
								});
							},
						},
					);
				},
			});
		},
		[deleteMember, invalidate],
	);

	// Filters state
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string | undefined>(
		undefined,
	);
	const [tagsFilter, setTagsFilter] = useState<string[]>([]);

	// Search history
	const { history, addToHistory } = useSearchHistory("members-search-history");

	// Handle search submission on Enter key
	const handleSearchKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				const value = searchInput.trim();
				setSearchQuery(value);
				if (value) {
					addToHistory(value);
				}
			}
		},
		[searchInput, addToHistory],
	);

	// Handle search clear
	const handleClearSearch = useCallback(() => {
		setSearchInput("");
		setSearchQuery("");
	}, []);

	const columns = useMemo<ColumnDef<Member>[]>(
		() => [
			{
				id: "photo",
				header: "Foto",
				accessorKey: "photo",
				enableSorting: false,
				cell: ({ getValue }) => {
					const photo = getValue() as string;
					return <Avatar src={photo} radius="xl" size="md" />;
				},
			},
			{
				id: "name",
				header: "Nome",
				accessorKey: "name",
				enableSorting: true,
				cell: ({ getValue }) => {
					const name = getValue() as string;
					return (
						<Text size="sm" fw={500}>
							{name}
						</Text>
					);
				},
			},
			{
				id: "email",
				header: "Email",
				accessorKey: "email",
				enableSorting: true,
				cell: ({ getValue }) => {
					const email = getValue() as string;
					return (
						<Text size="sm" c="dimmed">
							{email}
						</Text>
					);
				},
			},
			{
				id: "phone",
				header: "Telefone",
				accessorKey: "phone",
				enableSorting: false,
				cell: ({ getValue }) => {
					const phone = getValue() as string;
					return (
						<Text size="sm" c="dimmed">
							{phone}
						</Text>
					);
				},
			},
			{
				id: "status",
				header: "Status",
				accessorKey: "status",
				enableSorting: true,
				cell: ({ getValue }) => {
					const status = getValue() as MemberStatus;
					const option = MEMBER_STATUS_OPTIONS.find((o) => o.value === status);
					return (
						<Badge color={option?.color || "gray"} variant="light">
							{option?.label || status}
						</Badge>
					);
				},
			},
			{
				id: "tags",
				header: "Tags",
				accessorKey: "tags",
				enableSorting: false,
				cell: ({ getValue }) => {
					const tags = getValue() as string[];
					if (!tags || tags.length === 0) return null;
					return (
						<Group gap="xs">
							{tags.slice(0, 2).map((tag) => (
								<Badge key={tag} size="sm" variant="dot">
									{tag}
								</Badge>
							))}
							{tags.length > 2 && (
								<Badge size="sm" variant="dot">
									+{tags.length - 2}
								</Badge>
							)}
						</Group>
					);
				},
			},
			{
				id: "actions",
				header: "Ações",
				enableSorting: false,
				cell: ({ row }) => (
					<Group gap="xs">
						<ActionIcon
							variant="light"
							color="blue"
							onClick={() => show("members", row.original.id)}
						>
							<IconEye size="1rem" />
						</ActionIcon>
						<CanEdit resource="members">
							<ActionIcon
								variant="light"
								color="orange"
								onClick={() => edit("members", row.original.id)}
							>
								<IconEdit size="1rem" />
							</ActionIcon>
						</CanEdit>
						<CanDelete resource="members">
							<ActionIcon
								variant="light"
								color="red"
								onClick={() => handleDelete(row.original.id, row.original.name)}
							>
								<IconTrash size="1rem" />
							</ActionIcon>
						</CanDelete>
					</Group>
				),
			},
		],
		[show, edit, handleDelete],
	);

	const {
		getHeaderGroups,
		getRowModel,
		refineCore: { setCurrent, pageCount, current, sorters, setSorters },
		setPageSize,
		getState,
	} = useTable({
		columns,
		refineCoreProps: {
			resource: "members",
			filters: {
				permanent: [
					...(searchQuery
						? [
								{
									field: "search",
									operator: "contains" as const,
									value: searchQuery,
								},
							]
						: []),
					...(statusFilter
						? [
								{
									field: "status",
									operator: "eq" as const,
									value: statusFilter,
								},
							]
						: []),
					...(tagsFilter.length > 0
						? [{ field: "tags", operator: "in" as const, value: tagsFilter }]
						: []),
				],
			},
		},
		enableSorting: true,
		manualSorting: true,
	});

	// Helper to get sort icon
	const getSortIcon = (columnId: string) => {
		const sort = sorters?.find((s) => s.field === columnId);
		if (!sort) return <IconSelector size="0.9rem" />;
		return sort.order === "asc" ? (
			<IconArrowUp size="0.9rem" />
		) : (
			<IconArrowDown size="0.9rem" />
		);
	};

	// Handle column sort
	const handleSort = useCallback(
		(columnId: string) => {
			const currentSort = sorters?.find((s) => s.field === columnId);

			if (!currentSort) {
				setSorters([{ field: columnId, order: "asc" }]);
			} else if (currentSort.order === "asc") {
				setSorters([{ field: columnId, order: "desc" }]);
			} else {
				setSorters([]);
			}
		},
		[sorters, setSorters],
	);

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

	// Protect member data from volunteers
	if (isVolunteer() || !canView("members")) {
		return (
			<Stack gap="lg">
				<Title order={2}>Membros</Title>
				<Alert
					icon={<IconLock size="1rem" />}
					title="Acesso Restrito"
					color="red"
				>
					Você não tem permissão para visualizar dados de membros. Esta área
					contém informações sensíveis e pessoais protegidas.
				</Alert>
			</Stack>
		);
	}

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>Membros</Title>
				<CanCreate resource="members">
					<Button
						leftSection={<IconPlus size="1rem" />}
						onClick={() => create("members")}
						styles={gradientButtonStyles}
					>
						Novo Membro
					</Button>
				</CanCreate>
			</Group>

			{/* Filters */}
			<Paper shadow="xs" p="md" radius="md" withBorder>
				<Grid>
					<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
						<Autocomplete
							placeholder="Buscar por nome, email... (Pressione Enter)"
							leftSection={<IconSearch size="1rem" />}
							value={searchInput}
							onChange={setSearchInput}
							onKeyDown={handleSearchKeyDown}
							data={history}
							rightSection={
								searchInput ? (
									<CloseButton
										size="sm"
										onClick={handleClearSearch}
										aria-label="Limpar busca"
									/>
								) : null
							}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
						<Select
							placeholder="Filtrar por status"
							data={MEMBER_STATUS_OPTIONS}
							value={statusFilter || null}
							onChange={(value) => setStatusFilter(value || undefined)}
							clearable
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
						<MultiSelect
							placeholder="Filtrar por tags"
							data={availableTags}
							value={tagsFilter}
							onChange={(value) => setTagsFilter(value || [])}
							clearable
						/>
					</Grid.Col>
				</Grid>
			</Paper>

			{/* Table */}
			<Paper shadow="xs" radius="md" withBorder>
				<Box style={{ overflowX: "auto" }}>
					<Table striped highlightOnHover>
						<Table.Thead>
							{getHeaderGroups().map((headerGroup) => (
								<Table.Tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const canSort =
											header.column.columnDef.enableSorting !== false;
										return (
											<Table.Th
												key={header.id}
												style={{
													cursor: canSort ? "pointer" : "default",
													userSelect: "none",
												}}
												onClick={() => canSort && handleSort(header.column.id)}
											>
												<Group gap="xs" wrap="nowrap">
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{canSort && getSortIcon(header.column.id)}
												</Group>
											</Table.Th>
										);
									})}
								</Table.Tr>
							))}
						</Table.Thead>
						<Table.Tbody>
							{getRowModel().rows.map((row) => (
								<Table.Tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<Table.Td key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</Table.Td>
									))}
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Box>

				<Group justify="space-between" p="md">
					<Select
						data={["10", "20", "50", "100"]}
						value={String(getState().pagination.pageSize)}
						onChange={(value) => setPageSize(Number(value))}
						w={100}
					/>
					<Pagination total={pageCount} value={current} onChange={setCurrent} />
				</Group>
			</Paper>
		</Stack>
	);
};

export default MemberList;
