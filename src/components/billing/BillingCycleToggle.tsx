import { Badge, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import type { BillingCycle } from "@/types";

interface BillingCycleToggleProps {
	value: BillingCycle;
	onChange: (value: BillingCycle) => void;
	savingsPercentage?: number;
}

/**
 * Toggle component for switching between monthly and annual billing cycles
 * Shows savings badge for annual billing
 */
export const BillingCycleToggle = ({
	value,
	onChange,
	savingsPercentage = 17,
}: BillingCycleToggleProps) => {
	return (
		<Stack gap="xs" align="center">
			<SegmentedControl
				value={value}
				onChange={(val) => onChange(val as BillingCycle)}
				data={[
					{ label: "Mensal", value: "monthly" },
					{ label: "Anual", value: "annual" },
				]}
				size="md"
				color="blue"
				radius="md"
			/>
			{value === "annual" && (
				<Group gap="xs">
					<Badge color="green" variant="filled" size="lg">
						Economize ~{savingsPercentage}%
					</Badge>
					<Text size="xs" c="dimmed">
						no plano anual
					</Text>
				</Group>
			)}
		</Stack>
	);
};
