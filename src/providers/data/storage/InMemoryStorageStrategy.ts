import type { IStorageStrategy } from "../types";

/**
 * In-Memory Storage Strategy Implementation
 *
 * Implements storage strategy using in-memory Map.
 * Useful for testing or when persistence is not needed.
 * Follows Single Responsibility Principle.
 */
export class InMemoryStorageStrategy implements IStorageStrategy {
	private storage: Map<string, string> = new Map();

	/**
	 * Get item from memory
	 * @param key Storage key
	 * @returns Parsed value or null if not found
	 */
	getItem<T>(key: string): T | null {
		try {
			const item = this.storage.get(key);
			if (!item) return null;
			return JSON.parse(item) as T;
		} catch (error) {
			console.error(`Error getting item from memory: ${key}`, error);
			return null;
		}
	}

	/**
	 * Set item in memory
	 * @param key Storage key
	 * @param value Value to store
	 */
	setItem<T>(key: string, value: T): void {
		try {
			this.storage.set(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error setting item in memory: ${key}`, error);
		}
	}

	/**
	 * Remove item from memory
	 * @param key Storage key
	 */
	removeItem(key: string): void {
		this.storage.delete(key);
	}

	/**
	 * Clear all items from memory
	 */
	clear(): void {
		this.storage.clear();
	}

	/**
	 * Check if key exists in memory
	 * @param key Storage key
	 * @returns True if key exists
	 */
	hasItem(key: string): boolean {
		return this.storage.has(key);
	}
}
