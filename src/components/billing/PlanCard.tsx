import {
	Badge,
	Button,
	Card,
	Divider,
	Group,
	List,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { gradientButtonStyles } from "@/styles/buttonStyles";
import type { BillingCycle, Plan } from "@/types";

interface PlanCardProps {
	plan: Plan;
	billingCycle: BillingCycle;
	onSelect: (planId: string) => void;
	isCurrentPlan?: boolean;
	disabled?: boolean;
	isPopular?: boolean;
}

/**
 * Card component to display plan details and features
 * Follows the PRD design specifications
 */
export const PlanCard = ({
	plan,
	billingCycle,
	onSelect,
	isCurrentPlan = false,
	disabled = false,
	isPopular = false,
}: PlanCardProps) => {
	const price =
		billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
	const priceDisplay = plan.isCustom ? "Sob consulta" : `R$ ${price}`;
	const periodDisplay = billingCycle === "monthly" ? "/mês" : "/ano";

	// Calculate monthly equivalent for annual plan
	const monthlyEquivalent = plan.isCustom
		? null
		: billingCycle === "annual"
			? Math.round(plan.annualPrice / 12)
			: null;

	return (
		<Card
			shadow="sm"
			padding="lg"
			radius="md"
			withBorder
			style={(theme) => ({
				position: "relative",
				border:
					isPopular || plan.isPopular
						? `2px solid ${theme.colors.blue[6]}`
						: undefined,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				overflow: "visible",
			})}
		>
			{(isPopular || plan.isPopular) && (
				<Badge
					color="blue"
					variant="filled"
					size="lg"
					style={{
						position: "absolute",
						top: -12,
						right: 16,
						zIndex: 10,
					}}
				>
					Mais Popular
				</Badge>
			)}

			<Stack gap="md" style={{ flex: 1 }}>
				<div>
					<Title order={3}>{plan.name}</Title>
					<Text size="sm" c="dimmed">
						{plan.description}
					</Text>
				</div>

				<div>
					<Group align="baseline" gap="xs">
						<Title order={2}>{priceDisplay}</Title>
						{!plan.isCustom && <Text c="dimmed">{periodDisplay}</Text>}
					</Group>
					{monthlyEquivalent && (
						<Text size="xs" c="dimmed">
							Equivalente a R$ {monthlyEquivalent}/mês
						</Text>
					)}
				</div>

				<Text size="sm" fw={500} c="blue">
					{plan.recommendedFor}
				</Text>

				<Divider />

				<List
					spacing="sm"
					size="sm"
					icon={
						<ThemeIcon color="teal" size={20} radius="xl">
							<IconCheck size={12} />
						</ThemeIcon>
					}
				>
					{/* Core Features */}
					{plan.features.maxMembers !== null && (
						<List.Item>Até {plan.features.maxMembers} membros</List.Item>
					)}
					{plan.features.maxMembers === null && (
						<List.Item>Membros ilimitados</List.Item>
					)}

					{plan.features.maxAdminUsers === 1 && (
						<List.Item>1 usuário Admin</List.Item>
					)}
					{plan.features.maxAdminUsers === null && (
						<List.Item>Usuários ilimitados</List.Item>
					)}

					{plan.features.multipleRoles && (
						<List.Item>Múltiplos papéis (Admin, Líder, Voluntário)</List.Item>
					)}

					{plan.features.ministryManagement && (
						<List.Item>Gestão por ministério</List.Item>
					)}

					{plan.features.advancedReports && (
						<List.Item>Relatórios avançados</List.Item>
					)}

					{plan.features.dataExport && (
						<List.Item>Exportação de dados</List.Item>
					)}

					{plan.features.activityHistory && (
						<List.Item>Histórico de atividades</List.Item>
					)}

					{plan.features.prioritySupport && (
						<List.Item>Suporte prioritário</List.Item>
					)}

					{plan.features.fastSupport && <List.Item>Suporte rápido</List.Item>}

					{plan.features.consolidatedDashboards && (
						<List.Item>Dashboards consolidados</List.Item>
					)}

					{plan.features.earlyAccess && (
						<List.Item>Acesso antecipado a novas funcionalidades</List.Item>
					)}

					{plan.features.customization && (
						<List.Item>Customização de fluxos</List.Item>
					)}

					{plan.features.multipleCongregations && (
						<List.Item>Múltiplas congregações</List.Item>
					)}

					{plan.features.teamTraining && (
						<List.Item>Treinamento de equipes</List.Item>
					)}

					{plan.features.dedicatedSLA && <List.Item>SLA dedicado</List.Item>}
				</List>

				{/* Not included features for basic plans */}
				{!plan.features.multipleRoles && (
					<List
						spacing="xs"
						size="sm"
						icon={
							<ThemeIcon color="gray" size={20} radius="xl">
								<IconX size={12} />
							</ThemeIcon>
						}
					>
						<List.Item c="dimmed">Múltiplos papéis</List.Item>
					</List>
				)}
			</Stack>

			<Button
				fullWidth
				mt="md"
				styles={!disabled && !isCurrentPlan ? gradientButtonStyles : undefined}
				onClick={() => onSelect(plan.id)}
				disabled={disabled || isCurrentPlan}
			>
				{isCurrentPlan
					? "Plano Atual"
					: plan.isCustom
						? "Falar com Consultor"
						: "Selecionar Plano"}
			</Button>
		</Card>
	);
};
