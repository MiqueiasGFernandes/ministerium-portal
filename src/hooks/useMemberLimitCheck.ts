import { notifications } from "@mantine/notifications";
import { useCustom, useList } from "@refinedev/core";
import { useEffect } from "react";
import type { Plan } from "@/types";

/**
 * Hook to check if the current member count exceeds the subscription plan limit
 * Shows a warning notification if limit is exceeded
 */
export const useMemberLimitCheck = () => {
	const tenantId = "1"; // In real app, get from auth context

	// Get current member count
	const { data: membersData } = useList({
		resource: "members",
		pagination: { current: 1, pageSize: 1 },
	});

	const memberCount = membersData?.total || 0;

	// Check limit via custom endpoint
	const {
		data: limitData,
		isLoading,
		refetch,
	} = useCustom<{
		exceedsLimit: boolean;
		currentLimit: number | null;
		currentCount: number;
		plan: string;
		suggestedPlans: Plan[];
	}>({
		url: "/billing/check-member-limit",
		method: "post",
		config: {
			payload: {
				tenantId,
				newMemberCount: memberCount,
			},
		},
		queryOptions: {
			enabled: memberCount > 0,
		},
	});

	const exceedsLimit = limitData?.data?.exceedsLimit || false;
	const currentLimit = limitData?.data?.currentLimit;
	const suggestedPlans = limitData?.data?.suggestedPlans || [];

	// Show warning when limit is exceeded
	useEffect(() => {
		if (exceedsLimit && currentLimit) {
			notifications.show({
				id: "member-limit-exceeded",
				title: "Limite de membros atingido",
				message: `Você atingiu o limite de ${currentLimit} membros do seu plano. Faça upgrade para continuar adicionando membros.`,
				color: "orange",
				autoClose: false,
			});
		}
	}, [exceedsLimit, currentLimit]);

	return {
		memberCount,
		exceedsLimit,
		currentLimit,
		suggestedPlans,
		isLoading,
		refetch,
	};
};
