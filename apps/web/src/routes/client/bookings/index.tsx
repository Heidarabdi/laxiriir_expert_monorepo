import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { ClientSessions } from "@/routes/client/sessions";

export const Route = createFileRoute("/client/bookings/")({
	component: ClientBookingsRoute,
	head: () => ({ meta: [{ title: "My Sessions | Laxiriir Expert" }] }),
});

function ClientBookingsRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<ClientSessions />
			</PageShell>
		</ProtectedPage>
	);
}
