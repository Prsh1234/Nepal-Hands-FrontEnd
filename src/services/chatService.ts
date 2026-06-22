import api from "@/lib/api";
import { Client } from "@stomp/stompjs";

let stompClient = null;


export const connectWebSocket = (onMessageReceived) => {

    const token = localStorage.getItem("AUTH_TOKEN");

    const socket = new WebSocket("ws://localhost:8080/ws");

    stompClient = new Client({
        webSocketFactory: () => socket,

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        onConnect: () => {

            stompClient.subscribe(
                "/user/queue/messages",
                (message) => {
                    console.log("Received message:", message.body);
                    onMessageReceived(JSON.parse(message.body));
                }
            );
        }
    });

    stompClient.activate();
};

export const sendMessage = (message) => {

    stompClient.publish({
        destination: "/app/private-message",
        body: JSON.stringify(message)
    });
};

export const connectRoomWebSocket = (opportunityId, onMessageReceived) => {

    const token = localStorage.getItem("AUTH_TOKEN");

    const socket = new WebSocket("ws://localhost:8080/ws");

    stompClient = new Client({
        webSocketFactory: () => socket,

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        onConnect: () => {

            stompClient.subscribe(
                `/topic/room.${opportunityId}`,
                (msg) => {
                    const message = JSON.parse(msg.body);
                    onMessageReceived(message);
                }
            );
        }
    });

    stompClient.activate();
};

export const sendGroupMessage = (message) => {

    stompClient.publish({
        destination: "/app/group.send",
        body: JSON.stringify({
            opportunityId: message.opportunityId,
            senderId: message.senderId,
            senderName: message.senderName,
            content: message.content,
            sentAt: new Date().toISOString()
        })
    });
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};


export const getMessages = async (
  opportunityId: number | string,
  page: number,
  size: number
) => {
  const { data } = await api.get(`/volunteer/chat/loadChats/${opportunityId}`, {
    params: {
      page,
      size,
    },
  });

  return data;
};

// "typescript": "^6.0.3",