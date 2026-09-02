import { BellIcon, CheckCheckIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import {
	useMarkAllNotificationsRead,
	useMarkNotificationRead,
	useNotifications,
} from "@/hooks/use-engagements";
import { messageFrom } from "@/lib/format";

const utcDateFormatter = new Intl.DateTimeFormat("en", {
	dateStyle: "medium",
	timeStyle: "short",
	timeZone: "UTC",
});

export function NotificationsWorkspace({
	description,
}: {
	description: string;
}) {
	const notificationsQuery = useNotifications();
	const markReadMutation = useMarkNotificationRead();
	const markAllMutation = useMarkAllNotificationsRead();
	const notifications = notificationsQuery.data?.notifications ?? [];
	const unreadCount = notificationsQuery.data?.unreadCount ?? 0;

	async function markRead(notificationId: string) {
		try {
			await markReadMutation.mutateAsync(notificationId);
		} catch (error) {
			toast.error(messageFrom(error, "Unable to update this notification."));
		}
	}

	async function markAllRead() {
		try {
			await markAllMutation.mutateAsync();
			toast.success("All notifications marked as read.");
		} catch (error) {
			toast.error(messageFrom(error, "Unable to update notifications."));
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				actions={
					<Button
						disabled={unreadCount === 0 || markAllMutation.isPending}
						onClick={markAllRead}
						variant="outline"
					>
						<CheckCheckIcon data-icon="inline-start" />
						Mark all read
					</Button>
				}
				description={description}
				eyebrow="Account"
				title="Notifications"
			/>

			{notificationsQuery.error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load notifications</AlertTitle>
					<AlertDescription>
						{messageFrom(notificationsQuery.error, "Please try again.")}
					</AlertDescription>
				</Alert>
			) : null}

			{notificationsQuery.isPending ? (
				<div className="flex flex-col gap-3">
					{[1, 2, 3].map((item) => (
						<Skeleton className="h-36" key={item} />
					))}
				</div>
			) : null}

			{!notificationsQuery.isPending && notifications.length > 0 ? (
				<div className="flex flex-col gap-3">
					{notifications.map((notification) => (
						<Card
							className={
								notification.readAt ? undefined : "bg-primary/5 ring-primary/20"
							}
							key={notification.id}
							size="sm"
						>
							<CardHeader>
								<CardTitle>{notification.title}</CardTitle>
								<CardDescription>
									<time dateTime={notification.createdAt}>
										{utcDateFormatter.format(new Date(notification.createdAt))}{" "}
										UTC
									</time>
								</CardDescription>
								<CardAction>
									<Badge variant={notification.readAt ? "outline" : "default"}>
										{notification.readAt ? "Read" : "New"}
									</Badge>
								</CardAction>
							</CardHeader>
							<CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
								<p className="max-w-3xl text-muted-foreground text-sm">
									{notification.message}
								</p>
								<div className="flex shrink-0 gap-2">
									{notification.href ? (
										<Button asChild size="sm" variant="outline">
											<a href={notification.href}>View details</a>
										</Button>
									) : null}
									{!notification.readAt ? (
										<Button
											disabled={markReadMutation.isPending}
											onClick={() => markRead(notification.id)}
											size="sm"
										>
											<CheckIcon data-icon="inline-start" />
											Mark read
										</Button>
									) : null}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : null}

			{!notificationsQuery.isPending && notifications.length === 0 ? (
				<Empty className="border bg-card">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<BellIcon />
						</EmptyMedia>
						<EmptyTitle>You are all caught up</EmptyTitle>
						<EmptyDescription>
							Booking confirmations, cancellations, and reschedules will appear
							here.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : null}
		</div>
	);
}
