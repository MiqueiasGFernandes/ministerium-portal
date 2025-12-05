/**
 * Dashboard Tour Configuration
 * Single Responsibility: Define dashboard tour steps
 */

import type { TourConfig } from "@/types/tour";

export const dashboardTourConfig: TourConfig = {
	id: "dashboard-first-access",
	steps: [
		{
			id: "welcome",
			target: "dashboard-title",
			title: "Bem-vindo ao Ministerium! 👋",
			content:
				"Este é o seu painel principal. Vamos fazer um tour rápido pelas funcionalidades principais.",
			placement: "bottom",
			showSkip: true,
		},
		{
			id: "navigation",
			target: "sidebar-navigation",
			title: "Menu de Navegação",
			content:
				"Aqui você encontra acesso rápido a todas as áreas do sistema: Membros, Ministérios, Eventos, Finanças e muito mais.",
			placement: "right",
		},
		{
			id: "stats",
			target: "dashboard-stats",
			title: "Estatísticas Gerais",
			content:
				"Acompanhe métricas importantes da sua organização em tempo real.",
			placement: "bottom",
		},
		{
			id: "events",
			target: "upcoming-events",
			title: "Próximos Eventos",
			content: "Visualize e gerencie os eventos programados da sua igreja.",
			placement: "top",
		},
		{
			id: "profile",
			target: "user-menu",
			title: "Seu Perfil",
			content:
				"Clique aqui para acessar suas configurações, perfil e fazer logout.",
			placement: "bottom",
		},
	],
	onComplete: () => {
		console.log("Dashboard tour completed");
	},
	onSkip: () => {
		console.log("Dashboard tour skipped");
	},
};
