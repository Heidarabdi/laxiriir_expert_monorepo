import type { ExpertSummary } from "@repo/contracts/consultations";
import { describe, expect, it } from "vitest";
import { searchExperts } from "./expert-search";

const experts: ExpertSummary[] = [
	{
		id: "a",
		displayName: "Amina Yusuf",
		title: "Operations advisor",
		category: "Operations",
		bio: "Improve team delivery",
		avatarUrl: "https://example.com/a.jpg",
		hourlyRateCents: 10000,
		createdAt: "2026-01-01T00:00:00Z",
		updatedAt: "2026-01-01T00:00:00Z",
	},
	{
		id: "b",
		displayName: "Alex Lee",
		title: "Finance advisor",
		category: "Finance",
		bio: "Plan your business budget",
		avatarUrl: "https://example.com/b.jpg",
		hourlyRateCents: 20000,
		createdAt: "2026-01-01T00:00:00Z",
		updatedAt: "2026-01-01T00:00:00Z",
	},
];

describe("landing expert search", () => {
	it("preserves directory order for blank searches", () => {
		expect(searchExperts(experts, "   ")).toEqual(experts);
	});
	it("matches names, specialties and biography without case sensitivity", () => {
		for (const term of ["AMINA", "operations", "delivery"]) {
			expect(searchExperts(experts, term).map((expert) => expert.id)).toEqual([
				"a",
			]);
		}
	});
	it("requires each word and tolerates repeated whitespace", () => {
		expect(
			searchExperts(experts, " finance   budget ").map((expert) => expert.id),
		).toEqual(["b"]);
		expect(searchExperts(experts, "finance delivery")).toEqual([]);
	});
	it("handles an empty directory without adding sample profiles", () => {
		expect(searchExperts([], "advisor")).toEqual([]);
	});
});
