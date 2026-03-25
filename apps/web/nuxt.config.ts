// https://nuxt.com/docs/api/configuration/nuxt-config
import { webEnv } from "@repo/env/web";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
	experimental: {
		// Disable the route-block scanning plugin because the generated Volar
		// plugin path is currently incompatible with the installed vue-router package.
		scanPageMeta: false,
	},
	future: {
		compatibilityVersion: 4,
	},
	modules: ["@pinia/nuxt", "shadcn-nuxt"],
	runtimeConfig: {
		public: {
			apiBaseUrl: webEnv.NUXT_PUBLIC_API_BASE_URL,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
