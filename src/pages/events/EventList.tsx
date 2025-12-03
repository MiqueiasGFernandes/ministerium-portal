import { useTable } from '@refinedev/react-table';
import { ColumnDef, flexRender } from '@tanstack/react-table';
import { useNavigation } from '@refinedev/core';
import { Box, Group, Button, Table, Pagination, Select, Badge, ActionIcon, Stack, Title, Paper, Text } from '@mantine/core';
import { IconPlus, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Event } from '@/types';
import { EVENT_STATUS_OPTIONS } from '@/config/constants';
import dayjs from 'dayjs';

export const EventList = () => {
  const { create, edit, show } = useNavigation();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const columns = useMemo<ColumnDef<Event>[]>(() => [
    { id: 'title', header: 'Título', accessorKey: 'title' },
    { id: 'date', header: 'Data', accessorKey: 'date', cell: ({ getValue }) => dayjs(getValue() as string).format('DD/MM/YYYY') },
    { id: 'time', header: 'Horário', accessorKey: 'time' },
    { id: 'location', header: 'Local', accessorKey: 'location', cell: ({ getValue }) => <Text size="sm" lineClamp={1}>{getValue() as string}</Text> },
    { id: 'status', header: 'Status', accessorKey: 'status', cell: ({ getValue }) => {
      const status = getValue() as string;
      const opt = EVENT_STATUS_OPTIONS.find(o => o.value === status);
      return <Badge color={opt?.color} variant="light">{opt?.label}</Badge>;
    }},
    { id: 'attendees', header: 'Inscritos', accessorKey: 'attendees', cell: ({ getValue }) => <Badge>{(getValue() as any[]).length}</Badge> },
    { id: 'actions', header: 'Ações', cell: ({ row }) => (
      <Group gap="xs">
        <ActionIcon variant="light" color="blue" onClick={() => show('events', row.original.id)}><IconEye size="1rem" /></ActionIcon>
        <ActionIcon variant="light" color="orange" onClick={() => edit('events', row.original.id)}><IconEdit size="1rem" /></ActionIcon>
        <ActionIcon variant="light" color="red"><IconTrash size="1rem" /></ActionIcon>
      </Group>
    )},
  ], [show, edit]);

  const { getHeaderGroups, getRowModel, refineCore: { setCurrent, pageCount, current }, setPageSize, getState } = useTable({
    columns,
    refineCoreProps: {
      resource: 'events',
      filters: { permanent: [...(statusFilter ? [{ field: 'status', operator: 'eq', value: statusFilter }] : [])] },
    },
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Eventos</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={() => create('events')}>Novo Evento</Button>
      </Group>
      <Paper shadow="xs" p="md" radius="md" withBorder>
        <Select placeholder="Filtrar por status" data={EVENT_STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} clearable />
      </Paper>
      <Paper shadow="xs" radius="md" withBorder>
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover>
            <Table.Thead>{getHeaderGroups().map(hg => <Table.Tr key={hg.id}>{hg.headers.map(h => <Table.Th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</Table.Th>)}</Table.Tr>)}</Table.Thead>
            <Table.Tbody>{getRowModel().rows.map(row => <Table.Tr key={row.id}>{row.getVisibleCells().map(cell => <Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>)}</Table.Tr>)}</Table.Tbody>
          </Table>
        </Box>
        <Group justify="space-between" p="md">
          <Select data={['10', '20', '50']} value={String(getState().pagination.pageSize)} onChange={(v) => setPageSize(Number(v))} w={100} />
          <Pagination total={pageCount} value={current} onChange={setCurrent} />
        </Group>
      </Paper>
    </Stack>
  );
};
export default EventList;
