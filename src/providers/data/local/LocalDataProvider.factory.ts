import type { DataProvider as RefineDataProvider } from "@refinedev/core";
import { fakeData } from "@/utils/fakeData";
import { LocalStorageStrategy } from "../storage";
import type {
	DataProviderConfig,
	IDataProviderFactory,
	IStorageStrategy,
} from "../types";
import { createLocalDataProvider } from "./localDataProvider";

/**
 * Local Data Provider Factory
 *
 * Creates local data provider instances with configurable storage strategy.
 * Follows Factory Pattern and Dependency Inversion Principle.
 *
 * @example
 * ```ts
 * const factory = new LocalDataProviderFactory();
 * const dataProvider = factory.create({
 *   delay: 300,
 *   enableLogging: true,
 * });
 * ```
 */
export class LocalDataProviderFactory implements IDataProviderFactory {
	private storageStrategy: IStorageStrategy;

	constructor(storageStrategy?: IStorageStrategy) {
		this.storageStrategy = storageStrategy || new LocalStorageStrategy();
	}

	/**
	 * Create a local data provider instance
	 *
	 * @param config Optional configuration
	 * @returns RefineDataProvider instance
	 */
	create(config?: DataProviderConfig): RefineDataProvider {
		const defaultConfig: DataProviderConfig = {
			delay: 300,
			enableLogging: false,
			tenantId: "1",
		};

		const finalConfig = { ...defaultConfig, ...config };

		return createLocalDataProvider({
			storage: this.storageStrategy,
			initialData: fakeData,
			config: finalConfig,
		});
	}
}
