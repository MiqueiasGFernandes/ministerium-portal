import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ministeriumTheme } from "./theme";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "./styles/global.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<ColorSchemeScript defaultColorScheme="light" />
		<MantineProvider theme={ministeriumTheme} defaultColorScheme="light">
			<ModalsProvider>
				<ThemeProvider>
					<Notifications position="top-right" zIndex={1000} />
					<App />
				</ThemeProvider>
			</ModalsProvider>
		</MantineProvider>
	</React.StrictMode>,
);
