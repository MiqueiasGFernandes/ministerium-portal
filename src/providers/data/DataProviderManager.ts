import type { DataProvider as RefineDataProvider } from "@refinedev/core";
import { LocalDataProviderFactory } from "./local/LocalDataProvider.factory";
import type { DataProviderConfig } from "./types";
import { DataProviderType } from "./types";

/**
 * Data Provider Manager
 *
 * Central manager for creating and switching between data providers.
 * Follows Strategy Pattern - allows runtime switching of data providers.
 *
 * This class makes it easy to:
 * - Switch from local to remote data provider
 * - Change configuration without touching application code
 * - Test with different providers
 *
 * @example
 * ```ts
 * // Development: use local provider
 * const manager = new DataProviderManager("local");
 * const dataProvider = manager.getDataProvider();
 *
 * // Production: switch to remote
 * const manager = new DataProviderManager("remote", {
 *   apiUrl: "https://api.example.com"
 * });
 * const dataProvider = manager.getDataProvider();
 * ```
 */
export class DataProviderManager {
	private currentProvider: RefineDataProvider;
	private providerType: DataProviderType;
	private config?: DataProviderConfig;

	constructor(
		type: DataProviderType = DataProviderType.LOCAL,
		config?: DataProviderConfig,
	) {
		this.providerType = type;
		this.config = config;
		this.currentProvider = this.createProvider(type, config);
	}

	/**
	 * Create a data provider based on type
	 */
	private createProvider(
		type: DataProviderType,
		config?: DataProviderConfig,
	): RefineDataProvider {
		switch (type) {
			case DataProviderType.LOCAL: {
				const factory = new LocalDataProviderFactory();
				return factory.create(config);
			}
			case DataProviderType.REMOTE: {
				// TODO: Implement RemoteDataProviderFactory when backend is ready
				throw new Error(
					"Remote data provider not implemented yet. Use local provider for now.",
				);
			}
			case DataProviderType.MOCK: {
				// TODO: Implement MockDataProviderFactory for testing
				throw new Error(
					"Mock data provider not implemented yet. Use local provider for now.",
				);
			}
			default: {
				const exhaustiveCheck: never = type;
				throw new Error(`Unknown provider type: ${exhaustiveCheck}`);
			}
		}
	}

	/**
	 * Get the current data provider
	 */
	getDataProvider(): RefineDataProvider {
		return this.currentProvider;
	}

	/**
	 * Switch to a different data provider type
	 *
	 * @param type New provider type
	 * @param config Optional configuration
	 */
	switchProvider(
		type: DataProviderType,
		config?: DataProviderConfig,
	): RefineDataProvider {
		this.providerType = type;
		this.config = config;
		this.currentProvider = this.createProvider(type, config);
		return this.currentProvider;
	}

	/**
	 * Get current provider type
	 */
	getProviderType(): DataProviderType {
		return this.providerType;
	}

	/**
	 * Get current configuration
	 */
	getConfig(): DataProviderConfig | undefined {
		return this.config;
	}
}
