import { MessageDTOType, UserDTOType } from "shared";
import React from "react";

interface MessageProps {
    msg: MessageDTOType;
    user: UserDTOType;
}

export const MessageCard = ({ msg, user }: MessageProps) => {
    const time = msg.createdAt
        ? new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

    return (
        <div
            className={`flex flex-col ${
                msg.sender === user.id ? "items-end" : "items-start"
            }`}
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
            <span className="text-xs text-cyan-400 mt-1 ml-1 opacity-75">
                {time}
            </span>
        </div>
    );
};
