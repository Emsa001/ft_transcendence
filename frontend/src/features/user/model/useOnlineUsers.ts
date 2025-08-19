import { useStatic } from "react";

let ws: WebSocket | undefined;

export const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useStatic<number[]>(
        "online_users",
        []
    );

    const subscribeToOnline = () => {
        if (ws) {
            ws.close();
        }
        ws = new WebSocket(`ws://localhost:8000/user/status`);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "online_users") {
                setOnlineUsers(msg.onlineUsers);
            }
        };

        return ws;
    };

    return { onlineUsers, subscribeToOnline };
};
