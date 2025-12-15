/**
 * Data Provider Types
 *
 * Defines interfaces and types for the data access layer.
 * Following Interface Segregation and Dependency Inversion principles.
 */

import type { DataProvider as RefineDataProvider } from "@refinedev/core";

/**
 * Data Provider Configuration
 *
 * Allows configuration of data provider behavior without changing implementation
 */
export interface DataProviderConfig {
	/** Base API URL (for remote providers) */
	apiUrl?: string;
	/** Simulated network delay in milliseconds (for local providers) */
	delay?: number;
	/** Enable request logging */
	enableLogging?: boolean;
	/** Authentication token */
	token?: string;
	/** Tenant ID for multi-tenant applications */
	tenantId?: string;
}

/**
 * Storage Strategy Interface
 *
 * Defines how data is persisted and retrieved.
 * Allows swapping between localStorage, sessionStorage, IndexedDB, etc.
 */
export interface IStorageStrategy {
	/** Get item from storage */
	getItem<T>(key: string): T | null;
	/** Set item in storage */
	setItem<T>(key: string, value: T): void;
	/** Remove item from storage */
	removeItem(key: string): void;
	/** Clear all items from storage */
	clear(): void;
	/** Check if key exists in storage */
	hasItem(key: string): boolean;
}

/**
 * Data Provider Factory Interface
 *
 * Allows creation of different data provider implementations
 * without coupling to specific implementations
 */
export interface IDataProviderFactory {
	/** Create a data provider instance */
	create(config?: DataProviderConfig): RefineDataProvider;
}

/**
 * Data Provider Type Enum
 *
 * Identifies which data provider implementation to use
 */
export enum DataProviderType {
	/** Local in-memory provider with localStorage persistence */
	LOCAL = "local",
	/** Remote API provider with HTTP requests */
	REMOTE = "remote",
	/** Mock provider for testing */
	MOCK = "mock",
}

/**
 * Paginated Response Interface
 *
 * Standard pagination format used across all providers
 */
export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
}

/**
 * Filter Operator Types
 *
 * Supported filter operators for querying data
 */
export type FilterOperator =
	| "eq" // equals
	| "ne" // not equals
	| "lt" // less than
	| "lte" // less than or equal
	| "gt" // greater than
	| "gte" // greater than or equal
	| "in" // in array
	| "nin" // not in array
	| "contains" // string contains
	| "ncontains" // string does not contain
	| "startswith" // string starts with
	| "endswith"; // string ends with

/**
 * Filter Definition
 *
 * Defines a filter condition for querying data
 */
export interface FilterDefinition {
	field: string;
	operator: FilterOperator;
	value: any;
}

/**
 * Sort Order
 */
export type SortOrder = "asc" | "desc";

/**
 * Sort Definition
 *
 * Defines how data should be sorted
 */
export interface SortDefinition {
	field: string;
	order: SortOrder;
}
