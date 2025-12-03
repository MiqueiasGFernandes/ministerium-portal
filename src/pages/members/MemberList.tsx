import { useTable } from '@refinedev/react-table';
import { ColumnDef, flexRender } from '@tanstack/react-table';
import { useNavigation } from '@refinedev/core';
import {
  Box,
  Group,
  Button,
  Table,
  Pagination,
  TextInput,
  Select,
  Badge,
  Avatar,
  ActionIcon,
  Stack,
  Title,
  Paper,
  MultiSelect,
  Grid,
  Text,
} from '@mantine/core';
import {
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Member, MemberStatus } from '@/types';
import { MEMBER_STATUS_OPTIONS } from '@/config/constants';
import dayjs from 'dayjs';

export const MemberList = () => {
  const { create, edit, show } = useNavigation();

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);

  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        id: 'photo',
        header: 'Foto',
        accessorKey: 'photo',
        cell: ({ getValue }) => (
          <Avatar src={getValue() as string} radius="xl" size="md" />
        ),
      },
      {
        id: 'name',
        header: 'Nome',
        accessorKey: 'name',
        cell: ({ getValue }) => (
          <Text size="sm" fw={500}>
            {getValue() as string}
          </Text>
        ),
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        cell: ({ getValue }) => (
          <Text size="sm" c="dimmed">
            {getValue() as string}
          </Text>
        ),
      },
      {
        id: 'phone',
        header: 'Telefone',
        accessorKey: 'phone',
        cell: ({ getValue }) => (
          <Text size="sm" c="dimmed">
            {getValue() as string}
          </Text>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue() as MemberStatus;
          const option = MEMBER_STATUS_OPTIONS.find((o) => o.value === status);
          return (
            <Badge color={option?.color || 'gray'} variant="light">
              {option?.label || status}
            </Badge>
          );
        },
      },
      {
        id: 'tags',
        header: 'Tags',
        accessorKey: 'tags',
        cell: ({ getValue }) => {
          const tags = getValue() as string[];
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
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => (
          <Group gap="xs">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => show('members', row.original.id)}
            >
              <IconEye size="1rem" />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="orange"
              onClick={() => edit('members', row.original.id)}
            >
              <IconEdit size="1rem" />
            </ActionIcon>
            <ActionIcon variant="light" color="red">
              <IconTrash size="1rem" />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    [show, edit]
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
    setPageSize,
    getState,
  } = useTable({
    columns,
    refineCoreProps: {
      resource: 'members',
      filters: {
        permanent: [
          ...(search ? [{ field: 'search', operator: 'contains', value: search }] : []),
          ...(statusFilter ? [{ field: 'status', operator: 'eq', value: statusFilter }] : []),
          ...(tagsFilter.length > 0
            ? [{ field: 'tags', operator: 'in', value: tagsFilter }]
            : []),
        ],
      },
    },
  });

  const availableTags = [
    'Líder',
    'Diácono',
    'Professor',
    'Músico',
    'Jovem',
    'Criança',
    'Família Nova',
    'Batizado',
    'Membro',
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Membros</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={() => create('members')}>
          Novo Membro
        </Button>
      </Group>

      {/* Filters */}
      <Paper shadow="xs" p="md" radius="md" withBorder>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Buscar por nome, email..."
              leftSection={<IconSearch size="1rem" />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              placeholder="Filtrar por status"
              data={MEMBER_STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MultiSelect
              placeholder="Filtrar por tags"
              data={availableTags}
              value={tagsFilter}
              onChange={setTagsFilter}
              clearable
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper shadow="xs" radius="md" withBorder>
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover>
            <Table.Thead>
              {getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>

        <Group justify="space-between" p="md">
          <Select
            data={['10', '20', '50', '100']}
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
