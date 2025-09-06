import { useUser } from "@features/auth/model/useUser";
import React, {
    createContext,
    useContext,
    useEffect,
    useNavigate,
    useState,
} from "react";
import { MessageDTOType, UserDTOType } from "shared";
import FriendsApi from "@features/user/service/friendsApi";
import { Toast } from "@shared/lib/Toast";
import { useWebSocket } from "@shared/hooks/useWebSocket";

interface ChatContextType {
    selectedUser: UserDTOType | null;
    setSelectedUser: (user: UserDTOType | null) => void;
    handleSelectUser: (user?: UserDTOType) => void;
    users: UserDTOType[];
    setUsers: (users: UserDTOType[]) => void;
    messages: MessageDTOType[];
    setMessages: (messages: MessageDTOType[]) => void;
    sendMessage: (message: string) => void;
    isBlocked: boolean;
    setIsBlocked: (blocked: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children?: ReactNode }) => {
    const { user: currentUser } = useUser();
    const [selectedUser, setSelectedUser] = useState<UserDTOType | null>(null);
    const [users, setUsers] = useState<UserDTOType[]>([]);
    const [messages, setMessages] = useState<MessageDTOType[]>([]);
    const [isBlocked, setIsBlocked] = useState(false);

    const navigate = useNavigate();

    const handleSelectUser = (user?: UserDTOType) => {
        if (!user) navigate("/chat");
        else navigate(`/chat/${user.id}`);
    };

    useEffect(() => {
        FriendsApi.getAllFriends().then((friends) => {
            if (friends) setUsers(friends);
        });
    }, []);

    const {
        isConnected,
        sendMessage: sendSocketMessage,
        addHook,
    } = useWebSocket(`/chat`);

    const handleSocketMessage = (msg: MessageEvent) => {
        const payload = JSON.parse(msg.data);
        if (payload.type === "error" && payload.code === "BLOCKED_USER") {
            setMessages((prev) => prev.slice(0, -1));
            setIsBlocked(true);
            Toast.error("You have been blocked by this user.");
        } else {
            setIsBlocked(false);
            setMessages((prev) => [...prev, payload]);
        }
    };

    useEffect(() => {
        addHook({ type: "onMessage", callback: handleSocketMessage });
    }, []);

    const sendMessage = (message: string) => {
        if (!message.trim() || !selectedUser || !isConnected || !currentUser)
            return;

        const tempMessage = {
            sender: currentUser.id,
            receiver: selectedUser.id,
            message,
            createdAt: new Date(),
        };

        sendSocketMessage(tempMessage);
        setMessages([...messages, tempMessage]);
    };

    const value: ChatContextType = {
        selectedUser,
        setSelectedUser,
        handleSelectUser,
        users,
        setUsers,
        messages,
        setMessages,
        sendMessage,
        isBlocked,
        setIsBlocked,
    };

    return (
        <div className="w-full h-full">
            <ChatContext.Provider value={value}>
                <div className="w-full h-full">{children}</div>
            </ChatContext.Provider>
        </div>
    );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within a chatProvider");
    return context;
};
