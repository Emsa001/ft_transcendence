import React, { useEffect, useNavigate, useRef, useState } from "react";
import { MessageDTOType, UserDTOType } from "shared";
import { ChatInput } from "@features/chat/ui/ChatInput";
import ChatApi from "@features/chat/service/api";
import { useUser } from "@features/auth/model/useUser";
import { UserInfo } from "./UserInfo";

interface ChatAreaProps {
    selectedUser: UserDTOType;
    users: UserDTOType[];
    setUsers: (users: UserDTOType[]) => void;
    setSelectedUser: (user: UserDTOType | null) => void;
}

let ws: WebSocket | null;
export function ChatArea({
    selectedUser,
    users,
    setUsers,
    setSelectedUser,
}: ChatAreaProps) {
    const [messages, setMessages] = useState<MessageDTOType[]>([]);
    const [input, setInput] = useState("");
    const messageBoxRef = useRef<HTMLDivElement | null>(null);
    const offset = useRef(0);
    const { user } = useUser();

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
            <UserInfo
                user={user}
                selectedUser={selectedUser}
                users={users}
                setUsers={setUsers}
                setSelectedUser={setSelectedUser}
            />

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
