export function formatDate(
	value: string,
	dateStyle: "medium" | "full" = "medium",
) {
	return new Intl.DateTimeFormat(undefined, { dateStyle }).format(
		new Date(value),
	);
}

export function formatTime(value: string) {
	return new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(value));
}

export function formatTimeRange(start: string, end: string) {
	return `${formatTime(start)} – ${formatTime(end)}`;
}

export function formatPrice(cents: number) {
	return new Intl.NumberFormat(undefined, {
		currency: "USD",
		maximumFractionDigits: 0,
		style: "currency",
	}).format(cents / 100);
}

export function messageFrom(error: unknown, fallback: string) {
	return error instanceof Error && error.message ? error.message : fallback;
}

export function canChangeBooking(startsAt: string, status: string) {
	return (
		status === "confirmed" &&
		new Date(startsAt).getTime() - Date.now() >= 24 * 60 * 60 * 1000
	);
}
