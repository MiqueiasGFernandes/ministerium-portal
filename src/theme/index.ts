import { createTheme, type MantineColorsTuple } from "@mantine/core";

/**
 * Ministerium Brand Colors
 * Custom color palette based on the login/onboarding design
 */

// Primary gradient colors (Purple-Blue)
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

// Secondary gradient colors (Purple)
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

// Background gradient colors (Desaturated)
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

// Link colors
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

/**
 * Ministerium Theme Configuration
 * Provides a complete theme with custom colors, gradients, and component styles
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

	// Global component styles
	components: {
		Button: {
			defaultProps: {
				color: "ministerium-primary",
			},
		},
		Anchor: {
			defaultProps: {
				c: "ministerium-link.7",
			},
		},
	},

	// Custom gradients
	other: {
		gradients: {
			primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			primaryHover: "linear-gradient(135deg, #7c8ef0 0%, #8b5fb8 100%)",
			background: "linear-gradient(135deg, #8b9dc3 0%, #9d8fb8 100%)",
			backgroundOverlay:
				"linear-gradient(135deg, rgba(139, 157, 195, 0.85) 0%, rgba(157, 143, 184, 0.85) 100%)",
		},
		shadows: {
			primaryGlow:
				"0 4px 15px rgba(102, 126, 234, 0.4), 0 0 20px rgba(118, 75, 162, 0.3)",
			primaryGlowHover:
				"0 6px 25px rgba(102, 126, 234, 0.65), 0 0 35px rgba(118, 75, 162, 0.6)",
		},
	},
});

// Type augmentation for TypeScript
declare module "@mantine/core" {
	export interface MantineThemeOther {
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
}
