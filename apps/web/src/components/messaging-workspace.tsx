import { CalendarDaysIcon, MessageSquareIcon, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
	Card,
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
import { Field } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Message,
	MessageAvatar,
	MessageContent,
	MessageFooter,
} from "@/components/ui/message";
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useCurrentUser } from "@/hooks/use-auth";
import {
	useConversation,
	useConversations,
	useMarkConversationRead,
	useSendMessage,
} from "@/hooks/use-workspace";
import { messageFrom } from "@/lib/format";
import { cn } from "@/lib/utils";

const shortDate = new Intl.DateTimeFormat("en", {
	dateStyle: "medium",
	timeZone: "UTC",
});
const consultationDate = new Intl.DateTimeFormat("en", {
	dateStyle: "full",
	timeStyle: "short",
	timeZone: "UTC",
});
const messageTime = new Intl.DateTimeFormat("en", {
	hour: "numeric",
	minute: "2-digit",
	timeZone: "UTC",
});

export function MessagingWorkspace({ description }: { description: string }) {
	const { data: user } = useCurrentUser();
	const conversationsQuery = useConversations();
	const conversations = conversationsQuery.data?.conversations ?? [];
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [body, setBody] = useState("");
	const conversationQuery = useConversation(selectedId);
	const sendMutation = useSendMessage();
	const markReadMutation = useMarkConversationRead();

	useEffect(() => {
		if (!selectedId && conversations[0]) {
			setSelectedId(conversations[0].bookingId);
		}
	}, [conversations, selectedId]);

	useEffect(() => {
		if (!selectedId) return;
		const selected = conversations.find(
			(conversation) => conversation.bookingId === selectedId,
		);
		if (selected?.unreadCount) markReadMutation.mutate(selectedId);
	}, [conversations, markReadMutation.mutate, selectedId]);

	async function send(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selectedId || !body.trim()) return;
		try {
			await sendMutation.mutateAsync({
				bookingId: selectedId,
				message: { body: body.trim() },
			});
			setBody("");
		} catch (error) {
			toast.error(messageFrom(error, "Unable to send this message."));
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description={description}
				eyebrow="Communication"
				title="Messages"
			/>
			{conversationsQuery.error || sendMutation.error ? (
				<Alert variant="destructive">
					<AlertTitle>Messaging needs attention</AlertTitle>
					<AlertDescription>
						{messageFrom(conversationsQuery.error ?? sendMutation.error, "Please try again.")}
					</AlertDescription>
				</Alert>
			) : null}
			{conversationsQuery.isPending ? <Skeleton className="h-[38rem]" /> : null}
			{!conversationsQuery.isPending && conversations.length === 0 ? (
				<Empty className="min-h-96 border bg-card">
					<EmptyHeader>
						<EmptyMedia variant="icon"><MessageSquareIcon /></EmptyMedia>
						<EmptyTitle>No consultation conversations yet</EmptyTitle>
						<EmptyDescription>
							A conversation is created automatically for every booking.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : null}
			{conversations.length > 0 ? (
				<div className="grid min-h-[38rem] gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
					<Card className="overflow-hidden">
						<CardHeader>
							<CardTitle>Consultations</CardTitle>
							<CardDescription>{conversations.length} conversations</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-2 p-2 pt-0">
							{conversations.map((conversation) => (
								<Button
									className={cn("h-auto justify-start px-3 py-3 text-left", selectedId === conversation.bookingId && "bg-accent")}
									key={conversation.bookingId}
									onClick={() => setSelectedId(conversation.bookingId)}
									variant="ghost"
								>
									<Avatar className="size-9">
										<AvatarImage alt={conversation.counterpart.displayName} src={conversation.counterpart.avatarUrl ?? undefined} />
										<AvatarFallback>{conversation.counterpart.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
									</Avatar>
									<span className="min-w-0 flex-1">
										<span className="flex items-center justify-between gap-2">
											<span className="truncate font-medium">{conversation.counterpart.displayName}</span>
											{conversation.unreadCount ? <Badge>{conversation.unreadCount}</Badge> : null}
										</span>
										<span className="block truncate text-muted-foreground text-xs">
											{conversation.lastMessage?.body ?? shortDate.format(new Date(conversation.bookingStartsAt))}
										</span>
									</span>
								</Button>
							))}
						</CardContent>
					</Card>
					<Card className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
						{conversationQuery.data ? (
							<CardHeader className="border-b">
								<CardTitle>{conversationQuery.data.conversation.counterpart.displayName}</CardTitle>
								<CardDescription className="flex items-center gap-1.5"><CalendarDaysIcon className="size-3.5" />{consultationDate.format(new Date(conversationQuery.data.conversation.bookingStartsAt))} UTC</CardDescription>
							</CardHeader>
						) : <Skeleton className="m-4 h-16" />}
						<div className="min-h-0 p-4">
							{conversationQuery.isPending ? <Skeleton className="h-full" /> : null}
							{conversationQuery.data ? (
								<MessageScrollerProvider>
									<MessageScroller>
										<MessageScrollerViewport>
											<MessageScrollerContent className="justify-end py-2">
												{conversationQuery.data.messages.length === 0 ? (
													<Empty className="border-0"><EmptyHeader><EmptyMedia variant="icon"><MessageSquareIcon /></EmptyMedia><EmptyTitle>Start the conversation</EmptyTitle><EmptyDescription>Ask a question or share useful context before the consultation.</EmptyDescription></EmptyHeader></Empty>
												) : conversationQuery.data.messages.map((message) => {
													const own = message.senderUserId === user?.userId;
													return <MessageScrollerItem key={message.id}>
														<Message align={own ? "end" : "start"}>
															<MessageAvatar><Avatar className="size-8"><AvatarImage alt="" src={own ? undefined : conversationQuery.data.conversation.counterpart.avatarUrl ?? undefined} /><AvatarFallback>{own ? "You" : conversationQuery.data.conversation.counterpart.displayName.slice(0, 2)}</AvatarFallback></Avatar></MessageAvatar>
															<MessageContent><Bubble align={own ? "end" : "start"} variant={own ? "default" : "secondary"}><BubbleContent>{message.body}</BubbleContent></Bubble><MessageFooter>{messageTime.format(new Date(message.createdAt))} UTC</MessageFooter></MessageContent>
														</Message>
													</MessageScrollerItem>;
												})}
											</MessageScrollerContent>
										</MessageScrollerViewport>
										<MessageScrollerButton />
									</MessageScroller>
								</MessageScrollerProvider>
							) : null}
						</div>
						<form className="border-t p-4" onSubmit={send}>
							<Field>
								<InputGroup>
									<InputGroupTextarea aria-label="Message" onChange={(event) => setBody(event.target.value)} placeholder="Write a message…" rows={2} value={body} />
									<InputGroupAddon align="block-end" className="justify-end">
										<InputGroupButton disabled={!body.trim() || sendMutation.isPending} size="sm" type="submit" variant="default"><SendIcon /> Send</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>
							</Field>
						</form>
					</Card>
				</div>
			) : null}
		</div>
	);
}
