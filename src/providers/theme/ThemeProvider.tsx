import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { PropsWithChildren } from "react";
import { ministeriumTheme } from "./theme.config";

/**
 * Centralized Theme Provider
 *
 * Responsibilities:
 * - Provides Mantine theme configuration
 * - Manages color scheme
 * - Provides modals and notifications
 * - Centralizes all styling concerns
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<ColorSchemeScript defaultColorScheme="light" />
			<MantineProvider theme={ministeriumTheme} defaultColorScheme="light">
				<ModalsProvider>
					<Notifications position="top-right" zIndex={1000} />
					{children}
				</ModalsProvider>
			</MantineProvider>
		</>
	);
};
