import { useForm } from '@refinedev/mantine';
import { TextInput, Select, Button, Group, Stack, Title, Paper, Grid, Textarea, NumberInput } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { Event, EventStatus } from '@/types';
import { EVENT_STATUS_OPTIONS } from '@/config/constants';

export const EventCreate = () => {
  const { saveButtonProps, getInputProps, refineCore: { formLoading } } = useForm<Event>({
    initialValues: {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      location: '',
      status: EventStatus.DRAFT,
      attendees: [],
    },
  });

  return (
    <Stack gap="lg">
      <Title order={2}>Novo Evento</Title>
      <form>
        <Paper shadow="xs" p="lg" radius="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput label="Título" required {...getInputProps('title')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select label="Status" required data={EVENT_STATUS_OPTIONS} {...getInputProps('status')} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Descrição" {...getInputProps('description')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DateInput label="Data" required valueFormat="DD/MM/YYYY" {...getInputProps('date')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TimeInput label="Horário" required {...getInputProps('time')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput label="Máx. Participantes" {...getInputProps('maxAttendees')} />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput label="Local" required {...getInputProps('location')} />
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
export default EventCreate;
