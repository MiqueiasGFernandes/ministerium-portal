import { Refine, Authenticated } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import { ErrorComponent, useNotificationProvider } from '@refinedev/mantine';
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import {
  IconUsers,
  IconCash,
  IconCalendarEvent,
  IconClipboardList,
  IconLayoutDashboard,
  IconSettings,
} from '@tabler/icons-react';

import { authProvider } from '@/providers/authProvider';
import { localDataProvider } from '@/providers/dataProvider';
import { config } from '@/config/env';

import { Login } from '@/pages/auth/Login';
import { Layout } from '@/components/layout/Layout';
import { UnauthorizedPage } from '@/components/auth/ProtectedRoute';

// Pages
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { MemberList } from '@/pages/members/MemberList';
import { MemberCreate } from '@/pages/members/MemberCreate';
import { MemberEdit } from '@/pages/members/MemberEdit';
import { MemberShow } from '@/pages/members/MemberShow';
import { TransactionList } from '@/pages/finance/TransactionList';
import { TransactionCreate } from '@/pages/finance/TransactionCreate';
import { TransactionEdit } from '@/pages/finance/TransactionEdit';
import { EventList } from '@/pages/events/EventList';
import { EventCreate } from '@/pages/events/EventCreate';
import { EventEdit } from '@/pages/events/EventEdit';
import { EventShow } from '@/pages/events/EventShow';
import { ScheduleList } from '@/pages/schedules/ScheduleList';
import { ScheduleCreate } from '@/pages/schedules/ScheduleCreate';
import { ScheduleEdit } from '@/pages/schedules/ScheduleEdit';
import { Settings } from '@/pages/settings/Settings';

function App() {
  const resources = [
    {
      name: 'dashboard',
      list: '/',
      meta: {
        label: 'Dashboard',
        icon: <IconLayoutDashboard />,
      },
    },
  ];

  // Conditionally add resources based on feature toggles
  if (config.features.members) {
    resources.push({
      name: 'members',
      list: '/members',
      create: '/members/create',
      edit: '/members/edit/:id',
      show: '/members/show/:id',
      meta: {
        label: 'Membros',
        icon: <IconUsers />,
      },
    });
  }

  if (config.features.finance) {
    resources.push({
      name: 'transactions',
      list: '/finance',
      create: '/finance/create',
      edit: '/finance/edit/:id',
      meta: {
        label: 'Financeiro',
        icon: <IconCash />,
      },
    });
  }

  if (config.features.events) {
    resources.push({
      name: 'events',
      list: '/events',
      create: '/events/create',
      edit: '/events/edit/:id',
      show: '/events/show/:id',
      meta: {
        label: 'Eventos',
        icon: <IconCalendarEvent />,
      },
    });
  }

  if (config.features.schedules) {
    resources.push({
      name: 'schedules',
      list: '/schedules',
      create: '/schedules/create',
      edit: '/schedules/edit/:id',
      meta: {
        label: 'Escalas',
        icon: <IconClipboardList />,
      },
    });
  }

  resources.push({
    name: 'settings',
    list: '/settings',
    meta: {
      label: 'Configurações',
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
            projectId: 'ministerium-mvp',
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
                <>
                  <Route path="/members">
                    <Route index element={<MemberList />} />
                    <Route path="create" element={<MemberCreate />} />
                    <Route path="edit/:id" element={<MemberEdit />} />
                    <Route path="show/:id" element={<MemberShow />} />
                  </Route>
                </>
              )}

              {/* Finance Routes */}
              {config.features.finance && (
                <>
                  <Route path="/finance">
                    <Route index element={<TransactionList />} />
                    <Route path="create" element={<TransactionCreate />} />
                    <Route path="edit/:id" element={<TransactionEdit />} />
                  </Route>
                </>
              )}

              {/* Events Routes */}
              {config.features.events && (
                <>
                  <Route path="/events">
                    <Route index element={<EventList />} />
                    <Route path="create" element={<EventCreate />} />
                    <Route path="edit/:id" element={<EventEdit />} />
                    <Route path="show/:id" element={<EventShow />} />
                  </Route>
                </>
              )}

              {/* Schedules Routes */}
              {config.features.schedules && (
                <>
                  <Route path="/schedules">
                    <Route index element={<ScheduleList />} />
                    <Route path="create" element={<ScheduleCreate />} />
                    <Route path="edit/:id" element={<ScheduleEdit />} />
                  </Route>
                </>
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
                  <NavigateToResource resource="dashboard" />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
            </Route>
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
