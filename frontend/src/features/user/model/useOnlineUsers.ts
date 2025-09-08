import { Toast } from "@shared/lib/Toast";
import { useStatic } from "react";

let ws: WebSocket | undefined;

export const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useStatic<number[]>(
        "online_users",
        []
    );

    const subscribeToOnline = () => {
        if (ws) return ws;
        ws = new WebSocket(
            process.env.FT_REACT_PUBLIC_API_HOST + "/user/status"
        );


        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "online_users") {
                setOnlineUsers(msg.onlineUsers);
            } else if (msg.type === "message") {
                const message = `${msg.sender}: ${msg.message}`;
                Toast.info({ message, timeout: 3000 });
            }
        };

        return ws;
    };

    const unsubscribeFromOnline = () => {
        if (ws) {
            ws.close();
            ws = undefined;
        }
    };

    const resubscribe = () => {
        unsubscribeFromOnline();
        subscribeToOnline();
    };

    return {
        onlineUsers,
        subscribeToOnline,
        unsubscribeFromOnline,
        resubscribe,
    };
};
