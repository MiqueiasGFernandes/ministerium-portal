import { useLogin } from '@refinedev/core';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
  Center,
  Image,
  Text,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { LoginCredentials } from '@/types';

export const Login = () => {
  const { mutate: login, isLoading } = useLogin<LoginCredentials>();
  const [error, setError] = useState<string>('');

  const form = useForm({
    initialValues: {
      email: 'admin@ministerium.com',
      password: 'admin123',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      password: (value) => (value.length >= 3 ? null : 'Senha deve ter no mínimo 3 caracteres'),
    },
  });

  const handleSubmit = (values: LoginCredentials) => {
    setError('');

    login(values, {
      onError: (error) => {
        setError(error.message || 'Erro ao fazer login');
      },
    });
  };

  return (
    <Center
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container size={460} my={40}>
        <Paper radius="md" p="xl" withBorder shadow="xl">
          <Stack gap="lg">
            <Center>
              <Stack gap="xs" align="center">
                <Title order={2} ta="center" fw={700}>
                  Ministerium
                </Title>
                <Text size="sm" c="dimmed" ta="center">
                  ERP para Gestão de Igrejas
                </Text>
              </Stack>
            </Center>

            {error && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Erro"
                color="red"
                withCloseButton
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="seu@email.com"
                  required
                  {...form.getInputProps('email')}
                />

                <PasswordInput
                  label="Senha"
                  placeholder="Sua senha"
                  required
                  {...form.getInputProps('password')}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  loading={isLoading}
                  mt="md"
                >
                  Entrar
                </Button>
              </Stack>
            </form>

            <Paper p="md" radius="md" bg="gray.0">
              <Stack gap="xs">
                <Text size="xs" fw={600} c="dimmed">
                  Credenciais de teste:
                </Text>
                <Text size="xs" c="dimmed">
                  Admin: admin@ministerium.com / qualquer senha (3+ caracteres)
                </Text>
                <Text size="xs" c="dimmed">
                  Líder: Use qualquer email dos usuários fake
                </Text>
              </Stack>
            </Paper>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
};

export default Login;
