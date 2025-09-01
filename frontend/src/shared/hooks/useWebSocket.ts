import { useEffect, useRef, useState } from "react";

interface Hook {
    type: "onMessage" | "onConnect" | "onDisconnect";
    callback: Function;
}

export const useWebSocket = (url: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const hooksRef = useRef<Hook[]>([]);

    const addHook = (hook: Hook) => {
        hooksRef.current.push(hook);
        console.log("Hook added:", hook);
    };

    // Connect to WebSocket
    useEffect(() => {
        if (!url) return;

        wsRef.current = new WebSocket(
            process.env.FT_REACT_PUBLIC_API_HOST + url
        );

        wsRef.current.onopen = () => {
            setIsConnected(true);
            hooksRef.current.forEach((hook) => {
                if (hook.type === "onConnect") {
                    hook.callback();
                }
            });
        };
        wsRef.current.onclose = () => {
            setIsConnected(false);
            hooksRef.current.forEach((hook) => {
                if (hook.type === "onDisconnect") {
                    hook.callback();
                }
            });
        };
        wsRef.current.onmessage = (event) => {
            hooksRef.current.forEach((hook) => {
                if (hook.type === "onMessage") {
                    hook.callback(event);
                }
            });
        };

        // Cleanup on unmount
        return () => {
            wsRef.current?.close();
            wsRef.current = null;
            hooksRef.current = [];
        };
    }, [url]);

    // Regular function to send messages
    const sendMessage = (data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    };

    return { addHook, sendMessage, isConnected };
};
