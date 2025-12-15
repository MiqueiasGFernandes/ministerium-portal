import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@/components": path.resolve(__dirname, "./src/components"),
			"@/pages": path.resolve(__dirname, "./src/pages"),
			"@/providers": path.resolve(__dirname, "./src/providers"),
			"@/types": path.resolve(__dirname, "./src/types"),
			"@/utils": path.resolve(__dirname, "./src/utils"),
			"@/hooks": path.resolve(__dirname, "./src/hooks"),
			"@/config": path.resolve(__dirname, "./src/config"),
		},
	},
	server: {
		port: 3000,
		host: true,
	},
	build: {
		outDir: "dist",
		sourcemap: true,
	},
	test: {
		globals: true,
		environment: "jsdom",
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/e2e/**",
			"**/.{idea,git,cache,output,temp}/**",
		],
	},
});
