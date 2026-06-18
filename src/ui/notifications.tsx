import { createSignal, For, onCleanup, onMount } from "solid-js";
import { render } from "solid-js/web";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import shadowWrapper from "./shadowWrapper";

const COLORS = {
	main: "rgb(26, 25, 26)",
	text: "rgb(209, 209, 209)",
	textDark: "rgb(170, 170, 170)",
};

type NotificationType = "info" | "warning" | "alert";

const PROGRESS_COLORS: Record<NotificationType, string> = {
	alert: "rgb(250, 50, 56)",
	warning: "rgb(236, 129, 43)",
	info: "rgb(220, 220, 220)",
};

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
	}, duration + 400);
}

function NotificationContainer() {
	return (
		<div
			style={{
				position: "fixed",
				inset: "0",
				"z-index": "10002",
				"pointer-events": "none",
			}}
		>
			<For each={notifications()}>
				{(notification, index) => (
					<NotificationItem
						notification={notification}
						offset={29 + 78 * (index() + 1)}
					/>
				)}
			</For>
		</div>
	);
}

function NotificationItem(props: {
	notification: Notification;
	offset: number;
}) {
	const [exiting, setExiting] = createSignal(false);
	const [mounted, setMounted] = createSignal(false);

	onMount(() => {
		requestAnimationFrame(() => {
			setMounted(true);
		});
	});

	const timer = setTimeout(() => {
		setExiting(true);
	}, props.notification.duration);

	onCleanup(() => clearTimeout(timer));

	return (
		<div
			style={{
				position: "absolute",
				right: "0",
				top: `calc(100% - ${props.offset}px)`,
				width: "266px",
				height: "75px",
				"background-color": "rgba(26, 25, 26, 0.5)",
				"border-radius": "5px",
				"box-shadow":
					"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
				overflow: "hidden",
				"pointer-events": "auto",
				animation: exiting()
					? "ntSlideOut 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards"
					: "ntSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
			}}
		>
			<img
				src={getResourceURL(props.notification.type)}
				alt=""
				style={{
					position: "absolute",
					left: "-1px",
					top: "-1px",
					width: "60px",
					height: "60px",
				}}
			/>

			<div
				style={{
					position: "absolute",
					left: "46px",
					top: "16px",
					right: "10px",
					color: COLORS.text,
					fontSize: "14px",
					fontWeight: "600",
					fontFamily: "Arial, sans-serif",
					textAlign: "left",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{props.notification.title}
			</div>

			<div
				style={{
					position: "absolute",
					left: "47px",
					top: "44px",
					color: "rgb(0, 0, 0)",
					fontSize: "14px",
					fontFamily: "Arial, sans-serif",
					opacity: "0.5",
					textAlign: "left",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{props.notification.message}
			</div>

			<div
				style={{
					position: "absolute",
					left: "46px",
					top: "43px",
					right: "10px",
					color: COLORS.textDark,
					fontSize: "14px",
					fontFamily: "Arial, sans-serif",
					textAlign: "left",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{props.notification.message}
			</div>

			<div
				style={{
					position: "absolute",
					bottom: "4px",
					left: "3px",
					right: "10px",
					height: "2px",
					backgroundColor: PROGRESS_COLORS[props.notification.type],
					borderRadius: "1px",
					transformOrigin: "left center",
					animation: mounted()
						? `ntProgress ${props.notification.duration}ms linear forwards`
						: "none",
				}}
			/>
		</div>
	);
}

export function initNotifications() {
	if (!document.querySelector("#nt-keyframes")) {
		const keyframesStyle = document.createElement("style");
		keyframesStyle.id = "nt-keyframes";
		keyframesStyle.textContent = `
			@keyframes ntSlideIn {
				from { transform: translateX(100%); }
				to { transform: translateX(0); }
			}
			@keyframes ntSlideOut {
				from { transform: translateX(0); }
				to { transform: translateX(100%); }
			}
			@keyframes ntProgress {
				from { transform: scaleX(1); }
				to { transform: scaleX(0); }
			}
		`;
		document.head.appendChild(keyframesStyle);
	}

	const container = document.createElement("div");
	container.id = "notifications-container";
	shadowWrapper.wrapper.appendChild(container);

	render(() => <NotificationContainer />, container);
}
