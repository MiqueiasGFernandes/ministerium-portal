/**
 * Theme Module
 *
 * Central export point for all theme-related functionality.
 * Provides theme configuration, provider, and hooks.
 *
 * @module providers/theme
 */

// Theme Provider
export { ThemeProvider } from "./ThemeProvider";

// Theme Configuration
export { gradients, ministeriumTheme, shadows } from "./theme.config";

// Theme Hook
export { type UseThemeReturn, useTheme } from "./useTheme.hook";
