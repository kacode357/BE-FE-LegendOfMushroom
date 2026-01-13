import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root");

function renderFatalError(error: unknown) {
	const message =
		error instanceof Error
			? `${error.name}: ${error.message}\n\n${error.stack ?? ""}`
			: String(error);

	if (rootEl) {
		rootEl.innerHTML = `
			<div style="padding:16px;font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
				<h1 style="margin:0 0 8px;font-size:16px;">App crashed</h1>
				<pre style="margin:0;white-space:pre-wrap;word-break:break-word;">${message.replace(/</g, "&lt;")}</pre>
				<p style="margin:12px 0 0;color:#666;">Open DevTools Console for more details.</p>
			</div>
		`;
	}

	// Keep this for DevTools even if root is missing
	// eslint-disable-next-line no-console
	console.error(error);
}

window.addEventListener("error", (event) => {
	renderFatalError(event.error ?? event.message);
});

window.addEventListener("unhandledrejection", (event) => {
	renderFatalError(event.reason);
});

try {
	if (!rootEl) {
		throw new Error("Root element '#root' not found");
	}

	createRoot(rootEl).render(<App />);
} catch (error) {
	renderFatalError(error);
}
