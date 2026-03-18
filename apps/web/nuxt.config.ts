// https://nuxt.com/docs/api/configuration/nuxt-config
import { webEnv } from "@repo/env/web";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
								compatibilityDate: "2025-07-15",
								future: {
																compatibilityVersion: 4,
								},
								devtools: { enabled: true },
								modules: ["@pinia/nuxt", "shadcn-nuxt"],
								css: ["~/assets/css/main.css"],
								runtimeConfig: {
																public: {
																								apiBaseUrl: webEnv.NUXT_PUBLIC_API_BASE_URL,
																},
								},
								vite: {
																plugins: [
																								tailwindcss(),
																],
								},
});