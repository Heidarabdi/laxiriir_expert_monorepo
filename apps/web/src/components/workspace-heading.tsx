export function WorkspaceHeading({
	actions,
	description,
	eyebrow,
	title,
}: {
	actions?: React.ReactNode;
	description: string;
	eyebrow: string;
	title: string;
}) {
	return (
		<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div className="flex flex-col gap-1">
				<p className="font-semibold text-primary text-xs uppercase">
					{eyebrow}
				</p>
				<h1 className="text-balance font-heading font-semibold text-3xl">
					{title}
				</h1>
				<p className="text-pretty text-muted-foreground text-sm">
					{description}
				</p>
			</div>
			{actions ? <div className="shrink-0">{actions}</div> : null}
		</header>
	);
}
