import { createSignal, For } from "solid-js";
import { render } from "solid-js/web";
import getResourceURL from "@/utils/cachedResourceURL";
import shadowWrapper from "./shadowWrapper";

const COLORS = {
	main: "rgb(26, 25, 26)",
	text: "rgb(200, 200, 200)",
	accent: "rgb(5, 134, 105)",
};

type NotificationType = "info" | "warning" | "alert";

interface Notification {
	id: number;
	title: string;
	message: string;
	type: NotificationType;
	duration: number;
}

const [notifications, setNotifications] = createSignal<Notification[]>([]);
let notificationId = 0;

export function showNotification(
	title: string,
	message: string,
	type: NotificationType = "info",
	duration: number = 3000,
) {
	const id = notificationId++;
	const notification: Notification = { id, title, message, type, duration };

	setNotifications((prev) => [...prev, notification]);

	setTimeout(() => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	}, duration);
}

function NotificationContainer() {
	return (
		<div
			style={{
				position: "fixed",
				bottom: "20px",
				right: "20px",
				"z-index": "10002",
				display: "flex",
				"flex-direction": "column",
				gap: "8px",
				"pointer-events": "none",
			}}
		>
			<For each={notifications()}>
				{(notification) => (
					<NotificationItem notification={notification} />
				)}
			</For>
		</div>
	);
}

function NotificationItem(props: { notification: Notification }) {
	return (
		<div
			style={{
				width: "300px",
				"background-color": COLORS.main,
				"border-radius": "5px",
				"box-shadow":
					"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
				padding: "12px 16px",
				display: "flex",
				"align-items": "center",
				gap: "12px",
				"pointer-events": "auto",
				"backdrop-filter": "blur(10px)",
				animation: "slideIn 0.3s ease-out",
			}}
		>
			{/* Blur background */}
			<div
				style={{
					position: "absolute",
					inset: "-48px -48px",
					"backdrop-filter": "blur(24px)",
					"background-size": "cover",
					opacity: "0.3",
					"pointer-events": "none",
					"z-index": "-1",
				}}
			/>

			<img
				src={getResourceURL(props.notification.type)}
				alt=""
				style={{
					width: "20px",
					height: "20px",
					filter: "brightness(0) invert(0.8)",
				}}
			/>
			<div style={{ flex: "1" }}>
				<div
					style={{
						color: COLORS.text,
						"font-size": "13px",
						"font-weight": "600",
						"margin-bottom": "2px",
						"font-family": "Arial, sans-serif",
					}}
				>
					{props.notification.title}
				</div>
				<div
					style={{
						color: COLORS.text,
						"font-size": "12px",
						opacity: "0.7",
						"font-family": "Arial, sans-serif",
					}}
				>
					{props.notification.message}
				</div>
			</div>
		</div>
	);
}

export function initNotifications() {
	const container = document.createElement("div");
	container.id = "notifications-container";
	shadowWrapper.wrapper.appendChild(container);

	// Add animation styles
	const style = document.createElement("style");
	style.textContent = `
		@keyframes slideIn {
			from {
				transform: translateX(400px);
				opacity: 0;
			}
			to {
				transform: translateX(0);
				opacity: 1;
			}
		}
	`;
	document.head.appendChild(style);

	render(() => <NotificationContainer />, container);
}
