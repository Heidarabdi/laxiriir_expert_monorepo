import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { SupportWorkspace } from "@/components/support-workspace";

export const Route = createFileRoute("/client/support")({ component: ClientSupportRoute, head: () => ({ meta: [{ title: "Support | Laxiriir Expert" }] }) });
function ClientSupportRoute() { return <ProtectedPage roles={["client"]}><PageShell><SupportWorkspace /></PageShell></ProtectedPage>; }
