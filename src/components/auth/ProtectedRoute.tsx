import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Center, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Protected Route Component
 * Checks user permissions and roles before rendering children
 */
export const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requiredRole,
  requiredRoles = [],
  requireAll = false,
  fallback,
}: ProtectedRouteProps) => {
  const {
    permissions,
    identity,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = usePermissions();

  // Loading state
  if (permissions === undefined || identity === undefined) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  // Check multiple permissions
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return fallback || <Navigate to="/unauthorized" replace />;
    }
  }

  // Check single role
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  // Check multiple roles
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

/**
 * Unauthorized Page Component
 */
export const UnauthorizedPage = () => {
  return (
    <Center h="100vh" p="xl">
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Acesso Negado"
        color="red"
        variant="filled"
      >
        Você não tem permissão para acessar esta página. Entre em contato com o administrador
        se precisar de acesso.
      </Alert>
    </Center>
  );
};

export default ProtectedRoute;
