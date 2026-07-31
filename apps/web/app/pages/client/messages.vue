<template>
    <div class="flex h-[calc(100vh-4rem)]">
                <div class="w-80 border-r border-border bg-card flex flex-col">
                    <div class="p-4 border-b border-border">
                        <h2 class="font-display font-semibold">Conversations</h2>
                    </div>
                    <div class="flex-1 overflow-y-auto">
                        <div
                            v-for="chat in conversations"
                            :key="chat.name"
                            class="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition border-b border-border/5"
                            :class="{ 'bg-muted/30': selectedChat === chat.name }"
                            @click="selectedChat = chat.name"
                        >
                            <div class="relative">
                                <div
                                    class="size-10 rounded-full overflow-hidden ring-1 ring-border/50"
                                >
                                    <img
                                        :src="chat.avatar"
                                        :alt="chat.name"
                                        class="size-full object-cover"
                                    />
                                </div>
                                <div
                                    v-if="chat.online"
                                    class="absolute bottom-0 right-0 size-2.5 rounded-full bg-primary border-2 border-card"
                                />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between">
                                    <p class="text-sm font-medium truncate">{{ chat.name }}</p>
                                    <span class="text-[10px] text-muted-foreground">{{ chat.time }}</span>
                                </div>
                                <p class="text-xs text-muted-foreground truncate mt-0.5">
                                    {{ chat.lastMessage }}
                                </p>
                            </div>
                            <div
                                v-if="chat.unread"
                                class="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold"
                            >
                                {{ chat.unread }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-1 flex flex-col">
                    <div
                        v-if="selectedChat"
                        class="flex-1 flex flex-col"
                    >
                        <div class="flex items-center gap-3 p-4 border-b border-border">
                            <div class="size-9 rounded-full overflow-hidden">
                                <img
                                    :src="currentChat?.avatar"
                                    :alt="currentChat?.name"
                                    class="size-full object-cover"
                                />
                            </div>
                            <div>
                                <p class="text-sm font-medium">{{ currentChat?.name }}</p>
                                <p class="text-[10px] text-muted-foreground">
                                    {{ currentChat?.online ? 'Online' : 'Last seen recently' }}
                                </p>
                            </div>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6 space-y-4">
                            <div
                                v-for="(msg, i) in messages"
                                :key="i"
                                class="flex"
                                :class="msg.sent ? 'justify-end' : 'justify-start'"
                            >
                                <div
                                    class="max-w-[70%] rounded-2xl px-4 py-2.5 text-sm"
                                    :class="
                                        msg.sent
                                            ? 'bg-primary text-primary-foreground rounded-br-md'
                                            : 'bg-secondary text-foreground rounded-bl-md'
                                    "
                                >
                                    <p>{{ msg.text }}</p>
                                    <p
                                        class="text-[10px] mt-1 text-right"
                                        :class="
                                            msg.sent
                                                ? 'text-primary-foreground/60'
                                                : 'text-muted-foreground'
                                        "
                                    >
                                        {{ msg.time }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="p-4 border-t border-border">
                            <div class="flex items-center gap-3">
                                <input
                                    v-model="newMessage"
                                    type="text"
                                    placeholder="Type a message..."
                                    class="flex-1 h-10 rounded-xl border border-border bg-secondary px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                    @keydown.enter="sendMessage"
                                />
                                <button
                                    class="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 transition"
                                    @click="sendMessage"
                                >
                                    <Send class="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else
                        class="flex-1 flex items-center justify-center text-muted-foreground"
                    >
                        <div class="text-center">
                            <MessageSquare class="size-12 mx-auto mb-4 opacity-30" />
                            <p class="text-sm">Select a conversation to start messaging</p>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script setup lang="ts">
import { MessageSquare, Send } from "lucide-vue-next";

definePageMeta({
	layout: "client",
	clientSearchPlaceholder: "Search messages...",
	middleware: ["auth-required", "verified-required", "role-required"],
	roles: ["client"],
});

useSeoMeta({
	title: "Messages | Laxiriir Expert",
});

const conversations = [
	{
		name: "Marcus Thorne",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
		lastMessage: "Looking forward to our session tomorrow!",
		time: "2h ago",
		unread: 2,
		online: true,
	},
	{
		name: "Sarah Jenkins",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
		lastMessage: "I've sent over the financial report.",
		time: "1d ago",
		unread: 0,
		online: false,
	},
	{
		name: "David Chen",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
		lastMessage: "The market analysis is complete.",
		time: "3d ago",
		unread: 0,
		online: true,
	},
];

const selectedChat = ref("Marcus Thorne");

const messages = ref([
	{
		text: "Hi there, I wanted to share some prep materials before our session.",
		sent: false,
		time: "10:30 AM",
	},
	{ text: "That would be great, thanks Marcus!", sent: true, time: "10:32 AM" },
	{
		text: "I've attached the Q4 forecast document. Please review the growth projections section.",
		sent: false,
		time: "10:35 AM",
	},
	{
		text: "Will do. Should I prepare any specific questions?",
		sent: true,
		time: "10:38 AM",
	},
	{
		text: "Yes, think about your expansion timeline and budget constraints for next quarter.",
		sent: false,
		time: "10:40 AM",
	},
	{
		text: "Looking forward to our session tomorrow!",
		sent: false,
		time: "10:41 AM",
	},
]);

const newMessage = ref("");

const currentChat = computed(() =>
	conversations.find((c) => c.name === selectedChat.value),
);

function sendMessage() {
	if (!newMessage.value.trim()) return;
	messages.value.push({
		text: newMessage.value,
		sent: true,
		time: new Date().toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		}),
	});
	newMessage.value = "";
}
</script>
