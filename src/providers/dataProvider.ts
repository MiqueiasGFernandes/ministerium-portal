import type { DataProvider } from "@refinedev/core";
import type {
	AccessRequest,
	EventRegistration,
	Member,
	MemberRegistration,
	PaginatedResponse,
} from "@/types";
import { fakeData } from "@/utils/fakeData";

/**
 * Local Data Provider for development and testing
 * Simulates API calls with in-memory data
 */

// Initialize localStorage by merging fakeData with any dynamically created members
// This ensures fakeData members are always present
let isLocalStorageInitialized = false;
const initializeLocalStorage = () => {
	if (isLocalStorageInitialized) return;

	const membersInStorage = localStorage.getItem("members");

	if (!membersInStorage) {
		// First time - just store fakeData
		localStorage.setItem("members", JSON.stringify(fakeData.members));
	} else {
		// Merge: keep fakeData members + dynamically created members
		const existingMembers = JSON.parse(membersInStorage) as Member[];
		const fakeDataIds = new Set(fakeData.members.map((m) => m.id));

		// Keep only members that are NOT in fakeData (dynamically created)
		const dynamicMembers = existingMembers.filter(
			(m) => !fakeDataIds.has(m.id),
		);

		// Merge: fakeData + dynamic members
		const mergedMembers = [...fakeData.members, ...dynamicMembers];
		localStorage.setItem("members", JSON.stringify(mergedMembers));
	}

	isLocalStorageInitialized = true;
};

// In-memory storage
let storage = {
	members: [...fakeData.members],
	transactions: [...fakeData.transactions],
	events: [...fakeData.events],
	schedules: [...fakeData.schedules],
	ministries: [...fakeData.ministries],
	users: [...fakeData.users],
	tenants: [fakeData.tenant],
	accessRequests: [] as AccessRequest[], // Will be initialized from localStorage
	memberRegistrations: [] as MemberRegistration[], // Will be initialized from localStorage
	eventRegistrations: [] as EventRegistration[], // Public event registrations
};

// Helper to simulate API delay
const simulateDelay = (ms: number = 300) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// Helper for pagination
const paginate = <T>(
	data: T[],
	page: number = 1,
	perPage: number = 10,
): PaginatedResponse<T> => {
	const start = (page - 1) * perPage;
	const end = start + perPage;
	const paginatedData = data.slice(start, end);

	return {
		data: paginatedData,
		total: data.length,
		page,
		perPage,
		totalPages: Math.ceil(data.length / perPage),
	};
};

// Helper for filtering
const filterData = <T extends Record<string, any>>(
	data: T[],
	filters: Record<string, any> = {},
): T[] => {
	if (!filters || Object.keys(filters).length === 0) return data;

	return data.filter((item) => {
		return Object.entries(filters).every(([key, value]) => {
			if (value === undefined || value === null || value === "") return true;

			// Handle array filters (e.g., tags)
			if (Array.isArray(value)) {
				if (value.length === 0) return true;
				if (Array.isArray(item[key])) {
					return value.some((v) => item[key].includes(v));
				}
				return value.includes(item[key]);
			}

			// Handle search
			if (key === "search") {
				const searchValue = value.toLowerCase();
				return Object.values(item).some((v) =>
					String(v).toLowerCase().includes(searchValue),
				);
			}

			// Handle exact match
			return item[key] === value;
		});
	});
};

// Helper for sorting
const sortData = <T extends Record<string, any>>(
	data: T[],
	sortBy?: string,
	sortOrder: "asc" | "desc" = "desc",
): T[] => {
	if (!sortBy) return data;

	return [...data].sort((a, b) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];

		if (aValue === bValue) return 0;

		const comparison = aValue > bValue ? 1 : -1;
		return sortOrder === "asc" ? comparison : -comparison;
	});
};

