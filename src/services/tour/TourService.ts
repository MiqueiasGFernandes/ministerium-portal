/**
 * Tour Service
 * Single Responsibility: Manage tour persistence and state
 * Open/Closed: Can be extended without modification
 * Dependency Inversion: Depends on ITourService abstraction
 */

import type { ITourService } from "@/types/tour";

const STORAGE_KEY = "ministerium_completed_tours";

export class TourService implements ITourService {
	private getCompletedTours(): string[] {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	}

	private saveCompletedTours(tours: string[]): void {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
		} catch (error) {
			console.error("Failed to save completed tours:", error);
		}
	}

	hasCompletedTour(tourId: string): boolean {
		return this.getCompletedTours().includes(tourId);
	}

	markTourAsCompleted(tourId: string): void {
		const completedTours = this.getCompletedTours();
		if (!completedTours.includes(tourId)) {
			this.saveCompletedTours([...completedTours, tourId]);
		}
	}

	resetTour(tourId: string): void {
		const completedTours = this.getCompletedTours();
		this.saveCompletedTours(completedTours.filter((id) => id !== tourId));
	}

	shouldShowTour(tourId: string): boolean {
		return !this.hasCompletedTour(tourId);
	}
}

// Singleton instance
export const tourService = new TourService();
