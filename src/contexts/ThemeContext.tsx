import { type MantineTheme, useMantineTheme } from "@mantine/core";
import { createContext, type PropsWithChildren, useContext } from "react";

/**
 * Theme Context Interface
 * Provides access to the Mantine theme and custom theme utilities
 *
 * Single Responsibility Principle: This context only manages theme access
 */
interface ThemeContextValue {
	theme: MantineTheme;
	gradients: {
		primary: string;
		primaryHover: string;
		background: string;
		backgroundOverlay: string;
	};
	shadows: {
		primaryGlow: string;
		primaryGlowHover: string;
	};
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme Provider Component
 * Wraps the application and provides theme context
 *
 * @param children - Child components
 */
export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const theme = useMantineTheme();

	const value: ThemeContextValue = {
		theme,
		gradients: theme.other.gradients,
		shadows: theme.other.shadows,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

/**
 * Custom hook to access theme context
 *
 * @throws Error if used outside ThemeProvider
 * @returns ThemeContextValue
 */
export const useThemeContext = (): ThemeContextValue => {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error("useThemeContext must be used within a ThemeProvider");
	}

	return context;
};
