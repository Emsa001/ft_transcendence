import React, { useEffect, useNavigate } from "react";
import { Sidebar } from "@features/chat/ui/Sidebar";
import { ChatArea } from "@features/chat/ui/ChatArea";
import { ChatProvider } from "@features/chat/model/ChatContext";
import { useUser } from "@features/auth/model/useUser";

export default function Chat() {
    const navigate = useNavigate();
    const { user, loading } = useUser();

    useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

    return (
        <div className="w-full h-full">
            <ChatProvider>
                <div className="flex h-full text-white pt-16">
                    <Sidebar />
                    <ChatArea />
                </div>
            </ChatProvider>
        </div>
    );
}
