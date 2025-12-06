import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface CanProps {
	permission: string;
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Component to conditionally render content based on permissions
 *
 * @example
 * <Can permission="members:create">
 *   <Button>Create Member</Button>
 * </Can>
 */
export const Can = ({ permission, children, fallback = null }: CanProps) => {
	const { hasPermission, isLoading } = usePermissions();

	// While loading, don't render anything to avoid flashing
	if (isLoading) {
		return <>{fallback}</>;
	}

	if (!hasPermission(permission)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

interface CanViewProps {
	resource: string;
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Component to conditionally render content if user can view a resource
 *
 * @example
 * <CanView resource="members">
 *   <MembersList />
 * </CanView>
 */
export const CanView = ({
	resource,
	children,
	fallback = null,
}: CanViewProps) => {
	const { canView, isLoading } = usePermissions();

	// While loading, don't render anything to avoid flashing
	if (isLoading) {
		return <>{fallback}</>;
	}

	if (!canView(resource)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

interface CanCreateProps {
	resource: string;
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Component to conditionally render content if user can create a resource
 *
 * @example
 * <CanCreate resource="members">
 *   <Button>Create Member</Button>
 * </CanCreate>
 */
export const CanCreate = ({
	resource,
	children,
	fallback = null,
}: CanCreateProps) => {
	const { canCreate, isLoading } = usePermissions();

	// While loading, don't render anything to avoid flashing
	if (isLoading) {
		return <>{fallback}</>;
	}

	if (!canCreate(resource)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

interface CanEditProps {
	resource: string;
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Component to conditionally render content if user can edit a resource
 *
 * @example
 * <CanEdit resource="members">
 *   <Button>Edit Member</Button>
 * </CanEdit>
 */
export const CanEdit = ({
	resource,
	children,
	fallback = null,
}: CanEditProps) => {
	const { canEdit, isLoading } = usePermissions();

	// While loading, don't render anything to avoid flashing
	if (isLoading) {
		return <>{fallback}</>;
	}

	if (!canEdit(resource)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

interface CanDeleteProps {
	resource: string;
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Component to conditionally render content if user can delete a resource
 *
 * @example
 * <CanDelete resource="members">
 *   <Button>Delete Member</Button>
 * </CanDelete>
 */
export const CanDelete = ({
	resource,
	children,
	fallback = null,
}: CanDeleteProps) => {
	const { canDelete, isLoading } = usePermissions();

	// While loading, don't render anything to avoid flashing
	if (isLoading) {
		return <>{fallback}</>;
	}

	if (!canDelete(resource)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};
