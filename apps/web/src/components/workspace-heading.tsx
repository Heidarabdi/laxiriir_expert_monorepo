export function WorkspaceHeading({
	description,
	eyebrow,
	title,
}: {
	description: string;
	eyebrow: string;
	title: string;
}) {
	return (
		<header className="flex flex-col gap-1">
			<p className="font-semibold text-primary text-xs uppercase tracking-wider">
				{eyebrow}
			</p>
			<h1 className="font-heading font-semibold text-3xl tracking-tight">
				{title}
			</h1>
			<p className="text-muted-foreground text-sm">{description}</p>
		</header>
	);
}
