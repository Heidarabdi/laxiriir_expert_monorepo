import type { ExpertSummary } from "@repo/contracts/consultations";

export function searchExperts(
	experts: readonly ExpertSummary[],
	search: string,
) {
	const words = search
		.trim()
		.toLocaleLowerCase("en")
		.split(/\s+/)
		.filter(Boolean);
	return experts.filter((expert) => {
		const text = [expert.displayName, expert.title, expert.category, expert.bio]
			.join(" ")
			.toLocaleLowerCase("en");
		return words.every((word) => text.includes(word));
	});
}