export const localDataProvider: DataProvider = {
	getList: async ({ resource, pagination, filters, sorters }) => {
		await simulateDelay();

		const { current = 1, pageSize = 10 } = pagination || {};

		let data: any[] = [];

		switch (resource) {
			case "members": {
				// Initialize localStorage with fakeData on first access
				initializeLocalStorage();

				// Sync with localStorage to include dynamically created members
				const membersFromStorage = localStorage.getItem("members");
				if (membersFromStorage) {
					storage.members = JSON.parse(membersFromStorage);
				}
				data = storage.members;
				break;
			}
			case "transactions":
				data = storage.transactions;
				break;
			case "events":
				data = storage.events;
				break;
			case "schedules":
				data = storage.schedules;
				break;
			case "ministries":
				data = storage.ministries;
				break;
			case "users":
				data = storage.users;
				break;
			case "tenants":
				data = storage.tenants;
				break;
			case "access-requests": {
				// Sync with localStorage
				const requests = localStorage.getItem("accessRequests");
				storage.accessRequests = requests ? JSON.parse(requests) : [];
				data = storage.accessRequests;
				break;
			}
			case "member-registrations": {
				// Sync with localStorage
				const registrations = localStorage.getItem("memberRegistrations");
				storage.memberRegistrations = registrations
					? JSON.parse(registrations)
					: [];
				data = storage.memberRegistrations;
				break;
			}
			case "event-registrations": {
				// Sync with localStorage
				const eventRegistrations = localStorage.getItem("eventRegistrations");
				storage.eventRegistrations = eventRegistrations
					? JSON.parse(eventRegistrations)
					: [];
				data = storage.eventRegistrations;
				break;
			}
			default:
				data = [];
		}

		// Apply filters
		const filterObj: Record<string, any> = {};
		filters?.forEach((filter) => {
			if ("field" in filter && "value" in filter) {
				filterObj[filter.field] = filter.value;
			}
		});
		data = filterData(data, filterObj);

		// Apply sorting
		const sorter = sorters?.[0];
		if (sorter) {
			data = sortData(data, sorter.field, sorter.order);
		} else {
			data = sortData(data, "createdAt", "desc");
		}

		// Apply pagination
		const result = paginate(data, current, pageSize);

		return {
			data: result.data,
			total: result.total,
		};
	},

	getOne: async ({ resource, id }) => {
		await simulateDelay();

		let data: any;

		switch (resource) {
			case "members": {
				// Initialize localStorage with fakeData on first access
				initializeLocalStorage();

				// Sync with localStorage
				const membersFromStorage = localStorage.getItem("members");
				if (membersFromStorage) {
					storage.members = JSON.parse(membersFromStorage);
				}
				data = storage.members.find((m) => m.id === id);
				break;
			}
			case "transactions":
				data = storage.transactions.find((t) => t.id === id);
				break;
			case "events":
				data = storage.events.find((e) => e.id === id);
				break;
			case "schedules":
				data = storage.schedules.find((s) => s.id === id);
				break;
			case "ministries":
				data = storage.ministries.find((m) => m.id === id);
				break;
			case "users":
				data = storage.users.find((u) => u.id === id);
				break;
			case "tenants":
				data = storage.tenants.find((t) => t.id === id);
				break;
			case "access-requests": {
				const requests = localStorage.getItem("accessRequests");
				storage.accessRequests = requests ? JSON.parse(requests) : [];
				data = storage.accessRequests.find((r) => r.id === id);
				break;
			}
			default:
				data = null;
		}

		if (!data) {
			throw new Error(`Resource ${resource} with id ${id} not found`);
		}

		return { data };
	},

	create: async ({ resource, variables }) => {
		await simulateDelay();

		const id = `${resource}-${Date.now()}`;
		const now = new Date().toISOString();

		const newItem = {
			id,
			...variables,
			tenantId: "1",
			createdAt: now,
			updatedAt: now,
		} as any;

		switch (resource) {
			case "members": {
				// Initialize localStorage with fakeData on first access
				initializeLocalStorage();

				// Sync with localStorage
				const membersFromStorage = localStorage.getItem("members");
				const existingMembers = membersFromStorage
					? JSON.parse(membersFromStorage)
					: storage.members;
				const updatedMembers = [...existingMembers, newItem];
				localStorage.setItem("members", JSON.stringify(updatedMembers));
				storage.members = updatedMembers;
				break;
			}
			case "transactions":
				storage.transactions = [...storage.transactions, newItem];
				break;
			case "events":
				storage.events = [...storage.events, newItem];
				break;
			case "schedules":
				storage.schedules = [...storage.schedules, newItem];
				break;
			case "ministries":
				storage.ministries = [...storage.ministries, newItem];
				break;
			case "users":
				storage.users = [...storage.users, newItem];
				break;
			case "tenants":
				storage.tenants = [...storage.tenants, newItem];
				break;
			case "access-requests": {
				const requests = localStorage.getItem("accessRequests");
				const existingRequests = requests ? JSON.parse(requests) : [];
				const updatedRequests = [...existingRequests, newItem];
				localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));
				storage.accessRequests = updatedRequests;
				break;
			}
			case "event-registrations": {
				const eventRegistrations = localStorage.getItem("eventRegistrations");
				const existingRegistrations = eventRegistrations
					? JSON.parse(eventRegistrations)
					: [];
				const updatedRegistrations = [...existingRegistrations, newItem];
				localStorage.setItem(
					"eventRegistrations",
					JSON.stringify(updatedRegistrations),
				);
				storage.eventRegistrations = updatedRegistrations;
				break;
			}
		}

		return { data: newItem };
	},

	update: async ({ resource, id, variables }) => {
		await simulateDelay();

		const now = new Date().toISOString();

		let updatedItem: any;

		switch (resource) {
			case "members": {
				// Initialize localStorage with fakeData on first access
				initializeLocalStorage();

				// Sync with localStorage
				const membersFromStorage = localStorage.getItem("members");
				const existingMembers = membersFromStorage
					? JSON.parse(membersFromStorage)
					: storage.members;
				const updatedMembers = existingMembers.map((m: Member) =>
					m.id === id ? { ...m, ...variables, updatedAt: now } : m,
				);
				localStorage.setItem("members", JSON.stringify(updatedMembers));
				storage.members = updatedMembers;
				updatedItem = storage.members.find((m) => m.id === id);
				break;
			}
			case "transactions":
				storage.transactions = storage.transactions.map((t) =>
					t.id === id ? { ...t, ...variables, updatedAt: now } : t,
				);
				updatedItem = storage.transactions.find((t) => t.id === id);
				break;
			case "events":
				storage.events = storage.events.map((e) =>
					e.id === id ? { ...e, ...variables, updatedAt: now } : e,
				);
				updatedItem = storage.events.find((e) => e.id === id);
				break;
			case "schedules":
				storage.schedules = storage.schedules.map((s) =>
					s.id === id ? { ...s, ...variables, updatedAt: now } : s,
				);
				updatedItem = storage.schedules.find((s) => s.id === id);
				break;
			case "ministries":
				storage.ministries = storage.ministries.map((m) =>
					m.id === id ? { ...m, ...variables, updatedAt: now } : m,
				);
				updatedItem = storage.ministries.find((m) => m.id === id);
				break;
			case "users": {
				storage.users = storage.users.map((u) =>
					u.id === id ? { ...u, ...variables, updatedAt: now } : u,
				);
				updatedItem = storage.users.find((u) => u.id === id);
				// Sync with localStorage
				localStorage.setItem("users", JSON.stringify(storage.users));
				break;
			}
			case "tenants":
				storage.tenants = storage.tenants.map((t) =>
					t.id === id ? { ...t, ...variables, updatedAt: now } : t,
				);
				updatedItem = storage.tenants.find((t) => t.id === id);
				break;
			case "access-requests": {
				const requests = localStorage.getItem("accessRequests");
				const existingRequests = requests ? JSON.parse(requests) : [];
				const updatedRequests = existingRequests.map((r: AccessRequest) =>
					r.id === id ? { ...r, ...variables } : r,
				);
				localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));
				storage.accessRequests = updatedRequests;
				updatedItem = updatedRequests.find((r: AccessRequest) => r.id === id);
				break;
			}
		}

		if (!updatedItem) {
			throw new Error(`Resource ${resource} with id ${id} not found`);
		}

		return { data: updatedItem };
	},

	deleteOne: async ({ resource, id }) => {
		await simulateDelay();

		switch (resource) {
			case "members": {
				// Initialize localStorage with fakeData on first access
				initializeLocalStorage();

				// Sync with localStorage
				const membersFromStorage = localStorage.getItem("members");
				const existingMembers = membersFromStorage
					? JSON.parse(membersFromStorage)
					: storage.members;
				const updatedMembers = existingMembers.filter(
					(m: Member) => m.id !== id,
				);
				localStorage.setItem("members", JSON.stringify(updatedMembers));
				storage.members = updatedMembers;
				break;
			}
			case "transactions":
				storage.transactions = storage.transactions.filter((t) => t.id !== id);
				break;
			case "events":
				storage.events = storage.events.filter((e) => e.id !== id);
				break;
			case "schedules":
				storage.schedules = storage.schedules.filter((s) => s.id !== id);
				break;
			case "ministries":
				storage.ministries = storage.ministries.filter((m) => m.id !== id);
				break;
			case "users": {
				storage.users = storage.users.filter((u) => u.id !== id);
				localStorage.setItem("users", JSON.stringify(storage.users));
				break;
			}
			case "tenants":
				storage.tenants = storage.tenants.filter((t) => t.id !== id);
				break;
			case "access-requests": {
				const requests = localStorage.getItem("accessRequests");
				const existingRequests = requests ? JSON.parse(requests) : [];
				const updatedRequests = existingRequests.filter(
					(r: AccessRequest) => r.id !== id,
				);
				localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));
				storage.accessRequests = updatedRequests;
				break;
			}
		}

		return { data: { id } } as any;
	},

	getApiUrl: () => {
		return "http://localhost:3000/api";
	},

	// Custom method to reset data
	custom: async ({ url, method, query }) => {
		await simulateDelay();

		if (url === "/reset" && method === "post") {
			// Reset to initial fake data
			storage = {
				members: [...fakeData.members],
				transactions: [...fakeData.transactions],
				events: [...fakeData.events],
				schedules: [...fakeData.schedules],
				ministries: [...fakeData.ministries],
				users: [...fakeData.users],
				tenants: [fakeData.tenant],
				accessRequests: [],
				memberRegistrations: [],
				eventRegistrations: [],
			};

			// Clear localStorage and reset initialization flag
			localStorage.clear();
			isLocalStorageInitialized = false;

			return { data: { message: "Data reset successfully" } };
		}

		if (url === "/dashboard/stats" && method === "get") {
			const totalMembers = storage.members.length;
			const activeMembers = storage.members.filter(
				(m) => m.status === "active",
			).length;
			const visitors = storage.members.filter(
				(m) => m.status === "visitor",
			).length;

			const now = new Date();
			const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			const monthTransactions = storage.transactions.filter((t) => {
				const date = new Date(t.date);
				return date >= firstDayOfMonth && date <= lastDayOfMonth;
			});

			const totalIncome = monthTransactions
				.filter((t) => t.type === "income")
				.reduce((sum, t) => sum + t.amount, 0);

			const totalExpense = monthTransactions
				.filter((t) => t.type === "expense")
				.reduce((sum, t) => sum + t.amount, 0);

			const upcomingEvents = storage.events
				.filter((e) => new Date(e.date) >= now && e.status === "published")
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
				.slice(0, 5);

			const upcomingSchedules = storage.schedules
				.filter((s) => new Date(s.date) >= now)
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
				.slice(0, 5);

			// Calculate historical data for analytics charts
			// Determine period from query param (defaults to 12 months)
			const period =
				(query as Record<string, unknown> | undefined)?.period || "12months";
			let monthsBack = 11; // 12 months including current
			if (period === "3months") monthsBack = 2;
			else if (period === "6months") monthsBack = 5;

			// Generate historical financial data
			const historicalFinancialData = [];
			for (let i = monthsBack; i >= 0; i--) {
				const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
				const monthEnd = new Date(
					monthDate.getFullYear(),
					monthDate.getMonth() + 1,
					0,
				);
				const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

				const transactions = storage.transactions.filter((t) => {
					const date = new Date(t.date);
					return (
						date >= monthDate &&
						date <= monthEnd &&
						date.getFullYear() === monthDate.getFullYear() &&
						date.getMonth() === monthDate.getMonth()
					);
				});

				const income = transactions
					.filter((t) => t.type === "income")
					.reduce((sum, t) => sum + t.amount, 0);

				const expense = transactions
					.filter((t) => t.type === "expense")
					.reduce((sum, t) => sum + t.amount, 0);

				historicalFinancialData.push({
					month: monthKey,
					monthLabel: monthDate.toLocaleDateString("pt-BR", {
						month: "short",
						year: "numeric",
					}),
					income,
					expense,
					balance: income - expense,
				});
			}

			// Generate historical members data
			const historicalMembersData = [];
			for (let i = monthsBack; i >= 0; i--) {
				const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
				const monthEnd = new Date(
					monthDate.getFullYear(),
					monthDate.getMonth() + 1,
					0,
				);
				const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

				// Count members created up to this month
				const membersUpToMonth = storage.members.filter((m) => {
					const createdDate = new Date(m.createdAt);
					return createdDate <= monthEnd;
				});

				const active = membersUpToMonth.filter(
					(m) => m.status === "active",
				).length;
				const inactive = membersUpToMonth.filter(
					(m) => m.status === "inactive",
				).length;
				const visitorsCount = membersUpToMonth.filter(
					(m) => m.status === "visitor",
				).length;

				historicalMembersData.push({
					month: monthKey,
					monthLabel: monthDate.toLocaleDateString("pt-BR", {
						month: "short",
						year: "numeric",
					}),
					active,
					inactive,
					visitors: visitorsCount,
					total: membersUpToMonth.length,
				});
			}

			return {
				data: {
					totalMembers,
					activeMembers,
					visitors,
					financialSummary: {
						totalIncome,
						totalExpense,
						balance: totalIncome - totalExpense,
						period: {
							start: firstDayOfMonth.toISOString(),
							end: lastDayOfMonth.toISOString(),
						},
					},
					upcomingEvents,
					upcomingSchedules,
					historicalFinancialData,
					historicalMembersData,
				},
			} as any;
		}

		// Get public event registration config
		if (
			url?.startsWith("/events/") &&
			url.endsWith("/registration-config") &&
			method === "get"
		) {
			const eventId = url.split("/")[2];
			const event = storage.events.find((e) => e.id === eventId);

			if (!event) {
				throw new Error("Event not found");
			}

			if (!event.registrationConfig?.enabled) {
				throw new Error("Event registration is not enabled");
			}

			return {
				data: {
					event: {
						id: event.id,
						title: event.title,
						description: event.description,
						date: event.date,
						time: event.time,
						location: event.location,
					},
					config: event.registrationConfig,
				},
			};
		}

		// Public event registration submission
		if (url === "/public/event-registration" && method === "post") {
			const payload = (query as Record<string, unknown>) || {};
			const eventId = payload.eventId as string;

			const event = storage.events.find((e) => e.id === eventId);
			if (!event) {
				throw new Error("Event not found");
			}

			if (!event.registrationConfig?.enabled) {
				throw new Error("Event registration is not enabled");
			}

			// Check capacity
			if (event.registrationConfig.capacity) {
				const eventRegistrations = localStorage.getItem("eventRegistrations");
				const registrations = eventRegistrations
					? JSON.parse(eventRegistrations)
					: [];
				const eventRegCount = registrations.filter(
					(r: EventRegistration) => r.eventId === eventId,
				).length;

				if (eventRegCount >= event.registrationConfig.capacity) {
					throw new Error("Event is at full capacity");
				}
			}

			// Check deadline
			if (event.registrationConfig.registrationDeadline) {
				const deadline = new Date(
					event.registrationConfig.registrationDeadline,
				);
				if (new Date() > deadline) {
					throw new Error("Registration deadline has passed");
				}
			}

			const id = `event-reg-${Date.now()}`;
			const now = new Date().toISOString();

			const newRegistration: EventRegistration = {
				id,
				eventId,
				email: payload.email as string,
				name: payload.name as string,
				phone: payload.phone as string | undefined,
				formData: payload.formData as Record<
					string,
					string | number | boolean | string[]
				>,
				status: "approved",
				registeredAt: now,
				checkedIn: false,
			};

			const eventRegistrations = localStorage.getItem("eventRegistrations");
			const existingRegistrations = eventRegistrations
				? JSON.parse(eventRegistrations)
				: [];
			const updatedRegistrations = [...existingRegistrations, newRegistration];
			localStorage.setItem(
				"eventRegistrations",
				JSON.stringify(updatedRegistrations),
			);
			storage.eventRegistrations = updatedRegistrations;

			return {
				data: {
					message:
						event.registrationConfig.confirmationMessage ||
						"Registration submitted successfully!",
					registration: newRegistration,
				},
			};
		}

		throw new Error(`Custom endpoint ${url} not found`);
	},
};

export default localDataProvider;
