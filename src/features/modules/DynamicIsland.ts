import Refs from "@/utils/refs";
import Category from "./api/Category";
import Module from "./api/Module";

interface DynamicIslandElement {
	type: "text" | "progress" | "toggle" | "image";
	x: number;
	y: number;
	content?: string;
	color?: string;
	size?: number;
	bold?: boolean;
	shadow?: boolean;
	width?: number;
	height?: number;
	value?: number;
	bgColor?: string;
	rounded?: boolean;
	state?: boolean;
	animate?: boolean;
	src?: string;
}

interface DynamicIslandRequest {
	duration: number;
	width: number;
	height: number;
	elements: DynamicIslandElement[];
	defaultDisplay?: boolean;
}

class DynamicIslandSystem {
	private element: HTMLDivElement | null = null;
	private content: HTMLDivElement | null = null;
	private timeout: number | null = null;
	private currentRequest: DynamicIslandRequest | null = null;
	private defaultDisplay: DynamicIslandRequest | null = null;
	private lastRequestKey: string = "";
	private currentWidth: number = 200;
	private currentHeight: number = 40;
	private sessionStartTime: number = Date.now();
	private updateInterval: number | null = null;

	init() {
		console.log("Dynamic Island initializing...");
		// Create DOM element
		this.element = document.createElement("div");
		this.element.id = "dynamic-island";
		this.element.style.cssText = `
			position: fixed;
			top: 15px;
			left: 50%;
			transform: translateX(-50%);
			background: rgba(18, 18, 22, 0.75);
			border-radius: 20px;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08);
			transition: width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
			z-index: 9999;
			pointer-events: none;
			width: 200px;
			height: 40px;
			backdrop-filter: blur(20px) saturate(180%);
			border: 1px solid rgba(255, 255, 255, 0.08);
		`;

		this.content = document.createElement("div");
		this.content.style.cssText = `
			position: relative;
			width: 100%;
			height: 100%;
			transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);
		`;

		this.element.appendChild(this.content);
		document.body.appendChild(this.element);

		console.log("Dynamic Island element created:", this.element);

		// Start update interval for default display
		this.updateInterval = window.setInterval(() => {
			this.updateDefaultDisplay();
		}, 550);

		// Initial display
		this.updateDefaultDisplay();
	}

