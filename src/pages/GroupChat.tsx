import { connectRoomWebSocket, disconnectWebSocket, sendGroupMessage } from "@/services/chatService";
import { getUserData } from "@/services/userService";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function GroupChat() {
    const { id } = useParams();

    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    // Load user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserData();
                setUserId(userData.id);
                console.log("USER:", userData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    // WebSocket connect
    useEffect(() => {
        if (!id) return;

        console.log("Connecting to room:", id);

        connectRoomWebSocket(
            id,
            (msg) => {
                console.log("RECEIVED RAW:", msg);

                // safe parse (VERY IMPORTANT)
                const message =
                    typeof msg.body === "string"
                        ? JSON.parse(msg.body)
                        : msg;

                setMessages(prev => {
                    const updated = [...prev, message];
                    console.log("UPDATED MESSAGES:", updated);
                    return updated;
                });
            }
        );

        // cleanup (IMPORTANT FIX)
        return () => {
            disconnectWebSocket();
        };

    }, [id]);

    // Send message
    const handleSend = () => {
        if (!text.trim()) return;

        sendGroupMessage({
            senderId: userId,
            roomId: Number(id), // IMPORTANT FIX
            content: text,
            sentAt: new Date()
        });

        setText("");
    };

    return (
        <div>
            {/* Messages */}
            <div>
                {messages.map((msg, i) => (
                    <div key={i}>
                        <strong>{msg.senderId}:</strong> {msg.content}
                    </div>
                ))}
            </div>

            {/* Input */}
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type message..."
            />

            <button onClick={handleSend}>
                Send
            </button>
        </div>
    );
}

export default GroupChat;