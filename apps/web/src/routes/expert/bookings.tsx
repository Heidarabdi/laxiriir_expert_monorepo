import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/expert/bookings")({
	beforeLoad: () => {
		throw redirect({ to: "/expert/sessions" });
	},
});