	destroy() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}
		if (this.element) {
			this.element.remove();
			this.element = null;
			this.content = null;
		}
	}

	show(request: DynamicIslandRequest) {
		if (!this.element) {
			console.warn("Dynamic Island element not initialized");
			return;
		}

		// Clear existing timeout
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}

		// Check if content is the same (avoid unnecessary re-render)
		const requestKey = JSON.stringify(request);
		if (this.lastRequestKey === requestKey) return;
		this.lastRequestKey = requestKey;

		// Store current request
		this.currentRequest = request;

		// Update size
		this.element.style.width = `${request.width}px`;
		this.element.style.height = `${request.height}px`;

		// Store dimensions for coordinate conversion
		this.currentWidth = request.width;
		this.currentHeight = request.height;

		// Render elements
		this.renderElements(request.elements);

		// Set timeout to return to default
		if (request.duration > 0) {
			this.timeout = window.setTimeout(() => {
				this.hide();
			}, request.duration);
		}
	}

	hide() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		this.currentRequest = null;
		if (this.defaultDisplay) {
			this.show(this.defaultDisplay);
		}
	}

	private renderElements(elements: DynamicIslandElement[]) {
		if (!this.content) return;

		// Clear existing content
		this.content.innerHTML = "";

		// Render each element
		for (const element of elements) {
			const el = this.createElement(element);
			if (el) this.content.appendChild(el);
		}
	}

	private createElement(element: DynamicIslandElement): HTMLElement | null {
		switch (element.type) {
			case "text":
				return this.createTextElement(element);
			case "progress":
				return this.createProgressElement(element);
			case "toggle":
				return this.createToggleElement(element);
			case "image":
				return this.createImageElement(element);
		}
		return null;
	}

	private createTextElement(element: DynamicIslandElement): HTMLElement {
		const centerX = this.currentWidth / 2;
		const centerY = this.currentHeight / 2;
		const el = document.createElement("div");
		el.style.cssText = `
			position: absolute;
			left: ${centerX + element.x}px;
			top: ${centerY + element.y}px;
			color: ${element.color || "#fff"};
			font-size: ${element.size || 14}px;
			font-weight: ${element.bold ? "bold" : "normal"};
			white-space: nowrap;
			transform: translate(-50%, -50%);
			font-family: Arial, sans-serif;
			letter-spacing: 0.3px;
			${element.shadow ? "text-shadow: 1px 1px 2px rgba(0,0,0,0.8);" : ""}
		`;
		el.textContent = element.content || "";
		return el;
	}

	private createProgressElement(element: DynamicIslandElement): HTMLElement {
		const centerX = this.currentWidth / 2;
		const centerY = this.currentHeight / 2;
		const container = document.createElement("div");
		container.style.cssText = `
			position: absolute;
			left: ${centerX + element.x}px;
			top: ${centerY + element.y}px;
			width: ${element.width}px;
			height: ${element.height}px;
			background: ${element.bgColor || "#333"};
			border-radius: ${element.rounded ? `${element.height! / 2}px` : "0"};
			overflow: hidden;
			transform: translate(-50%, -50%);
		`;

		const bar = document.createElement("div");
		bar.style.cssText = `
			width: ${(element.value || 0) * 100}%;
			height: 100%;
			background: ${element.color || "#0FB3A0"};
			transition: width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
		`;

		container.appendChild(bar);
		return container;
	}

	private createToggleElement(element: DynamicIslandElement): HTMLElement {
		const centerX = this.currentWidth / 2;
		const centerY = this.currentHeight / 2;
		const size = element.size || 30;
		const container = document.createElement("div");
		container.style.cssText = `
			position: absolute;
			left: ${centerX + element.x}px;
			top: ${centerY + element.y}px;
			width: ${size * 1.8}px;
			height: ${size}px;
			background: ${element.state ? "#0FB3A0" : "#555"};
			border-radius: ${size / 2}px;
			transition: background 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
			transform: translate(-50%, -50%);
			box-shadow: ${element.state ? "0 0 12px rgba(5, 134, 105, 0.3)" : "none"};
		`;

		const circle = document.createElement("div");
		const circleSize = size * 0.8;
		circle.style.cssText = `
			width: ${circleSize}px;
			height: ${circleSize}px;
			background: rgba(255, 255, 255, 0.95);
			border-radius: 50%;
			position: absolute;
			top: ${(size - circleSize) / 2}px;
			left: ${element.state ? size * 1.8 - circleSize - (size - circleSize) / 2 : (size - circleSize) / 2}px;
			transition: left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
			box-shadow: 0 2px 4px rgba(0,0,0,0.3);
		`;

		// Handle animation flag
		if (element.animate) {
			// Start from opposite state
			circle.style.left = element.state
				? `${(size - circleSize) / 2}px`
				: `${size * 1.8 - circleSize - (size - circleSize) / 2}px`;
			// Trigger animation immediately after render
			requestAnimationFrame(() => {
				circle.style.left = element.state
					? `${size * 1.8 - circleSize - (size - circleSize) / 2}px`
					: `${(size - circleSize) / 2}px`;
			});
		}

		container.appendChild(circle);
		return container;
	}

	private createImageElement(element: DynamicIslandElement): HTMLElement {
		const centerX = this.currentWidth / 2;
		const centerY = this.currentHeight / 2;
		const img = document.createElement("img");
		img.style.cssText = `
			position: absolute;
			left: ${centerX + element.x}px;
			top: ${centerY + element.y}px;
			width: ${element.width}px;
			height: ${element.height}px;
			transform: translate(-50%, -50%);
		`;
		img.src = element.src || "";
		return img;
	}

	private updateDefaultDisplay() {
		// duration is 0 for only the default display
		if (this.currentRequest && !this.currentRequest.defaultDisplay) return;

		// Check if in-game
		const inGame = Refs.game?.inGame?.() || false;

		// Calculate session time
		const sessionTime = Math.floor(
			(Date.now() - this.sessionStartTime) / 1000,
		);
		const hours = Math.floor(sessionTime / 3600);
		const minutes = Math.floor((sessionTime % 3600) / 60);
		const seconds = sessionTime % 60;
		const timeStr =
			hours > 0
				? `${hours}h ${minutes}m`
				: minutes > 0
					? `${minutes}m ${seconds}s`
					: `${seconds}s`;

		if (inGame) {
			// In-game display with FPS/Ping
			const fps = Math.floor(Refs.game.resourceMonitor?.filteredFPS || 0);
			const ping = Math.floor(
				Refs.game.resourceMonitor?.filteredPing || 0,
			);
			const fpsLbl = `${fps} FPS`;
			const pingLbl = `${ping} Ping`;

			const baseWidth = 267;
			const estimatedFPSLen = fpsLbl.length * 11;
			const estimatedPingLen = pingLbl.length * 11;
			const estimatedTimeLen = timeStr.length * 11;
			const accountedWidth =
				baseWidth +
				Math.max(estimatedFPSLen, estimatedPingLen) +
				estimatedTimeLen;
			const timeX = accountedWidth / 2 - estimatedTimeLen / 1.2;
			const perfX = timeX / 2;

			this.defaultDisplay = {
				duration: 0,
				defaultDisplay: true,
				width: accountedWidth,
				height: 47,
				elements: [
					{
						type: "text",
						content: "Vape V4",
						x: 0,
						y: 0,
						color: "#fff",
						size: 13,
						bold: true,
					},
					{
						type: "text",
						content: fpsLbl,
						x: perfX,
						y: -4,
						color: "#0FB3A0",
						size: 18,
					},
					{
						type: "text",
						content: pingLbl,
						x: perfX,
						y: 12,
						color: "#0FB3A0",
						size: 12,
					},
					{
						type: "text",
						content: timeStr,
						x: timeX,
						y: 0,
						color: "#ffd700",
						size: 11,
						bold: true,
					},
				],
			};
		} else {
			// Out-of-game display (simpler)
			const baseWidth = 180;
			const estimatedTimeLen = timeStr.length * 11;
			const accountedWidth = baseWidth + estimatedTimeLen;
			const timeX = accountedWidth / 2 - estimatedTimeLen / 1.2;

			this.defaultDisplay = {
				duration: 0,
				defaultDisplay: true,
				width: accountedWidth,
				height: 32,
				elements: [
					{
						type: "text",
						content: "Vape V4",
						x: 0,
						y: 0,
						color: "#fff",
						size: 13,
						bold: true,
					},
					{
						type: "text",
						content: timeStr,
						x: timeX,
						y: 0,
						color: "#ffd700",
						size: 11,
						bold: true,
					},
				],
			};
		}

		this.show(this.defaultDisplay);
	}
}

export const dynamicIsland = new DynamicIslandSystem();

export default class DynamicIslandModule extends Module {
	public name = "DynamicIsland";
	public category = Category.RENDER;

	onEnable() {
		dynamicIsland.init();
	}

	onDisable() {
		dynamicIsland.destroy();
	}
}
