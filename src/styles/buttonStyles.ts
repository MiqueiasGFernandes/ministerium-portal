import { type ButtonProps, useMantineTheme } from "@mantine/core";

/**
 * Hook to get gradient button styles with glow effect
 * Uses theme values for consistency
 */
export const useGradientButtonStyles = (): ButtonProps["styles"] => {
	const theme = useMantineTheme();

	return {
		root: {
			background: theme.other.gradients.primary,
			border: "none",
			boxShadow: theme.other.shadows.primaryGlow,
			transition: "all 0.5s ease",
			"&:hover:not([data-disabled])": {
				background: `${theme.other.gradients.primaryHover} !important`,
				boxShadow: `${theme.other.shadows.primaryGlowHover} !important`,
				transform: "translateY(-2px)",
				filter: "brightness(1.15)",
			},
			"&:active:not([data-disabled])": {
				transform: "translateY(0)",
			},
			"&[data-loading]": {
				background: theme.other.gradients.primary,
			},
		},
	};
};

/**
 * Hook to get back button styles with hover effect
 */
export const useBackButtonStyles = (): ButtonProps["styles"] => {
	return {
		root: {
			transition: "all 0.2s ease",
			"&:hover:not([data-disabled])": {
				transform: "translateX(-3px)",
			},
		},
	};
};

/**
 * Static gradient button styles (for components that can't use hooks)
 * Note: These won't be as dynamic as the hook versions
 */
export const gradientButtonStyles: ButtonProps["styles"] = {
	root: {
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		border: "none",
		boxShadow:
			"0 4px 15px rgba(102, 126, 234, 0.4), 0 0 20px rgba(118, 75, 162, 0.3)",
		transition: "all 0.5s ease",
		"&:hover:not([data-disabled])": {
			background:
				"linear-gradient(135deg, #8a9ff5 0%, #a077d4 100%) !important",
			boxShadow:
				"0 8px 35px rgba(102, 126, 234, 0.75), 0 0 50px rgba(118, 75, 162, 0.7) !important",
			transform: "translateY(-2px)",
			filter: "brightness(1.15)",
		},
		"&:active:not([data-disabled])": {
			transform: "translateY(0)",
		},
		"&[data-loading]": {
			background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		},
	},
};

/**
 * Static back button styles
 */
export const backButtonStyles: ButtonProps["styles"] = {
	root: {
		transition: "all 0.2s ease",
		"&:hover:not([data-disabled])": {
			transform: "translateX(-3px)",
		},
	},
};
