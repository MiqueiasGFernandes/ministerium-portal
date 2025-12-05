/**
 * Tour Guide Types
 * Single Responsibility: Define types for the guided tour feature
 */

export interface TourStep {
	id: string;
	target: string; // CSS selector or data-tour attribute
	title: string;
	content: string;
	placement?: "top" | "bottom" | "left" | "right";
	showSkip?: boolean;
	action?: () => void;
}

export interface TourConfig {
	id: string;
	steps: TourStep[];
	onComplete?: () => void;
	onSkip?: () => void;
}

export interface TourState {
	isActive: boolean;
	currentStepIndex: number;
	completedTours: string[];
}

export interface ITourService {
	hasCompletedTour(tourId: string): boolean;
	markTourAsCompleted(tourId: string): void;
	resetTour(tourId: string): void;
	shouldShowTour(tourId: string): boolean;
}

export interface ITourContext {
	state: TourState;
	startTour: (config: TourConfig) => void;
	nextStep: () => void;
	previousStep: () => void;
	skipTour: () => void;
	completeTour: () => void;
	currentTour: TourConfig | null;
	currentStep: TourStep | null;
}
