import { MessageDTOType, UserDTOType } from "shared";
import React, { useEffect, useState } from "react";
import { RiGamepadLine } from "react-icons/ri";
import { FaCopy } from "react-icons/fa6";
import { Icon } from "@shared/components/Icon";
import { Toast } from "@shared/lib/Toast";
import { useLanguage } from "@features/language/model/useLanguage";

function InviteMessage({ code }: { code: string }) {
    const { getText } = useLanguage();
    const text = getText("chat");
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleJoin = () => {
        Toast.success(`Joining game ${code}...`);
        window.open(`/game/remote/casual/${code}`, "_blank");
    };

    return (
        <div className="w-72 rounded-2xl bg-gradient-to-br from-pink-300/10 to-purple-800/20 border border-pink-500/40 shadow-lg backdrop-blur-md p-4 flex flex-col items-center space-y-3">
            <div className="flex flex-col items-center space-y-2">
                <Icon icon={RiGamepadLine} className="w-8 h-8 text-pink-400" />
                <h2 className="text-lg font-bold text-pink-300">
                    {text.pongDuel}
                </h2>
            </div>

            <p className="text-pink-100/80 italic text-sm text-center">
                {text.casualPongGame}
            </p>

            <div className="flex items-center justify-between w-full bg-purple-900/30 rounded-lg px-3 py-2 text-xs font-mono text-pink-300">
                <span>{code}</span>
                <button
                    onClick={handleCopy}
                    className="p-1 rounded-md hover:bg-pink-700/30 transition"
                >
                    <Icon icon={FaCopy} className="w-4 h-4" />
                </button>
            </div>

            <button
                onClick={() => handleJoin()}
                className="w-full py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-black font-semibold shadow-md transition"
            >
                {text.joinGame}
            </button>
        </div>
    );
}

function checkIfInviteMessage(message: string) {
    return message.startsWith("/invite");
}

function getCode(message: string) {
    const parts = message.split(" ");
    return parts[1] || "";
}

interface MessageProps {
    msg: MessageDTOType;
    user: UserDTOType;
}

export function MessageCard({ msg, user }: MessageProps) {
    const [isInvite, setIsInvite] = useState(false);
    const [code, setCode] = useState("");

    useEffect(() => {
        if (checkIfInviteMessage(msg.message)) {
            setIsInvite(true);
            setCode(getCode(msg.message));
        }
    }, []);

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
            {isInvite ? (
                <InviteMessage code={code} />
            ) : (
                <div
                    className={`px-4 py-2 rounded-2xl max-w-xs break-words border border-cyan-800 shadow-[0_0_8px_rgba(0,255,255,0.5)] ${
                        msg.sender === user.id
                            ? "bg-cyan-500 text-black"
                            : "bg-gray-800 text-cyan-200"
                    }`}
                    style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
                >
                    {msg.message}
                </div>
            )}
            <span className="text-xs text-cyan-400 mt-1 ml-1 opacity-75">
                {time}
            </span>
        </div>
    );
}
