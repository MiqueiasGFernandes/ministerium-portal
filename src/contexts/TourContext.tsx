/**
 * Tour Context
 * Single Responsibility: Provide tour state and actions to components
 * Dependency Inversion: Components depend on ITourContext interface
 */

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { tourService } from "@/services/tour/TourService";
import type {
	ITourContext,
	TourConfig,
	TourState,
	TourStep,
} from "@/types/tour";

const TourContext = createContext<ITourContext | undefined>(undefined);

interface TourProviderProps {
	children: ReactNode;
}

export const TourProvider = ({ children }: TourProviderProps) => {
	const [state, setState] = useState<TourState>({
		isActive: false,
		currentStepIndex: 0,
		completedTours: [],
	});
	const [currentTour, setCurrentTour] = useState<TourConfig | null>(null);

	const startTour = useCallback((config: TourConfig) => {
		// Only start if tour hasn't been completed
		if (tourService.shouldShowTour(config.id)) {
			setCurrentTour(config);
			setState({
				isActive: true,
				currentStepIndex: 0,
				completedTours: [],
			});
		}
	}, []);

	const nextStep = useCallback(() => {
		if (!currentTour) return;

		setState((prev) => {
			const nextIndex = prev.currentStepIndex + 1;

			// If last step, complete the tour
			if (nextIndex >= currentTour.steps.length) {
				tourService.markTourAsCompleted(currentTour.id);
				currentTour.onComplete?.();
				setCurrentTour(null);
				return {
					...prev,
					isActive: false,
					currentStepIndex: 0,
				};
			}

			return {
				...prev,
				currentStepIndex: nextIndex,
			};
		});
	}, [currentTour]);

	const previousStep = useCallback(() => {
		setState((prev) => ({
			...prev,
			currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
		}));
	}, []);

	const skipTour = useCallback(() => {
		if (!currentTour) return;

		tourService.markTourAsCompleted(currentTour.id);
		currentTour.onSkip?.();
		setCurrentTour(null);
		setState({
			isActive: false,
			currentStepIndex: 0,
			completedTours: [],
		});
	}, [currentTour]);

	const completeTour = useCallback(() => {
		if (!currentTour) return;

		tourService.markTourAsCompleted(currentTour.id);
		currentTour.onComplete?.();
		setCurrentTour(null);
		setState({
			isActive: false,
			currentStepIndex: 0,
			completedTours: [],
		});
	}, [currentTour]);

	const currentStep: TourStep | null =
		currentTour?.steps[state.currentStepIndex] ?? null;

	const value: ITourContext = {
		state,
		startTour,
		nextStep,
		previousStep,
		skipTour,
		completeTour,
		currentTour,
		currentStep,
	};

	return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export const useTour = (): ITourContext => {
	const context = useContext(TourContext);
	if (!context) {
		throw new Error("useTour must be used within a TourProvider");
	}
	return context;
};
