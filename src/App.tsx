import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { ErrorComponent, useNotificationProvider } from "@refinedev/mantine";
import routerBindings, {
	CatchAllNavigate,
	DocumentTitleHandler,
	NavigateToResource,
	UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import {
	IconCalendarEvent,
	IconCash,
	IconClipboardList,
	IconLayoutDashboard,
	IconSettings,
	IconUsers,
	IconUsersGroup,
} from "@tabler/icons-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { UnauthorizedPage } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { config } from "@/config/env";

import { Login } from "@/pages/auth/Login";
import { Onboarding } from "@/pages/onboarding/Onboarding";
// Pages
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { EventCreate } from "@/pages/events/EventCreate";
import { EventEdit } from "@/pages/events/EventEdit";
import { EventList } from "@/pages/events/EventList";
import { EventShow } from "@/pages/events/EventShow";
import { TransactionCreate } from "@/pages/finance/TransactionCreate";
import { TransactionEdit } from "@/pages/finance/TransactionEdit";
import { TransactionList } from "@/pages/finance/TransactionList";
import { MemberCreate } from "@/pages/members/MemberCreate";
import { MemberEdit } from "@/pages/members/MemberEdit";
import { MemberList } from "@/pages/members/MemberList";
import { MemberShow } from "@/pages/members/MemberShow";
import {
	MinistryCreate,
	MinistryEdit,
	MinistryList,
	MinistryShow,
} from "@/pages/ministries";
import { ScheduleCreate } from "@/pages/schedules/ScheduleCreate";
import { ScheduleEdit } from "@/pages/schedules/ScheduleEdit";
import { ScheduleList } from "@/pages/schedules/ScheduleList";
import { Settings } from "@/pages/settings/Settings";
import { authProvider } from "@/providers/authProvider";
import { localDataProvider } from "@/providers/dataProvider";

type Resource = {
	name: string;
	list?: string;
	create?: string;
	edit?: string;
	show?: string;
	meta: {
		label: string;
		icon: React.ReactNode;
	};
};

function App() {
	const resources: Resource[] = [
		{
			name: "dashboard",
			list: "/",
			meta: {
				label: "Dashboard",
				icon: <IconLayoutDashboard />,
			},
		},
	];

	// Conditionally add resources based on feature toggles
	if (config.features.members) {
		resources.push({
			name: "members",
			list: "/members",
			create: "/members/create",
			edit: "/members/edit/:id",
			show: "/members/show/:id",
			meta: {
				label: "Membros",
				icon: <IconUsers />,
			},
		});
	}

	if (config.features.finance) {
		resources.push({
			name: "transactions",
			list: "/finance",
			create: "/finance/create",
			edit: "/finance/edit/:id",
			meta: {
				label: "Financeiro",
				icon: <IconCash />,
			},
		});
	}

	if (config.features.events) {
		resources.push({
			name: "events",
			list: "/events",
			create: "/events/create",
			edit: "/events/edit/:id",
			show: "/events/show/:id",
			meta: {
				label: "Eventos",
				icon: <IconCalendarEvent />,
			},
		});
	}

	if (config.features.schedules) {
		resources.push({
			name: "schedules",
			list: "/schedules",
			create: "/schedules/create",
			edit: "/schedules/edit/:id",
			meta: {
				label: "Escalas",
				icon: <IconClipboardList />,
			},
		});
	}

	if (config.features.ministries) {
		resources.push({
			name: "ministries",
			list: "/ministries",
			create: "/ministries/create",
			edit: "/ministries/edit/:id",
			show: "/ministries/show/:id",
			meta: {
				label: "Ministérios",
				icon: <IconUsersGroup />,
			},
		});
	}

	resources.push({
		name: "settings",
		list: "/settings",
		meta: {
			label: "Configurações",
			icon: <IconSettings />,
		},
	});

	return (
		<BrowserRouter>
			<RefineKbarProvider>
				<Refine
					dataProvider={localDataProvider}
					authProvider={authProvider}
					routerProvider={routerBindings}
					notificationProvider={useNotificationProvider}
					resources={resources}
					options={{
						syncWithLocation: true,
						warnWhenUnsavedChanges: true,
						useNewQueryKeys: true,
						projectId: "ministerium-mvp",
					}}
				>
					<Routes>
						<Route
							element={
								<Authenticated
									key="authenticated-routes"
									fallback={<CatchAllNavigate to="/login" />}
								>
									<Layout>
										<Outlet />
									</Layout>
								</Authenticated>
							}
						>
							<Route index element={<Dashboard />} />

							{/* Members Routes */}
							{config.features.members && (
								<Route path="/members">
									<Route index element={<MemberList />} />
									<Route path="create" element={<MemberCreate />} />
									<Route path="edit/:id" element={<MemberEdit />} />
									<Route path="show/:id" element={<MemberShow />} />
								</Route>
							)}

							{/* Finance Routes */}
							{config.features.finance && (
								<Route path="/finance">
									<Route index element={<TransactionList />} />
									<Route path="create" element={<TransactionCreate />} />
									<Route path="edit/:id" element={<TransactionEdit />} />
								</Route>
							)}

							{/* Events Routes */}
							{config.features.events && (
								<Route path="/events">
									<Route index element={<EventList />} />
									<Route path="create" element={<EventCreate />} />
									<Route path="edit/:id" element={<EventEdit />} />
									<Route path="show/:id" element={<EventShow />} />
								</Route>
							)}

							{/* Schedules Routes */}
							{config.features.schedules && (
								<Route path="/schedules">
									<Route index element={<ScheduleList />} />
									<Route path="create" element={<ScheduleCreate />} />
									<Route path="edit/:id" element={<ScheduleEdit />} />
								</Route>
							)}

							{/* Ministries Routes */}
							{config.features.ministries && (
								<Route path="/ministries">
									<Route index element={<MinistryList />} />
									<Route path="create" element={<MinistryCreate />} />
									<Route path="edit/:id" element={<MinistryEdit />} />
									<Route path="show/:id" element={<MinistryShow />} />
								</Route>
							)}

							{/* Settings */}
							<Route path="/settings" element={<Settings />} />

							{/* Error Pages */}
							<Route path="/unauthorized" element={<UnauthorizedPage />} />
							<Route path="*" element={<ErrorComponent />} />
						</Route>

						{/* Auth Routes */}
						<Route
							element={
								<Authenticated key="auth-pages" fallback={<Outlet />}>
									<NavigateToResource />
								</Authenticated>
							}
						>
							<Route path="/login" element={<Login />} />
						</Route>

						{/* Onboarding Route - Public */}
						<Route path="/onboarding" element={<Onboarding />} />
					</Routes>

					<RefineKbar />
					<UnsavedChangesNotifier />
					<DocumentTitleHandler />
				</Refine>
			</RefineKbarProvider>
		</BrowserRouter>
	);
}

export default App;
