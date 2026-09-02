import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	XAxis,
} from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type ActivityDatum = {
	label: string;
	primary: number;
	secondary?: number;
};

export function ActivityBarChart({
	data,
	primaryLabel,
	secondaryLabel,
}: {
	data: ActivityDatum[];
	primaryLabel: string;
	secondaryLabel?: string;
}) {
	const config = {
		primary: { color: "var(--chart-1)", label: primaryLabel },
		secondary: { color: "var(--chart-2)", label: secondaryLabel },
	} satisfies ChartConfig;

	return (
		<ChartContainer className="h-64 w-full" config={config}>
			<BarChart accessibilityLayer data={data} margin={{ left: 0, right: 0 }}>
				<CartesianGrid vertical={false} />
				<XAxis
					axisLine={false}
					dataKey="label"
					tickLine={false}
					tickMargin={10}
				/>
				<ChartTooltip content={<ChartTooltipContent indicator="line" />} />
				<Bar
					dataKey="primary"
					fill="var(--color-primary)"
					radius={[6, 6, 0, 0]}
				/>
				{secondaryLabel ? (
					<Bar
						dataKey="secondary"
						fill="var(--color-secondary)"
						radius={[6, 6, 0, 0]}
					/>
				) : null}
				{secondaryLabel ? (
					<ChartLegend content={<ChartLegendContent />} />
				) : null}
			</BarChart>
		</ChartContainer>
	);
}

const pieColors = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
];

export function StatusDonutChart({
	data,
}: {
	data: Array<{ label: string; value: number }>;
}) {
	const config = Object.fromEntries(
		data.map((item, index) => [
			item.label,
			{ color: pieColors[index % pieColors.length], label: item.label },
		]),
	) satisfies ChartConfig;

	return (
		<ChartContainer className="mx-auto h-64 w-full max-w-sm" config={config}>
			<PieChart accessibilityLayer>
				<ChartTooltip content={<ChartTooltipContent hideLabel />} />
				<Pie
					data={data}
					dataKey="value"
					innerRadius={58}
					nameKey="label"
					outerRadius={88}
					paddingAngle={3}
				>
					{data.map((item, index) => (
						<Cell fill={pieColors[index % pieColors.length]} key={item.label} />
					))}
				</Pie>
				<ChartLegend content={<ChartLegendContent nameKey="label" />} />
			</PieChart>
		</ChartContainer>
	);
}
