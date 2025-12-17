import { Badge } from "@mantine/core";
import type { SubscriptionStatus } from "@/types";

interface SubscriptionStatusBadgeProps {
	status: SubscriptionStatus;
}

/**
 * Badge component to display subscription status with appropriate colors
 */
export const SubscriptionStatusBadge = ({
	status,
}: SubscriptionStatusBadgeProps) => {
	const getStatusConfig = (status: SubscriptionStatus) => {
		switch (status) {
			case "trial":
				return { color: "yellow", label: "Trial" };
			case "active":
				return { color: "green", label: "Ativo" };
			case "pending":
				return { color: "blue", label: "Pendente" };
			case "canceled":
				return { color: "red", label: "Cancelado" };
			case "past_due":
				return { color: "orange", label: "Vencido" };
			default:
				return { color: "gray", label: "Desconhecido" };
		}
	};

	const config = getStatusConfig(status);

	return (
		<Badge color={config.color} variant="filled">
			{config.label}
		</Badge>
	);
};
