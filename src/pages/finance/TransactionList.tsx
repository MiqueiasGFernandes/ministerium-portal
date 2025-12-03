import { useTable } from '@refinedev/react-table';
import { ColumnDef, flexRender } from '@tanstack/react-table';
import { useNavigation } from '@refinedev/core';
import {
  Box,
  Group,
  Button,
  Table,
  Pagination,
  Select,
  Badge,
  ActionIcon,
  Stack,
  Title,
  Paper,
  Grid,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Transaction, TransactionType } from '@/types';
import { TRANSACTION_CATEGORIES } from '@/config/constants';
import dayjs from 'dayjs';

export const TransactionList = () => {
  const { create, edit } = useNavigation();

  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: 'date',
        header: 'Data',
        accessorKey: 'date',
        cell: ({ getValue }) => dayjs(getValue() as string).format('DD/MM/YYYY'),
      },
      {
        id: 'type',
        header: 'Tipo',
        accessorKey: 'type',
        cell: ({ getValue }) => {
          const type = getValue() as TransactionType;
          return (
            <Badge
              color={type === 'income' ? 'green' : 'red'}
              variant="light"
              leftSection={
                type === 'income' ? <IconTrendingUp size="0.8rem" /> : <IconTrendingDown size="0.8rem" />
              }
            >
              {type === 'income' ? 'Entrada' : 'Saída'}
            </Badge>
          );
        },
      },
      {
        id: 'category',
        header: 'Categoria',
        accessorKey: 'category',
        cell: ({ getValue }) => {
          const category = getValue() as string;
          const cat = TRANSACTION_CATEGORIES.find((c) => c.value === category);
          return <Text size="sm">{cat?.label || category}</Text>;
        },
      },
      {
        id: 'description',
        header: 'Descrição',
        accessorKey: 'description',
        cell: ({ getValue }) => (
          <Text size="sm" lineClamp={1}>
            {getValue() as string}
          </Text>
        ),
      },
      {
        id: 'amount',
        header: 'Valor',
        accessorKey: 'amount',
        cell: ({ row, getValue }) => {
          const type = row.original.type;
          const amount = getValue() as number;
          return (
            <Text size="sm" fw={600} c={type === 'income' ? 'green' : 'red'}>
              {type === 'income' ? '+' : '-'} {formatCurrency(amount)}
            </Text>
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
              color="orange"
              onClick={() => edit('transactions', row.original.id)}
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
    [edit]
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
      resource: 'transactions',
      filters: {
        permanent: [
          ...(typeFilter ? [{ field: 'type', operator: 'eq', value: typeFilter }] : []),
          ...(categoryFilter ? [{ field: 'category', operator: 'eq', value: categoryFilter }] : []),
        ],
      },
    },
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Financeiro</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={() => create('transactions')}>
          Nova Transação
        </Button>
      </Group>

      {/* Filters */}
      <Paper shadow="xs" p="md" radius="md" withBorder>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              placeholder="Tipo"
              data={[
                { value: 'income', label: 'Entrada' },
                { value: 'expense', label: 'Saída' },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              placeholder="Categoria"
              data={TRANSACTION_CATEGORIES}
              value={categoryFilter}
              onChange={setCategoryFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <DatePickerInput
              type="range"
              placeholder="Período"
              value={dateRange}
              onChange={setDateRange}
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

export default TransactionList;
