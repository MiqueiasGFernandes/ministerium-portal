import { Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useGo, useResource } from "@refinedev/core";
import {
	IconCalendarEvent,
	IconCash,
	IconClipboardList,
	IconLayoutDashboard,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";
import { useLocation } from "react-router-dom";

const iconMap: Record<string, React.ReactNode> = {
	dashboard: <IconLayoutDashboard size="1.5rem" />,
	members: <IconUsers size="1.5rem" />,
	transactions: <IconCash size="1.5rem" />,
	events: <IconCalendarEvent size="1.5rem" />,
	schedules: <IconClipboardList size="1.5rem" />,
	settings: <IconSettings size="1.5rem" />,
};

export const FooterNav = () => {
	const { resources } = useResource();
	const go = useGo();
	const location = useLocation();

	const getIsActive = (path: string) => {
		if (path === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(path);
	};

	const visibleResources = resources.filter((resource) => {
		// Show all resources that have a list route
		return resource.list;
	});

	return (
		<Box
			hiddenFrom="sm"
			style={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				backgroundColor: "var(--mantine-color-body)",
				borderTop: "1px solid var(--mantine-color-gray-3)",
				zIndex: 100,
			}}
		>
			<Group gap={0} justify="space-around" p="xs">
				{visibleResources.map((resource) => {
					const path = typeof resource.list === "string" ? resource.list : "/";
					const isActive = getIsActive(path);

					return (
						<UnstyledButton
							key={resource.name}
							onClick={() => go({ to: path })}
							style={{
								flex: 1,
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Stack gap={4} align="center">
								<Box
									c={
										isActive
											? "var(--mantine-primary-color-filled)"
											: "var(--mantine-color-gray-6)"
									}
								>
									{iconMap[resource.name]}
								</Box>
								<Text
									size="xs"
									c={
										isActive
											? "var(--mantine-primary-color-filled)"
											: "var(--mantine-color-gray-6)"
									}
									fw={isActive ? 600 : 400}
								>
									{resource.meta?.label || resource.name}
								</Text>
							</Stack>
						</UnstyledButton>
					);
				})}
			</Group>
		</Box>
	);
};

export default FooterNav;
