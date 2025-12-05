/**
 * Tour Tooltip Component
 * Single Responsibility: Display tour step content with navigation
 * Interface Segregation: Only uses what it needs from tour context
 */

import {
	Box,
	Button,
	Group,
	Paper,
	Progress,
	Stack,
	Text,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTour } from "@/contexts/TourContext";

const TOOLTIP_WIDTH = 400;
const TOOLTIP_ESTIMATED_HEIGHT = 350;
const SPACING = 20;

export const TourTooltip = () => {
	const { state, currentStep, currentTour, nextStep, previousStep, skipTour } =
		useTour();
	const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const tooltipRef = useRef<HTMLDivElement>(null);

	const calculatePosition = useCallback(() => {
		if (!targetElement || !currentStep) return null;

		const targetRect = targetElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Use actual tooltip dimensions if available
		const tooltipWidth = Math.min(TOOLTIP_WIDTH, viewportWidth - SPACING * 2);
		const tooltipHeight =
			tooltipRef.current?.offsetHeight || TOOLTIP_ESTIMATED_HEIGHT;

		let placement = currentStep.placement || "bottom";
		let top = 0;
		let left = 0;

		// Try original placement first
		switch (placement) {
			case "bottom":
				top = targetRect.bottom + SPACING;
				left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

				// Check if it fits
				if (top + tooltipHeight + SPACING > viewportHeight) {
					// Try top instead
					const topPlacement = targetRect.top - SPACING - tooltipHeight;
					if (topPlacement >= SPACING) {
						placement = "top";
						top = topPlacement;
					} else {
						// Force fit in viewport
						top = viewportHeight - tooltipHeight - SPACING;
					}
				}
				break;

			case "top":
				top = targetRect.top - SPACING - tooltipHeight;
				left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

				// Check if it fits
				if (top < SPACING) {
					// Try bottom instead
					const bottomPlacement = targetRect.bottom + SPACING;
					if (bottomPlacement + tooltipHeight + SPACING <= viewportHeight) {
						placement = "bottom";
						top = bottomPlacement;
					} else {
						// Force fit in viewport
						top = SPACING;
					}
				}
				break;

			case "right":
				top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
				left = targetRect.right + SPACING;

				// Check if it fits
				if (left + tooltipWidth + SPACING > viewportWidth) {
					// Try left instead
					const leftPlacement = targetRect.left - SPACING - tooltipWidth;
					if (leftPlacement >= SPACING) {
						placement = "left";
						left = leftPlacement;
					} else {
						// Force fit in viewport
						left = viewportWidth - tooltipWidth - SPACING;
					}
				}
				break;

			case "left":
				top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
				left = targetRect.left - SPACING - tooltipWidth;

				// Check if it fits
				if (left < SPACING) {
					// Try right instead
					const rightPlacement = targetRect.right + SPACING;
					if (rightPlacement + tooltipWidth + SPACING <= viewportWidth) {
						placement = "right";
						left = rightPlacement;
					} else {
						// Force fit in viewport
						left = SPACING;
					}
				}
				break;
		}

		// Final boundary checks - ensure tooltip is fully within viewport
		// Horizontal bounds
		if (left < SPACING) {
			left = SPACING;
		} else if (left + tooltipWidth > viewportWidth - SPACING) {
			left = viewportWidth - tooltipWidth - SPACING;
		}

		// Vertical bounds
		if (top < SPACING) {
			top = SPACING;
		} else if (top + tooltipHeight > viewportHeight - SPACING) {
			top = viewportHeight - tooltipHeight - SPACING;
		}

		return { top, left };
	}, [targetElement, currentStep]);

	// Calculate position when step changes
	useEffect(() => {
		if (!currentStep || !state.isActive) {
			setTargetElement(null);
			return;
		}

		const element = document.querySelector(
			`[data-tour="${currentStep.target}"]`,
		) as HTMLElement;

		if (!element) {
			console.warn(`Tour target not found: ${currentStep.target}`);
			return;
		}

		setTargetElement(element);

		// Calculate initial position
		const pos = calculatePosition();
		if (pos) {
			setPosition(pos);
		}

		// Highlight element
		element.style.position = "relative";
		element.style.zIndex = "1001";
		element.scrollIntoView({ behavior: "smooth", block: "center" });

		// Execute step action if provided
		currentStep.action?.();

		return () => {
			element.style.position = "";
			element.style.zIndex = "";
		};
	}, [currentStep, state.isActive, calculatePosition]);

	// Recalculate when tooltip renders with actual dimensions
	useEffect(() => {
		if (!tooltipRef.current || !targetElement) return;

		const pos = calculatePosition();
		if (pos && (pos.top !== position.top || pos.left !== position.left)) {
			setPosition(pos);
		}
	}, [targetElement, calculatePosition, position.left, position.top]);

	if (!state.isActive || !currentStep || !currentTour || !targetElement) {
		return null;
	}

	const progress =
		((state.currentStepIndex + 1) / currentTour.steps.length) * 100;
	const isFirstStep = state.currentStepIndex === 0;
	const isLastStep = state.currentStepIndex === currentTour.steps.length - 1;

	const tooltipWidth = Math.min(TOOLTIP_WIDTH, window.innerWidth - SPACING * 2);

	return (
		<>
			{/* Backdrop */}
			<Box
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					zIndex: 1000,
				}}
				onClick={skipTour}
				data-tour-backdrop
			/>

			{/* Tooltip */}
			<AnimatePresence>
				<motion.div
					ref={tooltipRef}
					key={currentStep.id}
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.2 }}
					style={{
						position: "fixed",
						top: position.top,
						left: position.left,
						zIndex: 1002,
						width: tooltipWidth,
					}}
					data-tour-tooltip
				>
					<Paper p="md" shadow="xl" radius="md" withBorder>
						<Stack gap="md">
							{/* Header */}
							<Group justify="space-between" align="flex-start">
								<Text fw={600} size="lg">
									{currentStep.title}
								</Text>
								{currentStep.showSkip !== false && (
									<Button
										variant="subtle"
										color="gray"
										size="xs"
										onClick={skipTour}
										leftSection={<IconX size={14} />}
										data-tour-skip
									>
										Pular
									</Button>
								)}
							</Group>

							{/* Content */}
							<Text size="sm" c="dimmed">
								{currentStep.content}
							</Text>

							{/* Progress */}
							<Stack gap="xs">
								<Progress value={progress} size="sm" radius="xl" />
								<Text size="xs" c="dimmed" ta="center">
									{state.currentStepIndex + 1} de {currentTour.steps.length}
								</Text>
							</Stack>

							{/* Navigation */}
							<Group justify="space-between">
								<Button
									variant="subtle"
									onClick={previousStep}
									disabled={isFirstStep}
									leftSection={<IconArrowLeft size={16} />}
									data-tour-prev
								>
									Anterior
								</Button>
								<Button
									onClick={nextStep}
									rightSection={<IconArrowRight size={16} />}
									data-tour-next
								>
									{isLastStep ? "Concluir" : "Próximo"}
								</Button>
							</Group>
						</Stack>
					</Paper>
				</motion.div>
			</AnimatePresence>
		</>
	);
};
