import type { CSSProperties } from "react";

/**
 * Layout Component Styles
 * Single Responsibility: Contains all styles for the Layout component
 */

export class LayoutStyles {
	get logoIcon(): CSSProperties {
		return {
			fontSize: "24px",
		};
	}

	get contentContainer(): CSSProperties {
		return {
			minHeight: "calc(100vh - 60px)",
		};
	}
}

/**
 * Factory function to create layout styles
 */
export const createLayoutStyles = (): LayoutStyles => {
	return new LayoutStyles();
};
