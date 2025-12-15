import type { CrudFilters, CrudSort } from "@refinedev/core";
import { useCallback, useState } from "react";

/**
 * Table State Hook Return Type
 */
export interface UseTableStateReturn {
	/** Current page number */
	page: number;
	/** Items per page */
	pageSize: number;
	/** Active filters */
	filters: CrudFilters;
	/** Active sorters */
	sorters: CrudSort[];
	/** Search query */
	searchQuery: string;
	/** Update page */
	setPage: (page: number) => void;
	/** Update page size */
	setPageSize: (size: number) => void;
	/** Update filters */
	setFilters: (filters: CrudFilters) => void;
	/** Update sorters */
	setSorters: (sorters: CrudSort[]) => void;
	/** Update search query */
	setSearchQuery: (query: string) => void;
	/** Reset all state to defaults */
	reset: () => void;
}

/**
 * Table State Hook Options
 */
export interface UseTableStateOptions {
	/** Initial page number */
	initialPage?: number;
	/** Initial page size */
	initialPageSize?: number;
	/** Initial filters */
	initialFilters?: CrudFilters;
	/** Initial sorters */
	initialSorters?: CrudSort[];
}

/**
 * Custom hook for managing table state
 *
 * Encapsulates common table state management including:
 * - Pagination
 * - Filtering
 * - Sorting
 * - Search
 *
 * This hook follows the Single Responsibility Principle by handling
 * only table state management, not data fetching or rendering.
 *
 * @param options Configuration options
 * @returns Table state and update functions
 *
 * @example
 * ```tsx
 * const {
 *   page,
 *   pageSize,
 *   filters,
 *   sorters,
 *   searchQuery,
 *   setPage,
 *   setFilters,
 * } = useTableState({
 *   initialPageSize: 20,
 * });
 * ```
 */
export function useTableState(
	options: UseTableStateOptions = {},
): UseTableStateReturn {
	const {
		initialPage = 1,
		initialPageSize = 10,
		initialFilters = [],
		initialSorters = [],
	} = options;

	const [page, setPage] = useState(initialPage);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [filters, setFilters] = useState<CrudFilters>(initialFilters);
	const [sorters, setSorters] = useState<CrudSort[]>(initialSorters);
	const [searchQuery, setSearchQuery] = useState("");

	const reset = useCallback(() => {
		setPage(initialPage);
		setPageSize(initialPageSize);
		setFilters(initialFilters);
		setSorters(initialSorters);
		setSearchQuery("");
	}, [initialPage, initialPageSize, initialFilters, initialSorters]);

	return {
		page,
		pageSize,
		filters,
		sorters,
		searchQuery,
		setPage,
		setPageSize,
		setFilters,
		setSorters,
		setSearchQuery,
		reset,
	};
}
