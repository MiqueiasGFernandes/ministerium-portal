/**
 * Local Data Provider
 *
 * This is a wrapper around the existing dataProvider.ts
 * maintaining backwards compatibility while providing a clean interface
 * for future refactoring.
 *
 * TODO: Refactor the large dataProvider.ts into smaller, focused modules:
 * - Separate CRUD operations by resource
 * - Extract filtering, sorting, pagination logic
 * - Create resource-specific services
 */

import type { DataProvider as RefineDataProvider } from "@refinedev/core";
import type { DataProviderConfig, IStorageStrategy } from "../types";

interface LocalDataProviderOptions {
	storage: IStorageStrategy;
	initialData: any;
	config: DataProviderConfig;
}

/**
 * Create local data provider
 *
 * For now, this imports the existing dataProvider.
 * In the future, we'll build a modular version here.
 */
export function createLocalDataProvider(
	_options: LocalDataProviderOptions,
): RefineDataProvider {
	// Import the existing dataProvider
	// This maintains backwards compatibility
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { dataProvider } = require("../../dataProvider");

	// TODO: Use _options to configure behavior
	// For now, just return the existing provider
	return dataProvider;
}
