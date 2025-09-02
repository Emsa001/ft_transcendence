import { useUser } from "@features/auth/model/useUser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MessageDTOType, UserDTOType } from "shared";
import FriendsApi from "@features/user/service/friendsApi";
import { Alert } from "@shared/components/Alert";

interface ChatContextType {
    selectedUser: UserDTOType | null;
    setSelectedUser: (user: UserDTOType | null) => void;
    users: UserDTOType[];
    setUsers: (users: UserDTOType[]) => void;
    messages: MessageDTOType[];
    setMessages: (messages: MessageDTOType[]) => void;
    ws: WebSocket | null;
    sendMessage: (message: string) => void;
    isBlocked: boolean;
    setIsBlocked: (blocked: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children?: ReactNode }) => {
    const [selectedUser, setSelectedUser] = useState<UserDTOType | null>(null);
    const [users, setUsers] = useState<UserDTOType[]>([]);
    const [messages, setMessages] = useState<MessageDTOType[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const { user: currentUser } = useUser();

    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await FriendsApi.getAllFriends();
            setUsers(allUsers);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const websocket = new WebSocket(`ws://localhost:8000/chat`);
        setWs(websocket);

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "error" && data.code === "BLOCKED_USER") {
                setMessages((prev) => prev.slice(0, -1));
                setIsBlocked(true);
                Alert.error("You have been blocked by this user.");
            } else {
                setIsBlocked(false);
                setMessages((prev) => [...prev, data]);
            }
        };

        return () => {
            websocket.close();
        };
    }, [currentUser, selectedUser]);

    const sendMessage = (message: string) => {
        if (!message.trim() || !selectedUser || !ws || !currentUser) return;

        const tempMessage = {
            sender: currentUser.id,
            receiver: selectedUser.id,
            message,
            createdAt: new Date(),
        };

        ws.send(JSON.stringify(tempMessage));
        setMessages([...messages, tempMessage]);
    };

    const value: ChatContextType = {
        selectedUser,
        setSelectedUser,
        users,
        setUsers,
        messages,
        setMessages,
        ws,
        sendMessage,
        isBlocked,
        setIsBlocked,
    };

    return (
        <div className="w-full h-full">
            <ChatContext.Provider value={value}>
                <div className="flex h-full text-white pt-16 ">{children}</div>
            </ChatContext.Provider>
        </div>
    );
};

export const usechat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("usechat must be used within a chatProvider");
    return context;
};
