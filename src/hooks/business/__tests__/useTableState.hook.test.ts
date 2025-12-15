import type { CrudFilters, CrudSort } from "@refinedev/core";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTableState } from "../useTableState.hook";

describe("useTableState", () => {
	describe("initialization", () => {
		it("should initialize with default values", () => {
			const { result } = renderHook(() => useTableState());

			expect(result.current.page).toBe(1);
			expect(result.current.pageSize).toBe(10);
			expect(result.current.filters).toEqual([]);
			expect(result.current.sorters).toEqual([]);
			expect(result.current.searchQuery).toBe("");
		});

		it("should initialize with custom values", () => {
			const initialFilters: CrudFilters = [
				{ field: "status", operator: "eq", value: "active" },
			];
			const initialSorters: CrudSort[] = [{ field: "name", order: "asc" }];

			const { result } = renderHook(() =>
				useTableState({
					initialPage: 2,
					initialPageSize: 20,
					initialFilters,
					initialSorters,
				}),
			);

			expect(result.current.page).toBe(2);
			expect(result.current.pageSize).toBe(20);
			expect(result.current.filters).toEqual(initialFilters);
			expect(result.current.sorters).toEqual(initialSorters);
		});
	});

	describe("pagination", () => {
		it("should update page", () => {
			const { result } = renderHook(() => useTableState());

			act(() => {
				result.current.setPage(3);
			});

			expect(result.current.page).toBe(3);
		});

		it("should update page size", () => {
			const { result } = renderHook(() => useTableState());

			act(() => {
				result.current.setPageSize(25);
			});

			expect(result.current.pageSize).toBe(25);
		});
	});

	describe("filtering", () => {
		it("should update filters", () => {
			const { result } = renderHook(() => useTableState());

			const newFilters: CrudFilters = [
				{ field: "status", operator: "eq", value: "pending" },
			];

			act(() => {
				result.current.setFilters(newFilters);
			});

			expect(result.current.filters).toEqual(newFilters);
		});
	});

	describe("sorting", () => {
		it("should update sorters", () => {
			const { result } = renderHook(() => useTableState());

			const newSorters: CrudSort[] = [{ field: "createdAt", order: "desc" }];

			act(() => {
				result.current.setSorters(newSorters);
			});

			expect(result.current.sorters).toEqual(newSorters);
		});
	});

	describe("search", () => {
		it("should update search query", () => {
			const { result } = renderHook(() => useTableState());

			act(() => {
				result.current.setSearchQuery("test query");
			});

			expect(result.current.searchQuery).toBe("test query");
		});
	});

	describe("reset", () => {
		it("should reset all state to initial values", () => {
			const { result } = renderHook(() => useTableState());

			// Change all values
			act(() => {
				result.current.setPage(5);
				result.current.setPageSize(50);
				result.current.setFilters([
					{ field: "test", operator: "eq", value: "value" },
				]);
				result.current.setSorters([{ field: "test", order: "asc" }]);
				result.current.setSearchQuery("search");
			});

			// Verify changes
			expect(result.current.page).toBe(5);
			expect(result.current.pageSize).toBe(50);

			// Reset
			act(() => {
				result.current.reset();
			});

			// Verify reset to defaults
			expect(result.current.page).toBe(1);
			expect(result.current.pageSize).toBe(10);
			expect(result.current.filters).toEqual([]);
			expect(result.current.sorters).toEqual([]);
			expect(result.current.searchQuery).toBe("");
		});

		it("should reset to custom initial values", () => {
			const initialFilters: CrudFilters = [
				{ field: "status", operator: "eq", value: "active" },
			];

			const { result } = renderHook(() =>
				useTableState({
					initialPage: 2,
					initialPageSize: 20,
					initialFilters,
				}),
			);

			// Change values
			act(() => {
				result.current.setPage(5);
				result.current.setFilters([]);
			});

			// Reset
			act(() => {
				result.current.reset();
			});

			// Verify reset to custom initial values
			expect(result.current.page).toBe(2);
			expect(result.current.pageSize).toBe(20);
			expect(result.current.filters).toEqual(initialFilters);
		});
	});
});
