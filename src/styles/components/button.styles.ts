import type { ButtonProps, MantineTheme } from "@mantine/core";

/**
 * Button Styles Module
 * Refactored following SOLID principles
 *
 * Single Responsibility: Each class handles one type of button style
 * Open/Closed: Can be extended without modifying existing code
 * Liskov Substitution: All button style classes implement the same interface
 * Interface Segregation: Separate interfaces for different button types
 * Dependency Inversion: Depends on abstractions (interfaces) not concrete implementations
 */

/**
 * Base interface for button styles
 */
export interface IButtonStyles {
	getStyles(): ButtonProps["styles"];
}

/**
 * Configuration for theme-dependent button styles
 */
export interface ButtonStylesConfig {
	theme: MantineTheme;
}

/**
 * Gradient Button Styles
 * Single Responsibility: Handles only gradient button styling
 */
export class GradientButtonStyles implements IButtonStyles {
	private theme: MantineTheme;

	constructor(config: ButtonStylesConfig) {
		this.theme = config.theme;
	}

	getStyles(): ButtonProps["styles"] {
		return {
			root: {
				background: this.theme.other.gradients.primary,
				border: "none",
				boxShadow: this.theme.other.shadows.primaryGlow,
				transition: "all 0.5s ease",
				"&:hover:not([data-disabled])": {
					background: `${this.theme.other.gradients.primaryHover} !important`,
					boxShadow: `${this.theme.other.shadows.primaryGlowHover} !important`,
					transform: "translateY(-2px)",
					filter: "brightness(1.15)",
				},
				"&:active:not([data-disabled])": {
					transform: "translateY(0)",
				},
				"&[data-loading]": {
					background: this.theme.other.gradients.primary,
				},
			},
		};
	}
}

/**
 * Back Button Styles
 * Single Responsibility: Handles only back button styling
 */
export class BackButtonStyles implements IButtonStyles {
	getStyles(): ButtonProps["styles"] {
		return {
			root: {
				transition: "all 0.2s ease",
				"&:hover:not([data-disabled])": {
					transform: "translateX(-3px)",
				},
			},
		};
	}
}

/**
 * Static Gradient Button Styles (for non-hook contexts)
 * Single Responsibility: Provides static gradient styles
 */
export class StaticGradientButtonStyles implements IButtonStyles {
	getStyles(): ButtonProps["styles"] {
		return {
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
	}
}

/**
 * Button Styles Factory
 * Factory Pattern: Creates appropriate button style instances
 */
export class ButtonStylesFactory {
	static createGradientStyles(theme: MantineTheme): IButtonStyles {
		return new GradientButtonStyles({ theme });
	}

	static createBackStyles(): IButtonStyles {
		return new BackButtonStyles();
	}

	static createStaticGradientStyles(): IButtonStyles {
		return new StaticGradientButtonStyles();
	}
}

/**
 * Hook to get gradient button styles with theme integration
 */
export const useGradientButtonStyles = (
	theme: MantineTheme,
): ButtonProps["styles"] => {
	const buttonStyles = ButtonStylesFactory.createGradientStyles(theme);
	return buttonStyles.getStyles();
};

/**
 * Hook to get back button styles
 */
export const useBackButtonStyles = (): ButtonProps["styles"] => {
	const buttonStyles = ButtonStylesFactory.createBackStyles();
	return buttonStyles.getStyles();
};

/**
 * Static gradient button styles (backward compatibility)
 */
export const gradientButtonStyles: ButtonProps["styles"] =
	ButtonStylesFactory.createStaticGradientStyles().getStyles();

/**
 * Static back button styles (backward compatibility)
 */
export const backButtonStyles: ButtonProps["styles"] =
	ButtonStylesFactory.createBackStyles().getStyles();
