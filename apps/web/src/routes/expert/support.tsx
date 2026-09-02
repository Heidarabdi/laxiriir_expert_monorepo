import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { SupportWorkspace } from "@/components/support-workspace";

export const Route = createFileRoute("/expert/support")({ component: ExpertSupportRoute, head: () => ({ meta: [{ title: "Expert Support | Laxiriir Expert" }] }) });
function ExpertSupportRoute() { return <ProtectedPage requireApprovedExpert roles={["expert"]}><PageShell><SupportWorkspace /></PageShell></ProtectedPage>; }
