import React, { useEffect, useRef, useState } from "react";
import { MessageDTOType, UserDTOType } from "shared";
import { Sidebar } from "@features/chat/ui/Sidebar";
import { ChatInput } from "@features/chat/ui/ChatInput";
import FriendsApi from "@features/user/service/friendsApi";
import ChatApi from "@features/chat/service/api";
import { useUser } from "@features/auth/model/useUser";

interface ChatAreaProps {
    selectedUser: UserDTOType | null;
}

let ws: WebSocket | null;

function ChatArea({ selectedUser }: ChatAreaProps) {
    const [messages, setMessages] = useState<MessageDTOType[]>([]);
    const [input, setInput] = useState("");
    const messageBoxRef = useRef<HTMLDivElement | null>(null);
    const { user } = useUser();

    if (!user) return <div />;

    const handleSend = () => {
        if (!input.trim() || !selectedUser) return;

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
            { sender: user.id, receiver: -1, message: input },
        ]);
        setInput("");
    };

    useEffect(() => {
        async function getMessages() {
            try {
                if (selectedUser) {
                    const oldMessages = await ChatApi.getChatWith(
                        selectedUser.id
                    );
                    setMessages(oldMessages);
                }
            } catch {
                console.log("No messages");
            }
        }
        getMessages();
    }, [selectedUser]);

    useEffect(() => {
        ws = new WebSocket(`ws://localhost:8000/chat`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    useEffect(() => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop =
                messageBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col w-2/3 bg-black/50 ">
            {selectedUser ? (
                <div className="flex flex-col h-full">
                    {/* User Info */}
                    <div className="h-14 border-b border-gray-800 flex items-center px-4 shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                        <h3 className="font-semibold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                            {selectedUser.username}
                        </h3>
                    </div>

                    {/* Messages */}
                    <div
                        ref={messageBoxRef}
                        className="flex-1 overflow-y-auto p-4 space-y-3"
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={msg.id || i}
                                className={`flex ${msg.sender === user.id ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-xs shadow-[0_0_12px_rgba(0,255,255,0.6)] ${
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
                    <ChatInput
                        input={input}
                        setInput={setInput}
                        onSend={handleSend}
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    Please choose a user to start chatting
                </div>
            )}
        </div>
    );
}

export default function Chat() {
    const [selectedUser, setSelectedUser] = useState<UserDTOType | null>(null);
    const [users, setUsers] = useState<UserDTOType[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await FriendsApi.getAllFriends();
            setUsers(allUsers);
        };
        fetchUsers();
    }, []);

    return (
        <div className="flex h-full text-white pt-16 ">
            {/* Left Sidebar */}
            <Sidebar
                users={users}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
            />

            {/* Chat Area */}
            <ChatArea selectedUser={selectedUser} />
        </div>
    );
}
