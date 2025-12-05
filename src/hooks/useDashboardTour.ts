/**
 * Dashboard Tour Hook
 * Single Responsibility: Manage dashboard tour lifecycle
 */

import { useEffect } from "react";
import { dashboardTourConfig } from "@/config/tours/dashboardTour";
import { useTour } from "@/contexts/TourContext";
import { featureToggleService } from "@/services/featureToggle/FeatureToggleService";
import { tourService } from "@/services/tour/TourService";

export const useDashboardTour = () => {
	const { startTour } = useTour();

	useEffect(() => {
		// Check if feature is enabled and tour hasn't been completed
		if (
			featureToggleService.isEnabled("firstAccessTour") &&
			tourService.shouldShowTour(dashboardTourConfig.id)
		) {
			// Small delay to ensure DOM is ready
			const timeoutId = setTimeout(() => {
				startTour(dashboardTourConfig);
			}, 1000);

			return () => clearTimeout(timeoutId);
		}
	}, [startTour]);
};
