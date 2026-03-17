import { describe, expect, it } from "vitest";
import { getWebHealthUrl } from "./api";

describe("getWebHealthUrl", () => {
	it("joins the configured API base URL with the health route", () => {
		expect(getWebHealthUrl("http://localhost:8080/")).toBe(
			"http://localhost:8080/health",
		);
	});
});
