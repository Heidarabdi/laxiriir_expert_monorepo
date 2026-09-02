import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings")({
	beforeLoad: () => {
		throw redirect({ to: "/client/bookings" });
	},
});
