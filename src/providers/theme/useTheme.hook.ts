import { type MantineTheme, useMantineTheme } from "@mantine/core";
import type { gradients, shadows } from "./theme.config";

/**
 * Theme Hook Return Type
 *
 * Provides typed access to theme configuration including
 * Mantine theme, custom gradients, and shadows
 */
export interface UseThemeReturn {
	/** Mantine theme object */
	theme: MantineTheme;
	/** Custom gradient definitions */
	gradients: typeof gradients;
	/** Custom shadow definitions */
	shadows: typeof shadows;
}

/**
 * Custom hook for accessing theme configuration
 *
 * Provides a unified interface to access all theme-related values including:
 * - Mantine theme object
 * - Custom gradients
 * - Custom shadows
 *
 * @returns {UseThemeReturn} Theme configuration object
 *
 * @example
 * ```tsx
 * const { theme, gradients, shadows } = useTheme();
 *
 * // Use Mantine theme colors
 * <Box bg={theme.colors["ministerium-primary"][5]}>
 *
 * // Use custom gradients
 * <Box style={{ background: gradients.primary }}>
 *
 * // Use custom shadows
 * <Paper shadow={shadows.primaryGlow}>
 * ```
 */
export const useTheme = (): UseThemeReturn => {
	const theme = useMantineTheme();

	return {
		theme,
		gradients: theme.other.gradients,
		shadows: theme.other.shadows,
	};
};
