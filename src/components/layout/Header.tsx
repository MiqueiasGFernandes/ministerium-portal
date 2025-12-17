import {
	ActionIcon,
	Avatar,
	Group,
	Menu,
	Text,
	UnstyledButton,
	useMantineColorScheme,
} from "@mantine/core";
import { useGetIdentity, useLogout, useNavigation } from "@refinedev/core";
import {
	IconCreditCard,
	IconLogout,
	IconMoon,
	IconSettings,
	IconSun,
	IconUser,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { createHeaderStyles } from "@/styles/components";
import type { User } from "@/types";

export const Header = () => {
	const { data: user } = useGetIdentity<User>();
	const { mutate: logout } = useLogout();
	const { push } = useNavigation();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const styles = useMemo(() => createHeaderStyles(), []);

	const getRoleLabel = (role: string) => {
		switch (role) {
			case "admin":
				return "Administrador";
			case "leader":
				return "Líder";
			case "volunteer":
				return "Voluntário";
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
				{colorScheme === "dark" ? (
					<IconSun size="1rem" />
				) : (
					<IconMoon size="1rem" />
				)}
			</ActionIcon>

			<Menu shadow="md" width={200}>
				<Menu.Target>
					<UnstyledButton data-tour="user-menu">
						<Group gap="xs">
							<Avatar src={user?.avatar} radius="xl" size="sm" />
							<div style={styles.userInfoContainer}>
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
						leftSection={<IconUser style={styles.iconWrapper} />}
						onClick={() => push("/profile")}
					>
						Perfil
					</Menu.Item>
					<Menu.Item
						leftSection={<IconSettings style={styles.iconWrapper} />}
						onClick={() => push("/settings")}
					>
						Configurações
					</Menu.Item>

					<Menu.Divider />

					<Menu.Label>Assinatura</Menu.Label>
					<Menu.Item
						leftSection={<IconCreditCard style={styles.iconWrapper} />}
						onClick={() => push("/billing/subscription")}
					>
						Minha Assinatura
					</Menu.Item>

					<Menu.Divider />

					<Menu.Item
						color="error"
						leftSection={<IconLogout style={styles.iconWrapper} />}
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
