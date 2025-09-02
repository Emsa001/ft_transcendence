import React, { useRef, useEffect, useState } from "react";
import { ChatInput } from "@features/chat/ui/ChatInput";
import { UserInfo } from "./UserInfo";
import { usechat } from "../model/ChatContext";
import { useUser } from "@features/auth/model/useUser";
import { MessageCard } from "./MessageCard";
import ChatApi from "@features/chat/service/api";

export function ChatArea() {
    const blockScroll = useRef(false);
    const { setMessages, setIsBlocked, selectedUser, messages } = usechat();
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const messageBoxRef = useRef<HTMLDivElement | null>(null);
    const { user } = useUser();
    if (!user) return <div />;

    const scrollToBottom = () => {
        if (blockScroll.current) {
            blockScroll.current = false;
            return;
        }

        setTimeout(() => {
            if (messageBoxRef.current) {
                messageBoxRef.current.scrollTop =
                    messageBoxRef.current.scrollHeight;
            }
        }, 0);
    };

    const handleLoadMore = async () => {
        blockScroll.current = true;
        getMessages();
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getMessages = async (init?: boolean) => {
        if (!selectedUser) return;

        const data = await ChatApi.getChatWith(
            selectedUser.id,
            init ? 0 : offset
        );
        if (init) {
            setMessages(data.messages);
            setOffset(data.messages.length);
        } else {
            setMessages([...data.messages, ...messages]);
            setOffset(offset + data.messages.length);
        }
        setHasMore(data.hasMore);
    };

    useEffect(() => {
        setIsBlocked(false);

        if (selectedUser) {
            getMessages(true);
        }
    }, [selectedUser]);

    return (
        <div className="flex flex-col w-2/3 bg-black/50 relative z-10">
            {selectedUser ? (
                <div className="flex flex-col h-full">
                    {/* User Info */}
                    <UserInfo />

                    {/* Messages */}
                    <div
                        ref={messageBoxRef}
                        className="flex-1 overflow-y-auto p-4 space-y-3"
                    >
                        {hasMore && (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-4 py-1 text-sm rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-800 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.5)] transition"
                                >
                                    Load more
                                </button>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i}>
                                <MessageCard msg={msg} user={user} />
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <ChatInput />
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    Please choose a user to start chatting
                </div>
            )}
        </div>
    );
}
