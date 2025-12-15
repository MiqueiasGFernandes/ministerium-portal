import type { IStorageStrategy } from "../types";

/**
 * LocalStorage Strategy Implementation
 *
 * Implements storage strategy using browser localStorage.
 * Follows Single Responsibility Principle - only handles localStorage operations.
 */
export class LocalStorageStrategy implements IStorageStrategy {
	/**
	 * Get item from localStorage
	 * @param key Storage key
	 * @returns Parsed value or null if not found
	 */
	getItem<T>(key: string): T | null {
		try {
			const item = localStorage.getItem(key);
			if (!item) return null;
			return JSON.parse(item) as T;
		} catch (error) {
			console.error(`Error getting item from localStorage: ${key}`, error);
			return null;
		}
	}

	/**
	 * Set item in localStorage
	 * @param key Storage key
	 * @param value Value to store
	 */
	setItem<T>(key: string, value: T): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error setting item in localStorage: ${key}`, error);
		}
	}

	/**
	 * Remove item from localStorage
	 * @param key Storage key
	 */
	removeItem(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing item from localStorage: ${key}`, error);
		}
	}

	/**
	 * Clear all items from localStorage
	 */
	clear(): void {
		try {
			localStorage.clear();
		} catch (error) {
			console.error("Error clearing localStorage", error);
		}
	}

	/**
	 * Check if key exists in localStorage
	 * @param key Storage key
	 * @returns True if key exists
	 */
	hasItem(key: string): boolean {
		return localStorage.getItem(key) !== null;
	}
}
