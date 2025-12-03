import { useForm } from '@refinedev/mantine';
import { TextInput, Select, Button, Group, Stack, Title, Paper, Grid, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Schedule } from '@/types';

export const ScheduleCreate = () => {
  const { saveButtonProps, getInputProps, refineCore: { formLoading } } = useForm<Schedule>({
    initialValues: {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      ministryId: '',
      volunteers: [],
    },
  });

  // Mock ministries - in real app, fetch from API
  const ministries = [
    { value: 'ministry-1', label: 'Louvor e Adoração' },
    { value: 'ministry-2', label: 'Mídia' },
    { value: 'ministry-3', label: 'Recepção' },
  ];

  return (
    <Stack gap="lg">
      <Title order={2}>Nova Escala</Title>
      <form>
        <Paper shadow="xs" p="lg" radius="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput label="Título" required {...getInputProps('title')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DateInput label="Data" required valueFormat="DD/MM/YYYY" {...getInputProps('date')} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Select label="Ministério" required data={ministries} {...getInputProps('ministryId')} searchable />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Descrição" {...getInputProps('description')} />
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
export default ScheduleCreate;
