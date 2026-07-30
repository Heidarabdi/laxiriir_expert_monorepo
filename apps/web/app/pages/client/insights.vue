<template>
    <div class="p-8 space-y-6">
                <div>
                    <span class="home-kicker text-primary">INSIGHTS</span>
                    <h1
                        class="font-display text-3xl font-bold tracking-tight mt-1"
                    >
                        Analytics & Insights
                    </h1>
                    <p class="text-muted-foreground mt-1 text-sm">
                        Track your consulting progress and ROI
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div
                        v-for="stat in stats"
                        :key="stat.label"
                        class="bg-card backdrop-blur-sm rounded-xl p-6 relative overflow-hidden group"
                    >
                        <div
                            class="absolute right-[-10px] bottom-[-10px] size-24 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
                        >
                            <component :is="stat.icon" class="size-full" />
                        </div>

                        <p
                            class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            {{ stat.label }}
                        </p>
                        <div class="mt-3 flex items-end gap-2">
                            <p class="text-3xl font-bold font-display">
                                {{ stat.value }}
                            </p>
                            <span
                                class="text-xs font-medium mb-1.5"
                                :class="stat.trendColor"
                                >{{ stat.trend }}</span
                            >
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-card backdrop-blur-sm rounded-xl p-6">
                        <h2 class="font-display font-semibold text-lg mb-5">
                            Session Frequency
                        </h2>
                        <div class="flex items-end gap-2 h-48">
                            <div
                                v-for="bar in chartData"
                                :key="bar.month"
                                class="flex-1 flex flex-col items-center gap-2"
                            >
                                <div
                                    class="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-all relative"
                                    :style="{ height: `${bar.height}%` }"
                                >
                                    <div
                                        class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground whitespace-nowrap"
                                    >
                                        {{ bar.value }}
                                    </div>
                                </div>
                                <span class="text-[10px] text-muted-foreground">{{ bar.month }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-card backdrop-blur-sm rounded-xl p-6">
                        <h2 class="font-display font-semibold text-lg mb-5">
                            Expert Distribution
                        </h2>
                        <div class="space-y-4">
                            <div
                                v-for="item in expertDist"
                                :key="item.name"
                            >
                                <div class="flex items-center justify-between mb-1.5">
                                    <span class="text-sm font-medium">{{ item.name }}</span>
                                    <span class="text-xs text-muted-foreground">{{ item.percentage }}%</span>
                                </div>
                                <div class="h-2 rounded-full bg-muted/60 overflow-hidden">
                                    <div
                                        class="h-full rounded-full transition-all duration-1000"
                                        :class="item.color"
                                        :style="{ width: `${item.percentage}%` }"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-card backdrop-blur-sm rounded-xl p-6">
                    <h2 class="font-display font-semibold text-lg mb-5">
                        Recent Activity
                    </h2>
                    <div class="space-y-4">
                        <div
                            v-for="activity in activities"
                            :key="activity.id"
                            class="flex items-center gap-4 py-3 border-b border-border/5 last:border-0"
                        >
                            <div
                                class="size-10 rounded-lg flex items-center justify-center shrink-0"
                                :class="activity.iconBg"
                            >
                                <component :is="activity.icon" class="size-4" :class="activity.iconColor" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium">{{ activity.title }}</p>
                                <p class="text-xs text-muted-foreground">{{ activity.description }}</p>
                            </div>
                            <span class="text-xs text-muted-foreground shrink-0">{{ activity.time }}</span>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script setup lang="ts">
import {
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	FileText,
	MessageCircle,
	Star,
	Target,
} from "lucide-vue-next";

definePageMeta({
	layout: "client",
	clientSearchPlaceholder: "Search insights...",
	middleware: ["auth-required", "verified-required", "role-required"],
	roles: ["client"],
});

useSeoMeta({
	title: "Insights | Laxiriir Expert",
});

const stats = [
	{
		label: "Total Sessions",
		value: "24",
		trend: "+12% vs last quarter",
		trendColor: "text-primary",
		icon: Calendar,
	},
	{
		label: "Avg. Session Length",
		value: "52m",
		trend: "+8 min improvement",
		trendColor: "text-blue-400",
		icon: Clock,
	},
	{
		label: "Expert Rating",
		value: "4.8",
		trend: "Top 10% of clients",
		trendColor: "text-yellow-400",
		icon: Star,
	},
	{
		label: "ROI Score",
		value: "3.2x",
		trend: "Above average",
		trendColor: "text-primary",
		icon: DollarSign,
	},
];

const chartData = [
	{ month: "May", height: 30, value: "3" },
	{ month: "Jun", height: 45, value: "5" },
	{ month: "Jul", height: 60, value: "7" },
	{ month: "Aug", height: 40, value: "4" },
	{ month: "Sep", height: 75, value: "9" },
	{ month: "Oct", height: 90, value: "11" },
];

const expertDist = [
	{ name: "Strategy", percentage: 42, color: "bg-primary" },
	{ name: "Finance", percentage: 28, color: "bg-blue-400" },
	{ name: "Operations", percentage: 18, color: "bg-chart-4" },
	{ name: "Marketing", percentage: 12, color: "bg-chart-3" },
];

const activities = [
	{
		id: 1,
		icon: CheckCircle,
		iconBg: "bg-primary/10",
		iconColor: "text-primary",
		title: "Session Completed",
		description: "Strategy Deep-Dive with Marcus Thorne",
		time: "2h ago",
	},
	{
		id: 2,
		icon: FileText,
		iconBg: "bg-blue-400/10",
		iconColor: "text-blue-400",
		title: "Report Generated",
		description: "Q4 Market Forecast PDF downloaded",
		time: "5h ago",
	},
	{
		id: 3,
		icon: MessageCircle,
		iconBg: "bg-chart-4/10",
		iconColor: "text-chart-4",
		title: "New Message",
		description: "Sarah Jenkins replied to your message",
		time: "1d ago",
	},
	{
		id: 4,
		icon: Target,
		iconBg: "bg-chart-3/10",
		iconColor: "text-chart-3",
		title: "Milestone Reached",
		description: "Completed Phase 2 of Global Expansion",
		time: "3d ago",
	},
];
</script>
