import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ministeriumTheme } from "./theme";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ColorSchemeScript defaultColorScheme="light" />
		<MantineProvider theme={ministeriumTheme} defaultColorScheme="light">
			<Notifications position="top-right" zIndex={1000} />
			<App />
		</MantineProvider>
	</React.StrictMode>,
);
