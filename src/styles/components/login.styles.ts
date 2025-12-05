import type { MantineTheme } from "@mantine/core";
import type { CSSProperties } from "react";

/**
 * Login Page Styles
 * Single Responsibility: Contains all styles for the Login page
 *
 * Open/Closed Principle: Can be extended without modifying existing styles
 */

export interface LoginStylesConfig {
	theme: MantineTheme;
}

/**
 * Style factory for Login page
 * Dependency Inversion: Depends on abstraction (LoginStylesConfig) not concrete implementation
 */
export class LoginStyles {
	private theme: MantineTheme;

	constructor(config: LoginStylesConfig) {
		this.theme = config.theme;
	}

	get container(): CSSProperties {
		return {
			minHeight: "100vh",
			background: this.theme.other.gradients.background,
		};
	}

	get mobileWrapper(): CSSProperties {
		return {
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "2rem",
		};
	}

	get mobileCard(): CSSProperties {
		return {
			width: "100%",
			maxWidth: "460px",
			background: "white",
			borderRadius: "12px",
			padding: "2rem",
			boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
			margin: "0 auto",
		};
	}

	get desktopWrapper(): CSSProperties {
		return {
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "2rem",
		};
	}

	get desktopGridWrapper(): CSSProperties {
		return {
			width: "100%",
			maxWidth: "1200px",
		};
	}

	get desktopCard(): CSSProperties {
		return {
			width: "100%",
			background: "white",
			borderRadius: "12px",
			overflow: "hidden",
			boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
		};
	}

	get brandingSection(): CSSProperties {
		return {
			height: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			backgroundImage: `${this.theme.other.gradients.backgroundOverlay}, url(/assets/bg-login.jpg)`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundBlendMode: "overlay",
			padding: "4rem 3rem",
			minHeight: "600px",
			position: "relative",
			overflow: "hidden",
		};
	}

	get brandingOverlay(): CSSProperties {
		return {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.35)",
			zIndex: 1,
		};
	}

	get brandingContent(): CSSProperties {
		return {
			position: "relative",
			zIndex: 2,
		};
	}

	get logoText(): CSSProperties {
		return {
			fontFamily: '"Space Grotesk", "Inter", -apple-system, sans-serif',
			fontWeight: 800,
			fontSize: "3.5rem",
			letterSpacing: "-0.02em",
			lineHeight: 1,
			paddingBottom: "2px",
		};
	}

	get formSection(): CSSProperties {
		return {
			height: "100%",
			display: "flex",
			alignItems: "center",
			padding: "4rem 3rem",
			minHeight: "600px",
		};
	}

	get formWrapper(): CSSProperties {
		return {
			width: "100%",
		};
	}

	get dividerLabel(): CSSProperties {
		return {
			fontSize: "0.875rem",
			color: "#868e96",
		};
	}

	get linkStyle(): CSSProperties {
		return {
			textDecoration: "none",
			transition: "all 0.2s ease",
		};
	}

	getLinkHoverStyle(): Record<string, string | number> {
		return {
			color: this.theme.colors["ministerium-link"][8],
			transform: "translateY(-1px)",
		};
	}
}

/**
 * Hook-friendly function to create login styles
 * Interface Segregation: Returns only what's needed
 */
export const createLoginStyles = (theme: MantineTheme): LoginStyles => {
	return new LoginStyles({ theme });
};
