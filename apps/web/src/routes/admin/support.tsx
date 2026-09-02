import { createFileRoute } from "@tanstack/react-router";
import { AdminSupportWorkspace } from "@/components/admin-support-workspace";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";

export const Route = createFileRoute("/admin/support")({
	component: AdminSupportRoute,
	head: () => ({ meta: [{ title: "Support | Laxiriir Expert" }] }),
});

function AdminSupportRoute() {
	return (
		<ProtectedPage roles={["admin"]}>
			<PageShell>
				<AdminSupportWorkspace />
			</PageShell>
		</ProtectedPage>
	);
}
