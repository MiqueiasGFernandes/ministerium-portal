import { useForm } from '@refinedev/mantine';
import { TextInput, Select, Button, Group, Stack, Title, Paper, Grid, NumberInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Transaction, TransactionType } from '@/types';
import { TRANSACTION_CATEGORIES } from '@/config/constants';

export const TransactionCreate = () => {
  const { saveButtonProps, getInputProps, refineCore: { formLoading } } = useForm<Transaction>({
    initialValues: {
      type: TransactionType.INCOME,
      amount: 0,
      category: 'tithe',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <Stack gap="lg">
      <Title order={2}>Nova Transação</Title>
      <form>
        <Paper shadow="xs" p="lg" radius="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Tipo" required data={[
                { value: 'income', label: 'Entrada' },
                { value: 'expense', label: 'Saída' },
              ]} {...getInputProps('type')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Categoria" required data={TRANSACTION_CATEGORIES} {...getInputProps('category')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput label="Valor" required prefix="R$ " decimalScale={2} {...getInputProps('amount')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput label="Data" required valueFormat="DD/MM/YYYY" {...getInputProps('date')} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Descrição" required {...getInputProps('description')} />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="md">
            <Button variant="default">Cancelar</Button>
            <Button {...saveButtonProps} loading={formLoading}>Salvar</Button>
          </Group>
        </Paper>
      </form>
    </Stack>
  );
};
export default TransactionCreate;
