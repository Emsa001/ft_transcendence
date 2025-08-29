import React, { useEffect, useNavigate, useRef, useState } from "react";
import { MessageDTOType, UserDTOType } from "shared";
import { ChatInput } from "@features/chat/ui/ChatInput";
import ChatApi from "@features/chat/service/api";
import { useUser } from "@features/auth/model/useUser";
import { UserPicture } from "@features/user/ui/UserPicture";

interface ChatAreaProps {
    selectedUser: UserDTOType;
}

let ws: WebSocket | null;
export function ChatArea({ selectedUser }: ChatAreaProps) {
    const [messages, setMessages] = useState<MessageDTOType[]>([]);
    const [input, setInput] = useState("");
    const messageBoxRef = useRef<HTMLDivElement | null>(null);
    const offset = useRef(0);
    const { user } = useUser();
    const navigate = useNavigate();

    if (!user) return <div />;

    const handleSend = () => {
        if (!input.trim()) return;

        if (ws) {
            ws.send(
                JSON.stringify({
                    sender: user.id,
                    receiver: selectedUser.id,
                    message: input,
                })
            );
        }

        setMessages([
            ...messages,
            { sender: user.id, receiver: selectedUser.id, message: input },
        ]);
        scrollToBottom();
        setInput("");
    };

    async function getMessages() {
        const oldMessages = await ChatApi.getChatWith(
            selectedUser.id,
            offset.current
        );
        setMessages((prev) => [...oldMessages, ...prev]);
        if (offset.current == 0) scrollToBottom();
        offset.current += oldMessages.length;
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            if (messageBoxRef.current) {
                messageBoxRef.current.scrollTop =
                    messageBoxRef.current.scrollHeight;
            }
        }, 0);
    };

    useEffect(() => {
        setMessages([]);
        offset.current = 0;
        setTimeout(() => {
            getMessages();
        }, 0);
    }, [selectedUser]);

    useEffect(() => {
        ws = new WebSocket(`ws://localhost:8000/chat`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
            scrollToBottom();
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* User Info */}
            <div
                onClick={() => navigate(`/users/${selectedUser.id}`)}
                className="h-18 border-b gap-2 border-gray-800 flex items-center px-4 cursor-pointer shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            >
                <UserPicture
                    userId={user.id.toString()}
                    className="w-10 h-10 rounded-full shadow-[0_0_8px_rgba(0,255,255,0.7)]"
                />
                <h3 className="font-semibold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                    {selectedUser.username}
                </h3>
            </div>

            {/* Messages */}
            <div
                ref={messageBoxRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
            >
                <div className="flex justify-center">
                    <button
                        onClick={getMessages}
                        className="px-4 py-1 text-sm rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-800 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.5)] transition"
                    >
                        Load more
                    </button>
                </div>
                {messages.map((msg, i) => (
                    <div
                        key={msg.id || i}
                        className={`flex ${msg.sender === user.id ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-2xl max-w-xs border border-cyan-800 shadow-[0_0_8px_rgba(0,255,255,0.5)] ${
                                msg.sender === user.id
                                    ? "bg-cyan-500 text-black"
                                    : "bg-gray-800 text-cyan-200"
                            }`}
                        >
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <ChatInput input={input} setInput={setInput} onSend={handleSend} />
        </div>
    );
}
