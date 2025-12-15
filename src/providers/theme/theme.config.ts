import { createTheme, type MantineColorsTuple } from "@mantine/core";

/**
 * Theme Configuration Module
 *
 * Centralizes all theme-related configurations following Single Responsibility Principle.
 * This module is the single source of truth for all visual design tokens.
 */

// ============================================================================
// COLOR PALETTES
// ============================================================================

/**
 * Primary gradient colors (Purple-Blue)
 * Used for primary actions, buttons, and brand elements
 */
const ministeriumPrimary: MantineColorsTuple = [
	"#f0f3ff", // Lightest
	"#dce4f5",
	"#bac8eb",
	"#94a8e0",
	"#7c8ef0", // Hover state
	"#667eea", // Base color
	"#5a6fd4",
	"#4d5fbd",
	"#4150a6",
	"#35418f", // Darkest
];

/**
 * Secondary gradient colors (Purple)
 * Used for secondary actions and accent elements
 */
const ministeriumSecondary: MantineColorsTuple = [
	"#f5f0ff", // Lightest
	"#e5dbf5",
	"#d4c4eb",
	"#c3aae0",
	"#b194d8",
	"#a07dd0",
	"#8b5fb8", // Hover state
	"#764ba2", // Base color
	"#654090",
	"#54357e", // Darkest
];

/**
 * Background gradient colors (Desaturated)
 * Used for page backgrounds and containers
 */
const ministeriumBackground: MantineColorsTuple = [
	"#f7f9fc", // Lightest
	"#e8ecf3",
	"#d4dcea",
	"#bfcbe0",
	"#aabbd7",
	"#9d8fb8", // Base gradient end
	"#8b9dc3", // Base gradient start
	"#7a8caf",
	"#697b9b",
	"#586a87", // Darkest
];

/**
 * Link colors
 * Used for hyperlinks and navigation elements
 */
const ministeriumLink: MantineColorsTuple = [
	"#e7f5ff",
	"#d0ebff",
	"#a5d8ff",
	"#74c0fc",
	"#4dabf7",
	"#339af0",
	"#228be6",
	"#1971c2", // Base link color
	"#1864ab", // Hover link color
	"#1558a3",
];

// ============================================================================
// GRADIENTS
// ============================================================================

export const gradients = {
	primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
	primaryHover: "linear-gradient(135deg, #8a9ff5 0%, #a077d4 100%)",
	background: "linear-gradient(135deg, #8b9dc3 0%, #9d8fb8 100%)",
	backgroundOverlay:
		"linear-gradient(135deg, rgba(139, 157, 195, 0.85) 0%, rgba(157, 143, 184, 0.85) 100%)",
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
	primaryGlow:
		"0 4px 15px rgba(102, 126, 234, 0.4), 0 0 20px rgba(118, 75, 162, 0.3)",
	primaryGlowHover:
		"0 8px 35px rgba(102, 126, 234, 0.75), 0 0 50px rgba(118, 75, 162, 0.7)",
} as const;

// ============================================================================
// COMPONENT OVERRIDES
// ============================================================================

const buttonComponentOverride = {
	defaultProps: {
		color: "ministerium-primary",
	},
	styles: () => ({
		root: {
			transition: "all 0.5s ease !important",
			"&:hover:not([data-disabled]):not([data-loading])": {
				transform: "translateY(-1px) !important",
				filter: "brightness(1.1) !important",
			},
		},
	}),
};

const anchorComponentOverride = {
	defaultProps: {
		c: "ministerium-link.7",
	},
};

const actionIconComponentOverride = {
	styles: () => ({
		root: {
			transition: "all 0.5s ease !important",
			"&:hover:not([data-disabled])": {
				transform: "scale(1.05) !important",
				filter: "brightness(1.1) !important",
			},
		},
	}),
};

// ============================================================================
// MAIN THEME
// ============================================================================

/**
 * Ministerium Theme Configuration
 *
 * This is the main theme object used throughout the application.
 * It provides a complete theme with custom colors, gradients, and component styles.
 *
 * Usage:
 * ```tsx
 * <MantineProvider theme={ministeriumTheme}>
 *   <App />
 * </MantineProvider>
 * ```
 */
export const ministeriumTheme = createTheme({
	primaryColor: "ministerium-primary",
	defaultRadius: "md",
	fontFamily:
		"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",

	colors: {
		"ministerium-primary": ministeriumPrimary,
		"ministerium-secondary": ministeriumSecondary,
		"ministerium-background": ministeriumBackground,
		"ministerium-link": ministeriumLink,
	},

	components: {
		Button: buttonComponentOverride,
		Anchor: anchorComponentOverride,
		ActionIcon: actionIconComponentOverride,
	},

	other: {
		gradients,
		shadows,
	},
});

// ============================================================================
// TYPE AUGMENTATION
// ============================================================================

/**
 * Type augmentation for TypeScript support
 * Extends MantineThemeOther to include custom gradients and shadows
 */
declare module "@mantine/core" {
	export interface MantineThemeOther {
		gradients: typeof gradients;
		shadows: typeof shadows;
	}
}
