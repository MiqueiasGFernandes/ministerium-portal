import { useGetIdentity, useLogout } from '@refinedev/core';
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  rem,
  useMantineColorScheme,
  ActionIcon,
} from '@mantine/core';
import {
  IconLogout,
  IconSettings,
  IconUser,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import { User } from '@/types';

export const Header = () => {
  const { data: user } = useGetIdentity<User>();
  const { mutate: logout } = useLogout();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'leader':
        return 'blue';
      case 'volunteer':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'leader':
        return 'Líder';
      case 'volunteer':
        return 'Voluntário';
      default:
        return role;
    }
  };

  return (
    <Group justify="flex-end" h="100%" px="md">
      <ActionIcon
        variant="default"
        onClick={() => toggleColorScheme()}
        size={30}
      >
        {colorScheme === 'dark' ? (
          <IconSun size="1rem" />
        ) : (
          <IconMoon size="1rem" />
        )}
      </ActionIcon>

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <UnstyledButton>
            <Group gap="xs">
              <Avatar src={user?.avatar} radius="xl" size="sm" />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {user?.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {user?.role && getRoleLabel(user.role)}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Conta</Menu.Label>
          <Menu.Item
            leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
          >
            Perfil
          </Menu.Item>
          <Menu.Item
            leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          >
            Configurações
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
            onClick={() => logout()}
          >
            Sair
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default Header;
