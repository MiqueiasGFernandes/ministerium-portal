import {
	Container,
	Grid,
	LoadingOverlay,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useList, useNavigation } from "@refinedev/core";
import { useState } from "react";
import { BillingCycleToggle, PlanCard } from "@/components/billing";
import type { BillingCycle, Plan } from "@/types";

/**
 * Plans page - displays all available subscription plans
 * Follows PRD specifications for plan display and selection
 */
export const Plans = () => {
	const { push } = useNavigation();
	const [billingCycle, setBillingCycle] = useState<BillingCycle>(
		"monthly" as BillingCycle,
	);

	// Fetch all plans
	const { data: plansData, isLoading } = useList<Plan>({
		resource: "plans",
		pagination: {
			mode: "off",
		},
	});

	const plans = plansData?.data || [];

	const handleSelectPlan = (planId: string) => {
		const plan = plans.find((p: Plan) => p.id === planId);

		if (plan?.isCustom) {
			// Redirect to enterprise lead form
			push("/billing/enterprise-contact");
		} else {
			// Redirect to checkout
			push(`/billing/checkout?planId=${planId}&cycle=${billingCycle}`);
		}
	};

	return (
		<Container size="xl" py="xl">
			<Stack gap="xl" pos="relative">
				<LoadingOverlay visible={isLoading} />

				{/* Header */}
				<Stack gap="md" align="center">
					<Title order={1} ta="center">
						Escolha o Plano Ideal para sua Igreja
					</Title>
					<Text size="lg" c="dimmed" ta="center" maw={600}>
						Simplicidade extrema para igrejas pequenas. Escala por maturidade
						organizacional, não por usuários.
					</Text>
				</Stack>

				{/* Billing Cycle Toggle */}
				<BillingCycleToggle
					value={billingCycle}
					onChange={setBillingCycle}
					savingsPercentage={17}
				/>

				{/* All Plans Grid */}
				<Grid>
					{plans.map((plan: Plan) => (
						<Grid.Col key={plan.id} span={{ base: 12, sm: 6, md: 4, lg: 2.4 }}>
							<PlanCard
								plan={plan}
								billingCycle={billingCycle}
								onSelect={handleSelectPlan}
								isPopular={plan.isPopular}
							/>
						</Grid.Col>
					))}
				</Grid>
			</Stack>
		</Container>
	);
};

export default Plans;
