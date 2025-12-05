import type { CSSProperties } from "react";

/**
 * Header Component Styles
 * Single Responsibility: Contains all styles for the Header component
 */

export class HeaderStyles {
	get userInfoContainer(): CSSProperties {
		return {
			flex: 1,
		};
	}

	get iconWrapper(): CSSProperties {
		return {
			width: "14px",
			height: "14px",
		};
	}
}

/**
 * Factory function to create header styles
 */
export const createHeaderStyles = (): HeaderStyles => {
	return new HeaderStyles();
};
