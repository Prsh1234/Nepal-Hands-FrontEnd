import api from "@/lib/api";
import { Client } from "@stomp/stompjs";

let stompClient: InstanceType<typeof Client> | null = null;

// ─── WebSocket ────────────────────────────────────────────────────────────────

export const connectWebSocket = (onMessageReceived: (msg: any) => void) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    stompClient = new Client({
        webSocketFactory: () => new WebSocket("ws://localhost:8080/ws"),
        connectHeaders: { Authorization: `Bearer ${token}` },
        onConnect: () => {
            stompClient!.subscribe("/user/queue/messages", (message) => {
                onMessageReceived(JSON.parse(message.body));
            });
        },
    });

    stompClient.activate();
};

export const connectRoomWebSocket = (
    opportunityId: number | string,
    onMessageReceived: (msg: any) => void
) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    stompClient = new Client({
        webSocketFactory: () => new WebSocket("ws://localhost:8080/ws"),
        connectHeaders: { Authorization: `Bearer ${token}` },
        onConnect: () => {
            stompClient!.subscribe(`/topic/room.${opportunityId}`, (msg) => {
                onMessageReceived(JSON.parse(msg.body));
            });
        },
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};

// ─── Text message (WebSocket) ─────────────────────────────────────────────────

export const sendGroupMessage = (message: {
    opportunityId: number;
    senderId: number;
    senderName: string;
    content: string;
}) => {
    stompClient!.publish({
        destination: "/app/group.send",
        body: JSON.stringify({
            ...message,
            sentAt: new Date().toISOString(),
            fileUrl: null,
        }),
    });
};

// ─── File message (REST → backend saves + broadcasts via WebSocket) ───────────

export const sendFileMessage = async (
    file: File,
    opportunityId: number,
    senderId: number,
    senderName: string
): Promise<void> => {
    const form = new FormData();
    form.append("file", file);
    form.append("opportunityId", String(opportunityId));
    form.append("senderId", String(senderId));
    form.append("senderName", senderName);

    // Axios throws on non-2xx — no need to check res.ok
    await api.post("/chat/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// ─── Private message ──────────────────────────────────────────────────────────

export const sendMessage = (message: any) => {
    stompClient!.publish({
        destination: "/app/private-message",
        body: JSON.stringify(message),
    });
};

// ─── Load paginated messages ──────────────────────────────────────────────────

export const getMessages = async (
    opportunityId: number | string,
    page: number,
    size: number
) => {
    const { data } = await api.get(`/volunteer/chat/loadChats/${opportunityId}`, {
        params: { page, size },
    });
    return data;
};
// "typescript": "^6.0.3",