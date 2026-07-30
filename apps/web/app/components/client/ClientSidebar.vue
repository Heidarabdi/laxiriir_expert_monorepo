<script setup lang="ts">
import {
	Calendar,
	LayoutDashboard,
	LifeBuoy,
	LogOut,
	MessageSquare,
	PanelLeftClose,
	PanelLeftOpen,
	TrendingUp,
	Users,
} from "lucide-vue-next";

const auth = useAuthStore();
const { isCollapsed, toggle } = useClientSidebar();
const signingOut = ref(false);

const navItems = [
	{ to: "/client", label: "Overview", icon: LayoutDashboard },
	{ to: "/client/sessions", label: "My Sessions", icon: Calendar },
	{ to: "/client/experts", label: "Experts", icon: Users },
	{ to: "/client/messages", label: "Messages", icon: MessageSquare },
	{ to: "/client/insights", label: "Insights", icon: TrendingUp },
];

async function handleSignOut() {
	if (signingOut.value) {
		return;
	}

	signingOut.value = true;
	try {
		await auth.signOut();
		await navigateTo("/");
	} finally {
		signingOut.value = false;
	}
}
</script>

<template>
	<aside
		class="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-card transition-all duration-300 md:flex"
		:class="isCollapsed ? 'w-16' : 'w-64'"
	>
		<NuxtLink
			to="/client"
			class="flex h-16 items-center border-b border-border transition-all duration-300"
			:class="isCollapsed ? 'justify-center px-3' : 'gap-3 px-6'"
		>
			<div
				class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
			>
				<LayoutDashboard class="size-5" />
			</div>
			<div
				class="overflow-hidden transition-all duration-300"
				:class="isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
			>
				<span class="block font-display text-lg font-bold leading-none tracking-tight">
					Laxiriir
				</span>
				<span class="text-[10px] font-medium tracking-wide text-primary">
					CLIENT WORKSPACE
				</span>
			</div>
		</NuxtLink>

		<nav class="flex-1 space-y-1 p-2">
			<NuxtLink
				v-for="item in navItems"
				:key="item.to"
				:to="item.to"
				class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
				:class="[
					$route.path === item.to ? 'bg-primary/10 text-primary' : '',
					isCollapsed ? 'justify-center' : 'gap-3',
				]"
			>
				<component :is="item.icon" class="size-4 shrink-0" />
				<span
					class="overflow-hidden whitespace-nowrap transition-all duration-300"
					:class="isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
				>
					{{ item.label }}
				</span>
			</NuxtLink>
		</nav>

		<div class="space-y-1 border-t border-border p-2">
			<NuxtLink
				to="/contact"
				class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
				:class="isCollapsed ? 'justify-center' : 'gap-3'"
			>
				<LifeBuoy class="size-4 shrink-0" />
				<span
					class="overflow-hidden whitespace-nowrap transition-all duration-300"
					:class="isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
				>
					Support
				</span>
			</NuxtLink>
			<button
				type="button"
				class="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
				:class="isCollapsed ? 'justify-center' : 'gap-3'"
				:disabled="signingOut"
				@click="handleSignOut"
			>
				<LogOut class="size-4 shrink-0" />
				<span
					class="overflow-hidden whitespace-nowrap transition-all duration-300"
					:class="isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
				>
					{{ signingOut ? "Signing out..." : "Log out" }}
				</span>
			</button>
		</div>

		<div class="border-t border-border p-2">
			<button
				type="button"
				class="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
				:class="isCollapsed ? 'justify-center' : 'gap-3'"
				@click="toggle"
			>
				<component
					:is="isCollapsed ? PanelLeftOpen : PanelLeftClose"
					class="size-4 shrink-0"
				/>
				<span
					class="overflow-hidden whitespace-nowrap transition-all duration-300"
					:class="isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
				>
					Collapse
				</span>
			</button>
		</div>
	</aside>
</template>
