import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook for managing search history
 * Follows Single Responsibility Principle (SRP) by focusing only on search history management
 */
export const useSearchHistory = (storageKey: string, maxItems: number = 5) => {
	const [history, setHistory] = useState<string[]>([]);

	// Load history from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(storageKey);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					setHistory(parsed.slice(0, maxItems));
				}
			}
		} catch (error) {
			console.error("Error loading search history:", error);
		}
	}, [storageKey, maxItems]);

	// Add search term to history
	const addToHistory = useCallback(
		(term: string) => {
			if (!term.trim()) return;

			setHistory((prev) => {
				// Remove duplicate if exists
				const filtered = prev.filter((item) => item !== term);
				// Add to beginning and limit to maxItems
				const updated = [term, ...filtered].slice(0, maxItems);

				// Persist to localStorage
				try {
					localStorage.setItem(storageKey, JSON.stringify(updated));
				} catch (error) {
					console.error("Error saving search history:", error);
				}

				return updated;
			});
		},
		[storageKey, maxItems],
	);

	// Clear all history
	const clearHistory = useCallback(() => {
		setHistory([]);
		try {
			localStorage.removeItem(storageKey);
		} catch (error) {
			console.error("Error clearing search history:", error);
		}
	}, [storageKey]);

	// Remove specific item from history
	const removeFromHistory = useCallback(
		(term: string) => {
			setHistory((prev) => {
				const updated = prev.filter((item) => item !== term);

				try {
					localStorage.setItem(storageKey, JSON.stringify(updated));
				} catch (error) {
					console.error("Error updating search history:", error);
				}

				return updated;
			});
		},
		[storageKey],
	);

	return {
		history,
		addToHistory,
		clearHistory,
		removeFromHistory,
	};
};
