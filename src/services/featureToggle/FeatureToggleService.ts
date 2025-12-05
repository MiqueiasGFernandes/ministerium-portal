/**
 * Feature Toggle Service
 * Single Responsibility: Manage feature flags
 * Open/Closed: Can add new features without modifying existing code
 */

export interface IFeatureToggleService {
	isEnabled(featureName: string): boolean;
	enable(featureName: string): void;
	disable(featureName: string): void;
}

const STORAGE_KEY = "ministerium_feature_toggles";

// Default feature flags
const DEFAULT_FEATURES = {
	firstAccessTour: true,
	dashboardTour: true,
	// Add more features as needed
};

export class FeatureToggleService implements IFeatureToggleService {
	private features: Record<string, boolean>;

	constructor() {
		this.features = this.loadFeatures();
	}

	private loadFeatures(): Record<string, boolean> {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			const savedFeatures = stored ? JSON.parse(stored) : {};
			return { ...DEFAULT_FEATURES, ...savedFeatures };
		} catch {
			return DEFAULT_FEATURES;
		}
	}

	private saveFeatures(): void {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.features));
		} catch (error) {
			console.error("Failed to save feature toggles:", error);
		}
	}

	isEnabled(featureName: string): boolean {
		return this.features[featureName] ?? false;
	}

	enable(featureName: string): void {
		this.features[featureName] = true;
		this.saveFeatures();
	}

	disable(featureName: string): void {
		this.features[featureName] = false;
		this.saveFeatures();
	}
}

// Singleton instance
export const featureToggleService = new FeatureToggleService();
