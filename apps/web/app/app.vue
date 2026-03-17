<script setup lang="ts">
import { getHealthUrl, type HealthResponse } from "@repo/platform/health";

const runtimeConfig = useRuntimeConfig();
const { data: health, error } = await useFetch<HealthResponse>(
	getHealthUrl(runtimeConfig.public.apiBaseUrl),
);
</script>

<template>
  <div
    class="min-h-screen bg-neutral-950 text-white font-sans p-8 flex items-center justify-center"
  >
    <div
      class="max-w-xl w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl"
    >
      <h1
        class="text-3xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2"
      >
        Laxiriir Expert Platform
      </h1>
      <p class="text-neutral-400 mb-8">
        Nuxt 4 + Tailwind v4 frontend is running!
      </p>

      <div class="bg-neutral-950 p-6 rounded-xl border border-neutral-800/50">
        <h2
          class="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4"
        >
          Go API Connection Status
        </h2>

        <div
          v-if="health"
          class="flex items-center gap-3 text-emerald-400 bg-emerald-400/10 px-4 py-3 rounded-lg border border-emerald-400/20"
        >
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"
            ></span>
          </span>
          <span class="font-medium"
            >Connected! Status: {{ health.status }} ({{ health.env }})</span
          >
        </div>

        <div
          v-else-if="error"
          class="flex items-center gap-3 text-rose-400 bg-rose-400/10 px-4 py-3 rounded-lg border border-rose-400/20"
        >
          <span class="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
          <span class="font-medium"
            >Connection Failed: {{ error.message }}</span
          >
        </div>

        <div
          v-else
          class="flex items-center gap-3 text-amber-400 bg-amber-400/10 px-4 py-3 rounded-lg border border-amber-400/20"
        >
          <span
            class="animate-spin w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full shrink-0"
          ></span>
          <span class="font-medium">Pinging backend...</span>
        </div>
      </div>
    </div>
  </div>
</template>
