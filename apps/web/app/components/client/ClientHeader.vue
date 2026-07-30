<script setup lang="ts">
import { Bell, LogOut, Search, User } from "lucide-vue-next";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "~/components/landing/ThemeToggle.vue";

defineProps<{
	placeholder?: string;
}>();

const auth = useAuthStore();
const signingOut = ref(false);

const displayName = computed(() => auth.user?.displayName || "Client");
const email = computed(() => auth.user?.email || "");
const initials = computed(() =>
	displayName.value
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join(""),
);

onMounted(() => auth.ensureLoaded());

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
	<header
		class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8"
	>
		<label class="relative hidden text-muted-foreground sm:block">
			<span class="sr-only">Search</span>
			<Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
			<input
				type="search"
				:placeholder="placeholder ?? 'Search...'"
				class="h-9 w-56 rounded-lg border border-border bg-secondary pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary lg:w-64"
			/>
		</label>

		<div class="ml-auto flex items-center gap-2 sm:gap-4">
			<button
				type="button"
				aria-label="Notifications"
				class="relative rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
			>
				<Bell class="size-5" />
				<span class="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
			</button>

			<div class="rounded-full border border-border/20 bg-card/80 p-1">
				<ThemeToggle />
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger as-child>
					<button
						type="button"
						class="flex items-center gap-3 rounded-lg border-l border-border p-1.5 pl-3 transition hover:bg-muted/50 sm:pl-4"
					>
						<div
							class="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary"
						>
							{{ initials || "C" }}
						</div>
						<div class="hidden text-left md:block">
							<p class="text-sm font-medium leading-none">{{ displayName }}</p>
							<p class="mt-1 text-xs text-muted-foreground">Client account</p>
						</div>
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="end"
					class="w-56 rounded-xl border border-border bg-card p-2 shadow-2xl"
				>
					<DropdownMenuLabel class="py-2">
						<div class="flex flex-col space-y-1">
							<p class="text-sm font-semibold leading-none text-foreground">
								{{ displayName }}
							</p>
							<p class="truncate text-xs leading-none text-muted-foreground">
								{{ email }}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator class="bg-border/40" />
					<DropdownMenuItem as-child class="rounded-xl">
						<NuxtLink class="flex cursor-pointer items-center gap-2" to="/client">
							<User class="size-4" />
							<span>Dashboard</span>
						</NuxtLink>
					</DropdownMenuItem>
					<DropdownMenuSeparator class="bg-border/40" />
					<DropdownMenuItem
						class="cursor-pointer rounded-xl text-destructive focus:text-destructive"
						:disabled="signingOut"
						@click="handleSignOut"
					>
						<LogOut class="size-4" />
						<span>{{ signingOut ? "Signing out..." : "Log out" }}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</header>
</template>
