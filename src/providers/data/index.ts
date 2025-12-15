/**
 * Data Providers Module
 *
 * Central export point for all data provider functionality.
 * Provides clean abstraction for data access layer.
 *
 * @example
 * ```ts
 * // Simple usage with defaults
 * import { createDataProvider } from "@/providers/data";
 * const dataProvider = createDataProvider();
 *
 * // Advanced usage with manager
 * import { DataProviderManager } from "@/providers/data";
 * const manager = new DataProviderManager("local", { delay: 500 });
 * const dataProvider = manager.getDataProvider();
 *
 * // Switch to remote in production
 * manager.switchProvider("remote", { apiUrl: process.env.API_URL });
 * ```
 */

// Data Provider Manager
export { DataProviderManager } from "./DataProviderManager";
// Factories
export { LocalDataProviderFactory } from "./local/LocalDataProvider.factory";

// Storage Strategies
export { InMemoryStorageStrategy, LocalStorageStrategy } from "./storage";
// Types
export type {
	DataProviderConfig,
	FilterDefinition,
	FilterOperator,
	IDataProviderFactory,
	IStorageStrategy,
	PaginatedResponse,
	SortDefinition,
	SortOrder,
} from "./types";
export { DataProviderType } from "./types";

import type { DataProvider as RefineDataProvider } from "@refinedev/core";
// Convenience function for simple usage
import { DataProviderManager } from "./DataProviderManager";
import type { DataProviderConfig } from "./types";
import { DataProviderType } from "./types";

/**
 * Create a data provider with default configuration
 *
 * This is a convenience function for simple usage.
 * For more control, use DataProviderManager directly.
 *
 * @param config Optional configuration
 * @returns RefineDataProvider instance
 */
export function createDataProvider(
	config?: DataProviderConfig,
): RefineDataProvider {
	const manager = new DataProviderManager(DataProviderType.LOCAL, config);
	return manager.getDataProvider();
}
